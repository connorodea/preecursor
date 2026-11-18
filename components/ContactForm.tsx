"use client";

import { useState } from "react";
import Honeypot from "@/components/Honeypot";
import { Eyebrow } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/ia";
import { submitForm, readForm, type FormStatus } from "@/lib/forms";
import { color, glass, inkA, shadow } from "@/lib/theme";

/** Shared field styling for the contact form. */
export const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12.5,
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: inkA(0.62),
  marginBottom: 10,
};

const fieldStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 10,
  border: "1px solid rgba(17,33,56,0.16)",
  background: "rgba(255,255,255,0.7)",
  padding: "14px 16px",
  fontSize: 16,
  lineHeight: 1.4,
  color: color.ink,
  fontFamily: "var(--font-archivo)",
};

/** The /contact form. Posts to the forms Worker and shows sent/error states. */
export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const res = await submitForm("contact", readForm(e.currentTarget));
    if (res.ok) {
      setStatus("sent");
    } else {
      setError(res.error);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          ...glass(0.62),
          borderRadius: 18,
          padding: "clamp(28px,3vw,42px)",
          boxShadow: shadow.glass,
        }}
      >
        <Eyebrow label="Message received" tone="brand" style={{ marginBottom: 22 }} />
        <h2
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 400,
            fontSize: "clamp(26px,2.4vw,36px)",
            lineHeight: 1.1,
            letterSpacing: "-0.015em",
            color: color.ink,
          }}
        >
          Thank you. It&rsquo;s with us.
        </h2>
        <p style={{ marginTop: 16, fontSize: 16.5, lineHeight: 1.6, color: inkA(0.66), maxWidth: "44ch" }}>
          We read every message and will reply to the address you gave.
          Anything to add? Write to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: color.brand, textDecoration: "none" }}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        position: "relative",
        ...glass(0.62),
        borderRadius: 18,
        padding: "clamp(28px,3vw,42px)",
        boxShadow: shadow.glass,
      }}
    >
      <Honeypot />
      <Eyebrow
        label="Start a conversation"
        tone="brand"
        style={{ marginBottom: 26 }}
      />

      <div
        className="grid grid-cols-1 sm:grid-cols-2"
        style={{ gap: 22, marginBottom: 22 }}
      >
        <div>
          <label htmlFor="name" style={labelStyle}>
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            maxLength={120}
            type="text"
            autoComplete="name"
            placeholder="Your name"
            style={fieldStyle}
          />
        </div>
        <div>
          <label htmlFor="email" style={labelStyle}>
            Work email
          </label>
          <input
            id="email"
            name="email"
            required
            maxLength={254}
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            style={fieldStyle}
          />
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <label htmlFor="company" style={labelStyle}>
          Company
        </label>
        <input
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          placeholder="Where you work"
          style={fieldStyle}
        />
      </div>

      <div style={{ marginBottom: 30 }}>
        <label htmlFor="outcome" style={labelStyle}>
          What outcome are you chasing?
        </label>
        <textarea
          id="outcome"
          name="outcome"
          required
          maxLength={5000}
          rows={5}
          placeholder="The number you need to move, the deadline you're up against — as much or as little as you like."
          style={{ ...fieldStyle, resize: "vertical", minHeight: 132 }}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-[#1b4fc7] transition-colors hover:bg-[#112138]"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          border: "none",
          cursor: status === "sending" ? "wait" : "pointer",
          opacity: status === "sending" ? 0.7 : 1,
          borderRadius: 999,
          padding: "15px 28px",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: color.mist,
          boxShadow: shadow.ctaBrand,
          fontFamily: "var(--font-archivo)",
        }}
      >
        {status === "sending" ? "Sending…" : "Send it over"}{" "}
        <span aria-hidden="true">→</span>
      </button>

      <p
        role="status"
        aria-live="polite"
        style={{
          marginTop: status === "idle" || status === "sending" ? 0 : 18,
          fontSize: 15,
          lineHeight: 1.5,
          fontWeight: 600,
          color: status === "error" ? "#b42318" : color.brand,
        }}
      >
        {status === "error" ? error : ""}
      </p>

      <p
        style={{
          marginTop: 20,
          fontSize: 13.5,
          lineHeight: 1.5,
          color: inkA(0.5),
        }}
      >
        Prefer email? Write to us directly at{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          style={{ color: color.brand, textDecoration: "none" }}
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </form>
  );
}
