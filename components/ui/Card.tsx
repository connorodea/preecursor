"use client";

/**
 * Card — an elevated content tile for use inside CardGrid.
 *
 * Optional kicker (small uppercase brand label), serif title, supporting
 * description and a serif stat. When `href` is set the whole card becomes a
 * link that lifts and nudges its trailing arrow on hover (hover state via
 * Tailwind group-hover arbitrary classes, since inline can't do `:hover`).
 * `tone="dark"` flips the surface to inkDeep + mist for use on dark sections.
 */

import Link from "next/link";
import { color, inkA, mistA, shadow } from "@/lib/theme";

type Tone = "light" | "dark";

type Props = {
  href?: string;
  kicker?: string;
  title: string;
  desc?: string;
  stat?: string;
  tone?: Tone;
  className?: string;
};

export default function Card({
  href,
  kicker,
  title,
  desc,
  stat,
  tone = "light",
  className = "",
}: Props) {
  const dark = tone === "dark";

  const base: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    borderRadius: 16,
    padding: 30,
    border: dark
      ? "1px solid rgba(234,241,251,0.1)"
      : "1px solid rgba(17,33,56,0.08)",
    background: dark ? color.inkDeep : "#fff",
    color: dark ? color.mist : color.ink,
    textDecoration: "none",
    height: "100%",
  };

  // Hover lift + soft shadow, applied only when the card links somewhere.
  const hoverClass = href
    ? "group transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_26px_52px_-20px_rgba(17,33,56,0.34)]"
    : "";

  const body = (
    <>
      {kicker && (
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: dark ? color.azure : color.brand,
            marginBottom: 16,
          }}
        >
          {kicker}
        </span>
      )}

      {stat && (
        <span
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: "clamp(34px,3vw,46px)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: dark ? color.azure : color.brand,
            marginBottom: 14,
          }}
        >
          {stat}
        </span>
      )}

      <span
        style={{
          fontFamily: "var(--font-newsreader)",
          fontSize: 23,
          fontWeight: 500,
          lineHeight: 1.18,
          color: dark ? color.mist : color.ink,
        }}
      >
        {title}
      </span>

      {desc && (
        <span
          style={{
            marginTop: 12,
            fontSize: 15.5,
            lineHeight: 1.55,
            color: dark ? mistA(0.66) : inkA(0.62),
          }}
        >
          {desc}
        </span>
      )}

      {href && (
        <span
          aria-hidden="true"
          className="transition-transform duration-300 ease-out group-hover:translate-x-1"
          style={{
            marginTop: "auto",
            paddingTop: 22,
            fontSize: 18,
            color: dark ? color.azure : color.brand,
          }}
        >
          →
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${hoverClass} ${className}`.trim()} style={base}>
        {body}
      </Link>
    );
  }

  return (
    <div
      className={className}
      style={{ ...base, boxShadow: dark ? undefined : shadow.card }}
    >
      {body}
    </div>
  );
}
