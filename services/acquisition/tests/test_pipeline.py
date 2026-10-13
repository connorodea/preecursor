import base64
import hashlib
import hmac
import io
import json
import tempfile
import threading
import unittest
import uuid
from concurrent.futures import ThreadPoolExecutor
from dataclasses import replace
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import Mock
from urllib.request import Request, urlopen
from wsgiref.simple_server import make_server, WSGIRequestHandler

from services.acquisition.app import create_app
from services.acquisition.config import Config
from services.acquisition.core import Store, Problem, canonical
from services.acquisition.providers import Providers, ProviderError
from services.acquisition.webhooks import calendly_event, calendly_signature, resend_event, resend_signature
from services.acquisition.worker import tick


def iso(ts):
    return datetime.fromtimestamp(ts, timezone.utc).isoformat()


class PipelineTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.now = 1791918000
        self.config = Config(database=str(Path(self.tmp.name) / 'test.sqlite3'), token_secret='s' * 40,
                             booking_url='https://calendly.com/preecursor/discovery', calendly_secret='calendar-secret',
                             calendly_event_type='https://api.calendly.com/event_types/discovery',
                             turnstile_secret='test-only', reply_to='replies@example.com', sender='Preecursor <hello@example.com>', postal_address='Test address',
                             resend_webhook_secret='whsec_' + base64.b64encode(b'test-resend-secret').decode())
        self.store = Store(self.config, clock=lambda: self.now)
        self.store.initialize()
        self.providers = Mock()
        self.providers.send.return_value = 'email-123'
        self.providers.hubspot.return_value = 'crm-123'
        self.app = create_app(self.config, self.providers, self.store)

    def lead(self, **overrides):
        return dict(schemaVersion=1, submissionId=str(uuid.uuid4()), name='Test Buyer', email='buyer@example.com',
                    company='Example Distribution', outcome='Reduce manual quote entry and follow-up delays.',
                    budget='15k-50k', timeline='30-days', attribution={'utm_source': 'partner'},
                    consent='inquiry-v1', turnstileToken='test-challenge', **overrides)

    def rows(self, table):
        with self.store.transaction() as db:
            return [dict(row) for row in db.execute(f'SELECT * FROM {table}')]

    def saved(self):
        body = self.lead()
        result = self.store.intake(body)
        return body, result, self.rows('contacts')[0]['id']

    def request(self, method, path, body=None, headers=None, raw=None):
        raw = raw if raw is not None else json.dumps(body).encode() if body is not None else b''
        env = {'REQUEST_METHOD': method, 'PATH_INFO': path, 'CONTENT_LENGTH': str(len(raw)),
               'CONTENT_TYPE': 'application/json', 'HTTP_ORIGIN': 'https://preecursor.com',
               'REMOTE_ADDR': '127.0.0.1', 'wsgi.input': io.BytesIO(raw), **(headers or {})}
        response = []
        output = b''.join(self.app(env, lambda status, headers: response.append((int(status.split()[0]), dict(headers)))))
        return *response[0], output

    def booking(self, kind='invitee.created', uri='one', email='buyer@example.com', updated=None):
        return {'event': kind, 'created_at': iso(self.now), 'payload': {
            'uri': f'https://api.calendly.com/scheduled_events/event/invitees/{uri}', 'email': email,
            'updated_at': iso(updated or self.now), 'tracking': {},
            'scheduled_event': {'event_type': self.config.calendly_event_type,
                                'start_time': iso(self.now + 600), 'end_time': iso(self.now + 2400)}}}

    def signature(self, raw, timestamp=None):
        ts = str(timestamp if timestamp is not None else self.now)
        return f't={ts},v1=' + hmac.new(self.config.calendly_secret.encode(), ts.encode() + b'.' + raw, hashlib.sha256).hexdigest()

    def deliver(self, event):
        raw = canonical(event).encode()
        return calendly_event(self.store, raw, self.signature(raw))

    def enable(self, **options):
        self.store.config = replace(self.config, **options)

    def test_capture_durable_retry_duplicate_and_no_automatic_qualification(self):
        body, first, cid = self.saved()
        self.assertEqual(first, self.store.intake(body))
        second = {**body, 'submissionId': str(uuid.uuid4()), 'company': 'Unverified rename'}
        self.store.intake(second)
        self.assertEqual(len(self.rows('contacts')), 1)
        self.assertEqual(len(self.rows('submissions')), 2)
        self.assertEqual(len(self.rows('drafts')), 1)
        self.assertEqual(self.rows('contacts')[0]['company'], 'Example Distribution')
        self.assertEqual(self.rows('contacts')[0]['stage'], 'captured')
        self.assertEqual(Store(self.config).intake(body), first)
        self.assertEqual(self.rows('contacts')[0]['score'], 60)

    def test_changed_retry_conflicts_without_partial_effect(self):
        body, _, _ = self.saved()
        with self.assertRaises(Problem) as error:
            self.store.intake({**body, 'outcome': 'A different outcome and changed project scope'})
        self.assertEqual(error.exception.status, 409)
        self.assertEqual(len(self.rows('submissions')), 1)

    def test_concurrent_duplicates_create_one_contact(self):
        body = self.lead()
        with ThreadPoolExecutor(max_workers=8) as pool:
            results = list(pool.map(lambda _: self.store.intake(body), range(8)))
        self.assertTrue(all(r == results[0] for r in results))
        self.assertEqual(len(self.rows('contacts')), 1)
        self.assertEqual(len(self.rows('submissions')), 1)

    def test_transaction_failure_rolls_back_intake(self):
        with self.store.transaction() as db:
            db.execute("CREATE TRIGGER reject_events BEFORE INSERT ON events BEGIN SELECT RAISE(ABORT, 'test failure'); END")
        status, _, body = self.request('POST', '/leads', self.lead())
        self.assertEqual(status, 503)
        self.assertNotIn(b'accepted', body)
        self.assertEqual(self.rows('contacts'), [])

    def test_bad_inputs_are_rejected(self):
        for field, value in [('consent', ''), ('fax', 'bot'), ('email', 'broken'), ('name', 'test\nBcc:'),
                             ('budget', 'rich'), ('timeline', []), ('submissionId', 'abc'), ('outcome', 'short'),
                             ('attribution', []), ('attribution', {'utm_source': 'x' * 161})]:
            with self.subTest(field=field, value=value), self.assertRaises(Problem):
                self.store.intake({**self.lead(), field: value})

    def test_capture_request_origin_size_json_and_challenge(self):
        for headers, raw, status in [({'HTTP_ORIGIN': 'https://evil.example'}, b'{}', 403),
                                      ({'CONTENT_LENGTH': '999999'}, b'{}', 413),
                                      ({}, b'{', 400), ({}, b'[]', 400),
                                      ({'CONTENT_TYPE': 'text/plain'}, b'{}', 415)]:
            with self.subTest(status=status):
                self.assertEqual(self.request('POST', '/leads', headers=headers, raw=raw)[0], status)
        self.providers.turnstile.side_effect = Problem(400, 'challenge failed')
        self.assertEqual(self.request('POST', '/leads', self.lead())[0], 400)
        self.assertEqual(self.rows('contacts'), [])

    def test_rate_limit_is_shared_by_connections_and_retains_no_ip(self):
        for _ in range(5):
            self.store.rate_limit('1.2.3.4')
        with self.assertRaises(Problem) as error:
            Store(self.config, clock=lambda: self.now).rate_limit('1.2.3.4')
        self.assertEqual(error.exception.status, 429)
        self.assertNotIn('1.2.3.4', str(self.rows('rate_limits')))
        self.now += 61
        self.store.rate_limit('1.2.3.4')

    def test_real_http_inquiry_to_booking_link(self):
        class Quiet(WSGIRequestHandler):
            def log_message(self, *_):
                pass
        server = make_server('127.0.0.1', 0, self.app, handler_class=Quiet)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            request = Request(f'http://127.0.0.1:{server.server_port}/leads', data=json.dumps(self.lead()).encode(),
                              headers={'Content-Type': 'application/json', 'Origin': 'https://preecursor.com'})
            with urlopen(request) as response:
                result = json.load(response)
            self.assertTrue(result['accepted'])
            self.assertIn('/booking/', result['bookingUrl'])
            self.assertEqual(len(self.rows('submissions')), 1)
        finally:
            server.shutdown(); thread.join(); server.server_close()

    def test_cors_and_no_public_admin(self):
        status, headers, _ = self.request('OPTIONS', '/leads')
        self.assertEqual(status, 204)
        self.assertEqual(headers['Access-Control-Allow-Origin'], 'https://preecursor.com')
        self.assertEqual(self.request('OPTIONS', '/leads', headers={'HTTP_ORIGIN': 'https://evil.example'})[0], 403)
        self.assertEqual(self.request('GET', '/contacts')[0], 404)
        self.assertEqual(self.request('GET', '/health')[0], 200)

    def test_booking_link_is_not_a_booking(self):
        _, result, _ = self.saved()
        token = result['bookingUrl'].split('/')[-1]
        redirect = self.store.booking_redirect(token)
        self.assertIn('utm_content=', redirect)
        self.assertNotIn('buyer', redirect)
        self.assertNotIn('booked', self.store.report()['unique_contact_events'])
        with self.assertRaises(Problem):
            self.store.booking_redirect(token + 'x')

    def test_signed_booking_replay_qualification_and_completion(self):
        _, _, cid = self.saved()
        self.store.qualify(cid, {k: 'Verified in inquiry review' for k in ('workflow', 'volume', 'authority', 'budget', 'timing', 'success_metric')}, 'operator')
        event = self.booking()
        self.deliver(event); self.deliver(event)
        self.assertEqual(len(self.rows('bookings')), 1)
        self.assertEqual(self.rows('contacts')[0]['stage'], 'booked')
        self.assertEqual(self.rows('drafts')[0]['status'], 'canceled')
        uri = event['payload']['uri']
        with self.assertRaises(Problem):
            self.store.complete_booking(uri, 'completed', 'operator')
        self.now += 2500
        self.store.complete_booking(uri, 'completed', 'operator')
        metrics = self.store.report()['cohorts'][0]
        self.assertEqual(metrics['booked_to_completed']['rate'], 1)
        self.assertEqual(metrics['qualified_to_booked']['rate'], 1)
        with self.assertRaises(Problem):
            self.store.complete_booking(uri, 'completed', 'operator')

    def test_tampered_stale_future_and_malformed_signature(self):
        raw = canonical(self.booking()).encode()
        for signature, data in [(self.signature(raw), raw + b' '), (self.signature(raw, self.now - 301), raw),
                                (self.signature(raw, self.now + 301), raw), ('broken', raw), ('t=x,v1=y', raw)]:
            with self.subTest(signature=signature), self.assertRaises(Problem):
                calendly_event(self.store, data, signature)
        self.assertEqual(self.rows('webhook_receipts'), [])

    def test_cancel_before_create_and_reschedule_order(self):
        self.saved()
        old_create = self.booking(updated=self.now - 20)
        self.deliver(self.booking('invitee.canceled'))
        self.deliver(old_create)
        self.assertEqual(self.rows('bookings')[0]['status'], 'canceled')
        self.deliver(self.booking(uri='two'))
        self.deliver(self.booking('invitee.canceled', updated=self.now + 1))
        self.assertEqual(self.rows('contacts')[0]['stage'], 'booked')
        self.assertEqual(sum(b['status'] == 'active' for b in self.rows('bookings')), 1)

    def test_unmatched_and_wrong_event_type_do_not_convert(self):
        self.saved()
        event = self.booking(email='different@example.com')
        self.deliver(event)
        self.assertEqual(self.store.report()['unmatched_bookings'], 1)
        self.assertEqual(self.rows('contacts')[0]['stage'], 'captured')
        event = self.booking(uri='unrelated')
        event['payload']['scheduled_event']['event_type'] = 'other-event'
        self.deliver(event)
        self.assertEqual(len(self.rows('bookings')), 1)

    def test_token_email_mismatch_requires_reconciliation(self):
        _, _, cid = self.saved()
        event = self.booking()
        event['payload']['tracking']['utm_content'] = self.store.token('booking', str(uuid.uuid4()))
        self.deliver(event)
        self.assertEqual(self.store.report()['unmatched_bookings'], 1)
        self.assertEqual(self.rows('contacts')[0]['stage'], 'captured')

    def test_unsubscribe_get_does_not_mutate_post_does_and_retry_cannot_clear(self):
        body, _, cid = self.saved()
        path = '/unsubscribe/' + self.store.token('unsubscribe', cid)
        self.assertEqual(self.request('GET', path)[0], 200)
        self.assertEqual(self.rows('suppression'), [])
        self.assertEqual(self.request('POST', path)[0], 200)
        self.assertEqual(self.request('POST', path)[0], 200)
        self.store.intake({**body, 'submissionId': str(uuid.uuid4())})
        self.store.grant_permission(cid, 'new permission does not clear suppression', 'operator')
        self.assertEqual(len(self.rows('suppression')), 1)
        self.enable(sending_enabled=True)
        tick(self.store, self.providers)
        self.providers.send.assert_not_called()

    def test_no_sends_without_enable_and_per_message_approval(self):
        self.saved()
        draft = self.rows('drafts')[0]
        tick(self.store, self.providers)
        self.store.approve(draft['id'], 'operator')
        tick(self.store, self.providers)
        self.providers.send.assert_not_called()
        self.enable(sending_enabled=True)
        self.assertEqual(tick(self.store, self.providers)['sent'], 1)
        tick(self.store, self.providers)
        self.assertEqual(self.providers.send.call_count, 1)
        payload = json.loads(self.rows('drafts')[0]['envelope'])
        self.assertIn('List-Unsubscribe', payload['headers'])
        self.assertIn('Test address', payload['text'])

    def test_approved_content_is_immutable(self):
        self.saved(); draft = self.rows('drafts')[0]
        self.store.edit_draft(draft['id'], 'Reviewed subject', 'Reviewed body')
        self.store.approve(draft['id'], 'operator')
        with self.assertRaises(Problem):
            self.store.edit_draft(draft['id'], 'Changed', 'Changed body')

    def test_suppression_and_reply_block_already_approved_messages(self):
        for stop in ('suppress', 'reply'):
            with self.subTest(stop=stop):
                body = self.lead(); body['email'] = stop + '@example.com'
                self.store.intake(body)
                contact = next(c for c in self.rows('contacts') if c['email'] == body['email'])
                draft = next(d for d in self.rows('drafts') if d['contact_id'] == contact['id'])
                self.store.approve(draft['id'], 'operator')
                if stop == 'reply':
                    self.store.mark_reply(contact['id'], 'operator')
                else:
                    with self.store.transaction() as db:
                        self.store.suppress(db, contact['email'], 'request')
        self.enable(sending_enabled=True)
        tick(self.store, self.providers)
        self.providers.send.assert_not_called()

    def test_transient_retry_same_envelope_and_idempotency_window(self):
        self.saved(); draft = self.rows('drafts')[0]
        self.store.approve(draft['id'], 'operator'); self.enable(sending_enabled=True)
        self.providers.send.side_effect = ProviderError(503)
        tick(self.store, self.providers)
        self.now += 300
        tick(self.store, self.providers)
        calls = self.providers.send.call_args_list
        self.assertEqual(calls[0].args[0]['envelope'], calls[1].args[0]['envelope'])
        self.assertEqual(calls[0].args[0]['id'], calls[1].args[0]['id'])
        self.now += 21 * 3600
        tick(self.store, self.providers)
        self.assertEqual(self.rows('drafts')[0]['status'], 'uncertain')
        self.assertEqual(self.providers.send.call_count, 2)

    def test_one_followup_after_three_days_requires_fresh_approval(self):
        self.saved(); self.store.approve(self.rows('drafts')[0]['id'], 'operator'); self.enable(sending_enabled=True)
        tick(self.store, self.providers)
        self.now += 3 * 86400
        tick(self.store, self.providers); tick(self.store, self.providers)
        self.assertEqual(len(self.rows('drafts')), 2)
        self.assertEqual(self.rows('drafts')[1]['status'], 'needs_review')
        self.assertEqual(self.providers.send.call_count, 1)

    def test_crm_failure_does_not_lose_intake_and_retries(self):
        self.saved(); self.enable(crm_enabled=True)
        self.providers.hubspot.side_effect = ProviderError(429)
        tick(self.store, self.providers)
        self.assertEqual(self.rows('crm_jobs')[0]['status'], 'pending')
        self.assertEqual(len(self.rows('submissions')), 1)
        self.providers.hubspot.side_effect = None
        self.now += 300
        tick(self.store, self.providers)
        self.assertEqual(self.rows('crm_jobs')[0]['status'], 'synced')

    def test_crm_inflight_state_change_keeps_new_generation_pending(self):
        _, _, cid = self.saved(); self.enable(crm_enabled=True)
        def sync(*_):
            with self.store.transaction() as db:
                self.store.suppress(db, 'buyer@example.com', 'request during sync')
            return 'crm-123'
        self.providers.hubspot.side_effect = sync
        tick(self.store, self.providers)
        self.assertEqual(self.rows('crm_jobs')[0]['status'], 'pending')
        self.providers.hubspot.side_effect = None
        tick(self.store, self.providers)
        self.assertTrue(self.providers.hubspot.call_args.args[1])

    def test_prospect_import_deduplicates_but_never_enrolls(self):
        row = {'email': 'buyer@example.com', 'name': 'Test Buyer', 'company': 'Example Distribution',
               'source_url': 'https://example.com/team', 'fit_evidence': 'Manual RFQ intake', 'jurisdiction': 'US'}
        cid = self.store.import_prospect(row, 'operator')
        self.assertEqual(cid, self.store.import_prospect(row, 'operator'))
        self.assertEqual(self.rows('drafts'), [])
        self.assertEqual(self.rows('crm_jobs'), [])
        self.store.grant_permission(cid, 'Requested details by email in partner introduction', 'operator')
        self.assertEqual(self.rows('drafts')[0]['status'], 'needs_review')

    def test_resend_bounce_signature_and_replay_suppress_contact(self):
        self.saved()
        raw = canonical({'type': 'email.bounced', 'data': {'to': ['buyer@example.com']}}).encode()
        msg, ts = 'msg-test', str(self.now)
        digest = base64.b64encode(hmac.new(b'test-resend-secret', f'{msg}.{ts}.'.encode() + raw, hashlib.sha256).digest()).decode()
        headers = {'svix-id': msg, 'svix-timestamp': ts, 'svix-signature': 'v1,' + digest}
        resend_event(self.store, raw, headers); resend_event(self.store, raw, headers)
        self.assertEqual(len(self.rows('suppression')), 1)
        self.assertEqual(len(self.rows('webhook_receipts')), 1)
        with self.assertRaises(Problem):
            resend_event(self.store, raw + b' ', headers)

    def test_svix_official_known_vector(self):
        raw = b'{"event_type":"ping","data":{"success":true}}'
        result = resend_signature(raw, {'svix-id': 'msg_loFOjxBNrRLzqYUf', 'svix-timestamp': '1731705121',
                                         'svix-signature': 'v1,rAvfW3dJ/X/qxhsaXPOyyCGmRKsaKWcsNccKXlIktD0='},
                                   'whsec_plJ3nmyCDGBKInavdOK15jsl', 1731705121)
        self.assertEqual(result, 'msg_loFOjxBNrRLzqYUf')

    def test_signed_inbound_reply_cancels_approved_followups(self):
        self.saved(); self.store.approve(self.rows('drafts')[0]['id'], 'operator')
        event = {'type': 'email.received', 'data': {'from': 'Buyer <buyer@example.com>', 'to': ['replies@example.com']}}
        raw = canonical(event).encode(); ts = str(self.now); msg = 'incoming-1'
        signature = base64.b64encode(hmac.new(b'test-resend-secret', f'{msg}.{ts}.'.encode() + raw, hashlib.sha256).digest()).decode()
        status, _, _ = self.request('POST', '/webhooks/resend', raw=raw, headers={
            'HTTP_SVIX_ID': msg, 'HTTP_SVIX_TIMESTAMP': ts, 'HTTP_SVIX_SIGNATURE': 'v1,' + signature})
        self.assertEqual(status, 200)
        self.assertEqual(self.rows('contacts')[0]['replied'], 1)
        self.assertEqual(self.rows('drafts')[0]['status'], 'canceled')
        self.enable(sending_enabled=True); tick(self.store, self.providers)
        self.providers.send.assert_not_called()

    def test_reconcile_unmatched_booking_requires_audited_operator_action(self):
        _, _, cid = self.saved()
        event = self.booking(email='alternate@example.com')
        self.deliver(event)
        self.store.reconcile_booking(event['payload']['uri'], cid, 'operator', 'Confirmed alternate address on call')
        self.assertEqual(self.store.report()['unmatched_bookings'], 0)
        self.assertEqual(self.rows('contacts')[0]['stage'], 'booked')
        self.assertEqual(self.rows('drafts')[0]['status'], 'canceled')

    def test_mocked_provider_end_to_end_over_http_contract(self):
        status, _, response = self.request('POST', '/leads', self.lead())
        self.assertEqual(status, 200)
        receipt = json.loads(response)
        cid = self.rows('contacts')[0]['id']
        self.store.qualify(cid, {key: 'Verified operator evidence' for key in ('workflow', 'volume', 'authority', 'budget', 'timing', 'success_metric')}, 'operator')
        self.store.approve(self.rows('drafts')[0]['id'], 'operator')
        self.enable(sending_enabled=True, crm_enabled=True)
        result = tick(self.store, self.providers)
        self.assertEqual((result['sent'], result['crm_synced']), (1, 1))
        path = '/booking/' + receipt['bookingUrl'].split('/')[-1]
        status, headers, _ = self.request('GET', path)
        self.assertEqual(status, 303)
        self.assertTrue(headers['Location'].startswith(self.config.booking_url))
        event = self.booking()
        event['payload']['tracking']['utm_content'] = receipt['bookingUrl'].split('/')[-1]
        raw = canonical(event).encode()
        self.assertEqual(self.request('POST', '/webhooks/calendly', raw=raw,
                                     headers={'HTTP_CALENDLY_WEBHOOK_SIGNATURE': self.signature(raw)})[0], 200)
        self.now += 2500
        self.store.complete_booking(event['payload']['uri'], 'completed', 'operator')
        tick(self.store, self.providers)
        self.assertEqual(self.store.report()['cohorts'][0]['booked_to_completed']['rate'], 1)
        self.assertEqual(self.providers.send.call_count, 1)

    def test_worker_lock_prevents_parallel_send(self):
        self.saved(); self.store.approve(self.rows('drafts')[0]['id'], 'operator'); self.enable(sending_enabled=True)
        started, release = threading.Event(), threading.Event()
        def send(_):
            started.set(); release.wait(5)
            return 'email-123'
        self.providers.send.side_effect = send
        with ThreadPoolExecutor(max_workers=1) as pool:
            future = pool.submit(tick, self.store, self.providers)
            try:
                self.assertTrue(started.wait(5))
                self.assertTrue(tick(self.store, self.providers)['busy'])
            finally:
                release.set()
            self.assertEqual(future.result()['sent'], 1)
        self.assertEqual(self.providers.send.call_count, 1)

    def test_expired_approval_never_sends(self):
        self.saved(); self.store.approve(self.rows('drafts')[0]['id'], 'operator')
        self.enable(sending_enabled=True)
        self.now += 8 * 86400
        tick(self.store, self.providers)
        self.assertEqual(self.rows('drafts')[0]['status'], 'canceled')
        self.providers.send.assert_not_called()

    def test_config_fails_closed(self):
        self.config.validate()
        for changes in ({'token_secret': ''}, {'turnstile_secret': ''}, {'booking_url': 'https://evil.example'},
                        {'calendly_secret': ''}, {'calendly_event_type': ''}, {'crm_enabled': True},
                        {'sending_enabled': True}, {'public_url': 'http://preecursor.com'}):
            with self.subTest(changes=changes), self.assertRaises(ValueError):
                replace(self.config, **changes).validate()


class AdapterTests(unittest.TestCase):
    def test_hubspot_lookup_create_conflict_reread_patch(self):
        request = Mock(side_effect=[ProviderError(404), ProviderError(409), {'id': '123'}, {'id': '123'}])
        adapter = Providers(Config(database='unused', token_secret='x', hubspot_token='test'), request)
        cid = adapter.hubspot({'email': 'buyer@example.com', 'name': 'Test Buyer', 'company': 'Example', 'stage': 'qualified', 'score': 50}, True)
        self.assertEqual(cid, '123')
        self.assertEqual([call.args[0] for call in request.call_args_list], ['GET', 'POST', 'GET', 'PATCH'])
        self.assertTrue(request.call_args.args[1].endswith('/123'))
        self.assertEqual(request.call_args.args[2]['properties']['preecursor_suppressed'], 'true')

    def test_turnstile_checks_hostname_and_action(self):
        request = Mock(return_value={'success': True, 'hostname': 'preecursor.com', 'action': 'lead-intake'})
        adapter = Providers(Config(database='unused', token_secret='x', turnstile_secret='secret'), request)
        adapter.turnstile('test-token', '127.0.0.1')
        for field in ('hostname', 'action', 'success'):
            request.return_value = {'success': True, 'hostname': 'preecursor.com', 'action': 'lead-intake', field: False}
            with self.subTest(field=field), self.assertRaises(Problem):
                adapter.turnstile('test-token', '127.0.0.1')

    def test_resend_idempotency_header(self):
        request = Mock(return_value={'id': 'email-1'})
        adapter = Providers(Config(database='unused', token_secret='x', resend_token='secret'), request)
        adapter.send({'id': 'draft-id', 'envelope': '{"to":["buyer@example.com"]}'})
        self.assertEqual(request.call_args.args[3]['Idempotency-Key'], 'preecursor/draft-id')


if __name__ == '__main__':
    unittest.main()
