/**
 * preecursor-forms — the form backend for the static preecursor.com export.
 *
 * Routes (JSON in, JSON out):
 *   POST /contact    { name, email, company?, outcome, website? }
 *   POST /subscribe  { email, website? }
 *
 * `website` is a honeypot: humans never see the field, bots fill it. A filled
 * honeypot gets a normal-looking 200 so the bot learns nothing, but no email
 * is sent. Every accepted submission is emailed to TO_EMAIL through Resend,
 * with Reply-To set to the submitter so a reply goes straight back to them.
 *
 * Secrets (wrangler secret put): RESEND_API_KEY. Never committed.
 */

export interface RateLimiter {
  limit(opts: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  RESEND_API_KEY: string;
  TO_EMAIL: string;
  FROM_EMAIL: string;
  ALLOWED_ORIGINS: string;
  LIMITER?: RateLimiter;
}

type Fields = Record<string, string>;

const EMAIL_RE = /^[^\s@<>()[\],;:"]+@[^\s@<>()[\],;:"]+\.[a-z]{2,}$/i;

const LIMITS: Record<string, number> = {
  name: 120,
  email: 254,
  company: 160,
  outcome: 5000,
};

export function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS.split(",").map((s) => s.trim());
  const h: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (origin && allowed.includes(origin)) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

function json(body: unknown, status: number, cors: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...cors },
  });
}

/** Trim every string field, drop non-strings. */
function clean(raw: unknown): Fields {
  const out: Fields = {};
  if (raw && typeof raw === "object") {
    for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
      if (typeof v === "string") out[k] = v.trim();
    }
  }
  return out;
}

/** Returns an error message, or null when the fields are acceptable. */
export function validate(kind: "contact" | "subscribe", f: Fields): string | null {
  if (!f.email || !EMAIL_RE.test(f.email)) return "Please enter a valid email address.";
  for (const [k, max] of Object.entries(LIMITS)) {
    if (f[k] && f[k].length > max) return `The ${k} field is too long.`;
  }
  if (kind === "contact") {
    if (!f.name) return "Please tell us your name.";
    if (!f.outcome) return "Please tell us a little about the outcome you're after.";
  }
  return null;
}

/** Strip CR/LF so user input can never inject extra email headers. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").slice(0, 200);

export function buildEmail(kind: "contact" | "subscribe", f: Fields, meta: { ip: string; country: string }) {
  if (kind === "subscribe") {
    return {
      subject: `Newsletter signup: ${oneLine(f.email)}`,
      text: [
        "New newsletter signup on preecursor.com",
        "",
        `Email:   ${f.email}`,
        "",
        `Country: ${meta.country}  IP: ${meta.ip}`,
      ].join("\n"),
    };
  }
  return {
    subject: `Website inquiry: ${oneLine(f.name)}${f.company ? ` (${oneLine(f.company)})` : ""}`,
    text: [
      "New inquiry from the preecursor.com contact form",
      "",
      `Name:    ${f.name}`,
      `Email:   ${f.email}`,
      `Company: ${f.company || "-"}`,
      "",
      "Outcome they're chasing:",
      f.outcome,
      "",
      `Country: ${meta.country}  IP: ${meta.ip}`,
      "Reply to this email to answer them directly.",
    ].join("\n"),
  };
}

export async function handle(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const origin = request.headers.get("Origin");
  const cors = corsHeaders(origin, env);

  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (url.pathname === "/" && request.method === "GET") return json({ ok: true, service: "preecursor-forms" }, 200, cors);

  const kind = url.pathname === "/contact" ? "contact" : url.pathname === "/subscribe" ? "subscribe" : null;
  if (!kind) return json({ ok: false, error: "Not found." }, 404, cors);
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed." }, 405, cors);
  if (!cors["Access-Control-Allow-Origin"]) return json({ ok: false, error: "Origin not allowed." }, 403, cors);

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (env.LIMITER) {
    const { success } = await env.LIMITER.limit({ key: `${kind}:${ip}` });
    if (!success) return json({ ok: false, error: "Too many submissions. Please try again in a minute." }, 429, cors);
  }

  const len = Number(request.headers.get("Content-Length") || "0");
  if (len > 20_000) return json({ ok: false, error: "Submission too large." }, 413, cors);

  let fields: Fields;
  try {
    fields = clean(await request.json());
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400, cors);
  }

  // Honeypot: pretend success, send nothing.
  if (fields.website) return json({ ok: true }, 200, cors);

  const err = validate(kind, fields);
  if (err) return json({ ok: false, error: err }, 422, cors);

  const country = request.headers.get("CF-IPCountry") || "unknown";
  const { subject, text } = buildEmail(kind, fields, { ip, country });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to: [env.TO_EMAIL],
      reply_to: fields.email,
      subject,
      text,
    }),
  });

  if (!res.ok) {
    console.error("resend error", res.status, await res.text().catch(() => ""));
    return json({ ok: false, error: "We couldn't send that just now. Please email us directly." }, 502, cors);
  }
  return json({ ok: true }, 200, cors);
}

const worker = { fetch: handle };
export default worker;
