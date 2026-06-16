/**
 * Design tokens as TypeScript constants.
 *
 * The handoff is built almost entirely from inline styles with very specific
 * values (exact rgba overlays, clamp() type ramps, precise paddings). To hit
 * pixel fidelity we reuse those values directly via these constants rather than
 * approximating them with Tailwind's scale. Tailwind handles layout/spacing
 * utilities; these handle brand color + the bespoke values.
 */

export const color = {
  paper: "#edf1f7",
  paper2: "#e1e8f1",
  paper3: "#e6eefb",
  ink: "#112138",
  inkDeep: "#0b1322",
  brand: "#1b4fc7",
  azure: "#5b8def",
  azureLight: "#7fa6f2",
  cyan: "#5fc8e8",
  mist: "#eaf1fb",
} as const;

/** Ink at an alpha — the prototype's most common text tints. */
export const inkA = (a: number) => `rgba(17,33,56,${a})`;
/** Mist (on-dark text) at an alpha. */
export const mistA = (a: number) => `rgba(234,241,251,${a})`;

/** Signature gradients reused across hero / contact / cards. */
export const gradient = {
  /** Hero & contact light wash. */
  heroWash: "linear-gradient(125deg,#d8e6f7 0%,#e6eefb 42%,#d2e4f5 100%)",
  /** Dark band with a soft blue corner glow. */
  inkBand: (corner = "82% -10%") =>
    `radial-gradient(130% 150% at ${corner}, #1a356180, transparent 55%), ${color.ink}`,
  /** Multiply overlay laid over imagery so white cards stay legible. */
  cardOverlay:
    "linear-gradient(155deg,rgba(27,79,199,0.5),rgba(95,200,232,0.26) 55%,rgba(17,33,56,0.44))",
} as const;

/** Layered navy shadows used on glass + cards. */
export const shadow = {
  nav: "0 8px 30px rgba(17,33,56,0.10)",
  glass: "0 16px 40px rgba(17,33,56,0.18)",
  card: "0 26px 52px -20px rgba(17,33,56,0.34)",
  cardLg: "0 30px 70px -28px rgba(17,33,56,0.4)",
  cta: "0 14px 34px rgba(91,141,239,0.42)",
  ctaBrand: "0 12px 30px rgba(27,79,199,0.30)",
} as const;

/** The frosted-glass surface used by nav pills and floating cards. */
export const glass = (alpha = 0.62) => ({
  background: `rgba(255,255,255,${alpha})`,
  backdropFilter: "blur(18px) saturate(1.3)",
  WebkitBackdropFilter: "blur(18px) saturate(1.3)",
  border: "1px solid rgba(255,255,255,0.55)",
});

/** Standard centered content column. */
export const container = "mx-auto w-full max-w-[1340px]";
