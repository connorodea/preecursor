import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { color, inkA, gradient, container } from "@/lib/theme";

// Server-rendered (static-export → 404.html). Plain styled links keep it
// dependency- and client-JS-free.
const RECOVERY = [
  { label: "AI consulting", href: "/ai-consulting" },
  { label: "Industries", href: "/industries" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Our work", href: "/work" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

const PILL: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  borderRadius: 999,
  padding: "11px 22px",
  fontSize: 15,
  fontWeight: 600,
  textDecoration: "none",
};

export default function NotFound() {
  return (
    <section
      style={{
        background: gradient.heroWash,
        minHeight: "82vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className={`${container} px-6 py-28 md:px-10 lg:px-[50px]`}
        style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <BrandMark size={46} variant="color" />

        <div
          style={{
            marginTop: 30,
            fontSize: 12.5,
            fontWeight: 700,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: color.azure,
          }}
        >
          404 — Page not found
        </div>

        <h1
          style={{
            marginTop: 18,
            fontFamily: "var(--font-newsreader)",
            fontWeight: 500,
            fontSize: "clamp(36px,5vw,64px)",
            lineHeight: 1.02,
            letterSpacing: "-0.025em",
            color: color.ink,
            maxWidth: "18ch",
            textWrap: "balance",
          }}
        >
          This page took a different path.
        </h1>

        <p
          style={{
            marginTop: 22,
            fontSize: "clamp(17px,1.4vw,20px)",
            lineHeight: 1.55,
            color: inkA(0.7),
            maxWidth: "52ch",
          }}
        >
          The link may be broken or the page may have moved. Here&rsquo;s where
          to pick back up.
        </p>

        <Link
          href="/"
          style={{
            ...PILL,
            marginTop: 38,
            background: color.ink,
            color: color.mist,
            padding: "14px 30px",
          }}
        >
          Back to home →
        </Link>

        <div
          style={{
            marginTop: 30,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "center",
            maxWidth: "44rem",
          }}
        >
          {RECOVERY.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="transition-colors hover:border-ink"
              style={{
                ...PILL,
                color: color.ink,
                border: `1.5px solid ${inkA(0.28)}`,
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
