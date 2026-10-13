import type { Metadata } from "next";
import LeadIntakeForm from "@/components/LeadIntakeForm";
import { publicHttpsUrl } from "@/lib/lead-intake";
import ShaderField from "@/components/ShaderField";
import { Section, Eyebrow, PillLink } from "@/components/ui";
import { CONTACT_EMAIL, LOCATIONS } from "@/lib/ia";
import { color, gradient, inkA, container } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us the outcome you're chasing. We'll tell you, honestly, whether AI is the way to get there — and how fast. hello@preecursor.com · Denver · Detroit · Remote-first.",
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

export default function ContactPage() {
  const bookingUrl = publicHttpsUrl(process.env.NEXT_PUBLIC_BOOKING_URL);
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
          className={`${container} px-6 md:px-10 lg:px-[50px]`}
          style={{
            position: "relative",
            zIndex: 5,
            // Clears the fixed ~96px header.
            paddingTop: "clamp(120px,16vh,180px)",
            paddingBottom: 72,
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
          <LeadIntakeForm />

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
              One inbox, every time zone
            </h2>

            {bookingUrl && <div style={{ marginTop: 28 }}><PillLink href={bookingUrl} variant="dark" external>Book a discovery call</PillLink></div>}
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
              Share the workflow you want to improve. A discovery conversation
              covers the current process, its cost, and whether automation is a
              practical fit.
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
