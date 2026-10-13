# Preecursor acquisition

The supported implementation is now [services/acquisition](../services/acquisition/README.md).
It runs separately from the statically exported Next.js site and includes lead intake,
SQLite persistence, duplicate detection, qualification, an optional HubSpot outbox,
signed Calendly events, and approved inquiry follow-ups through Resend.

The earlier n8n exports and PostgreSQL schema are retained as inactive reference
artifacts in this directory. They are **not the deployment path for this release**.
Do not activate both pipelines: they have separate stores and would produce
inconsistent state. No existing production n8n deployment or PostgreSQL data was
confirmed, and no migration of live lead data has been performed. If one exists,
inventory and migrate it before changing the website endpoint.

- [Setup, operation, deployment and first live test](../services/acquisition/README.md)
- [Initial acquisition playbook](../docs/acquisition-playbook.md)
- [Original n8n package notes](LEGACY_N8N.md)
