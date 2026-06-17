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
   ---------------------------------------------------------------- */
export function EdgeFade({
  color = "#e6eefb",
  top = true,
  bottom = true,
  size = 110,
}: {
  /** The neighbouring light colour to fade toward. */
  color?: string;
  top?: boolean;
  bottom?: boolean;
  size?: number;
}) {
  return (
    <>
      {top && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: size,
            background: `linear-gradient(180deg, ${color}, transparent)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}
      {bottom && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: size,
            background: `linear-gradient(0deg, ${color}, transparent)`,
            pointerEvents: "none",
            zIndex: 0,
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
