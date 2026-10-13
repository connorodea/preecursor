"""Verify raw bytes before parsing. Persist receipts with their effects atomically."""
import base64
import binascii
import hashlib
import hmac
import json
from datetime import datetime
from email.utils import parseaddr
from .core import Problem, email_address, text


def calendly_signature(raw, signature, secret, now):
    if not secret:
        raise Problem(503, 'Webhook is not configured')
    try:
        parts = [part.strip().split('=', 1) for part in signature.split(',')]
        timestamp = next(v for k, v in parts if k == 't')
        expected = hmac.new(secret.encode(), timestamp.encode() + b'.' + raw, hashlib.sha256).hexdigest()
        valid = any(k == 'v1' and hmac.compare_digest(v, expected) for k, v in parts)
        if abs(now - int(timestamp)) > 300 or not valid:
            raise ValueError()
    except (ValueError, TypeError, StopIteration):
        raise Problem(401, 'Invalid webhook signature') from None


def resend_signature(raw, headers, secret, now):
    if not secret:
        raise Problem(503, 'Webhook is not configured')
    try:
        message_id, timestamp = headers.get('svix-id', ''), headers.get('svix-timestamp', '')
        key = base64.b64decode(secret.removeprefix('whsec_'), validate=True)
        expected = base64.b64encode(hmac.new(key, f'{message_id}.{timestamp}.'.encode() + raw, hashlib.sha256).digest()).decode()
        signatures = [s.split(',', 1) for s in headers.get('svix-signature', '').split()]
        if not message_id or abs(now - int(timestamp)) > 300 or not any(k == 'v1' and hmac.compare_digest(v, expected) for k, v in signatures):
            raise ValueError()
        return message_id
    except (ValueError, TypeError, binascii.Error):
        raise Problem(401, 'Invalid webhook signature') from None


def instant(value):
    try:
        date = datetime.fromisoformat(value.replace('Z', '+00:00'))
        if date.tzinfo is None:
            raise ValueError()
        return int(date.timestamp())
    except (ValueError, AttributeError, TypeError):
        raise Problem(400, 'Invalid event timestamp') from None


def calendly_event(store, raw, signature):
    calendly_signature(raw, signature, store.config.calendly_secret, store.now())
    data = json.loads(raw)
    if not isinstance(data, dict):
        raise Problem(400, 'Invalid event')
    kind = data.get('event')
    if kind not in ('invitee.created', 'invitee.canceled'):
        return {'accepted': True, 'ignored': True}
    payload = data.get('payload')
    if not isinstance(payload, dict):
        raise Problem(400, 'Missing invitee')
    uri = text(payload.get('uri'), maximum=500)
    if not uri.startswith('https://api.calendly.com/scheduled_events/') or '/invitees/' not in uri:
        raise Problem(400, 'Invalid invitee URI')
    event_time = instant(payload.get('updated_at') or data.get('created_at'))
    scheduled = payload.get('scheduled_event') or {}
    if not isinstance(scheduled, dict):
        raise Problem(400, 'Invalid scheduled event')
    if not store.config.calendly_event_type:
        raise Problem(503, 'Discovery event type is not configured')
    if scheduled.get('event_type') != store.config.calendly_event_type:
        return {'accepted': True, 'ignored': True}
    # Require actual schedule data for creation; never guess a meeting's end.
    starts = instant(scheduled.get('start_time')) if kind == 'invitee.created' else 0
    ends = instant(scheduled.get('end_time')) if kind == 'invitee.created' else 0
    if kind == 'invitee.created' and ends <= starts:
        raise Problem(400, 'Invalid meeting interval')
    email = email_address(payload.get('email'))
    key = f'calendly:{kind}:{uri}:{event_time}'
    with store.transaction() as db:
        if db.execute('SELECT 1 FROM webhook_receipts WHERE id=?', (key,)).fetchone():
            return {'accepted': True}
        contact = db.execute('SELECT * FROM contacts WHERE email=?', (email,)).fetchone()
        tracking = payload.get('tracking') or {}
        if not isinstance(tracking, dict):
            raise Problem(400, 'Invalid tracking data')
        token = tracking.get('utm_content')
        if token:
            try:
                cid = store.untoken('booking', token)
                # Email and token must agree; conflicting identity goes to reconciliation.
                if not contact or contact['id'] != cid:
                    contact = None
            except (Problem, AttributeError):
                contact = None
        previous = db.execute('SELECT * FROM bookings WHERE uri=?', (uri,)).fetchone()
        cid = previous['contact_id'] if previous and previous['contact_id'] else contact['id'] if contact else None
        status = 'canceled' if kind == 'invitee.canceled' else 'active'
        # A canceled invitee never reactivates. Reschedules have a new invitee URI.
        if previous and (previous['updated_at'] > event_time or previous['status'] in ('canceled', 'completed', 'no_show')):
            db.execute('INSERT INTO webhook_receipts VALUES(?,?,?)', (key, 'calendly', store.now()))
            return {'accepted': True}
        db.execute('''INSERT INTO bookings VALUES(?,?,?,?,?,?) ON CONFLICT(uri) DO UPDATE SET
            contact_id=excluded.contact_id,status=excluded.status,
            starts_at=CASE WHEN excluded.starts_at=0 THEN bookings.starts_at ELSE excluded.starts_at END,
            ends_at=CASE WHEN excluded.ends_at=0 THEN bookings.ends_at ELSE excluded.ends_at END,
            updated_at=excluded.updated_at''', (uri, cid, status, starts, ends, event_time))
        if cid:
            if status == 'active':
                store.event(db, cid, 'booked', f'booked:{uri}', {'booking': uri})
                db.execute("UPDATE contacts SET stage='booked' WHERE id=? AND stage NOT IN ('completed','won','lost','closed')", (cid,))
                db.execute("UPDATE drafts SET status='canceled' WHERE contact_id=? AND status IN ('needs_review','approved')", (cid,))
            else:
                store.event(db, cid, 'booking_canceled', f'canceled:{uri}', {'booking': uri})
                active = db.execute("SELECT 1 FROM bookings WHERE contact_id=? AND status='active'", (cid,)).fetchone()
                if not active:
                    stage = 'qualified' if db.execute("SELECT 1 FROM events WHERE contact_id=? AND kind='qualified'", (cid,)).fetchone() else 'captured'
                    db.execute("UPDATE contacts SET stage=? WHERE id=? AND stage='booked'", (stage, cid))
            store.crm(db, cid)
        db.execute('INSERT INTO webhook_receipts VALUES(?,?,?)', (key, 'calendly', store.now()))
    return {'accepted': True}


def resend_event(store, raw, headers):
    message_id = resend_signature(raw, headers, store.config.resend_webhook_secret, store.now())
    event = json.loads(raw)
    if not isinstance(event, dict) or not isinstance(event.get('data'), dict):
        raise Problem(400, 'Invalid email event')
    kind = event.get('type')
    key = f'resend:{message_id}'
    with store.transaction() as db:
        if db.execute('SELECT 1 FROM webhook_receipts WHERE id=?', (key,)).fetchone():
            return {'accepted': True}
        if kind in ('email.bounced', 'email.complained', 'email.suppressed'):
            recipients = event['data'].get('to')
            if not isinstance(recipients, list) or not 1 <= len(recipients) <= 50:
                raise Problem(400, 'Invalid recipients')
            for recipient in recipients:
                store.suppress(db, email_address(recipient), kind)
        elif kind == 'email.received':
            recipients = event['data'].get('to', [])
            sender = event['data'].get('from', '')
            if not isinstance(recipients, list) or not isinstance(sender, str):
                raise Problem(400, 'Invalid incoming email')
            if store.config.reply_to and store.config.reply_to.lower() in [str(item).lower() for item in recipients]:
                email = email_address(parseaddr(sender)[1])
                contact = db.execute('SELECT id FROM contacts WHERE email=?', (email,)).fetchone()
                if contact:
                    cid = contact['id']
                    db.execute('UPDATE contacts SET replied=1 WHERE id=?', (cid,))
                    db.execute("UPDATE drafts SET status='canceled' WHERE contact_id=? AND status IN ('needs_review','approved')", (cid,))
                    store.event(db, cid, 'replied', f'reply:{cid}', {'source': 'signed_inbound_email'})
                    store.crm(db, cid)
        db.execute('INSERT INTO webhook_receipts VALUES(?,?,?)', (key, 'resend', store.now()))
    return {'accepted': True}
