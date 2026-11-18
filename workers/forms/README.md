# preecursor-forms (Cloudflare Worker)

Backend for the static site's forms. `POST /contact` and `POST /subscribe`
take JSON, validate it, drop honeypot hits (`website` field), rate-limit
5/min per IP per route, and email the submission to `TO_EMAIL` via Resend
with `Reply-To` set to the submitter.

Live: `https://preecursor-forms.connorodea.workers.dev` (connorodea Cloudflare account).

## Deploy

```bash
export CLOUDFLARE_API_TOKEN=$CLOUDFLARE_CO_API_TOKEN CLOUDFLARE_ACCOUNT_ID=$CLOUDFLARE_CO_ACCOUNT_ID
cd workers/forms && npx wrangler deploy
```

## Secret

`RESEND_API_KEY` — a Resend **sending_access** key scoped to `privilegedinfra.com`
(the verified sender domain). Set with `npx wrangler secret put RESEND_API_KEY`.
Never commit it.

## Config (`wrangler.toml` `[vars]`)

- `TO_EMAIL` — inbox that receives submissions (`connor@preecursor.com`, forwarded to Gmail).
- `FROM_EMAIL` — must be on a Resend-verified domain.
- `ALLOWED_ORIGINS` — CORS allowlist; other origins get 403.

Tests: `npx vitest run workers/` from the repo root.
