"use client";

import { Reveal, CountUp } from "@/lib/motion";
import { gradient, color, mistA } from "@/lib/theme";

const NUM_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-newsreader)",
  fontSize: "clamp(46px,4.6vw,70px)",
  lineHeight: 0.9,
  letterSpacing: "-0.02em",
};

const LABEL_STYLE: React.CSSProperties = {
  marginTop: 18,
  fontSize: 14.5,
  lineHeight: 1.45,
  color: mistA(0.62),
};

const SMALL_SUFFIX: React.CSSProperties = { fontSize: "0.46em" };

const STATS = [
  {
    num: (
      <CountUp value={2.4} decimals={1} prefix="$" suffix="B" />
    ),
    label: "Enterprise value influenced across engagements",
  },
  {
    num: <CountUp value={40} suffix="+" />,
    label: "AI systems shipped into production",
  },
  {
    num: (
      <>
        <CountUp value={6} />
        <span style={SMALL_SUFFIX}> wks</span>
      </>
    ),
    label: "Median time to first live deployment",
  },
  {
    num: (
      <>
        <CountUp value={9} />
        <span style={SMALL_SUFFIX}>/10</span>
      </>
    ),
    label: "Engagements that expand within a year",
  },
];

export default function ImpactBand() {
  return (
    <section
      style={{
        background: gradient.inkBand("82% -10%"),
        color: color.mist,
      }}
    >
      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "78px 50px" }}>
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
            Client impact
          </span>
        </div>

        {/* Stat grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 40,
          }}
        >
          {STATS.map((s, i) => (
            <Reveal
              key={i}
              delay={i * 0.08}
              style={{
                borderTop: `1px solid ${mistA(0.2)}`,
                paddingTop: 26,
              }}
            >
              <div style={NUM_STYLE}>{s.num}</div>
              <div style={LABEL_STYLE}>{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
