import { mkdirSync, writeFileSync } from "node:fs";
import * as t from "./templates.ts";
mkdirSync("preview", { recursive: true });
const evil = { name: 'Ada <script>alert(1)</script> Lovelace', email: "ada@acme.com", company: 'Acme "Co" & Sons', message: "Cut churn 10%.\n<img src=x onerror=alert(1)> Second line." };
const out = {
  "1-inquiry-notification": t.inquiryNotification(evil, { country: "US", ip: "203.0.113.9" }),
  "2-inquiry-confirmation": t.inquiryConfirmation(evil),
  "3-newsletter-welcome": t.newsletterWelcome(),
  "4-newsletter-notification": t.newsletterNotification("ada@acme.com"),
};
for (const [k, v] of Object.entries(out)) {
  writeFileSync(`preview/${k}.html`, v.html);
  if (/<(script|img|iframe)\b/i.test(v.html)) { console.error("INJECTION LEAK in", k); process.exit(1); }
}
console.log("rendered", Object.keys(out).length, "- no injection leaks");
