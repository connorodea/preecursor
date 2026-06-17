/**
 * SiteFooter — the global footer (navy band).
 *
 * Server component. All links come from `FOOTER` in `lib/ia.ts`. Hover color
 * shifts are handled by Tailwind utility classes that resolve to the azure
 * brand token, so no client JS is needed here.
 */

import Link from "next/link";
import { FOOTER } from "@/lib/ia";
import { color, mistA, container } from "@/lib/theme";
import BrandMark from "@/components/BrandMark";
import { PILLARS } from "@/lib/content/programmatic";

const SERVICE_LINKS = Object.values(PILLARS).map((p) => ({
  label: p.eyebrow,
  href: `/${p.slug}`,
}));

const COLUMN_LABEL: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: mistA(0.5),
  marginBottom: 20,
};

const FOOTER_LINK: React.CSSProperties = {
  color: mistA(0.82),
  fontSize: 15,
  textDecoration: "none",
};

function FooterColumn({
  label,
  links,
}: {
  label: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <div style={COLUMN_LABEL}>{label}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={FOOTER_LINK}
            className="transition-colors hover:text-azure"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer style={{ background: color.ink, color: color.mist }}>
      <div className={`${container} px-6 pt-16 pb-11 md:px-10 lg:px-[50px]`}>
        {/* Top: brand + three link columns */}
        <div
          className="grid grid-cols-2 gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]"
          style={{
            paddingBottom: 48,
            borderBottom: `1px solid ${mistA(0.18)}`,
          }}
        >
          {/* Brand column — spans both columns on mobile, one cell at lg. */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label="Preecursor — home"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                textDecoration: "none",
              }}
            >
              <BrandMark size={30} variant="reversed" />
              <span
                style={{
                  fontWeight: 800,
                  fontSize: 22,
                  letterSpacing: "0.18em",
                  color: color.mist,
                }}
              >
                PREECURSOR
              </span>
            </Link>
            <p
              style={{
                marginTop: 22,
                marginBottom: 0,
                fontSize: 15.5,
                lineHeight: 1.55,
                color: mistA(0.6),
                maxWidth: "30ch",
              }}
            >
              An applied-AI studio for leaders who need more than advice.
            </p>
          </div>

          <FooterColumn label="AI Consulting" links={SERVICE_LINKS} />
          <FooterColumn label="Firm" links={FOOTER.firm} />
          <FooterColumn label="Industries" links={FOOTER.industries} />
          <FooterColumn label="Contact" links={FOOTER.contact} />
        </div>

        {/* Bottom bar */}
        <div
          style={{
            paddingTop: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 13.5, color: mistA(0.5) }}>
            © 2026 Preecursor Intelligence, Inc. All rights reserved.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <span style={{ fontSize: 13.5, color: mistA(0.5) }}>Privacy</span>
            <span style={{ fontSize: 13.5, color: mistA(0.5) }}>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
