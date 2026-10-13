-- Run once with an administrative database connection, then use a dedicated
-- least-privilege credential for n8n. These tables hold private inquiry data.
BEGIN;
CREATE SCHEMA IF NOT EXISTS preecursor;
CREATE TABLE IF NOT EXISTS preecursor.leads (
  submission_id uuid PRIMARY KEY,
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  email text GENERATED ALWAYS AS (lower(payload->>'email')) STORED,
  priority text NOT NULL CHECK (priority IN ('high', 'standard')),
  stage text NOT NULL DEFAULT 'new' CHECK (stage IN ('new', 'qualified', 'booked', 'attended', 'proposal', 'won', 'lost', 'closed')),
  monthly_fee_cents bigint NOT NULL DEFAULT 0 CHECK (monthly_fee_cents >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS leads_email_idx ON preecursor.leads(email);
CREATE INDEX IF NOT EXISTS leads_stage_idx ON preecursor.leads(stage, created_at);
CREATE TABLE IF NOT EXISTS preecursor.suppression (
  email text PRIMARY KEY CHECK (email = lower(trim(email))),
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS preecursor.followup_drafts (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  submission_id uuid NOT NULL UNIQUE REFERENCES preecursor.leads(submission_id) ON DELETE CASCADE,
  recipient text NOT NULL,
  subject text NOT NULL,
  body text NOT NULL,
  status text NOT NULL DEFAULT 'needs_review' CHECK (status IN ('needs_review', 'approved', 'sent', 'dismissed')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS preecursor.pipeline_snapshots (
  snapshot_date date PRIMARY KEY,
  metrics jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
-- Suppression removes queued drafts from this view immediately. Actual sending
-- must independently check suppression and current lead stage again.
CREATE OR REPLACE VIEW preecursor.review_queue AS
SELECT d.id, d.submission_id, d.recipient, d.subject, d.body, d.status,
       l.priority, l.payload, l.created_at
FROM preecursor.followup_drafts d JOIN preecursor.leads l USING (submission_id)
WHERE d.status = 'needs_review' AND l.stage IN ('new', 'qualified')
  AND NOT EXISTS (SELECT 1 FROM preecursor.suppression s WHERE s.email = d.recipient);
COMMIT;
