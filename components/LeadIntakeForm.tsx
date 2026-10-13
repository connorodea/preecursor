"use client";

import { useRef, useState, type FormEvent, type CSSProperties } from "react";
import { CONTACT_EMAIL } from "@/lib/ia";
import { publicHttpsUrl, readAttribution } from "@/lib/lead-intake";
import { color, glass, inkA, shadow } from "@/lib/theme";
import { Eyebrow } from "@/components/ui";

const labelStyle: CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 700, color: inkA(0.72), marginBottom: 9,
};
const fieldStyle: CSSProperties = {
  width: "100%", borderRadius: 10, border: "1px solid rgba(17,33,56,0.16)",
  background: "rgba(255,255,255,0.7)", padding: "14px 16px", fontSize: 16,
  lineHeight: 1.4, color: color.ink, fontFamily: "var(--font-archivo)",
};
const buttonStyle: CSSProperties = {
  border: "none", borderRadius: 999, padding: "15px 28px", fontSize: 14,
  fontWeight: 700, color: color.mist, background: color.brand, cursor: "pointer",
};

export default function LeadIntakeForm({
  endpoint = process.env.NEXT_PUBLIC_LEAD_INTAKE_URL,
  bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL,
}: { endpoint?: string; bookingUrl?: string }) {
  const intakeUrl = publicHttpsUrl(endpoint);
  const booking = publicHttpsUrl(bookingUrl);
  const [state, setState] = useState<"idle" | "sending" | "error" | "saved">("idle");
  const [message, setMessage] = useState("");
  const lock = useRef(false);
  const pending = useRef<{ fingerprint: string; id: string } | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    if (!intakeUrl) return; // The visible email-draft fallback remains honest.
    event.preventDefault();
    if (lock.current) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const data = { ...values, attribution: readAttribution() };
    const fingerprint = JSON.stringify(data);
    if (pending.current?.fingerprint !== fingerprint) {
      pending.current = { fingerprint, id: crypto.randomUUID() };
    }
    const submissionId = pending.current.id;
    lock.current = true;
    setState("sending");
    setMessage("");
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(intakeUrl, {
        method: "POST", headers: { "Content-Type": "application/json" },
        credentials: "omit", signal: controller.signal,
        body: JSON.stringify({ ...data, submissionId, schemaVersion: 1 }),
      });
      const result = await response.json();
      if (!response.ok || result.accepted !== true || result.submissionId !== submissionId) {
        throw new Error("The inquiry was not confirmed.");
      }
      setState("saved");
    } catch {
      setState("error");
      setMessage("We couldn’t confirm receipt. Your details are still here—please try again or email us directly.");
    } finally {
      window.clearTimeout(timer);
      lock.current = false;
    }
  }

  return (
    <div style={{ ...glass(0.62), borderRadius: 18, padding: "clamp(28px,3vw,42px)", boxShadow: shadow.glass }}>
      <Eyebrow label="Plan your AI workflow" tone="brand" style={{ marginBottom: 26 }} />
      {state === "saved" ? (
        <div role="status" aria-live="polite">
          <h2 style={{ fontSize: 28, color: color.ink }}>Your inquiry is saved.</h2>
          <p style={{ marginTop: 16, lineHeight: 1.6 }}>We’ll review your workflow and follow up using the email you provided.</p>
          {booking && <a href={booking} style={{ ...buttonStyle, display: "inline-block", textDecoration: "none", marginTop: 24 }}>Choose a discovery time →</a>}
        </div>
      ) : (
        <form action={intakeUrl ? undefined : `mailto:${CONTACT_EMAIL}`} method="post" encType={intakeUrl ? undefined : "text/plain"} onSubmit={submit}>
          <fieldset disabled={state === "sending"} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 22, marginBottom: 22 }}>
              <div><label htmlFor="name" style={labelStyle}>Name</label><input id="name" name="name" autoComplete="name" required maxLength={120} style={fieldStyle} /></div>
              <div><label htmlFor="email" style={labelStyle}>Work email</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} style={fieldStyle} /></div>
            </div>
            <div style={{ marginBottom: 22 }}><label htmlFor="company" style={labelStyle}>Company</label><input id="company" name="company" autoComplete="organization" required maxLength={160} style={fieldStyle} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 22, marginBottom: 22 }}>
              <div><label htmlFor="budget" style={labelStyle}>Initial project budget</label><select id="budget" name="budget" defaultValue="exploring" style={fieldStyle}>
                <option value="exploring">Still exploring</option><option value="under-5k">Under $5,000</option><option value="5k-15k">$5,000–$15,000</option><option value="15k-50k">$15,000–$50,000</option><option value="50k-plus">$50,000+</option>
              </select></div>
              <div><label htmlFor="timeline" style={labelStyle}>When would you like to start?</label><select id="timeline" name="timeline" defaultValue="exploring" style={fieldStyle}>
                <option value="exploring">Still exploring</option><option value="30-days">Within 30 days</option><option value="90-days">Within 90 days</option><option value="later">Later</option>
              </select></div>
            </div>
            <div style={{ marginBottom: 24 }}><label htmlFor="outcome" style={labelStyle}>What outcome are you chasing?</label><textarea id="outcome" name="outcome" rows={5} required minLength={20} maxLength={3000} placeholder="Describe the workflow, the tools involved, and what you’d like to improve." style={{ ...fieldStyle, resize: "vertical", minHeight: 132 }} /></div>
            <div aria-hidden="true" style={{ position: "absolute", left: -10000, width: 1, height: 1, overflow: "hidden" }}><label htmlFor="fax">Leave this empty</label><input id="fax" name="fax" tabIndex={-1} autoComplete="off" /></div>
            <p style={{ fontSize: 13, lineHeight: 1.6, color: inkA(0.62), marginBottom: 22 }}>We use these details to respond to your inquiry. Please don’t include confidential client information or sensitive records.</p>
            <button type="submit" style={buttonStyle}>{state === "sending" ? "Saving…" : intakeUrl ? "Request a discovery call →" : "Open email draft →"}</button>
          </fieldset>
          {!intakeUrl && <p style={{ marginTop: 14, fontSize: 13, lineHeight: 1.6 }}>This opens your email app with your details. Send the draft to complete your inquiry.</p>}
          {message && <p role="alert" style={{ marginTop: 18, lineHeight: 1.6 }}>{message}</p>}
          <noscript><p>Please email us directly to arrange a discovery call.</p></noscript>
        </form>
      )}
      <p style={{ marginTop: 22, fontSize: 14, lineHeight: 1.6 }}>Prefer email? <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: color.brand }}>{CONTACT_EMAIL}</a></p>
    </div>
  );
}
