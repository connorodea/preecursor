import type { Metadata } from "next";
import {
  PageHero,
  Section,
  CardGrid,
  RevealGrid,
  Card,
  FeatureRows,
  CTASection,
  Eyebrow,
} from "@/components/ui";
import { PANELS } from "@/lib/ia";
import { WORK_CASES } from "@/lib/content/work";
import { GaugeIcon, GearIcon, PulseIcon, NetworkIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "The work",
  description: PANELS.impact.desc,
};

/** Accent icon per case study, keyed by slug — reuses the use-case marks. */
const WORK_ICONS: Record<
  string,
  React.ComponentType<{ size?: number; style?: React.CSSProperties }>
> = {
  "underwriting-copilot": GaugeIcon,
  "predictive-operations": GearIcon,
  "clinical-documentation": PulseIcon,
  "network-ops-copilot": NetworkIcon,
};

const METHODOLOGY = [
  {
    title: "Diagnose",
    desc: "We start from the metric you already track — cycle time, downtime, loss ratio, churn — and work backward to the system that moves it, scored on value and feasibility before a line of code.",
  },
  {
    title: "Build",
    desc: "Our engineers ship production-grade retrieval, agents, and eval harnesses in weeks, not quarters — instrumented from the first sprint so you can see exactly what they do and what they are worth.",
  },
  {
    title: "Scale",
    desc: "We harden the system for everyday operations: latency, cost, monitoring, and rollback, proven against the number you agreed to move and built to hold as usage climbs.",
  },
  {
    title: "Enable",
    desc: "We redesign the workflow around the system and hand it over documented and owned, so the gains stick after we leave instead of decaying back to the old way.",
  },
];

/**
 * What clients can expect — our standards, stated plainly. As a new studio we
 * do not publish invented client quotes or attributions; these are the
 * commitments we hold ourselves to, not testimonials we've fabricated.
 */
const PRINCIPLES = [
  {
    title: "We ship, not slide-deck",
    body: "The deliverable is a running system in production, not a strategy document and a separate vendor to build it. We own the outcome end to end.",
  },
  {
    title: "The metric is the deliverable",
    body: "Every engagement opens with a single agreed metric and a candid view of what moving it is worth — so the work is judged on the number, not the polish of the readout.",
  },
  {
    title: "Eval discipline, built in",
    body: "We ship the eval harnesses and monitoring that let you change models and prompts without holding your breath — quality is measured, not asserted.",
  },
];

const SECTORS = [
  "Financial institutions",
  "Healthcare & life sciences",
  "Industrial goods",
  "Telecommunications",
  "Insurance",
  "Energy & utilities",
  "Public sector",
  "Private equity",
];

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="The work"
        title="The kind of work we do"
        lede="Illustrative examples of the systems we build and the outcomes they're designed to produce — the cycle time, cost, time-to-repair, and hours-returned levers AI can actually move. Examples, not specific client results."
        cta={{ label: "Start a conversation", href: "/contact" }}
        secondaryCta={{ label: "See our capabilities", href: "/capabilities" }}
      />

      {/* Example engagements — the "Case Studies" leaf points here (/work top). */}
      <Section id="case-studies" className="scroll-mt-[110px]" tone="paper2">
        <Eyebrow label="Example engagements" tone="brand" style={{ marginBottom: 16 }} />
        <p
          style={{
            fontSize: 14.5,
            lineHeight: 1.5,
            color: "rgba(17,33,56,0.55)",
            maxWidth: "60ch",
            marginBottom: 40,
          }}
        >
          The scenarios below are illustrative examples of the kind of work we
          do — not specific delivered client results.
        </p>
        <RevealGrid columns={2}>
          {WORK_CASES.map((c) => {
            const Icon = WORK_ICONS[c.slug];
            return (
              <Card
                key={c.slug}
                href={`/work/${c.slug}`}
                icon={Icon ? <Icon size={26} /> : undefined}
                kicker={c.sector}
                title={c.headline}
                desc={c.summary}
              />
            );
          })}
        </RevealGrid>
      </Section>

      {/* Outcomes — what moving the number looks like across the book. */}
      <Section id="outcomes" className="scroll-mt-[110px]" tone="paper">
        <Eyebrow label="Outcomes" tone="brand" style={{ marginBottom: 28 }} />
        <h2
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 400,
            fontSize: "clamp(30px,3vw,46px)",
            lineHeight: 1.05,
            letterSpacing: "-0.018em",
            color: "#112138",
            maxWidth: "20ch",
          }}
        >
          We define the outcome before we build the system.
        </h2>
        <p
          style={{
            marginTop: 24,
            fontSize: 18,
            lineHeight: 1.62,
            color: "rgba(17,33,56,0.66)",
            maxWidth: "62ch",
          }}
        >
          Every engagement opens with a single agreed metric and a candid view of
          what moving it is worth. That number governs scope, sequencing, and
          what we count as done — so the work pays for itself in a line of the
          P&L you already watch, not in a slide we made up. The examples above
          show the kind of system that follows.
        </p>
      </Section>

      {/* Methodology — Diagnose / Build / Scale / Enable. */}
      <Section id="methodology" className="scroll-mt-[110px]" tone="paper2">
        <Eyebrow label="Methodology" tone="brand" style={{ marginBottom: 28 }} />
        <h2
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 400,
            fontSize: "clamp(30px,3vw,46px)",
            lineHeight: 1.05,
            letterSpacing: "-0.018em",
            color: "#112138",
            maxWidth: "18ch",
            marginBottom: 48,
          }}
        >
          How an engagement runs
        </h2>
        <FeatureRows rows={METHODOLOGY} />
      </Section>

      {/* What to expect — our standards, not fabricated testimonials. */}
      <Section id="what-to-expect" className="scroll-mt-[110px]" tone="paper">
        <Eyebrow label="What to expect" tone="brand" style={{ marginBottom: 40 }} />
        <CardGrid columns={3}>
          {PRINCIPLES.map((p, i) => (
            <figure
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                borderRadius: 16,
                padding: 30,
                background: "#fff",
                border: "1px solid rgba(17,33,56,0.08)",
                boxShadow: "0 26px 52px -20px rgba(17,33,56,0.34)",
                margin: 0,
              }}
            >
              <blockquote
                style={{
                  fontFamily: "var(--font-newsreader)",
                  fontSize: 22,
                  lineHeight: 1.3,
                  color: "#112138",
                  margin: 0,
                }}
              >
                {p.body}
              </blockquote>
              <figcaption
                style={{
                  marginTop: "auto",
                  paddingTop: 24,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#1b4fc7",
                }}
              >
                {p.title}
              </figcaption>
            </figure>
          ))}
        </CardGrid>
      </Section>

      {/* Sectors served. */}
      <Section id="sectors-served" className="scroll-mt-[110px]" tone="paper2">
        <Eyebrow label="Sectors served" tone="brand" style={{ marginBottom: 28 }} />
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.62,
            color: "rgba(17,33,56,0.66)",
            maxWidth: "62ch",
            marginBottom: 40,
          }}
        >
          We bring sector judgment to every build — pairing people who understand
          your industry with engineers who put production AI in front of your
          customers and teams.
        </p>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {SECTORS.map((s) => (
            <span
              key={s}
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 999,
                padding: "11px 20px",
                fontSize: 14.5,
                fontWeight: 600,
                color: "#112138",
                background: "#fff",
                border: "1px solid rgba(17,33,56,0.1)",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </Section>

      <CTASection
        title="What number do you need to move?"
        body="Bring us the metric. We will tell you, candidly, whether AI is the right lever — and if it is, what we would build first, how long it takes, and what it is worth."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "Read our thinking", href: "/insights" }}
        shader
      />
    </>
  );
}
