/**
 * PlaceholderImage — deterministic, on-brand abstract artwork that stands in
 * for real photography (replaces the handoff's `image-slot` drop zones).
 *
 * Seeded by a string id so a given slot always renders the same composition.
 * Pure render (no client JS): a navy/paper field with brand-blue radial glows
 * and one of four faint geometric motifs. Most slots sit under a multiply
 * overlay, so these read as rich, intentional imagery rather than gradients.
 *
 * Swappable later: drop a real <img>/next-image in the same slot.
 */

type Variant = "dark" | "light";

type Props = {
  /** Stable id — same id ⇒ same artwork. */
  seed: string;
  variant?: Variant;
  className?: string;
  style?: React.CSSProperties;
};

/** Deterministic 32-bit hash of a string. */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Seeded PRNG (mulberry32) → deterministic floats in [0,1). */
function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function PlaceholderImage({
  seed,
  variant = "dark",
  className,
  style,
}: Props) {
  const rand = rng(hash(seed));
  const uid = `ph-${hash(seed).toString(36)}`;

  const dark = variant === "dark";
  const base1 = dark ? "#0b1322" : "#e6eefb";
  const base2 = dark ? "#16294a" : "#d2e4f5";
  const glowA = dark ? "#5fc8e8" : "#7fa6f2"; // cyan / azure-light
  const glowB = dark ? "#1b4fc7" : "#5fc8e8";
  const line = dark ? "rgba(234,241,251,0.5)" : "rgba(17,33,56,0.4)";

  // Seeded glow placements.
  const gx1 = (18 + rand() * 64).toFixed(1);
  const gy1 = (14 + rand() * 40).toFixed(1);
  const gx2 = (40 + rand() * 55).toFixed(1);
  const gy2 = (55 + rand() * 40).toFixed(1);
  const angle = Math.floor(95 + rand() * 60);
  const motif = Math.floor(rand() * 4);

  return (
    <svg
      className={className}
      style={{ display: "block", width: "100%", height: "100%", ...style }}
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${uid}-base`} x1="0" y1="0" x2="1" y2="1"
          gradientTransform={`rotate(${angle - 125} 0.5 0.5)`}>
          <stop offset="0" stopColor={base1} />
          <stop offset="1" stopColor={base2} />
        </linearGradient>
        <radialGradient id={`${uid}-a`} cx={`${gx1}%`} cy={`${gy1}%`} r="55%">
          <stop offset="0" stopColor={glowA} stopOpacity={dark ? 0.5 : 0.45} />
          <stop offset="0.6" stopColor={glowA} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-b`} cx={`${gx2}%`} cy={`${gy2}%`} r="50%">
          <stop offset="0" stopColor={glowB} stopOpacity={dark ? 0.45 : 0.35} />
          <stop offset="0.62" stopColor={glowB} stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="600" fill={`url(#${uid}-base)`} />
      <rect width="800" height="600" fill={`url(#${uid}-a)`} />
      <rect width="800" height="600" fill={`url(#${uid}-b)`} />

      <g stroke={line} fill="none" opacity={dark ? 0.18 : 0.22}>
        {motif === 0 &&
          // diagonal hatch
          Array.from({ length: 26 }, (_, i) => (
            <line key={i} x1={-200 + i * 50} y1="600" x2={200 + i * 50} y2="0" strokeWidth="1" />
          ))}
        {motif === 1 &&
          // concentric rings
          Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx={Number(gx2) * 8} cy={Number(gy2) * 6} r={40 + i * 46} strokeWidth="1" />
          ))}
        {motif === 2 &&
          // dot grid
          Array.from({ length: 88 }, (_, i) => (
            <circle
              key={i}
              cx={40 + (i % 11) * 72}
              cy={40 + Math.floor(i / 11) * 72}
              r="2.4"
              fill={line}
              stroke="none"
            />
          ))}
        {motif === 3 &&
          // rotated-square lattice
          Array.from({ length: 18 }, (_, i) => {
            const x = 80 + (i % 6) * 130;
            const y = 90 + Math.floor(i / 6) * 150;
            return <rect key={i} x={x} y={y} width="64" height="64" strokeWidth="1" transform={`rotate(45 ${x + 32} ${y + 32})`} />;
          })}
      </g>
    </svg>
  );
}
