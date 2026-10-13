"""Transactional lead ledger. All operator mutations require local OS access."""
import hashlib
import hmac
import json
import os
import re
import sqlite3
import time
import uuid
from contextlib import contextmanager
from pathlib import Path
from urllib.parse import urlencode, urlsplit


class Problem(Exception):
    def __init__(self, status, message):
        self.status, self.message = status, message
        super().__init__(message)


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(',', ':'), ensure_ascii=False)


def text(value, minimum=1, maximum=3000, multiline=False):
    if not isinstance(value, str) or not minimum <= len(value.strip()) <= maximum:
        raise Problem(400, 'Invalid or missing field')
    if re.search(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', value) or (not multiline and re.search(r'[\r\n]', value)):
        raise Problem(400, 'Invalid field characters')
    return value.strip()


def email_address(value):
    value = text(value, maximum=254).lower()
    if not re.fullmatch(r"[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?\.[A-Za-z]{2,63}", value):
        raise Problem(400, 'Invalid email')
    return value


def validate_lead(body):
    if not isinstance(body, dict) or body.get('schemaVersion') != 1 or body.get('fax', '') != '':
        raise Problem(400, 'Invalid inquiry')
    try:
        submission_id = str(uuid.UUID(body['submissionId'], version=4))
        if submission_id != body['submissionId'].lower():
            raise ValueError()
    except (KeyError, TypeError, ValueError, AttributeError):
        raise Problem(400, 'Invalid submission ID') from None
    if body.get('consent') != 'inquiry-v1':
        raise Problem(400, 'Please agree to contact about this inquiry')
    budget, timeline = body.get('budget'), body.get('timeline')
    if budget not in ('exploring', 'under-5k', '5k-15k', '15k-50k', '50k-plus') or timeline not in ('exploring', '30-days', '90-days', 'later'):
        raise Problem(400, 'Invalid budget or timeline')
    attribution = body.get('attribution', {})
    if not isinstance(attribution, dict):
        raise Problem(400, 'Invalid attribution')
    campaign = {key: text(attribution[key], maximum=160) for key in ('utm_source', 'utm_medium', 'utm_campaign') if key in attribution}
    payload = dict(name=text(body.get('name'), maximum=120), email=email_address(body.get('email')),
                   company=text(body.get('company'), maximum=160), outcome=text(body.get('outcome'), 20, 3000, True),
                   budget=budget, timeline=timeline, attribution=campaign, consent='inquiry-v1')
    score = {'exploring': 0, 'under-5k': 5, '5k-15k': 20, '15k-50k': 35, '50k-plus': 35}[budget]
    score += {'exploring': 0, 'later': 5, '90-days': 15, '30-days': 25}[timeline]
    return submission_id, payload, score


class Store:
    def __init__(self, config, clock=time.time):
        self.config, self.clock = config, clock

    def connect(self):
        db = sqlite3.connect(self.config.database, timeout=10, isolation_level=None)
        db.row_factory = sqlite3.Row
        db.execute('PRAGMA foreign_keys = ON')
        db.execute('PRAGMA busy_timeout = 10000')
        return db

    def initialize(self):
        os.umask(0o077)
        path = Path(self.config.database)
        path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
        with self.transaction() as db:
            version = db.execute('PRAGMA user_version').fetchone()[0]
            if version not in (0, 1):
                raise RuntimeError('Unsupported database version')
        db = self.connect()
        try:
            db.executescript(Path(__file__).with_name('schema.sql').read_text())
        finally:
            db.close()
        os.chmod(path, 0o600)

    @contextmanager
    def transaction(self):
        db = self.connect()
        try:
            db.execute('BEGIN IMMEDIATE')
            yield db
            db.commit()
        except BaseException:
            db.rollback()
            raise
        finally:
            db.close()

    def now(self):
        return int(self.clock())

    def token(self, purpose, contact_id):
        digest = hmac.new(self.config.token_secret.encode(), f'{purpose}:{contact_id}'.encode(), hashlib.sha256).hexdigest()
        return f'{contact_id}.{digest}'

    def untoken(self, purpose, token):
        if not isinstance(token, str) or not re.fullmatch(r'[0-9a-f-]{36}\.[0-9a-f]{64}', token):
            raise Problem(404, 'Link not found')
        contact_id = token.split('.')[0]
        if len(token) > 110 or not hmac.compare_digest(self.token(purpose, contact_id), token):
            raise Problem(404, 'Link not found')
        return contact_id

    def link(self, purpose, contact_id):
        return f'{self.config.public_url}/{purpose}/{self.token(purpose, contact_id)}'

    def event(self, db, contact_id, kind, key, detail=None):
        db.execute('INSERT OR IGNORE INTO events(contact_id,kind,event_key,detail,created_at) VALUES(?,?,?,?,?)',
                   (contact_id, kind, key, canonical(detail or {}), self.now()))

    def crm(self, db, contact_id):
        db.execute("""INSERT INTO crm_jobs(contact_id,due_at) VALUES(?,?)
            ON CONFLICT(contact_id) DO UPDATE SET generation=generation+1,status='pending',attempts=0,due_at=excluded.due_at,error=NULL""",
                   (contact_id, self.now()))

    def rate_limit(self, ip):
        # Only Nginx's overwritten X-Real-IP is used. No raw IP is retained.
        now = self.now()
        digest = hmac.new(self.config.token_secret.encode(), ip.encode(), hashlib.sha256).hexdigest()
        bucket = f'{now // 60}:{digest}'
        with self.transaction() as db:
            db.execute('DELETE FROM rate_limits WHERE expires_at < ?', (now,))
            db.execute('INSERT INTO rate_limits VALUES(?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1', (bucket, now + 120))
            count = db.execute('SELECT count FROM rate_limits WHERE bucket=?', (bucket,)).fetchone()[0]
        if count > 5:
            raise Problem(429, 'Please wait before trying again')

    def draft(self, db, contact_id, kind, due_at):
        # Drafts contain no untrusted HTML. A person reviews every recipient and message.
        message = ('Thanks for contacting Preecursor. We would like to learn more about the workflow you want to improve.'
                   if kind == 'response' else 'Following up on your Preecursor inquiry. Would a short discovery conversation still be useful?')
        if self.config.booking_url:
            message += '\n\nChoose a discovery time: ' + self.link('booking', contact_id)
        else:
            message += '\n\nReply with a few convenient times and your timezone.'
        db.execute('INSERT OR IGNORE INTO drafts(id,contact_id,kind,subject,body,due_at) VALUES(?,?,?,?,?,?)',
                   (str(uuid.uuid4()), contact_id, kind, 'Your Preecursor inquiry', message, due_at))

    def intake(self, body):
        submission_id, payload, score = validate_lead(body)
        serialized = canonical(payload)
        with self.transaction() as db:
            previous = db.execute('SELECT * FROM submissions WHERE id=?', (submission_id,)).fetchone()
            if previous:
                if previous['payload'] != serialized:
                    raise Problem(409, 'Submission ID already used for different details')
                contact_id = previous['contact_id']
            else:
                contact = db.execute('SELECT * FROM contacts WHERE email=?', (payload['email'],)).fetchone()
                contact_id = contact['id'] if contact else str(uuid.uuid4())
                if not contact:
                    db.execute("""INSERT INTO contacts(id,email,name,company,source,stage,score,permission,permission_evidence,created_at)
                        VALUES(?,?,?,?, 'website','captured',?,'inquiry',?,?)""",
                               (contact_id, payload['email'], payload['name'], payload['company'], score, f'submission:{submission_id}:inquiry-v1', self.now()))
                elif contact['permission'] == 'none':
                    db.execute("UPDATE contacts SET permission='inquiry', permission_evidence=? WHERE id=?",
                               (f'submission:{submission_id}:inquiry-v1', contact_id))
                if contact and contact['stage'] == 'identified':
                    db.execute("UPDATE contacts SET stage='captured',score=? WHERE id=?", (score, contact_id))
                db.execute('INSERT INTO submissions VALUES(?,?,?,?)', (submission_id, contact_id, serialized, self.now()))
                self.event(db, contact_id, 'captured', f'captured:{contact_id}')
                self.event(db, contact_id, 'inquiry_received', submission_id, {'score': score, 'attribution': payload['attribution'], 'consent': 'inquiry-v1'})
                # Public repeat submissions never overwrite reviewed contact details or lift suppression.
                self.draft(db, contact_id, 'response', self.now())
                self.crm(db, contact_id)
        result = {'accepted': True, 'submissionId': submission_id}
        if self.config.booking_url:
            result['bookingUrl'] = self.link('booking', contact_id)
        return result

    def suppress(self, db, email, reason):
        db.execute('INSERT INTO suppression VALUES(?,?,?) ON CONFLICT(email) DO NOTHING', (email, reason, self.now()))
        contact = db.execute('SELECT id FROM contacts WHERE email=?', (email,)).fetchone()
        if contact:
            cid = contact['id']
            db.execute("UPDATE drafts SET status='canceled' WHERE contact_id=? AND status IN ('needs_review','approved')", (cid,))
            self.event(db, cid, 'suppressed', f'suppressed:{cid}', {'reason': reason})
            self.crm(db, cid)

    def unsubscribe(self, token):
        cid = self.untoken('unsubscribe', token)
        with self.transaction() as db:
            row = db.execute('SELECT email FROM contacts WHERE id=?', (cid,)).fetchone()
            if not row:
                raise Problem(404, 'Link not found')
            self.suppress(db, row['email'], 'unsubscribe')

    def booking_redirect(self, token):
        cid = self.untoken('booking', token)
        if not self.config.booking_url:
            raise Problem(503, 'Scheduling is temporarily unavailable')
        with self.transaction() as db:
            if not db.execute('SELECT 1 FROM contacts WHERE id=?', (cid,)).fetchone():
                raise Problem(404, 'Link not found')
            self.event(db, cid, 'booking_link_opened', f'booking_link:{cid}')
        # This is an opaque, signed correlation token; no email/name in the URL.
        return self.config.booking_url + '?' + urlencode({'utm_source': 'preecursor', 'utm_medium': 'discovery', 'utm_content': token})

    def eligible(self, db, contact_id):
        return db.execute("""SELECT c.* FROM contacts c WHERE c.id=? AND c.permission != 'none'
            AND c.replied=0 AND c.stage NOT IN ('booked','completed','no_show','closed','won','lost')
            AND NOT EXISTS (SELECT 1 FROM suppression s WHERE s.email=c.email)
            AND NOT EXISTS (SELECT 1 FROM bookings b WHERE b.contact_id=c.id AND b.status IN ('active','completed'))""", (contact_id,)).fetchone()

    def approve(self, draft_id, actor):
        actor = text(actor, maximum=120)
        if not self.config.sender or not self.config.reply_to or not self.config.postal_address:
            raise Problem(400, 'Configure sender, monitored reply address and postal address before approval')
        with self.transaction() as db:
            draft = db.execute("SELECT * FROM drafts WHERE id=? AND status='needs_review'", (draft_id,)).fetchone()
            if not draft:
                raise Problem(409, 'Draft is not awaiting review')
            contact = self.eligible(db, draft['contact_id'])
            if not contact:
                raise Problem(409, 'Contact is not eligible for follow-up')
            unsubscribe = self.link('unsubscribe', contact['id'])
            envelope = {'from': self.config.sender, 'reply_to': self.config.reply_to, 'to': [contact['email']], 'subject': draft['subject'],
                        'text': draft['body'] + f'\n\nPreecursor | {self.config.postal_address}\nStop follow-ups: {unsubscribe}',
                        'headers': {'List-Unsubscribe': f'<{unsubscribe}>', 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'}}
            db.execute("UPDATE drafts SET status='approved',approved_by=?,approved_at=?,envelope=? WHERE id=?",
                       (actor, self.now(), canonical(envelope), draft_id))
            self.event(db, contact['id'], 'followup_approved', f'approval:{draft_id}', {'actor': actor})

    def edit_draft(self, draft_id, subject, body):
        with self.transaction() as db:
            changed = db.execute("UPDATE drafts SET subject=?,body=? WHERE id=? AND status='needs_review'",
                                 (text(subject, maximum=160), text(body, maximum=6000, multiline=True), draft_id)).rowcount
            if not changed:
                raise Problem(409, 'Only unapproved drafts can be edited')

    def qualify(self, contact_id, evidence, actor):
        if not isinstance(evidence, dict):
            raise Problem(400, 'Qualification evidence must be an object')
        fields = {k: text(evidence.get(k), maximum=1000) for k in ('workflow', 'volume', 'authority', 'budget', 'timing', 'success_metric')}
        fields['actor'] = text(actor, maximum=120)
        with self.transaction() as db:
            row = db.execute('SELECT * FROM contacts WHERE id=?', (contact_id,)).fetchone()
            if not row:
                raise Problem(404, 'Contact not found')
            if row['stage'] in ('identified', 'captured'):
                db.execute("UPDATE contacts SET stage='qualified' WHERE id=?", (contact_id,))
            self.event(db, contact_id, 'qualified', f'qualified:{contact_id}', fields)
            self.crm(db, contact_id)

    def mark_reply(self, contact_id, actor):
        with self.transaction() as db:
            if not db.execute('UPDATE contacts SET replied=1 WHERE id=?', (contact_id,)).rowcount:
                raise Problem(404, 'Contact not found')
            db.execute("UPDATE drafts SET status='canceled' WHERE contact_id=? AND status IN ('needs_review','approved')", (contact_id,))
            self.event(db, contact_id, 'replied', f'reply:{contact_id}', {'actor': text(actor, maximum=120)})

    def complete_booking(self, uri, outcome, actor):
        if outcome not in ('completed', 'no_show'):
            raise Problem(400, 'Invalid meeting outcome')
        with self.transaction() as db:
            booking = db.execute("SELECT * FROM bookings WHERE uri=? AND status='active'", (uri,)).fetchone()
            if not booking or not booking['contact_id'] or booking['ends_at'] > self.now():
                raise Problem(409, 'An ended, active, matched meeting is required')
            db.execute('UPDATE bookings SET status=?,updated_at=? WHERE uri=?', (outcome, self.now(), uri))
            db.execute('UPDATE contacts SET stage=? WHERE id=?', (outcome, booking['contact_id']))
            self.event(db, booking['contact_id'], outcome, f'{outcome}:{uri}', {'actor': text(actor, maximum=120), 'booking': uri})
            self.crm(db, booking['contact_id'])

    def reconcile_booking(self, uri, contact_id, actor, evidence):
        detail = {'actor': text(actor, maximum=120), 'evidence': text(evidence, maximum=1000), 'booking': uri}
        with self.transaction() as db:
            booking = db.execute('SELECT * FROM bookings WHERE uri=? AND contact_id IS NULL', (uri,)).fetchone()
            contact = db.execute('SELECT * FROM contacts WHERE id=?', (contact_id,)).fetchone()
            if not booking or not contact:
                raise Problem(409, 'An unmatched booking and existing contact are required')
            db.execute('UPDATE bookings SET contact_id=? WHERE uri=?', (contact_id, uri))
            self.event(db, contact_id, 'booking_reconciled', f'reconciled:{uri}', detail)
            if booking['status'] == 'active':
                self.event(db, contact_id, 'booked', f'booked:{uri}', {'booking': uri})
                db.execute("UPDATE contacts SET stage='booked' WHERE id=? AND stage NOT IN ('completed','won','lost','closed')", (contact_id,))
                db.execute("UPDATE drafts SET status='canceled' WHERE contact_id=? AND status IN ('needs_review','approved')", (contact_id,))
            self.crm(db, contact_id)

    def import_prospect(self, row, actor):
        # Import is identification only. No enrichment purchase, scraping or cold sequence.
        email = email_address(row.get('email'))
        evidence = {k: text(row.get(k), maximum=1000) for k in ('source_url', 'fit_evidence', 'jurisdiction')}
        if urlsplit(evidence['source_url']).scheme != 'https':
            raise Problem(400, 'Source evidence must be an HTTPS URL')
        evidence['actor'] = text(actor, maximum=120)
        with self.transaction() as db:
            existing = db.execute('SELECT id FROM contacts WHERE email=?', (email,)).fetchone()
            if existing:
                return existing['id']
            cid = str(uuid.uuid4())
            db.execute("INSERT INTO contacts(id,email,name,company,source,created_at) VALUES(?,?,?,?,'prospect',?)",
                       (cid, email, text(row.get('name'), maximum=120), text(row.get('company'), maximum=160), self.now()))
            self.event(db, cid, 'identified', f'identified:{cid}', evidence)
            # Unconsented prospect records stay local; no automatic transfer to an email/CRM provider.
            return cid

    def grant_permission(self, cid, evidence, actor):
        with self.transaction() as db:
            if not db.execute('SELECT 1 FROM contacts WHERE id=?', (cid,)).fetchone():
                raise Problem(404, 'Contact not found')
            proof = {'evidence': text(evidence, maximum=1000), 'actor': text(actor, maximum=120)}
            db.execute("UPDATE contacts SET permission='opt_in', permission_evidence=? WHERE id=?", (canonical(proof), cid))
            # Existing suppression is deliberately never cleared here.
            self.event(db, cid, 'permission_recorded', f'permission:{cid}', proof)
            self.draft(db, cid, 'response', self.now())
            self.crm(db, cid)

    def report(self):
        with self.transaction() as db:
            stages = dict(db.execute('SELECT kind,COUNT(DISTINCT contact_id) FROM events GROUP BY kind').fetchall())
            cohorts = []
            for cohort in ('website', 'prospect'):
                counts = {'cohort': cohort, 'contacts': db.execute('SELECT COUNT(*) FROM contacts WHERE source=?', (cohort,)).fetchone()[0]}
                for kind in ('identified', 'captured', 'qualified', 'outreach_sent', 'replied', 'booked', 'completed', 'no_show'):
                    counts[kind] = db.execute('SELECT COUNT(DISTINCT e.contact_id) FROM events e JOIN contacts c ON c.id=e.contact_id WHERE c.source=? AND e.kind=?', (cohort, kind)).fetchone()[0]
                counts['qualified_to_booked'] = self.conversion(db, cohort, 'qualified', 'booked')
                counts['booked_to_completed'] = self.conversion(db, cohort, 'booked', 'completed')
                cohorts.append(counts)
            return {'unique_contact_events': stages, 'cohorts': cohorts,
                    'draft_status': dict(db.execute('SELECT status,COUNT(*) FROM drafts GROUP BY status').fetchall()),
                    'crm_status': dict(db.execute('SELECT status,COUNT(*) FROM crm_jobs GROUP BY status').fetchall()),
                    'unmatched_bookings': db.execute('SELECT COUNT(*) FROM bookings WHERE contact_id IS NULL').fetchone()[0]}

    @staticmethod
    def conversion(db, cohort, first, second):
        rows = db.execute('SELECT DISTINCT e.contact_id FROM events e JOIN contacts c ON c.id=e.contact_id WHERE c.source=? AND e.kind=?', (cohort, first)).fetchall()
        converted = sum(bool(db.execute('SELECT 1 FROM events WHERE contact_id=? AND kind=?', (r[0], second)).fetchone()) for r in rows)
        return {'numerator': converted, 'denominator': len(rows), 'rate': round(converted / len(rows), 4) if rows else None}
