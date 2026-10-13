# Preecursor acquisition automations

Prepared for the existing static Next.js site. These files are a deployable
integration package, **not evidence that an n8n instance is configured or live**.
All three exported workflows start inactive. No workflow sends email, enrolls a
prospect in a sequence, buys contact data, or creates a calendar invitation.

## Included behavior

| Workflow | Trigger | Result |
| --- | --- | --- |
| `n8n/01-lead-intake.json` | Website POST | Validate an inquiry, assign review priority, store it, acknowledge receipt |
| `n8n/02-followup-draft-queue.json` | Every 15 minutes after activation | Prepare one follow-up draft per inquiry for human review |
| `n8n/03-daily-pipeline.json` | 08:30 America/Denver after activation | Store a daily pipeline snapshot in PostgreSQL |

The contact form adds budget/timeline fields, campaign attribution, retry-safe
submission IDs, and an optional booking link. Homepage CTAs lead to the form.
Without an intake URL it explicitly opens an email draft; it never pretends to
have saved a lead. Without a booking URL it offers email follow-up.

## Activation inputs

1. An n8n instance that supports the exported node versions, with an HTTPS
   production webhook endpoint.
2. A private PostgreSQL database and a dedicated n8n database credential.
3. Your real scheduling URL and connected calendar in Cal.com, Calendly, or
   your existing provider. Set meeting duration, availability, minimum notice,
   buffers, timezone, and reminders there before sharing it.
4. The two GitHub Actions repository variables below and a site deployment.

Use the providers' credential stores. Do not paste passwords into the repository,
workflow JSON, public URLs, GitHub variables, or chat.

## Installation

1. Apply `schema.sql` to the selected private database using its administration
   connection. This creates a separate `preecursor` schema and does not change
   existing application tables. Grant the n8n role USAGE on the schema, the
   SELECT/INSERT/UPDATE privileges required by the three workflows, SELECT on
   `review_queue`, and USAGE on the identity sequence. Keep suppression/deletion
   administration separate from the public intake workflow.
2. Import the three JSON files into n8n. Select that PostgreSQL credential in
   each Postgres node. In `Booking configuration`, replace the empty booking URL
   with your real scheduling URL, or leave it empty for a request for times.
3. Test manually against a **staging database**. Use synthetic people and an
   `Origin: https://preecursor.com` header. Verify persistence, repeated IDs,
   validation failures, and database failure responses. Publish/activate the
   intake workflow only after these checks; use its production `/webhook/` URL,
   not its temporary `/webhook-test/` URL.
4. Protect the public webhook with request-size and rate limits at its ingress.
   Suggested initial settings: a 16 KB request-body limit and five submissions
   per minute per IP with a small burst allowance; adjust for observed traffic.
   The origin allowlist and honeypot reduce browser misuse but are not
   authentication or complete bot protection. Keep n8n's editor and the database
   private, and configure execution failures to be visible to an operator.
5. Set these **public build variables** in the Preecursor GitHub repository:

   | Variable | Value |
   | --- | --- |
   | `NEXT_PUBLIC_LEAD_INTAKE_URL` | Production HTTPS intake webhook, without credentials |
   | `NEXT_PUBLIC_BOOKING_URL` | Actual HTTPS scheduling page |

   The existing CI/deploy workflow passes both into the static build. They are
   frozen at build time, so changing them requires a rebuild/deploy. Keep them
   empty until the service is ready. No DNS or hosting migration is required.
6. Test one synthetic inquiry on the deployed contact page. Confirm its database
   row before treating the integration as live. Confirm errors retain the form,
   booking goes to the correct calendar, and campaign tags survive navigation
   from a tagged homepage link to `/contact`.
7. Activate the draft and daily snapshot workflows. The draft queue contains
   proposed messages only. Review recipients, suppression status, and text before
   sending through a separately authorized email workflow.

## Working the pipeline

Read pending work using a private SQL console or your CRM's database connector:

```sql
SELECT * FROM preecursor.review_queue ORDER BY priority, created_at;
SELECT * FROM preecursor.pipeline_snapshots ORDER BY snapshot_date DESC LIMIT 7;
```

Update a lead's stage only from verified activity: `new`, `qualified`, `booked`,
`attended`, `proposal`, `won`, `lost`, or `closed`. Set `monthly_fee_cents` from the
signed contract. The snapshot counts those fees only for `won` deals; this is a
contracted monthly fee total, not recognized revenue or proof of collection.
Stages are mutually exclusive current states, not historical conversion events.

`high` priority means the visitor self-reported a $15k+ initial budget and a
30-day start. It does not verify purchasing authority, fit, budget, or ROI.
Lower budgets remain in the queue; they are not automatically rejected.

Add an address to `preecursor.suppression` immediately when it opts out or is
otherwise ineligible for contact. Store a normalized lowercase address and
reason. Suppressed leads disappear from `review_queue`; historical drafts remain
for review. Any future sender must recheck suppression and lead stage at send
time, including drafts that were previously approved.

On the discovery call, establish the current workflow, volume, avoidable costs,
systems, decision-maker, budget, and timing. Use the earlier $15k implementation
plus $5k/month model as a pricing hypothesis. Quote a scoped result after
discovery; the form does not promise a price or an outcome.

## Boundaries and next connections

- **Prospecting:** Apollo has been identified as an optional data source. No
  account, list, search filters, enrichment budget, or API credential is assumed.
  Choose the first industry and offer, then prepare a small verified prospect
  list and reviewed outreach before activating any sequence.
- **Email:** No mailbox is connected to these workflows. They cannot send
  follow-ups, cold outreach, or reminders. Inquiry follow-up drafts are not
  permission to subscribe someone to a marketing sequence.
- **Booking:** This release provides a link, not booking confirmation ingestion.
  Record booked/attended stages manually until the scheduling provider is known
  and its signed, replay-safe event integration is implemented. Configure native
  booking confirmations and reminders in that provider.
- **CRM:** PostgreSQL is the durable lead store. There is no public admin
  dashboard and no assumed HubSpot/Salesforce account. A private CRM connection
  or read-only view can be added after the operating stack is chosen.
- **Deduplication:** The same submission ID with the same normalized payload
  returns the original acknowledgment. A changed payload with that ID is a
  conflict. Repeated inquiries from the same email remain separate submissions.
- **Data:** Only selected fields and three campaign tags are persisted. n8n
  execution-content retention is disabled in the exports; database records need
  an owner-defined retention policy and backups. Do not collect confidential
  client files in this sales form.

## Development and verification

The generator embeds the tested validation function into the intake Code node:

```bash
node automations/generate-workflows.mjs
npm test
npx tsc --noEmit
npm run build
```

Database tests execute the actual workflow SQL in PGlite (PostgreSQL compiled to
WASM), including retries, conflicting payloads, suppression, duplicate drafts,
booked-lead exclusion, and snapshot updates. These checks do not replace importing
the workflows into the actual n8n host and testing its credentials, CORS,
webhook responses, and booking provider.

To roll back intake activation, clear `NEXT_PUBLIC_LEAD_INTAKE_URL` and rebuild
the website; then deactivate the intake workflow. Keep existing records and the
review queue. Clear `NEXT_PUBLIC_BOOKING_URL` and rebuild to remove the booking
handoff if its destination changes or becomes unavailable.
