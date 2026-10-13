"""One local worker; durable retries and immutable, explicitly approved emails."""
import fcntl
import json
from .providers import ProviderError


def tick(store, providers):
    result = {'crm_synced': 0, 'sent': 0, 'failed': 0}
    # Lock survives for the entire provider call; another timer cannot send the same draft.
    with open(store.config.database + '.worker.lock', 'a') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return {**result, 'busy': True}
        with store.transaction() as db:
            for row in db.execute("SELECT contact_id,sent_at FROM drafts WHERE kind='response' AND status='sent' AND sent_at<=?", (store.now() - 3 * 86400,)).fetchall():
                if store.eligible(db, row['contact_id']):
                    store.draft(db, row['contact_id'], 'followup', row['sent_at'] + 3 * 86400)
            jobs = db.execute("SELECT * FROM crm_jobs WHERE status='pending' AND due_at<=? LIMIT 25", (store.now(),)).fetchall()
        if store.config.crm_enabled:
            for job in jobs:
                with store.transaction() as db:
                    contact = db.execute('SELECT * FROM contacts WHERE id=?', (job['contact_id'],)).fetchone()
                    suppressed = bool(db.execute('SELECT 1 FROM suppression WHERE email=?', (contact['email'],)).fetchone())
                try:
                    remote_id = providers.hubspot(contact, suppressed)
                    with store.transaction() as db:
                        db.execute("UPDATE crm_jobs SET status='synced',remote_id=?,error=NULL WHERE contact_id=? AND generation=?", (remote_id, job['contact_id'], job['generation']))
                    result['crm_synced'] += 1
                except (ProviderError, KeyError, TypeError):
                    attempts = job['attempts'] + 1
                    with store.transaction() as db:
                        db.execute('UPDATE crm_jobs SET status=?,attempts=?,due_at=?,error=? WHERE contact_id=? AND generation=?',
                                   ('failed' if attempts >= 10 else 'pending', attempts, store.now() + min(3600, 60 * 2 ** attempts), 'crm_sync_failed', job['contact_id'], job['generation']))
                    result['failed'] += 1
        if not store.config.sending_enabled:
            return result
        with store.transaction() as db:
            drafts = db.execute("SELECT id FROM drafts WHERE status='approved' AND due_at<=? LIMIT 10", (store.now(),)).fetchall()
        for row in drafts:
            with store.transaction() as db:
                draft = db.execute("SELECT * FROM drafts WHERE id=? AND status='approved'", (row['id'],)).fetchone()
                if not draft:
                    continue
                if not store.eligible(db, draft['contact_id']) or store.now() - draft['approved_at'] > 7 * 86400:
                    db.execute("UPDATE drafts SET status='canceled',error='ineligible_or_expired' WHERE id=?", (draft['id'],))
                    continue
                # Resend's idempotency retention is 24h. Never retry beyond our 20h safety window.
                if draft['first_attempt'] is not None and store.now() - draft['first_attempt'] >= 20 * 3600:
                    db.execute("UPDATE drafts SET status='uncertain',error='reconcile_provider_before_retry' WHERE id=?", (draft['id'],))
                    continue
                db.execute('UPDATE drafts SET first_attempt=COALESCE(first_attempt,?),attempts=attempts+1 WHERE id=?', (store.now(), draft['id']))
            try:
                remote_id = providers.send(draft)
                with store.transaction() as db:
                    # If suppression arrived while the API call was in flight, record the actual send.
                    db.execute("UPDATE drafts SET status='sent',sent_at=?,provider_id=?,error=NULL WHERE id=?", (store.now(), remote_id, draft['id']))
                    store.event(db, draft['contact_id'], 'outreach_sent', f'sent:{draft["id"]}', {'kind': draft['kind']})
                result['sent'] += 1
            except ProviderError as error:
                attempts = draft['attempts'] + 1
                retryable = error.status in (0, 409, 429) or error.status >= 500
                with store.transaction() as db:
                    db.execute("UPDATE drafts SET status=?,due_at=?,error=? WHERE id=? AND status='approved'",
                               ('approved' if retryable and attempts < 10 else 'uncertain' if retryable else 'failed',
                                store.now() + min(3600, 60 * 2 ** attempts), str(error), draft['id']))
                result['failed'] += 1
    return result
