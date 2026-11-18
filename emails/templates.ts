// Branded, email-client-safe templates for preecursor.com.
// Table layout + inline styles (Gmail/Outlook strip <style> and ignore flex/grid).
// Tokens mirror lib/theme.ts. Web fonts load in Apple Mail; Gmail falls back to Georgia / Helvetica.

export const C = {
  paper: "#edf1f7",
  paper2: "#e1e8f1",
  ink: "#112138",
  inkDeep: "#0b1322",
  brand: "#1b4fc7",
  azure: "#5b8def",
  cyan: "#5fc8e8",
  mist: "#eaf1fb",
  line: "#d5deeb",
};
const SERIF = "'Newsreader', Georgia, 'Times New Roman', serif";
const SANS = "'Archivo', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const SITE = "https://preecursor.com";

/** Every user-supplied value goes through this. Never interpolate raw input. */
export function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
const oneLine = (s: unknown) => String(s ?? "").replace(/[\r\n]+/g, " ").trim();

function button(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="${C.brand}" style="border-radius:999px;background:${C.brand};">
<a href="${esc(href)}" style="display:inline-block;padding:14px 28px;font-family:${SANS};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:999px;">${esc(label)} &rarr;</a></td></tr></table>`;
}

function shell(opts: { preheader: string; eyebrow: string; title: string; body: string }): string {
  const { preheader, eyebrow, title, body } = opts;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>${esc(title)}</title>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;600&family=Newsreader:wght@400;500&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:${C.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.paper};">${esc(preheader)}&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;&#8199;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.paper}" style="background:${C.paper};"><tr><td align="center" style="padding:32px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
  <tr><td bgcolor="${C.brand}" style="background:${C.brand};background-image:linear-gradient(125deg,${C.brand} 0%,${C.azure} 62%,${C.cyan} 100%);border-radius:20px 20px 0 0;padding:40px 40px 44px;">
    <div style="font-family:${SERIF};font-size:26px;letter-spacing:-0.01em;color:#ffffff;">Preecursor</div>
    <div style="font-family:${SANS};font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:rgba(255,255,255,0.78);padding-top:36px;">${esc(eyebrow)}</div>
    <h1 style="margin:10px 0 0;font-family:${SERIF};font-weight:400;font-size:36px;line-height:1.12;letter-spacing:-0.02em;color:#ffffff;">${esc(title)}</h1>
  </td></tr>
  <tr><td bgcolor="#ffffff" style="background:#ffffff;padding:40px;font-family:${SANS};font-size:16px;line-height:1.65;color:${C.ink};">${body}</td></tr>
  <tr><td bgcolor="${C.inkDeep}" style="background:${C.inkDeep};border-radius:0 0 20px 20px;padding:28px 40px;font-family:${SANS};font-size:13px;line-height:1.6;color:rgba(234,241,251,0.66);">
    <span style="font-family:${SERIF};font-size:17px;color:${C.mist};">Preecursor</span><br>
    Applied AI studio. &nbsp;<a href="${SITE}" style="color:${C.cyan};text-decoration:none;">preecursor.com</a>
  </td></tr>
</table></td></tr></table></body></html>`;
}

function row(label: string, valueHtml: string): string {
  return `<tr><td style="padding:12px 0;border-bottom:1px solid ${C.line};font-family:${SANS};font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(17,33,56,0.55);width:120px;vertical-align:top;">${esc(label)}</td>
<td style="padding:12px 0;border-bottom:1px solid ${C.line};font-family:${SANS};font-size:16px;color:${C.ink};vertical-align:top;">${valueHtml}</td></tr>`;
}

export type Email = { subject: string; html: string; text: string };

/** Internal: a new contact-form inquiry, sent to Connor. */
export function inquiryNotification(f: { name: string; email: string; company?: string; message?: string }, meta: { ip?: string; country?: string } = {}): Email {
  const subject = `Website inquiry: ${oneLine(f.name)}${f.company ? ` (${oneLine(f.company)})` : ""}`;
  const rows = [
    row("Name", esc(f.name)),
    row("Email", `<a href="mailto:${esc(f.email)}" style="color:${C.brand};text-decoration:none;">${esc(f.email)}</a>`),
    f.company ? row("Company", esc(f.company)) : "",
  ].join("");
  const msg = f.message
    ? `<div style="margin-top:28px;padding:22px 24px;background:${C.mist};border-left:3px solid ${C.brand};border-radius:0 12px 12px 0;">
<div style="font-family:${SANS};font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(17,33,56,0.55);padding-bottom:8px;">Outcome they're chasing</div>
<div style="font-family:${SERIF};font-size:19px;line-height:1.55;white-space:pre-wrap;">${esc(f.message)}</div></div>`
    : "";
  const body = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>${msg}
<div style="padding-top:32px;">${button("Reply to " + oneLine(f.name).split(" ")[0], "mailto:" + f.email)}</div>
<div style="padding-top:28px;font-size:12px;color:rgba(17,33,56,0.5);">Sent from the preecursor.com contact form${meta.country ? " &middot; " + esc(meta.country) : ""}${meta.ip ? " &middot; " + esc(meta.ip) : ""}. Replying answers them directly.</div>`;
  const text = [`New inquiry from the preecursor.com contact form`, ``, `Name: ${f.name}`, `Email: ${f.email}`, f.company ? `Company: ${f.company}` : "", f.message ? `\nOutcome they're chasing:\n${f.message}` : "", ``, `Country: ${meta.country ?? "?"}  IP: ${meta.ip ?? "?"}`, `Reply to this email to answer them directly.`].filter((l) => l !== "").join("\n");
  return { subject, html: shell({ preheader: `${oneLine(f.name)}${f.company ? " at " + oneLine(f.company) : ""} sent a new inquiry.`, eyebrow: "New inquiry", title: oneLine(f.name) + (f.company ? `, ${oneLine(f.company)}` : ""), body }), text };
}

/** Customer: confirmation that we received their message. Makes no promise about timing. */
export function inquiryConfirmation(f: { name: string; message?: string }): Email {
  const first = oneLine(f.name).split(" ")[0] || "there";
  const echo = f.message
    ? `<div style="margin:28px 0;padding:22px 24px;background:${C.mist};border-radius:14px;">
<div style="font-family:${SANS};font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(17,33,56,0.55);padding-bottom:8px;">What you told us</div>
<div style="font-family:${SERIF};font-size:18px;line-height:1.55;white-space:pre-wrap;">${esc(f.message)}</div></div>`
    : "";
  const body = `<p style="margin:0 0 16px;">Hi ${esc(first)},</p>
<p style="margin:0 0 16px;">Thanks for reaching out. Your message has landed with the team and we read every one personally.</p>${echo}
<p style="margin:0 0 28px;">We will reply to this email address. If you want to add anything in the meantime, just reply to this message.</p>
${button("Visit preecursor.com", SITE)}
<p style="margin:32px 0 0;color:rgba(17,33,56,0.7);">&mdash; The Preecursor team</p>`;
  const text = `Hi ${first},\n\nThanks for reaching out. Your message has landed with the team and we read every one personally.\n\nWe will reply to this email address. To add anything, just reply to this message.\n\n— The Preecursor team\n${SITE}`;
  return { subject: "We got your message — Preecursor", html: shell({ preheader: "Thanks for reaching out. Here is what happens next.", eyebrow: "Message received", title: `Thanks, ${first}.`, body }), text };
}

/** Customer: newsletter welcome. */
export function newsletterWelcome(): Email {
  const body = `<p style="margin:0 0 16px;">You are on the list.</p>
<p style="margin:0 0 28px;">We will send you our latest thinking on applied AI: what works in production, what does not, and why. No filler, and you can leave any time by replying "unsubscribe".</p>
${button("Read our latest insights", SITE + "/insights/")}
<p style="margin:32px 0 0;color:rgba(17,33,56,0.7);">&mdash; The Preecursor team</p>`;
  const text = `You are on the list.\n\nWe will send you our latest thinking on applied AI. Reply "unsubscribe" to leave any time.\n\n— The Preecursor team\n${SITE}/insights/`;
  return { subject: "Welcome to Preecursor", html: shell({ preheader: "You are on the list. Here is what to expect.", eyebrow: "Welcome", title: "Good to have you here.", body }), text };
}

/** Internal: a newsletter signup, sent to Connor. */
export function newsletterNotification(email: string): Email {
  const body = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${row("Email", `<a href="mailto:${esc(email)}" style="color:${C.brand};text-decoration:none;">${esc(email)}</a>`)}</table>`;
  return { subject: `Newsletter signup: ${oneLine(email)}`, html: shell({ preheader: `${oneLine(email)} subscribed.`, eyebrow: "New subscriber", title: oneLine(email), body }), text: `New newsletter signup: ${email}` };
}
