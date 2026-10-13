# Acquisition service

Preecursor's Next.js site remains a static export served by Nginx. This independent
Python WSGI service runs behind `/acquisition/` on the existing host. It does not
use Next.js API routes or require a production Node process.

## Delivery status — 2026-10-13

Repository main `19735a7` used a mailto form. Draft PR #56 already contained a
static form and inactive n8n/PostgreSQL drafts. This release extends that PR.
Repository files, available connected tools, and integration discovery were
inspected. HubSpot and Calendly were available but unconnected. No live n8n,
CRM, scheduling account, sending domain, production credentials, or server
configuration was verified. Independently hosted integrations may still exist.

| Component | Implemented | Activation requirement |
| --- | --- | --- |
| Website intake | Validation, explicit inquiry permission, challenge, retry IDs, saved feedback | Deploy backend, Turnstile keys, rebuild site |
| Private lead ledger | Transactions, unique normalized email, immutable inquiries, events | Persistent encrypted host volume and backups |
| Qualification | Transparent score plus evidence-based operator qualification | Operator reviews workflow, volume, authority, budget, timing and success metric |
| CRM | Durable HubSpot contact sync, retries, unique-email lookup and conflict handling | HubSpot private app, three properties, enable flag |
| Scheduling | Hosted Calendly availability UI, correlated link, signed event ingestion | Connected calendar, discovery event type, webhook secret, scheduling URL |
| Booking outcomes | Cancellation/reschedule isolation, no-show/completed operator recording | Operator records attendance after meeting ends |
| Follow-up | Response draft, one draft after three days, immutable approval, durable sender | Verified Resend sender, inbound reply route, signed feedback, postal address, enable flag and approval |
| Suppression | Unsubscribe, bounce, complaint, provider suppression, reply stop | Register feedback and inbound webhooks; operator handles other channels |
| Reporting | Historical distinct-contact milestones and separate source cohorts | Run private `report` command; optional GA4 needs visitor opt-in |
| Prospecting | Evidence-backed CSV import; no automatic enrollment | Human research, source/fit review, permission evidence |

**Implemented and tested is not deployed.** Provider adapters are tested against
controlled responses; live provider behavior and the actual Nginx/systemd host
remain staging gates. A form success means the local transaction committed,
not that CRM sync or email delivery succeeded. The database is the source of truth.

## Why this deployment

Use the existing VPS/Nginx footprint rather than assume an unverified hosted
workflow service. Python/Gunicorn and a private SQLite WAL database keep the
initial single-host pipeline small. HubSpot, Calendly and Resend are replaceable
adapters; credentials never appear in the static bundle. The existing n8n exports
are inactive reference material only. Inventory any independently deployed intake
before switching; do not run two authoritative pipelines.

SQLite is suitable for this initial low-volume, single-host service. This is not
a highly available deployment. Before multiple hosts or substantially higher
write volume, migrate the transactional ledger and outbox to managed PostgreSQL.
Do not put the WAL database on an NFS mount. File permissions do not provide disk
encryption: configure encrypted storage and encrypted off-host backups separately.

## Data and permission rules

- One contact per trimmed, lowercase email; no Gmail-specific alias guessing.
  Repeat submissions remain distinct immutable inquiries. A retry with the same
  ID/payload returns the same receipt; changed data under an ID returns 409.
- Server-side validation, 16 KiB intake limit, five requests/minute/IP, Turnstile
  verification including hostname/action, exact origin allowlist, parameterized
  SQL. Origin checks alone do not authenticate a caller. IPs are HMAC-hashed in
  short-lived rate-limit buckets, not saved with contact records.
- The first inquiry grants only permission to respond to that inquiry. It does
  not subscribe the person to marketing. Suppression survives repeat inquiries
  and later permission records. There is no automatic suppression removal.
- Existing contact identity fields are never overwritten by public resubmissions.
  Existing HubSpot records receive only `preecursor_*` property updates.
- Budget score: exploring 0, under $5k 5, $5k–$15k 20, $15k+ 35. Timing:
  exploring 0, later 5, 90 days 15, 30 days 25. Maximum 60. Self-reported priority
  is not verified fit. `qualify` requires evidence in six fields.
- Each email needs a named human approval. Approved content, sender, recipient,
  reply address and unsubscribe headers are frozen together. Sender checks
  permission, suppression, replies, booking state and seven-day approval expiry
  immediately before each attempt. A request already in flight cannot be recalled.
- At most one initial response and one follow-up per contact. Repeat inquiries do
  not restart a sequence. Follow-up becomes reviewable three days after the first
  response is sent. No bulk cold email, SMS, LinkedIn messaging, scraped lists or
  paid enrichment is executed by this service.
- Resend retries use one immutable idempotency key per draft. After 20 hours from
  the first attempt, ambiguous sends become `uncertain`; they are never blindly
  retried outside the provider's 24-hour deduplication window. Reconcile in the
  provider dashboard. The CLI deliberately has no automatic email resend command.
- Calendly and Resend raw-body signatures have a five-minute timestamp tolerance.
  Receipt IDs and state changes commit together. Only the configured discovery
  event type affects the pipeline. Bookings with mismatched identity remain
  unmatched for manual reconciliation. Canceled invitee URIs cannot reactivate;
  reschedules use a different URI. Native Calendly handles confirmations/reminders.
- A signed inbound `email.received` event to the configured reply address stops
  follow-ups for the sender, including automated replies conservatively. Operators
  must monitor that inbox and record replies arriving through other channels.
  Mail bodies/attachments are neither fetched nor executed.
- No public admin API or dashboard. OS-authorized operators use a local CLI.
  Root and the service OS identity can access the ledger; protect host access.
  Do not write CLI queue/contacts output into public CI logs or issue comments.

## Configuration

Copy `deploy/acquisition.env.example` to `/etc/preecursor/acquisition.env` with
root ownership and mode 0600. This is a systemd EnvironmentFile, not a shell script.
Generate `ACQ_TOKEN_SECRET` with at least 32 random bytes, and keep it stable:
rotating it invalidates existing booking/unsubscribe links. No real values belong
in git, GitHub public variables, URLs, PRs, or chat.

| Setting | Required when |
| --- | --- |
| `ACQ_DATABASE` | Always; outside web root, owned by service user |
| `ACQ_PUBLIC_URL`, `ACQ_ORIGINS` | Always; staging must use its own HTTPS origin |
| `ACQ_TOKEN_SECRET`, `ACQ_TURNSTILE_SECRET` | Always; production refuses missing values |
| `ACQ_BOOKING_URL` | Enable scheduling: clean `https://calendly.com/owner/event` |
| `ACQ_CALENDLY_SECRET`, `ACQ_CALENDLY_EVENT_TYPE` | Scheduling; use exact `https://api.calendly.com/event_types/...` URI |
| `ACQ_HUBSPOT_TOKEN`, `ACQ_CRM_ENABLED=true` | CRM sync; default disabled |
| `ACQ_RESEND_TOKEN`, `ACQ_RESEND_WEBHOOK_SECRET` | Email delivery and authenticated delivery/inbound feedback |
| `ACQ_SENDER`, `ACQ_REPLY_TO`, `ACQ_POSTAL_ADDRESS` | Email approval/delivery; reply address must be monitored and routed through inbound feedback |
| `ACQ_SENDING_ENABLED=true` | Delivery; default disabled; does not approve any drafts |

HubSpot private app scopes: `crm.objects.contacts.read` and
`crm.objects.contacts.write`. Before enabling, create contact properties using
HubSpot's property settings: `preecursor_stage` (single-line text),
`preecursor_score` (number), `preecursor_suppressed` (single checkbox). Make an
operator view using those fields. Contacts are not automatically subscribed to
HubSpot marketing or sequences. This is a one-way operational contact sync, not
a bidirectional marketing-preference integration. Do not run separate HubSpot
outreach automations against these contacts; this ledger enforces suppression.

Calendly: connect the actual calendar; create a 30-minute discovery event, confirm
availability, America/Denver display, minimum notice, buffers, conflict calendars,
meeting link, confirmations, and reminders. Obtain its event-type URI. Register
`invitee.created` and `invitee.canceled` at
`https://preecursor.com/acquisition/webhooks/calendly` with an explicit signing
key. Confirm the account has webhook access. Direct bookings using the same email
can match without the correlation token; mismatches require operator evidence.

Resend: verify a sending domain and sender; set SPF/DKIM/DMARC according to the
provider's instructions. Configure an inbound reply address (a provider-supplied
address or dedicated receiving subdomain) and subscribe `email.received`,
`email.bounced`, `email.complained`, and `email.suppressed` to
`https://preecursor.com/acquisition/webhooks/resend`. **Do not replace the primary
business mailbox MX records.** DNS/provider purchases and live sending remain
separate activation decisions. Monitor the inbound mailbox for actual responses.

Turnstile: create a widget restricted to the production hostname(s), with a
separate widget for staging. Frontend action is `lead-intake`.

Public GitHub Actions variables, only after staging succeeds:

```text
NEXT_PUBLIC_LEAD_INTAKE_URL=https://preecursor.com/acquisition/leads
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<public widget key>
NEXT_PUBLIC_BOOKING_URL=
```

Leave `NEXT_PUBLIC_BOOKING_URL` empty to use the correlated backend link. All
`NEXT_PUBLIC_*` values are public and require a rebuild to change. Optional GA4
now loads only after a visitor permits it; no email or lead ID is passed to GA4.
Funnel metrics come from the private event ledger and do not depend on GA4.

## Installation and safe rollout

1. Run the checks below on the reviewed commit. Existing PR CI tests the static
   site and Python service; PR builds never run the production rsync job.
2. Inspect the actual VPS: Python 3.12+, free disk, encrypted persistent volume,
   TLS server block, firewall, existing services and any independent lead intake.
   Provision a separate staging instance/database/origin first. This runbook does
   not claim those infrastructure checks have been performed.
3. As the authorized server operator, prepare a dedicated user and versioned code:

   ```bash
   sudo useradd --system --home /var/lib/preecursor-acquisition --shell /usr/sbin/nologin preecursor-acq
   sudo install -d -m 700 -o preecursor-acq -g preecursor-acq /var/lib/preecursor-acquisition
   sudo install -d -m 700 /etc/preecursor
   sudo install -m 600 deploy/acquisition.env.example /etc/preecursor/acquisition.env
   sudo install -d /opt/preecursor-acquisition/releases
   ACQ_RELEASE=$(git rev-parse HEAD)
   sudo install -d "/opt/preecursor-acquisition/releases/$ACQ_RELEASE"
   git archive HEAD services | sudo tar -x -C "/opt/preecursor-acquisition/releases/$ACQ_RELEASE"
   sudo python3 -m venv /opt/preecursor-acquisition/venv
   sudo /opt/preecursor-acquisition/venv/bin/pip install -r "/opt/preecursor-acquisition/releases/$ACQ_RELEASE/services/acquisition/requirements.txt"
   sudo ln -sfn "/opt/preecursor-acquisition/releases/$ACQ_RELEASE" /opt/preecursor-acquisition/current
   sudo install -m 755 deploy/preecursor-acq /usr/local/sbin/preecursor-acq
   ```

   Skip `useradd` if the service account already exists. Set the environment file
   through your secret-management process; keep both integration enable flags false.
4. Initialize with `sudo preecursor-acq init`. Install the three systemd unit files
   from `deploy/` into `/etc/systemd/system/`, then `sudo systemctl daemon-reload`.
   Start only `preecursor-acquisition.service` first. Verify local `/health`.
5. Copy `deploy/nginx.acquisition.conf` into `/etc/nginx/snippets/` and include it
   inside the existing **HTTPS** site server block. Preserve the existing static
   location and certificates. Validate with `sudo nginx -t`, then reload Nginx.
   Port 8091 must remain loopback-only. Health must work via HTTPS.
6. Exercise the complete synthetic test below in staging. Keep live outbound
   flags off until the sender identity, consent process, opt-out/reply handling,
   backups and operator ownership are checked. Do not import real prospect data
   into staging.
7. Deploy the same reviewed backend release to production, register production
   webhooks, then configure the public build variables. Merge/deploy the static
   site only when intake works. The backend is **not** deployed by the existing
   static rsync job. This prevents accidental service activation from a web merge.
8. Enable the API at boot. Enable the worker timer only after its configuration
   passes review. Set CRM/email flags individually; email still needs per-draft
   approval. No email was approved or sent during implementation.

## Operator commands

Run these privately on the host. The installed `preecursor-acq` wrapper asks
systemd to load the root-only environment file and run as the service user.

```bash
sudo preecursor-acq report
sudo preecursor-acq contacts
sudo preecursor-acq queue
sudo preecursor-acq bookings
sudo preecursor-acq import-prospects /private/prospects.csv --actor connor
sudo preecursor-acq permission CONTACT_ID --actor connor --evidence 'Requested follow-up during the recorded partner introduction on DATE'
sudo preecursor-acq qualify CONTACT_ID --actor connor --evidence-file /private/qualification.json
sudo preecursor-acq edit-draft DRAFT_ID --subject 'Your Preecursor inquiry' --body-file /private/reviewed-message.txt
sudo preecursor-acq approve DRAFT_ID --actor connor
sudo preecursor-acq tick
sudo preecursor-acq reply CONTACT_ID --actor connor
sudo preecursor-acq suppress person@example.com --reason 'Requested no further contact'
sudo preecursor-acq meeting INVITEE_URI --outcome completed --actor connor
sudo preecursor-acq reconcile-booking INVITEE_URI CONTACT_ID --actor connor --evidence 'Confirmed alternate booking email with buyer'
sudo preecursor-acq retry-crm
sudo preecursor-acq backup /var/lib/preecursor-acquisition/backup-2026-10-13.sqlite3
```

Files supplied to commands must be readable by the service user and contain no
real data in git. Qualification JSON fields: `workflow`, `volume`, `authority`,
`budget`, `timing`, `success_metric`; all six require textual evidence. CSV headers:
`name,email,company,source_url,fit_evidence,jurisdiction`. Import records evidence
and deduplicates; it does not contact the prospect or claim consent.

## First complete staging lead-to-booking test

Use an operator-controlled address and synthetic company. Real provider test
requires explicit approval of that test message and provider credentials.

1. Submit the staging form with UTM tags, challenge and consent. Confirm success,
   one private contact and inquiry, a pending CRM job, and a review-only draft.
2. Repeat the same request ID/payload and a new ID with the same email: one contact,
   no duplicate response draft. Reusing an ID with changed data must return 409.
3. Interrupt the backend/storage: the form must retain entered details and show
   an error. Restore and retry; never accept an uncommitted lead.
4. Enable staging CRM; run a worker pass. Verify one HubSpot contact, correct stage
   and custom fields; retry must not create duplicates. Test provider failure and
   recovery without losing the inquiry.
5. Review and approve only the synthetic response. Enable staging sender and tick.
   Verify recipient, content, reply route, postal footer and unsubscribe headers.
   Repeat tick and confirm only one email. Confirm received replies stop follow-up.
6. Open the correlated booking link. Use Calendly to select a real available test
   slot. Verify the signed event creates one booking. Replay it: no extra event.
7. Reschedule and cancel test slots; verify new and old invitee URIs don't corrupt
   each other. Opening the link alone must never increase `booked`.
8. After the test meeting ends, record completed/no-show. Verify distinct-contact
   `qualified_to_booked` and `booked_to_completed` numerators/denominators.
9. Test opt-out before an approved message, bounce/complaint, stale/tampered webhook,
   identity mismatch and a provider timeout. Confirm stopped messages remain stopped.
10. Verify a SQLite online backup restores to a separate database and retains
    inquiry/event/outbox/suppression state. Restore must never automatically send
    old approved jobs: start with sending disabled and reconcile provider IDs.

## Monitoring, privacy and rollback

- Check HTTPS `/acquisition/health`, systemd failure state and `report` daily.
  Investigate `failed`/`uncertain` queues, unmatched bookings, disk space and stale
  pending CRM jobs. Integration failures do not affect intake durability.
- Gunicorn access logging is disabled; the Nginx snippet disables access logs for
  token URLs. App errors log only fixed codes. Keep reverse-proxy error logs
  restricted as infrastructure errors may contain paths. Do not enable debug logs.
- Schedule encrypted off-host backups using the SQLite online backup command;
  copying only the live `.sqlite3` file can miss WAL data. Test restoration before
  launch. Define an operator and alert destination before enabling acquisition.
- Review inactive records at 180 days. Fulfill deletion/correction requests across
  the local ledger, HubSpot, email provider and Calendly, with applicable retention
  exceptions reviewed by the operator. This release does not automatically erase
  external-provider records. Keep minimal suppression data to prevent re-contact.
- Emergency stop: stop `preecursor-acquisition-worker.timer` and its worker service,
  set sending false. For intake rollback clear its public build variable and
  rebuild the site to restore the explicit email fallback. Keep the backend
  unsubscribe and webhook endpoints available for previously sent messages.
- Roll back service code by repointing `current` to the previous reviewed release
  and restarting the API. Keep the database and secret unchanged. Database schema
  version 1 is additive; future schema changes need an explicit migration/backup.

## Checks and provider contracts

```bash
python3 -m unittest discover -s services/acquisition/tests -v
npm test
npx tsc --noEmit
npm run build
```

Tests use temporary real SQLite databases, a local WSGI HTTP server, signed webhook
fixtures and mocked outbound adapters. They cover concurrent duplicates, atomic
rollback, signature/timestamp/replay checks, cancel-before-create ordering,
unsubscribe persistence, immutable approvals, outbox failure recovery and the
bounded idempotency retry window. They do not prove live account configuration.

Primary provider references checked during implementation:
- https://developer.calendly.com/api-docs/overview/webhooks/webhook-signatures
- https://developer.calendly.com/api-docs/calendly-api/webhooks/get-sample-webhook-data
- https://developers.hubspot.com/docs/api-reference/legacy/crm/objects/contacts/guide
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://resend.com/docs/dashboard/emails/idempotency-keys
- https://resend.com/docs/webhooks/verify-webhooks-requests
- https://docs.svix.com/receiving/verifying-payloads/how-manual
- https://github.com/resend/resend-openapi/blob/main/resend.yaml
- https://gunicorn.org/deploy/
