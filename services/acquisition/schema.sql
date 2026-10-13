PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL, company TEXT NOT NULL,
  source TEXT NOT NULL CHECK(source IN ('website','prospect')),
  stage TEXT NOT NULL DEFAULT 'identified', score INTEGER NOT NULL DEFAULT 0,
  permission TEXT NOT NULL DEFAULT 'none' CHECK(permission IN ('none','inquiry','opt_in')),
  permission_evidence TEXT NOT NULL DEFAULT '',
  replied INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY, contact_id TEXT NOT NULL REFERENCES contacts(id),
  payload TEXT NOT NULL, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY, contact_id TEXT NOT NULL REFERENCES contacts(id),
  kind TEXT NOT NULL, event_key TEXT NOT NULL UNIQUE,
  detail TEXT NOT NULL DEFAULT '{}', created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS events_contact ON events(contact_id,kind);
CREATE TABLE IF NOT EXISTS suppression (
  email TEXT PRIMARY KEY, reason TEXT NOT NULL, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS bookings (
  uri TEXT PRIMARY KEY, contact_id TEXT REFERENCES contacts(id),
  status TEXT NOT NULL CHECK(status IN ('active','canceled','completed','no_show')),
  starts_at INTEGER NOT NULL, ends_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS webhook_receipts (
  id TEXT PRIMARY KEY, provider TEXT NOT NULL, received_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS crm_jobs (
  contact_id TEXT PRIMARY KEY REFERENCES contacts(id), generation INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending', attempts INTEGER NOT NULL DEFAULT 0,
  due_at INTEGER NOT NULL, error TEXT, remote_id TEXT
);
CREATE TABLE IF NOT EXISTS drafts (
  id TEXT PRIMARY KEY, contact_id TEXT NOT NULL REFERENCES contacts(id),
  kind TEXT NOT NULL CHECK(kind IN ('response','followup')),
  subject TEXT NOT NULL, body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'needs_review' CHECK(status IN
    ('needs_review','approved','sent','canceled','failed','uncertain')),
  due_at INTEGER NOT NULL, approved_by TEXT, approved_at INTEGER,
  envelope TEXT, first_attempt INTEGER, attempts INTEGER NOT NULL DEFAULT 0,
  sent_at INTEGER, provider_id TEXT, error TEXT,
  UNIQUE(contact_id,kind)
);
CREATE TABLE IF NOT EXISTS rate_limits (
  bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, expires_at INTEGER NOT NULL
);
PRAGMA user_version = 1;
