"""Small HTTP adapters. Fixed provider hosts, finite timeouts, no body logging."""
import json
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, build_opener, HTTPRedirectHandler
from .core import Problem, canonical


class ProviderError(Exception):
    def __init__(self, status=0):
        self.status = status
        super().__init__(f'provider_http_{status}')


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def request_json(method, url, body=None, headers=None):
    request = Request(url, data=canonical(body).encode() if body is not None else None, method=method,
                      headers={'Content-Type': 'application/json', **(headers or {})})
    try:
        with build_opener(NoRedirect).open(request, timeout=10) as response:
            raw = response.read(1024 * 1024 + 1)
            if len(raw) > 1024 * 1024:
                raise ProviderError()
            return json.loads(raw) if raw else {}
    except HTTPError as error:
        raise ProviderError(error.code) from None
    except (URLError, TimeoutError, OSError, ValueError):
        raise ProviderError() from None


class Providers:
    def __init__(self, config, request=request_json):
        self.config, self.request = config, request

    def turnstile(self, token, ip):
        if not isinstance(token, str) or not token or len(token) > 2048:
            raise Problem(400, 'Complete the verification challenge')
        result = self.request('POST', 'https://challenges.cloudflare.com/turnstile/v0/siteverify',
                              {'secret': self.config.turnstile_secret, 'response': token, 'remoteip': ip})
        hosts = {url.split('/')[2] for url in self.config.origins}
        if result.get('success') is not True or result.get('hostname') not in hosts or result.get('action') != 'lead-intake':
            raise Problem(400, 'Verification expired or failed; please try again')

    def hubspot(self, contact, suppressed):
        base = 'https://api.hubapi.com/crm/v3/objects/contacts'
        headers = {'Authorization': 'Bearer ' + self.config.hubspot_token}
        names = contact['name'].split(' ', 1)
        properties = {'email': contact['email'], 'firstname': names[0], 'lastname': names[1] if len(names) > 1 else '',
                      'company': contact['company'], 'preecursor_stage': contact['stage'],
                      'preecursor_score': str(contact['score']), 'preecursor_suppressed': 'true' if suppressed else 'false'}
        # GET/PATCH avoids email-key partial upsert limitations; 409 creation races re-read.
        url = base + '/' + quote(contact['email'], safe='') + '?idProperty=email'
        try:
            existing = self.request('GET', url, headers=headers)
        except ProviderError as error:
            if error.status != 404:
                raise
            try:
                return self.request('POST', base, {'properties': properties}, headers)['id']
            except ProviderError as conflict:
                if conflict.status != 409:
                    raise
                existing = self.request('GET', url, headers=headers)
        # Existing CRM identity fields belong to the operator; update only our namespace.
        updates = {key: value for key, value in properties.items() if key.startswith('preecursor_')}
        return self.request('PATCH', base + '/' + quote(str(existing['id']), safe=''), {'properties': updates}, headers)['id']

    def send(self, draft):
        result = self.request('POST', 'https://api.resend.com/emails', json.loads(draft['envelope']),
                              {'Authorization': 'Bearer ' + self.config.resend_token, 'Idempotency-Key': 'preecursor/' + draft['id']})
        if not isinstance(result.get('id'), str) or not result['id']:
            raise ProviderError()
        return result['id']
