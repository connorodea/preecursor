/**
 * EducationMarks — the two universities where Preecursor's co-founders earned
 * their master's degrees, shown as a small honest credential lockup (emblem +
 * institution name). Emblems are simple original SVG glyphs (a block "M" and a
 * coronet) tuned to read on the dark People band; the wordmark uses the site
 * serif. Recolour via the `tone` prop so the same marks work on light or dark.
 */

type Tone = { emblemMaize: string; emblemLight: string; text: string };

const DARK: Tone = {
  emblemMaize: "#ffcb05", // Michigan maize
  emblemLight: "#9fc2e8", // soft Columbia blue, legible on navy
  text: "#eaf1fb", // mist
};

function Lockup({
  emblem,
  name,
  textColor,
}: {
  emblem: React.ReactNode;
  name: string;
  textColor: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
      {emblem}
      <span
        style={{
          fontFamily: "var(--font-newsreader)",
          fontSize: 19,
          lineHeight: 1.05,
          letterSpacing: "-0.005em",
          color: textColor,
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </span>
    </div>
  );
}

/** Simplified block-M emblem (original geometric rendering). */
function MichiganEmblem({ fill }: { fill: string }) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 100 100"
      aria-hidden="true"
      role="presentation"
    >
      <path
        d="M6 88V12h22l22 30 22-30h22v76H72V44L55 67H45L28 44v44Z"
        fill={fill}
      />
    </svg>
  );
}

/** Simplified coronet emblem (original geometric rendering). */
function ColumbiaEmblem({ fill }: { fill: string }) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 100 100"
      aria-hidden="true"
      role="presentation"
    >
      {/* small cross atop the centre point */}
      <path d="M46 6h8v9h9v8h-9v9h-8v-9h-9v-8h9Z" fill={fill} />
      {/* coronet: zig-zag points rising from a base band */}
      <path
        d="M12 70 L26 40 L40 62 L50 36 L60 62 L74 40 L88 70 Z"
        fill={fill}
      />
      <rect x="14" y="72" width="72" height="13" rx="2" fill={fill} />
    </svg>
  );
}

export default function EducationMarks({ tone = DARK }: { tone?: Tone }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 40,
        flexWrap: "wrap",
      }}
    >
      <Lockup
        emblem={<MichiganEmblem fill={tone.emblemMaize} />}
        name="University of Michigan"
        textColor={tone.text}
      />
      <Lockup
        emblem={<ColumbiaEmblem fill={tone.emblemLight} />}
        name="Columbia University"
        textColor={tone.text}
      />
    </div>
  );
}
