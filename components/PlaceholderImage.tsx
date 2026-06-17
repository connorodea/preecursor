/**
 * PlaceholderImage — deterministic, on-brand abstract artwork that stands in
 * for real photography (replaces the handoff's `image-slot` drop zones).
 *
 * Seeded by a string id so a given slot always renders the same composition.
 * Pure render (no client JS): soft aurora-silk gradient blobs warped by SVG
 * turbulence, in the brand blue palette — meshing with the animated hero field.
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

  const base1 = dark ? "#0a1424" : "#e9f0fb";
  const base2 = dark ? "#173461" : "#cfe0f6";

  // Aurora glow colours (blue family, no green) — pick 3 in a seeded order.
  const palette = dark
    ? ["#5fc8e8", "#4f8ef0", "#8f86ef", "#7fb0f5"]
    : ["#7fa6f2", "#5fc8e8", "#8fb8f0", "#9aa8f2"];
  const pick = () => palette[Math.floor(rand() * palette.length)];
  const cA = pick();
  const cB = pick();
  const cC = pick();

  // Seeded blob placements.
  const blob = () => ({
    cx: (12 + rand() * 76).toFixed(1),
    cy: (10 + rand() * 80).toFixed(1),
    r: (44 + rand() * 30).toFixed(1),
  });
  const b1 = blob();
  const b2 = blob();
  const b3 = blob();

  const tseed = Math.floor(rand() * 100);
  const bfx = (0.009 + rand() * 0.006).toFixed(4);
  const bfy = (0.012 + rand() * 0.008).toFixed(4);
  const angle = Math.floor(95 + rand() * 70);
  const glowOpacity = dark ? 0.85 : 0.7;

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
        <linearGradient
          id={`${uid}-base`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
          gradientTransform={`rotate(${angle - 125} 0.5 0.5)`}
        >
          <stop offset="0" stopColor={base1} />
          <stop offset="1" stopColor={base2} />
        </linearGradient>

        {[
          { id: "a", c: cA, ...b1 },
          { id: "b", c: cB, ...b2 },
          { id: "c", c: cC, ...b3 },
        ].map((g) => (
          <radialGradient
            key={g.id}
            id={`${uid}-${g.id}`}
            cx={`${g.cx}%`}
            cy={`${g.cy}%`}
            r={`${g.r}%`}
          >
            <stop offset="0" stopColor={g.c} stopOpacity={glowOpacity} />
            <stop offset="0.55" stopColor={g.c} stopOpacity={glowOpacity * 0.35} />
            <stop offset="1" stopColor={g.c} stopOpacity="0" />
          </radialGradient>
        ))}

        {/* Warp the soft blobs into flowing silk ribbons. */}
        <filter
          id={`${uid}-silk`}
          x="-25%"
          y="-25%"
          width="150%"
          height="150%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency={`${bfx} ${bfy}`}
            numOctaves="3"
            seed={tseed}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="125"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <rect width="800" height="600" fill={`url(#${uid}-base)`} />
      <g filter={`url(#${uid}-silk)`}>
        <rect x="-120" y="-120" width="1040" height="840" fill={`url(#${uid}-a)`} />
        <rect x="-120" y="-120" width="1040" height="840" fill={`url(#${uid}-b)`} />
        <rect x="-120" y="-120" width="1040" height="840" fill={`url(#${uid}-c)`} />
      </g>
      {/* Soft vignette for depth. */}
      <rect
        width="800"
        height="600"
        fill={dark ? "#0a1424" : "#e9f0fb"}
        opacity={dark ? 0.18 : 0.12}
        style={{ mixBlendMode: "multiply" }}
      />
    </svg>
  );
}
