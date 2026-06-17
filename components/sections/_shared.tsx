/**
 * Local section helpers — kept inside components/sections so the landing page
 * stays self-contained. (The reusable design-system primitives in
 * components/ui/ are owned by a later task; nothing shared here belongs there.)
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { color } from "@/lib/theme";

/* ----------------------------------------------------------------
   Eyebrow — the small horizontal bar + uppercase micro-label that
   prefaces nearly every section header in the prototype.
   ---------------------------------------------------------------- */
export function Eyebrow({
  label,
  barColor = color.azure,
  textColor = color.azure,
  className,
  style,
}: {
  label: string;
  /** Colour of the leading bar. */
  barColor?: string;
  /** Colour of the label text. */
  textColor?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", gap: 14, ...style }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 34,
          height: 1,
          background: barColor,
          flex: "0 0 auto",
        }}
      />
      <span
        style={{
          fontSize: 12.5,
          fontWeight: 700,
          letterSpacing: "0.24em",
          color: textColor,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ----------------------------------------------------------------
   EdgeFade — soft gradient fades at the top and/or bottom edge of a
   (dark) section so it melts into its light neighbours instead of
   hard-cutting. Render as the first child of a position:relative
   section; keep the section's content in a position:relative wrapper
   so it paints above these fades.

   A naive light→transparent fade over a dark band greys out at its
   midpoint (≈50% near-white over navy resolves to a muddy steel) — the
   "fog" between sections. To blend cleanly we route the seam through two
   saturated-blue waypoints, so the edge reads as a luminous deep-blue glow
   (matching the aurora hero) that resolves into the navy body — never grey.
   Pass each edge the *exact* light colour of its neighbour so the join at
   the very seam is invisible.
   ---------------------------------------------------------------- */
const SEAM_GLOW = "rgba(60,98,164,0.42)"; // upper waypoint — luminous azure
const SEAM_DEEP = "rgba(24,48,92,0.28)"; //  lower waypoint — settles toward navy

export function EdgeFade({
  topColor = color.paper3,
  bottomColor = color.paper3,
  top = true,
  bottom = true,
  size = 124,
}: {
  /** Exact light colour of the section ABOVE — the top edge melts into it. */
  topColor?: string;
  /** Exact light colour of the section BELOW — the bottom edge melts into it. */
  bottomColor?: string;
  top?: boolean;
  bottom?: boolean;
  size?: number;
}) {
  const base: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    height: size,
    pointerEvents: "none",
    zIndex: 0,
  };
  // edge → azure glow → deep blue → navy (transparent lets the band show)
  const stops = (edge: string) =>
    `${edge} 0%, ${SEAM_GLOW} 30%, ${SEAM_DEEP} 62%, transparent 100%`;
  return (
    <>
      {top && (
        <div
          aria-hidden="true"
          style={{
            ...base,
            top: 0,
            background: `linear-gradient(180deg, ${stops(topColor)})`,
          }}
        />
      )}
      {bottom && (
        <div
          aria-hidden="true"
          style={{
            ...base,
            bottom: 0,
            background: `linear-gradient(0deg, ${stops(bottomColor)})`,
          }}
        />
      )}
    </>
  );
}

/* ----------------------------------------------------------------
   PillLink — a rounded pill anchor with base + hover colours done
   via Tailwind arbitrary classes (inline style can't do :hover).
   ---------------------------------------------------------------- */
export function PillLink({
  href,
  children,
  className = "",
  style,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <Link
      href={href}
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 999,
        textDecoration: "none",
        ...style,
      }}
    >
      {children}
    </Link>
  );
}
