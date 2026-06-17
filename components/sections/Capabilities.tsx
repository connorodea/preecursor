"use client";

import { Reveal } from "@/lib/motion";
import { Eyebrow } from "./_shared";
import SectionSeam from "./SectionSeam";
import { StrategyIcon, BuildIcon, ScaleIcon, EnableIcon } from "@/components/icons";
import { color, inkA } from "@/lib/theme";

const ROWS = [
  {
    n: "01",
    Icon: StrategyIcon,
    title: "AI Strategy & Diagnostics",
    body: "Where AI creates durable advantage — and where it doesn't. A clear-eyed portfolio of bets, sequenced by value and feasibility, with the economics modeled before a line of code is written.",
  },
  {
    n: "02",
    Icon: BuildIcon,
    title: "Applied Builds",
    body: "Production systems, not prototypes: agents, retrieval, evaluation harnesses, and the infrastructure around them. Built to your security and reliability bar, instrumented to prove their value.",
  },
  {
    n: "03",
    Icon: ScaleIcon,
    title: "Scale & Operate",
    body: "From pilot to platform. Evaluation, monitoring, cost control and the guardrails to run AI in front of real customers — and the operating model to keep it improving.",
  },
  {
    n: "04",
    Icon: EnableIcon,
    title: "Capability & Enablement",
    body: "Your teams own it after we leave. We embed, document, and train — transferring the judgment, not just the codebase — so the capability compounds long after the engagement ends.",
  },
];

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      style={{ position: "relative", overflow: "hidden", background: color.paper }}
    >
      {/* Top seam — the page rises out of the navy ImpactBand pool into paper. */}
      <SectionSeam edge="top" from={color.ink} to={color.paper} />
      <div className="relative z-[1] mx-auto max-w-[1340px] px-6 pt-[160px] pb-20 md:px-10 lg:px-[50px] lg:pt-[200px] lg:pb-[108px]">
        {/* Header grid */}
        <div
          className="grid grid-cols-1 items-start lg:grid-cols-[0.92fr_1.08fr]"
          style={{
            gap: 54,
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
            className="group grid grid-cols-1 items-start lg:grid-cols-[84px_1fr_1.1fr]"
            style={{
              gap: 34,
              padding: "36px 0",
              borderTop: `1px solid ${inkA(0.14)}`,
              ...(i === ROWS.length - 1
                ? { borderBottom: `1px solid ${inkA(0.14)}` }
                : null),
            }}
          >
            <div
              className="text-brand transition-colors duration-300 group-hover:text-azure"
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <row.Icon
                size={30}
                className="transition-transform duration-300 ease-out group-hover:scale-110"
                style={{ transformOrigin: "left bottom" }}
              />
              <span style={{ fontFamily: "var(--font-newsreader)", fontSize: 25 }}>
                {row.n}
              </span>
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
