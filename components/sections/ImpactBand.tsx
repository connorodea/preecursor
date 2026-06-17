"use client";

import { Reveal } from "@/lib/motion";
import EducationMarks from "./EducationMarks";
import { color, mistA } from "@/lib/theme";

const NUM_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-newsreader)",
  fontSize: "clamp(34px,3.1vw,50px)",
  lineHeight: 1.02,
  letterSpacing: "-0.02em",
};

const LABEL_STYLE: React.CSSProperties = {
  marginTop: 18,
  fontSize: 14.5,
  lineHeight: 1.45,
  color: mistA(0.62),
};

/**
 * Operating principles — how we work, stated plainly. No metrics: we're a new
 * studio and we don't invent aggregate numbers. These are commitments we hold
 * ourselves to on every engagement.
 */
const PRINCIPLES = [
  {
    headline: "Senior-only",
    label: "The people in the pitch are the people who build. No junior bench, no hand-off to a team you never met.",
  },
  {
    headline: "One team",
    label: "Strategists and engineers work in the same room — the thinking and the shipping are never separate contracts.",
  },
  {
    headline: "In production",
    label: "We deliver running systems, not slideware. The deliverable is software that works, instrumented so you can see what it does.",
  },
  {
    headline: "Embedded",
    label: "We work inside your stack, your tools, and your time zone — close to where the decisions and the code actually live.",
  },
];

export default function ImpactBand() {
  return (
    <section
      style={{
        // Solid navy "pool" — the dissolve is owned by the light neighbours
        // (Hero below the wash, Capabilities above) via SectionSeam.
        background: color.ink,
        color: color.mist,
      }}
    >
      <div className="relative mx-auto max-w-[1340px] px-6 py-16 md:px-10 lg:px-[50px] lg:py-[78px]">
        {/* Trust strip — co-founders' universities, the first thing the page
            shows as it dissolves out of the hero into this dark band. */}
        <Reveal>
          <div
            style={{
              paddingBottom: 40,
              marginBottom: 50,
              borderBottom: `1px solid ${mistA(0.16)}`,
            }}
          >
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: mistA(0.5),
                marginBottom: 22,
              }}
            >
              Our co-founders studied at
            </div>
            <EducationMarks />
          </div>
        </Reveal>

        {/* Eyebrow row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 50,
          }}
        >
          <span
            aria-hidden="true"
            style={{ width: 34, height: 1, background: color.azure }}
          />
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 700,
              letterSpacing: "0.24em",
              color: color.azure,
              textTransform: "uppercase",
            }}
          >
            How we work
          </span>
        </div>

        {/* Operating principles */}
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-4">
          {PRINCIPLES.map((p, i) => (
            <Reveal
              key={i}
              delay={i * 0.08}
              style={{
                borderTop: `1px solid ${mistA(0.2)}`,
                paddingTop: 26,
              }}
            >
              <div style={NUM_STYLE}>{p.headline}</div>
              <div style={LABEL_STYLE}>{p.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
