"use client";

/**
 * ContentSplit — a two-column "text + media" block. Left holds an eyebrow,
 * serif H2, body copy and an optional CTA; right holds arbitrary media inside
 * an elevated, rounded, clipped frame.
 *
 * Columns are driven by Tailwind so the layout stacks to one column below the
 * `lg` breakpoint (and visually re-orders media-first there for a natural
 * reading flow). `reverse` swaps the desktop column order.
 */

import type { ReactNode } from "react";
import { Reveal } from "@/lib/motion";
import { color, inkA, shadow, container } from "@/lib/theme";
import Eyebrow from "./Eyebrow";
import PillLink from "./PillLink";

type Cta = {
  label: string;
  href: string;
  variant?: "brand" | "azure" | "dark" | "outline" | "ghost";
};

type Props = {
  eyebrow?: string;
  title: string;
  body: string | string[];
  media: ReactNode;
  /** Swap column order on desktop (media on the left). */
  reverse?: boolean;
  cta?: Cta;
};

export default function ContentSplit({
  eyebrow,
  title,
  body,
  media,
  reverse = false,
  cta,
}: Props) {
  const paras = Array.isArray(body) ? body : [body];

  return (
    <div
      className={`${container} grid grid-cols-1 items-center lg:grid-cols-[1.05fr_0.95fr]`}
      style={{ gap: 60, padding: "96px 50px" }}
    >
      {/* Text column */}
      <Reveal style={reverse ? { order: 2 } : undefined}>
        {eyebrow && <Eyebrow label={eyebrow} tone="brand" style={{ marginBottom: 22 }} />}
        <h2
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 400,
            fontSize: "clamp(30px,3vw,46px)",
            lineHeight: 1.04,
            letterSpacing: "-0.018em",
            color: color.ink,
          }}
        >
          {title}
        </h2>
        {paras.map((p, i) => (
          <p
            key={i}
            style={{
              marginTop: i === 0 ? 24 : 18,
              fontSize: 18,
              lineHeight: 1.62,
              color: inkA(0.66),
            }}
          >
            {p}
          </p>
        ))}
        {cta && (
          <div style={{ marginTop: 32 }}>
            <PillLink href={cta.href} variant={cta.variant ?? "brand"}>
              {cta.label}
            </PillLink>
          </div>
        )}
      </Reveal>

      {/* Media column */}
      <Reveal
        delay={0.08}
        style={{
          position: "relative",
          minHeight: 440,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: shadow.card,
          ...(reverse ? { order: 1 } : null),
        }}
      >
        {media}
      </Reveal>
    </div>
  );
}
