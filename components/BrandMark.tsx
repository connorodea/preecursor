/**
 * BrandMark — the Preecursor symbol: twelve petal/ray forms radiating from a
 * thin ring around a four-point "north star", from the logo handoff.
 *
 * Server-safe (no hooks). Variants:
 *   - "color"    periwinkle rays + indigo star (on light surfaces)
 *   - "reversed" pale rays + white star (on dark/indigo surfaces)
 *   - "ink"      monochrome navy (single-colour contexts)
 */

type Variant = "color" | "reversed" | "ink";

const PALETTE: Record<Variant, { ray: string; ring: string; star: string }> = {
  color: { ray: "#7184f5", ring: "#9aa9f7", star: "#3a4fe8" },
  reversed: { ray: "#c5cdff", ring: "rgba(255,255,255,0.7)", star: "#ffffff" },
  ink: { ray: "#3a4569", ring: "#6473a0", star: "#0d1b2e" },
};

// Alternating long / short ray, repeated every 30°.
const RAY_LONG = "M0,-50 C1.6,-44 1.6,-37 0,-31 C-1.6,-37 -1.6,-44 0,-50 Z";
const RAY_SHORT = "M0,-42 C1.5,-38 1.5,-34 0,-31 C-1.5,-34 -1.5,-38 0,-42 Z";
const STAR = "M0,-21 C3,-7 7,-3 21,0 C7,3 3,7 0,21 C-3,7 -7,3 -21,0 C-7,-3 -3,-7 0,-21 Z";

export default function BrandMark({
  size = 30,
  variant = "color",
  className,
  style,
  title = "Preecursor",
}: {
  size?: number;
  variant?: Variant;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}) {
  const p = PALETTE[variant];
  return (
    <svg
      width={size}
      height={size}
      viewBox="-60 -60 120 120"
      className={className}
      style={{ flexShrink: 0, display: "block", ...style }}
      role="img"
      aria-label={title}
    >
      <g fill={p.ray}>
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={i % 2 === 0 ? RAY_LONG : RAY_SHORT} transform={`rotate(${i * 30})`} />
        ))}
      </g>
      <circle r="26" fill="none" stroke={p.ring} strokeWidth="1.6" />
      <path d={STAR} fill={p.star} />
    </svg>
  );
}
