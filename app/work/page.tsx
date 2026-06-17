import type { Metadata } from "next";
import {
  PageHero,
  Section,
  CardGrid,
  Card,
  StatBand,
  FeatureRows,
  CTASection,
  Eyebrow,
} from "@/components/ui";
import { PANELS } from "@/lib/ia";
import { WORK_CASES, FIRM_STATS, formatStat } from "@/lib/content/work";

export const metadata: Metadata = {
  title: "Client impact",
  description: PANELS.impact.desc,
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

const TESTIMONIALS = [
  {
    quote:
      "They shipped something our last two vendors only slide-decked. Eight weeks in, it was in production and clearing model risk review.",
    attribution: "Chief Risk Officer, global bank",
  },
  {
    quote:
      "Preecursor is the rare partner that treats the number as the deliverable. They told us what they would build, what it was worth, and then they were right.",
    attribution: "VP of Operations, industrial manufacturer",
  },
  {
    quote:
      "The eval discipline alone changed how our team works. We can swap models now without holding our breath.",
    attribution: "Head of AI, healthcare network",
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
        eyebrow="Client impact"
        title="Outcomes we can point to"
        lede="We are measured against numbers our clients agreed to move — cycle time, cost, time-to-repair, hours returned. Here is what that looks like in production."
        cta={{ label: "Start a conversation", href: "/contact" }}
        secondaryCta={{ label: "See our capabilities", href: "/capabilities" }}
      />

      {/* Case studies — the "Case Studies" leaf points here (/work top). */}
      <Section id="case-studies" className="scroll-mt-[110px]" tone="paper2">
        <Eyebrow label="Selected work" tone="brand" style={{ marginBottom: 40 }} />
        <CardGrid columns={2}>
          {WORK_CASES.map((c) => (
            <Card
              key={c.slug}
              href={`/work/${c.slug}`}
              kicker={c.sector}
              title={c.headline}
              stat={formatStat(c.stat)}
              desc={c.summary}
            />
          ))}
        </CardGrid>
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
          Every engagement opens with a single agreed metric and the dollar value
          of moving it. That number governs scope, sequencing, and what we count
          as done — so the work pays for itself in a line of the P&L you already
          watch, not in a slide we made up. The case studies below are the proof,
          and the band further down is the book of business behind them.
        </p>
      </Section>

      {/* By the numbers — the "By the Numbers" leaf points here. */}
      <div id="by-the-numbers" className="scroll-mt-[110px]">
        <StatBand eyebrow="By the numbers" stats={FIRM_STATS} />
      </div>

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

      {/* Testimonials. */}
      <Section id="testimonials" className="scroll-mt-[110px]" tone="paper">
        <Eyebrow label="Testimonials" tone="brand" style={{ marginBottom: 40 }} />
        <CardGrid columns={3}>
          {TESTIMONIALS.map((t, i) => (
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
                “{t.quote}”
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
                {t.attribution}
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
