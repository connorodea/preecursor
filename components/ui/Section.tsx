/**
 * Section — a full-bleed page section with a tone-driven background and the
 * standard centered content column.
 *
 * Paper tones render a flat surface; the two ink tones use the signature
 * inkBand gradient and flip text to mist. Inner padding defaults to the
 * prototype's 108px block / 50px inline rhythm.
 *
 * Pure presentational — safe as a server component.
 */

import type { ReactNode } from "react";
import { color, gradient, container } from "@/lib/theme";

type Tone = "paper" | "paper2" | "paper3" | "ink" | "inkDeep";

type Props = {
  children: ReactNode;
  tone?: Tone;
  id?: string;
  /** Vertical padding in px (block). Defaults to 108. */
  py?: number;
  className?: string;
  style?: React.CSSProperties;
};

const isDark = (tone: Tone) => tone === "ink" || tone === "inkDeep";

function background(tone: Tone): string {
  switch (tone) {
    case "paper":
      return color.paper;
    case "paper2":
      return color.paper2;
    case "paper3":
      return color.paper3;
    case "ink":
      return gradient.inkBand();
    case "inkDeep":
      // Same signature band, anchored to the deeper base.
      return `radial-gradient(130% 150% at 82% -10%, #1a356180, transparent 55%), ${color.inkDeep}`;
  }
}

export default function Section({
  children,
  tone = "paper",
  id,
  py = 108,
  className,
  style,
}: Props) {
  return (
    <section
      id={id}
      className={className}
      style={{
        background: background(tone),
        color: isDark(tone) ? color.mist : color.ink,
        ...style,
      }}
    >
      <div className={container} style={{ padding: `${py}px 50px` }}>
        {children}
      </div>
    </section>
  );
}
