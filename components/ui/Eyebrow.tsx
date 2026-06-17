/**
 * Eyebrow — the small horizontal bar + uppercase micro-label that prefaces
 * nearly every section header in the design language.
 *
 * Generalizes the local `Eyebrow` in components/sections/_shared.tsx into a
 * tone-driven, reusable primitive. `tone="brand"` (default) reads on paper
 * backgrounds; `tone="azure"` reads on the dark ink bands.
 *
 * Pure presentational — safe as a server component.
 */

import { color } from "@/lib/theme";

type Tone = "brand" | "azure";

type Props = {
  label: string;
  /** brand (default, for paper) · azure (for dark sections). */
  tone?: Tone;
  className?: string;
  style?: React.CSSProperties;
};

export default function Eyebrow({
  label,
  tone = "brand",
  className,
  style,
}: Props) {
  const c = tone === "azure" ? color.azure : color.brand;
  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", gap: 14, ...style }}
    >
      <span
        aria-hidden="true"
        style={{ width: 34, height: 1, background: c, flex: "0 0 auto" }}
      />
      <span
        style={{
          fontSize: 12.5,
          fontWeight: 700,
          letterSpacing: "0.24em",
          color: c,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}
