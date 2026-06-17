/**
 * SectionSeam — the single, unified boundary mechanism for the homepage.
 *
 * Every section transition is rendered as ONE tall vertical ramp between the
 * two true adjacent colours (light ↔ navy), so each navy band reads as a
 * "pool" the page sinks into and rises out of — symmetric at top and bottom.
 * There are no thin blurred bands and no backdrop-filter blur: the seam is a
 * pure-CSS layered gradient.
 *
 * Render it as the FIRST child inside a `position:relative` section, anchored
 * to the section's top or bottom edge. The section's real content must sit in
 * a `position:relative; zIndex:1` wrapper so text paints above the seam.
 *
 * Layer 1 — the two-colour linear ramp (top→bottom in visual order).
 * Layer 2 — a wide, low-opacity radial "junction glow" of the LIGHTER colour
 *           bleeding toward the boundary. Felt, not seen as a band.
 */

type Props = {
  /** Which edge of the host section the seam is anchored to. */
  edge: "top" | "bottom";
  /** Top colour of the ramp (visual order). For a "top" seam this is navy. */
  from: string;
  /** Bottom colour of the ramp (visual order). For a "bottom" seam this is navy. */
  to: string;
  /** Ramp height in px. */
  height?: number;
  /**
   * Override the junction glow colour. Accepts a hex or an already-built rgba.
   * Defaults to the lighter of from/to (by sRGB luminance) at ~0.5 alpha.
   */
  glow?: string;
};

/** Parse a #rgb or #rrggbb hex into [r,g,b] (0–255). */
function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Relative sRGB luminance (Rec. 709 coefficients) for a hex colour. */
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** The lighter of two hex colours by sRGB luminance. */
function lighterOf(a: string, b: string): string {
  return luminance(a) >= luminance(b) ? a : b;
}

/** Convert a hex colour to an rgba string at the given alpha. */
function hexToRgba(hex: string, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function SectionSeam({
  edge,
  from,
  to,
  height = 240,
  glow,
}: Props) {
  // If the caller passed a glow, use it verbatim (may already be rgba);
  // otherwise pick the lighter ramp colour and render it at ~0.5 alpha.
  const glowColor = glow ?? hexToRgba(lighterOf(from, to), 0.5);
  const glowAnchor = edge === "top" ? "0%" : "100%";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        [edge]: 0,
        height,
        pointerEvents: "none",
        zIndex: 0,
        background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`,
      }}
    >
      {/* Junction glow — a wide, soft radial of the lighter colour bleeding
          toward the boundary so the seam is felt, not seen as a hard band. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(140% 75% at 50% ${glowAnchor}, ${glowColor}, transparent 72%)`,
        }}
      />
    </div>
  );
}
