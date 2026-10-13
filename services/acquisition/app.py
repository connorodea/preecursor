"""WSGI API for Gunicorn behind Nginx. There are no public administration routes."""
import html
import json
import logging
import sqlite3
from http import HTTPStatus
from .config import Config
from .core import Problem, Store
from .providers import Providers, ProviderError
from .webhooks import calendly_event, resend_event


def create_app(config=None, providers=None, store=None):
    config = config or Config.from_env()
    store = store or Store(config)
    providers = providers or Providers(config)

    def app(environ, start_response):
        method, path = environ['REQUEST_METHOD'], environ.get('PATH_INFO', '/')
        origin = environ.get('HTTP_ORIGIN', '')
        headers = [('Cache-Control', 'no-store'), ('Referrer-Policy', 'no-referrer'),
                   ('X-Content-Type-Options', 'nosniff'), ('X-Frame-Options', 'DENY'),
                   ('Content-Security-Policy', "default-src 'none'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'")]
        if origin in config.origins:
            headers += [('Access-Control-Allow-Origin', origin), ('Vary', 'Origin')]
        content_type, status, result = 'application/json', 200, {}
        try:
            if method == 'OPTIONS':
                if path != '/leads' or origin not in config.origins:
                    raise Problem(403, 'Origin not permitted')
                headers += [('Access-Control-Allow-Methods', 'POST'), ('Access-Control-Allow-Headers', 'Content-Type'), ('Access-Control-Max-Age', '600')]
                status = 204
            elif method == 'GET' and path == '/health':
                with store.transaction() as db:
                    db.execute('SELECT id FROM contacts LIMIT 1').fetchone()
                result = {'ok': True}
            elif method == 'GET' and path.startswith('/booking/'):
                headers.append(('Location', store.booking_redirect(path.removeprefix('/booking/'))))
                status = 303
            elif path.startswith('/unsubscribe/') and method in ('GET', 'POST'):
                token = path.removeprefix('/unsubscribe/')
                store.untoken('unsubscribe', token)
                content_type = 'text/html; charset=utf-8'
                if method == 'POST':
                    store.unsubscribe(token)
                    result = '<!doctype html><html lang="en"><meta charset="utf-8"><title>Unsubscribed</title><h1>Follow-ups stopped.</h1><p>You will no longer receive Preecursor acquisition follow-ups.</p></html>'
                else:
                    # GET never opts out: mail security scanners often open links.
                    result = '<!doctype html><html lang="en"><meta charset="utf-8"><title>Stop follow-ups</title><h1>Stop Preecursor follow-ups?</h1><form method="post" action="' + html.escape(config.public_url + path, quote=True) + '"><button type="submit">Unsubscribe</button></form></html>'
            elif method == 'POST' and path in ('/leads', '/webhooks/calendly', '/webhooks/resend'):
                if environ.get('CONTENT_TYPE', '').split(';')[0].strip().lower() != 'application/json':
                    raise Problem(415, 'JSON is required')
                limit = 16384 if path == '/leads' else 65536
                try:
                    length = int(environ.get('CONTENT_LENGTH', '0'))
                except ValueError:
                    raise Problem(400, 'Invalid request length') from None
                if length <= 0 or length > limit:
                    raise Problem(413, 'Invalid request size')
                if path == '/leads':
                    if origin not in config.origins:
                        raise Problem(403, 'Origin not permitted')
                    ip = environ.get('HTTP_X_REAL_IP') or environ.get('REMOTE_ADDR', '')
                    store.rate_limit(ip)
                raw = environ['wsgi.input'].read(length)
                if len(raw) != length:
                    raise Problem(400, 'Incomplete request')
                if path == '/leads':
                    body = json.loads(raw)
                    if not isinstance(body, dict):
                        raise Problem(400, 'Invalid inquiry')
                    providers.turnstile(body.get('turnstileToken'), ip)
                    result = store.intake(body)
                elif path.endswith('/calendly'):
                    result = calendly_event(store, raw, environ.get('HTTP_CALENDLY_WEBHOOK_SIGNATURE', ''))
                else:
                    wh_headers = {key: environ.get('HTTP_' + key.upper().replace('-', '_'), '') for key in ('svix-id', 'svix-timestamp', 'svix-signature')}
                    result = resend_event(store, raw, wh_headers)
            else:
                raise Problem(404, 'Not found')
        except Problem as error:
            status, result, content_type = error.status, {'error': error.message}, 'application/json'
        except (json.JSONDecodeError, UnicodeDecodeError):
            status, result = 400, {'error': 'Invalid JSON'}
        except (sqlite3.Error, ProviderError):
            status, result = 503, {'error': 'Service temporarily unavailable; please retry'}
            logging.error('acquisition_dependency_failure')
        except Exception:
            # Do not log request content, tokens, addresses, secrets or provider error bodies.
            status, result = 500, {'error': 'Request could not be completed'}
            logging.error('acquisition_unexpected_failure')
        if status in (429, 503):
            headers.append(('Retry-After', '60'))
        body = (result if isinstance(result, str) else json.dumps(result)).encode('utf-8') if status != 204 else b''
        headers += [('Content-Type', content_type), ('Content-Length', str(len(body)))]
        start_response(f'{status} {HTTPStatus(status).phrase}', headers)
        return [body]
    return app
