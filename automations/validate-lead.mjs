/** Self-contained so the same function can run in an n8n Code node and tests. */
export function validateLead(input) {
  const reject = (status = 400) => ({ ok: false, status, error: "Invalid inquiry." });
  if (!input || typeof input !== "object" || Array.isArray(input)) return reject();
  const origin = input.headers?.origin;
  if (!["https://preecursor.com", "https://www.preecursor.com"].includes(origin)) return reject(403);
  const body = input.body;
  if (!body || typeof body !== "object" || Array.isArray(body) || JSON.stringify(body).length > 12000) return reject();
  const text = (key, min, max) => {
    const value = body[key];
    if (typeof value !== "string" || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) return null;
    return value.trim().length >= min ? value.trim() : null;
  };
  if (body.schemaVersion !== 1 || typeof body.submissionId !== "string" ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.submissionId)) return reject();
  if (body.fax !== undefined && body.fax !== "") return reject();
  const name = text("name", 1, 120);
  const email = text("email", 3, 254)?.toLowerCase();
  const company = text("company", 1, 160);
  const outcome = text("outcome", 20, 3000);
  if (!name || !email || !company || !outcome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reject();
  if (/[\r\n]/.test(name + company)) return reject();
  const budgets = ["exploring", "under-5k", "5k-15k", "15k-50k", "50k-plus"];
  const timelines = ["exploring", "30-days", "90-days", "later"];
  if (!budgets.includes(body.budget) || !timelines.includes(body.timeline)) return reject();
  const attribution = {};
  if (body.attribution !== undefined) {
    if (!body.attribution || typeof body.attribution !== "object" || Array.isArray(body.attribution)) return reject();
    for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
      const value = body.attribution[key];
      if (value !== undefined) {
        if (typeof value !== "string" || value.length > 160 || /[\r\n\u0000]/.test(value)) return reject();
        attribution[key] = value;
      }
    }
  }
  const priority = ["15k-50k", "50k-plus"].includes(body.budget) && body.timeline === "30-days" ? "high" : "standard";
  return {
    ok: true, status: 200, submissionId: body.submissionId.toLowerCase(), priority,
    payload: { name, email, company, outcome, budget: body.budget, timeline: body.timeline, attribution, source: "website", schemaVersion: 1 },
  };
}
