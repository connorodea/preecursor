import type { Metadata } from "next";
import ShaderField from "@/components/ShaderField";
import { Section, Eyebrow, PillLink } from "@/components/ui";
import { CONTACT_EMAIL, LOCATIONS } from "@/lib/ia";
import { color, gradient, glass, inkA, shadow, container } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us the outcome you're chasing. We'll tell you, honestly, whether AI is the way to get there — and how fast. hello@preecursor.com · New York · London · Singapore.",
};

/** Shared field styling for the presentational contact form. */
const labelStyle: React.CSSProperties = {
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

export default function ContactPage() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background: gradient.heroWash,
        }}
      >
        <ShaderField style={{ zIndex: 0 }} />
        {/* Light vignette keeps the headline legible over the mesh. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            background:
              "radial-gradient(115% 100% at 15% 42%, rgba(255,255,255,0.62), rgba(255,255,255,0.12) 46%, rgba(255,255,255,0) 70%)",
          }}
        />

        <div
          className={container}
          style={{
            position: "relative",
            zIndex: 5,
            // Clears the fixed ~96px header.
            padding: "clamp(140px,16vh,180px) 50px 72px",
          }}
        >
          <Eyebrow label="Contact" tone="brand" style={{ marginBottom: 26 }} />
          <h1
            style={{
              fontFamily: "var(--font-newsreader)",
              fontWeight: 500,
              fontSize: "clamp(40px,5vw,76px)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: color.ink,
              maxWidth: "16ch",
              textWrap: "balance",
            }}
          >
            Let&rsquo;s build what&rsquo;s next.
          </h1>
          <p
            style={{
              marginTop: 28,
              fontSize: "clamp(18px,1.6vw,22px)",
              lineHeight: 1.45,
              color: inkA(0.66),
              maxWidth: "46ch",
            }}
          >
            Tell us the outcome you&rsquo;re chasing. We&rsquo;ll tell you,
            honestly, whether AI is the way to get there — and how fast.
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------- Form + details */}
      <Section tone="paper">
        <div
          className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]"
          style={{ gap: 60, alignItems: "start" }}
        >
          {/* Left — presentational contact form on a glass card. */}
          <form
            action={`mailto:${CONTACT_EMAIL}`}
            method="post"
            encType="text/plain"
            style={{
              ...glass(0.62),
              borderRadius: 18,
              padding: "clamp(28px,3vw,42px)",
              boxShadow: shadow.glass,
            }}
          >
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
                rows={5}
                placeholder="The number you need to move, the deadline you're up against — as much or as little as you like."
                style={{ ...fieldStyle, resize: "vertical", minHeight: 132 }}
              />
            </div>

            <PillLink
              href={`mailto:${CONTACT_EMAIL}`}
              variant="brand"
              external
            >
              Send it over
            </PillLink>

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

          {/* Right — contact details. */}
          <div style={{ paddingTop: 8 }}>
            <Eyebrow label="Reach us" tone="brand" style={{ marginBottom: 22 }} />
            <h2
              style={{
                fontFamily: "var(--font-newsreader)",
                fontWeight: 400,
                fontSize: "clamp(28px,2.6vw,40px)",
                lineHeight: 1.06,
                letterSpacing: "-0.018em",
                color: color.ink,
                maxWidth: "16ch",
              }}
            >
              One inbox, three time zones
            </h2>

            <div style={{ marginTop: 30 }}>
              <PillLink
                href={`mailto:${CONTACT_EMAIL}`}
                variant="dark"
                external
              >
                {CONTACT_EMAIL}
              </PillLink>
            </div>

            <div
              style={{
                marginTop: 40,
                borderTop: `1px solid ${inkA(0.14)}`,
                paddingTop: 28,
              }}
            >
              <div style={labelStyle}>Our studios</div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {LOCATIONS.map((city) => (
                  <li
                    key={city}
                    style={{
                      fontFamily: "var(--font-newsreader)",
                      fontSize: 24,
                      lineHeight: 1.5,
                      color: color.ink,
                    }}
                  >
                    {city}
                  </li>
                ))}
              </ul>
            </div>

            <p
              style={{
                marginTop: 32,
                fontSize: 16,
                lineHeight: 1.6,
                color: inkA(0.62),
                maxWidth: "40ch",
              }}
            >
              We read every message ourselves and reply within one business day —
              usually with a candid first take, not a calendar link.
            </p>
          </div>
        </div>

        {/* Closing trust line. */}
        <p
          style={{
            marginTop: 72,
            fontSize: 15,
            lineHeight: 1.6,
            color: inkA(0.5),
            textAlign: "center",
            maxWidth: "56ch",
            marginInline: "auto",
          }}
        >
          No procurement maze, no junior bench. The people who read your message
          are the people who would do the work.
        </p>
      </Section>
    </>
  );
}
