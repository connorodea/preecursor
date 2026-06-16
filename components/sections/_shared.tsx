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
