# Acquisition implementation verification — 2026-10-13

Extends draft PR #56 from base main `19735a74c908a22606120a108d0f860e6a65ddea`.
No production deployment, calendar booking, external email, or real prospect
enrollment was performed.

| Check | Observed result |
| --- | --- |
| Frontend/legacy integration regression suite | 85 files, 525 tests passed |
| Acquisition Python suite | 36 tests passed, including real SQLite and Gunicorn 26.2.0 smoke test |
| Simulated complete workflow | Intake → qualify → approve → mocked CRM/email → signed booking → confirmed completion passed |
| Static production build | Passed; 114 pages, including contact and privacy |
| TypeScript | `npx tsc --noEmit` passed |
| ESLint on changed frontend files | Passed |
| Workflow YAML parsing and whitespace check | Passed |
| Actual VPS, Nginx configuration, TLS and systemd units | Not applied or verified on the production host |
| Live Turnstile, HubSpot, Calendly and Resend accounts | Not connected or exercised |
| Browser visual inspection | Not performed; component interaction tests and static export passed |

The test harness uses synthetic identities, temporary SQLite databases, raw-body
signed webhook fixtures and controlled outbound HTTP responses. The production
WSGI process was started locally with both external integration flags disabled.
The Svix signature verifier also passes the provider's published known-vector test.

Failure paths covered include concurrent retries, changed-payload conflicts,
transaction rollback, rate limits, malformed input, missing consent, wrong origins,
challenge failure, forged/stale/future webhooks, duplicate delivery, identity
mismatch, cancel-before-create, rescheduling, future meeting completion rejection,
send approval/expiry gates, unsubscribe persistence, inbound replies, bounces,
CRM recovery, in-flight CRM generation changes, worker locking, and the email
idempotency time limit.

Activation blockers and the concrete first live test are in
[the service runbook](../services/acquisition/README.md). The initial segment,
qualification criteria and funnel targets are in
[the acquisition playbook](acquisition-playbook.md).
