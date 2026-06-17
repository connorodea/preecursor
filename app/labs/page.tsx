import type { Metadata } from "next";
import {
  PageHero,
  Section,
  CardGrid,
  Card,
  CTASection,
  Eyebrow,
  PillLink,
} from "@/components/ui";
import { PANELS, slugify } from "@/lib/ia";
import { LABS } from "@/lib/content/world";
import { color, inkA, mistA } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Labs",
  description: PANELS.labs.desc,
};

/** The four areas that render as anchored prose sections (publications &
 *  fellowships get bespoke, content-rich sections of their own below). */
const PROSE_AREAS = LABS.areas.filter(
  (a) => a.title !== "Publications" && a.title !== "Fellowships",
);

export default function LabsPage() {
  return (
    <>
      <PageHero
        eyebrow="Preecursor Labs"
        title="Where we sharpen the methods before they reach a client"
        lede={LABS.hero.lede}
        cta={{ label: "Start a conversation", href: "/contact" }}
        secondaryCta={{ label: "Read our publications", href: "#publications" }}
      />

      {/* Intro statement. */}
      <Section py={80}>
        <Eyebrow label="What Labs is for" tone="brand" style={{ marginBottom: 24 }} />
        <p
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 400,
            fontSize: "clamp(24px,2.4vw,34px)",
            lineHeight: 1.32,
            letterSpacing: "-0.01em",
            color: color.ink,
            maxWidth: "32ch",
          }}
        >
          {LABS.intro}
        </p>
      </Section>

      {/* The four core areas, each its own anchored section. The middle one is
          a dark band for contrast. Anchor ids: frontier-research, open-tooling,
          reference-architectures, benchmarks. */}
      {PROSE_AREAS.map((area, i) => {
        const dark = i === 1; // Open Tooling renders on the ink band.
        return (
          <Section
            key={area.title}
            id={slugify(area.title)}
            className="scroll-mt-[110px]"
            tone={dark ? "ink" : i % 2 === 0 ? "paper" : "paper3"}
            py={88}
          >
            <div
              className="grid grid-cols-1 items-baseline md:grid-cols-[0.9fr_1.1fr]"
              style={{ gap: 48 }}
            >
              <div>
                <Eyebrow
                  label={`0${i + 1}`}
                  tone={dark ? "azure" : "brand"}
                  style={{ marginBottom: 18 }}
                />
                <h2
                  style={{
                    fontFamily: "var(--font-newsreader)",
                    fontWeight: 400,
                    fontSize: "clamp(30px,3vw,46px)",
                    lineHeight: 1.04,
                    letterSpacing: "-0.018em",
                    color: dark ? color.mist : color.ink,
                  }}
                >
                  {area.title}
                </h2>
              </div>
              <p
                style={{
                  fontSize: 18,
                  lineHeight: 1.62,
                  color: dark ? mistA(0.72) : inkA(0.66),
                }}
              >
                {area.desc}
              </p>
            </div>
          </Section>
        );
      })}

      {/* Publications — anchored list. */}
      <Section id="publications" className="scroll-mt-[110px]" tone="paper2">
        <Eyebrow label="Publications" tone="brand" style={{ marginBottom: 18 }} />
        <h2
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 400,
            fontSize: "clamp(30px,3vw,46px)",
            lineHeight: 1.04,
            letterSpacing: "-0.018em",
            color: color.ink,
            maxWidth: "20ch",
          }}
        >
          We publish what worked, what didn&rsquo;t, and the evidence
        </h2>
        <p
          style={{
            marginTop: 22,
            marginBottom: 48,
            fontSize: 18,
            lineHeight: 1.62,
            color: inkA(0.66),
            maxWidth: "60ch",
          }}
        >
          {
            LABS.areas.find((a) => a.title === "Publications")?.desc
          }
        </p>

        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {LABS.publications.map((pub, i) => (
            <li
              key={pub.title}
              className="grid grid-cols-1 items-baseline md:grid-cols-[1fr_auto]"
              style={{
                gap: 24,
                padding: "26px 0",
                borderTop: `1px solid ${inkA(0.14)}`,
                ...(i === LABS.publications.length - 1
                  ? { borderBottom: `1px solid ${inkA(0.14)}` }
                  : null),
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-newsreader)",
                    fontSize: "clamp(20px,1.8vw,25px)",
                    fontWeight: 500,
                    lineHeight: 1.22,
                    letterSpacing: "-0.01em",
                    color: color.ink,
                  }}
                >
                  {pub.title}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 14.5,
                    color: inkA(0.58),
                  }}
                >
                  {pub.venue}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-newsreader)",
                  fontSize: 22,
                  color: color.brand,
                  whiteSpace: "nowrap",
                }}
              >
                {pub.year}
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* Fellowships — anchored CTA section. */}
      <Section id="fellowships" className="scroll-mt-[110px]" tone="inkDeep">
        <div
          className="grid grid-cols-1 items-center lg:grid-cols-[1.1fr_0.9fr]"
          style={{ gap: 60 }}
        >
          <div>
            <Eyebrow label="Fellowships" tone="azure" style={{ marginBottom: 22 }} />
            <h2
              style={{
                fontFamily: "var(--font-newsreader)",
                fontWeight: 500,
                fontSize: "clamp(32px,3.4vw,52px)",
                lineHeight: 1.02,
                letterSpacing: "-0.02em",
                color: color.mist,
              }}
            >
              {LABS.fellowship.title}
            </h2>
            {LABS.fellowship.body.map((p, i) => (
              <p
                key={i}
                style={{
                  marginTop: i === 0 ? 24 : 18,
                  fontSize: 18,
                  lineHeight: 1.62,
                  color: mistA(0.72),
                  maxWidth: "52ch",
                }}
              >
                {p}
              </p>
            ))}
            <div style={{ marginTop: 32 }}>
              <PillLink href="/contact" variant="azure">
                Apply for a fellowship
              </PillLink>
            </div>
          </div>

          <div>
            <Card
              tone="dark"
              kicker="Residency"
              title="Six months, one hard problem, your name on it"
              desc="Funded. Senior mentorship from our partners. Real client-grade work that ships into Labs — not academic tourism, not coffee runs."
            />
          </div>
        </div>
      </Section>

      <CTASection
        title="Put the methods to work on your problem"
        body="Labs is where we prove the approach. An engagement is where we apply it to a number you need to move."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "See our work", href: "/work" }}
        shader
      />
    </>
  );
}
