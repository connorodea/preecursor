"use client";

/**
 * StatBand — a dark "by the numbers" band. Generalizes the landing ImpactBand:
 * an azure eyebrow over a row of animated CountUp figures, each topped by the
 * signature hairline rule.
 *
 * Columns adapt: one-up on mobile, two-up on small screens, then `n`-up on
 * desktop (driven by Tailwind so it stacks gracefully).
 */

import { Reveal, CountUp } from "@/lib/motion";
import { color, gradient, mistA, container } from "@/lib/theme";
import Eyebrow from "./Eyebrow";

type Stat = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

type Props = {
  eyebrow?: string;
  stats: Stat[];
};

const NUM_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-newsreader)",
  fontSize: "clamp(46px,4.6vw,70px)",
  lineHeight: 0.9,
  letterSpacing: "-0.02em",
};

/** Desktop column count tracks the number of stats, capped at 4. */
const LG_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export default function StatBand({ eyebrow, stats }: Props) {
  const lg = LG_COLS[Math.min(stats.length, 4)] ?? "lg:grid-cols-4";

  return (
    <section style={{ background: gradient.inkBand("82% -10%"), color: color.mist }}>
      <div className={`${container} px-6 py-16 md:px-10 lg:px-[50px] lg:py-[78px]`}>
        {eyebrow && (
          <Eyebrow label={eyebrow} tone="azure" style={{ marginBottom: 50 }} />
        )}

        <div className={`grid grid-cols-1 sm:grid-cols-2 ${lg}`} style={{ gap: 40 }}>
          {stats.map((s, i) => (
            <Reveal
              key={i}
              delay={i * 0.08}
              style={{ borderTop: `1px solid ${mistA(0.2)}`, paddingTop: 26 }}
            >
              <div style={NUM_STYLE}>
                <CountUp
                  value={s.value}
                  decimals={s.decimals}
                  prefix={s.prefix}
                  suffix={s.suffix}
                />
              </div>
              <div
                style={{
                  marginTop: 18,
                  fontSize: 14.5,
                  lineHeight: 1.45,
                  color: mistA(0.62),
                }}
              >
                {s.label}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
