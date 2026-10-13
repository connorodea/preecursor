"""Only the static form's URL and Turnstile site key are public configuration."""
import os
from dataclasses import dataclass
from urllib.parse import urlsplit


@dataclass(frozen=True)
class Config:
    database: str
    token_secret: str
    public_url: str = 'https://preecursor.com/acquisition'
    origins: tuple[str, ...] = ('https://preecursor.com', 'https://www.preecursor.com')
    booking_url: str = ''
    calendly_secret: str = ''
    calendly_event_type: str = ''
    turnstile_secret: str = ''
    hubspot_token: str = ''
    crm_enabled: bool = False
    resend_token: str = ''
    resend_webhook_secret: str = ''
    sending_enabled: bool = False
    sender: str = ''
    reply_to: str = ''
    postal_address: str = ''

    @classmethod
    def from_env(cls):
        config = cls(
            database=os.environ.get('ACQ_DATABASE', '/var/lib/preecursor-acquisition/leads.sqlite3'),
            token_secret=os.environ.get('ACQ_TOKEN_SECRET', ''),
            public_url=os.environ.get('ACQ_PUBLIC_URL', 'https://preecursor.com/acquisition').rstrip('/'),
            origins=tuple(os.environ.get('ACQ_ORIGINS', 'https://preecursor.com,https://www.preecursor.com').split(',')),
            booking_url=os.environ.get('ACQ_BOOKING_URL', ''),
            calendly_secret=os.environ.get('ACQ_CALENDLY_SECRET', ''),
            calendly_event_type=os.environ.get('ACQ_CALENDLY_EVENT_TYPE', ''),
            turnstile_secret=os.environ.get('ACQ_TURNSTILE_SECRET', ''),
            hubspot_token=os.environ.get('ACQ_HUBSPOT_TOKEN', ''),
            crm_enabled=os.environ.get('ACQ_CRM_ENABLED') == 'true',
            resend_token=os.environ.get('ACQ_RESEND_TOKEN', ''),
            resend_webhook_secret=os.environ.get('ACQ_RESEND_WEBHOOK_SECRET', ''),
            sending_enabled=os.environ.get('ACQ_SENDING_ENABLED') == 'true',
            sender=os.environ.get('ACQ_SENDER', ''),
            reply_to=os.environ.get('ACQ_REPLY_TO', ''),
            postal_address=os.environ.get('ACQ_POSTAL_ADDRESS', ''),
        )
        config.validate()
        return config

    def validate(self):
        if len(self.token_secret) < 32 or not self.turnstile_secret:
            raise ValueError('Set strong ACQ_TOKEN_SECRET and ACQ_TURNSTILE_SECRET')
        for url in (self.public_url, *self.origins):
            parts = urlsplit(url)
            if parts.scheme != 'https' or not parts.hostname or parts.username or parts.password or parts.query or parts.fragment:
                raise ValueError('Public URLs and origins must use HTTPS without credentials/query/fragment')
        if self.booking_url:
            parts = urlsplit(self.booking_url)
            if parts.scheme != 'https' or parts.hostname != 'calendly.com' or parts.username or parts.password or parts.query or parts.fragment:
                raise ValueError('ACQ_BOOKING_URL must be a clean https://calendly.com event URL')
            if not self.calendly_secret or not self.calendly_event_type.startswith('https://api.calendly.com/event_types/'):
                raise ValueError('Configure signed Calendly webhooks before enabling booking')
        if self.crm_enabled and not self.hubspot_token:
            raise ValueError('CRM enabled without credentials')
        if self.sending_enabled and not all((self.resend_token, self.resend_webhook_secret, self.sender, self.reply_to, self.postal_address)):
            raise ValueError('Sending requires email credentials, signed feedback, sender and postal address')
        if any('\n' in value or '\r' in value for value in (self.sender, self.reply_to, self.postal_address)):
            raise ValueError('Sender/address must be single-line values')
