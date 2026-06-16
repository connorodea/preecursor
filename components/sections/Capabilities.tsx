"use client";

import { Reveal } from "@/lib/motion";
import { Eyebrow } from "./_shared";
import { color, inkA } from "@/lib/theme";

const ROWS = [
  {
    n: "01",
    title: "AI Strategy & Diagnostics",
    body: "Where AI creates durable advantage — and where it doesn't. A clear-eyed portfolio of bets, sequenced by value and feasibility, with the economics modeled before a line of code is written.",
  },
  {
    n: "02",
    title: "Applied Builds",
    body: "Production systems, not prototypes: agents, retrieval, evaluation harnesses, and the infrastructure around them. Built to your security and reliability bar, instrumented to prove their value.",
  },
  {
    n: "03",
    title: "Scale & Operate",
    body: "From pilot to platform. Evaluation, monitoring, cost control and the guardrails to run AI in front of real customers — and the operating model to keep it improving.",
  },
  {
    n: "04",
    title: "Capability & Enablement",
    body: "Your teams own it after we leave. We embed, document, and train — transferring the judgment, not just the codebase — so the capability compounds long after the engagement ends.",
  },
];

export default function Capabilities() {
  return (
    <section id="capabilities">
      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "108px 50px" }}>
        {/* Header grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "0.92fr 1.08fr",
            gap: 54,
            alignItems: "start",
            marginBottom: 66,
          }}
        >
          <div>
            <Eyebrow
              label="What we do"
              barColor={color.brand}
              textColor={color.brand}
              style={{ marginBottom: 22 }}
            />
            <h2
              style={{
                fontFamily: "var(--font-newsreader)",
                fontWeight: 400,
                fontSize: "clamp(36px,3.6vw,54px)",
                lineHeight: 1.03,
                letterSpacing: "-0.018em",
                color: color.ink,
              }}
            >
              A complete arc — from where AI matters to systems your teams run.
            </h2>
          </div>
          <p
            style={{
              fontSize: 18.5,
              lineHeight: 1.62,
              color: inkA(0.66),
              paddingTop: 8,
            }}
          >
            Most AI work stalls between the strategy deck and the production
            system. We close that gap. Preecursor pairs senior strategists with
            engineers who have shipped at scale, so the path from ambition to
            operating capability is one continuous engagement — not a handoff
            between three vendors.
          </p>
        </div>

        {/* Capability rows */}
        {ROWS.map((row, i) => (
          <Reveal
            key={row.n}
            delay={i * 0.07}
            style={{
              display: "grid",
              gridTemplateColumns: "84px 1fr 1.1fr",
              gap: 34,
              alignItems: "baseline",
              padding: "36px 0",
              borderTop: `1px solid ${inkA(0.14)}`,
              ...(i === ROWS.length - 1
                ? { borderBottom: `1px solid ${inkA(0.14)}` }
                : null),
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-newsreader)",
                fontSize: 25,
                color: color.brand,
              }}
            >
              {row.n}
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, color: color.ink }}>
              {row.title}
            </div>
            <div
              style={{
                fontSize: 16.5,
                lineHeight: 1.55,
                color: inkA(0.62),
              }}
            >
              {row.body}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
