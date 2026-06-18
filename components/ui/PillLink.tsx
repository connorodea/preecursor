"use client";

/**
 * PillLink — the signature rounded-pill call-to-action used across the site.
 *
 * Base styling is inline (exact paddings / type) while hover colours use
 * Tailwind arbitrary classes, since inline styles can't express `:hover`.
 * Optional `magnetic` wraps the pill in the house Magnetic pointer-follow
 * (default on for the filled variants). `external`/`mailto:` render a plain
 * `<a>`; everything else uses next/link.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { Magnetic } from "@/lib/motion";
import { color, shadow } from "@/lib/theme";

type Variant = "brand" | "azure" | "dark" | "outline" | "ghost";
type Size = "sm" | "md";
type Arrow = "→" | "↗" | false;

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  /** Trailing glyph; pass false to omit. Defaults to "→". */
  arrow?: Arrow;
  /** Wrap in the Magnetic pointer-follow. Defaults true for filled variants. */
  magnetic?: boolean;
  /** Render a plain <a> (also auto-detected for mailto:/tel: hrefs). */
  external?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

/** Per-variant hover classes (base colours live in inline style). */
const VARIANT_CLASS: Record<Variant, string> = {
  brand: "bg-[#1b4fc7] hover:bg-[#112138] transition-colors",
  azure: "bg-[#5b8def] hover:bg-[#7fa6f2] transition-colors",
  dark: "bg-[#112138] hover:bg-[#1b4fc7] transition-colors",
  outline:
    "border-[1.5px] border-[rgba(17,33,56,0.3)] hover:border-[#112138] transition-colors",
  ghost:
    "border-[1.5px] border-[rgba(234,241,251,0.3)] hover:border-[#eaf1fb] transition-colors",
};

/** Per-variant inline colours / shadows. */
function variantStyle(variant: Variant): React.CSSProperties {
  switch (variant) {
    case "brand":
      return { color: color.mist, boxShadow: shadow.ctaBrand };
    case "azure":
      return { color: "#0b1322" };
    case "dark":
      return { color: color.mist };
    case "outline":
      return { color: color.ink, background: "transparent" };
    case "ghost":
      return { color: color.mist, background: "transparent" };
  }
}

const SIZE_STYLE: Record<Size, React.CSSProperties> = {
  md: { padding: "15px 28px", fontSize: 13 },
  sm: { padding: "13px 22px", fontSize: 12.5 },
};

const DEFAULT_MAGNETIC: Record<Variant, boolean> = {
  brand: true,
  azure: true,
  dark: true,
  outline: false,
  ghost: false,
};

export default function PillLink({
  href,
  children,
  variant = "brand",
  size = "md",
  arrow = "→",
  magnetic,
  external,
  className = "",
  style,
}: Props) {
  const isPlainAnchor =
    external || /^(mailto:|tel:|https?:)/i.test(href);
  const useMagnetic = magnetic ?? DEFAULT_MAGNETIC[variant];

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 999,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    textDecoration: "none",
    ...SIZE_STYLE[size],
    ...variantStyle(variant),
    ...style,
  };

  // `group` lets the trailing arrow nudge on hover (matches Card); the nudge is
  // motion-safe-gated so reduced-motion users get no movement.
  const cls = `group ${VARIANT_CLASS[variant]} ${className}`.trim();

  const inner = (
    <>
      {children}
      {arrow && (
        <span
          aria-hidden="true"
          className="motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:translate-x-1"
        >
          {arrow}
        </span>
      )}
    </>
  );

  const pill = isPlainAnchor ? (
    <a
      href={href}
      className={cls}
      style={base}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : null)}
    >
      {inner}
    </a>
  ) : (
    <Link href={href} className={cls} style={base}>
      {inner}
    </Link>
  );

  return useMagnetic ? <Magnetic>{pill}</Magnetic> : pill;
}
