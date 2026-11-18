"use client";

import { useState } from "react";
import Honeypot from "@/components/Honeypot";
import { submitForm, readForm, type FormStatus } from "@/lib/forms";
import { color } from "@/lib/theme";

/**
 * Email-only newsletter signup: a white pill with an inline Subscribe button.
 * Sits on dark (ink) surfaces. Posts to the forms Worker's /subscribe route.
 */
export default function NewsletterForm({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    const res = await submitForm("subscribe", readForm(e.currentTarget));
    if (res.ok) {
      setStatus("sent");
    } else {
      setError(res.error);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p
        role="status"
        aria-live="polite"
        className={className}
        style={{ fontSize: 17, lineHeight: 1.5, color: "#eaf1fb", fontWeight: 600 }}
      >
        Thanks — you&rsquo;re on the list.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className={className} style={{ position: "relative" }}>
      <Honeypot />
      <div
        className="pl-6 sm:pl-7"
        style={{
          display: "flex",
          alignItems: "center",
          background: "#fff",
          borderRadius: 999,
          paddingTop: 7,
          paddingRight: 7,
          paddingBottom: 7,
        }}
      >
        <input
          type="email"
          name="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="Enter email"
          aria-label="Email address"
          style={{
            flex: 1,
            border: "none",
            background: "transparent",
            fontSize: 16,
            color: color.ink,
            minWidth: 0,
          }}
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-[#1b4fc7] hover:bg-[#112138] transition-colors"
          style={{
            border: "none",
            cursor: status === "sending" ? "wait" : "pointer",
            opacity: status === "sending" ? 0.7 : 1,
            color: color.mist,
            borderRadius: 999,
            padding: "15px 30px",
            fontWeight: 700,
            fontSize: 14.5,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
          }}
        >
          {status === "sending" ? "Sending…" : <>Subscribe &rarr;</>}
        </button>
      </div>
      <p
        role="status"
        aria-live="polite"
        style={{
          marginTop: status === "error" ? 12 : 0,
          paddingLeft: 8,
          fontSize: 14.5,
          lineHeight: 1.45,
          color: "#ffb4ab",
        }}
      >
        {status === "error" ? error : ""}
      </p>
    </form>
  );
}
