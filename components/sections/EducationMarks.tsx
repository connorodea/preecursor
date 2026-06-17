/**
 * EducationMarks — the universities where Preecursor's co-founders studied,
 * shown as an honest credential strip (a small emblem + the institution name).
 *
 * The emblem is a single original shield glyph with a soft top gloss, recoloured
 * per school in that school's brand colour — a clean, original treatment (not a
 * reproduction of any institution's crest or seal) that signals the affiliation.
 * The recognisable element is the institution name; colours aid quick reading on
 * the dark band.
 */

type School = { name: string; mark: string };

// Brand-derived accent colours chosen to stay legible on the navy band.
const SCHOOLS: School[] = [
  { name: "University of Michigan", mark: "#ffcb05" }, // maize
  { name: "Columbia University", mark: "#9fc2e8" }, // Columbia blue (light)
  { name: "Harvard University", mark: "#e0697a" }, // crimson, lightened for navy
  { name: "Johns Hopkins University", mark: "#68ace5" }, // Hopkins spirit blue
  { name: "UC Berkeley", mark: "#fdb515" }, // California gold
];

function ShieldEmblem({ fill }: { fill: string }) {
  return (
    <svg
      width="26"
      height="30"
      viewBox="0 0 24 28"
      aria-hidden="true"
      role="presentation"
    >
      <path
        d="M12 1 23 5v9c0 7-5 11-11 13C6 25 1 21 1 14V5Z"
        fill={fill}
      />
      {/* soft top gloss for a little dimensionality */}
      <path d="M12 1 23 5v5c-5 2.4-17 2.4-22 0V5Z" fill="#ffffff" opacity="0.2" />
    </svg>
  );
}

export default function EducationMarks({
  textColor = "#eaf1fb",
}: {
  textColor?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px 30px",
        flexWrap: "wrap",
      }}
    >
      {SCHOOLS.map((s) => (
        <div
          key={s.name}
          style={{ display: "flex", alignItems: "center", gap: 14 }}
        >
          <ShieldEmblem fill={s.mark} />
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
            {s.name}
          </span>
        </div>
      ))}
    </div>
  );
}
