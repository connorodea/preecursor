"use client";

/**
 * FeatureRows — the index / title / description rows from the landing
 * Capabilities section, generalized. Each row reveals on scroll with a small
 * staggered delay; indices auto-number ("01", "02", …) when not provided.
 *
 * Columns are driven by Tailwind so rows stack to a single column below the
 * `md` breakpoint and lay out as `84px 1fr 1.1fr` above it.
 */

import { Reveal } from "@/lib/motion";
import { color, inkA } from "@/lib/theme";

type Row = {
  index?: string;
  title: string;
  desc: string;
};

type Props = {
  rows: Row[];
};

export default function FeatureRows({ rows }: Props) {
  return (
    <div>
      {rows.map((row, i) => (
        <Reveal
          key={i}
          delay={i * 0.07}
          className="grid grid-cols-1 items-baseline md:grid-cols-[84px_1fr_1.1fr]"
          style={{
            gap: 34,
            padding: "36px 0",
            borderTop: `1px solid ${inkA(0.14)}`,
            ...(i === rows.length - 1
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
            {row.index ?? String(i + 1).padStart(2, "0")}
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: color.ink }}>
            {row.title}
          </div>
          <div style={{ fontSize: 16.5, lineHeight: 1.55, color: inkA(0.62) }}>
            {row.desc}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
