import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, Section, CardGrid, Card, CTASection, Eyebrow } from "@/components/ui";
import {
  COMPARISONS,
  getComparison,
  type Comparison,
} from "@/lib/content/comparisons";
import { serviceSchema, breadcrumbSchema, absoluteUrl, socialMeta } from "@/lib/seo";
import { color, inkA } from "@/lib/theme";

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cmp = getComparison(slug);
  if (!cmp) return {};
  return {
    title: cmp.title,
    description: cmp.metaDescription,
    ...socialMeta({
      title: cmp.title,
      description: cmp.metaDescription,
      path: `/compare/${slug}`,
    }),
  };
}

/**
 * The comparison table — bespoke semantic markup (the UI kit has no table
 * component). Theme tokens keep it on-brand; it stays readable on mobile by
 * scrolling horizontally inside its container.
 */
function ComparisonTable({ cmp }: { cmp: Comparison }) {
  const headCell: React.CSSProperties = {
    textAlign: "left",
    verticalAlign: "top",
    padding: "20px 22px",
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: "0.02em",
    color: color.ink,
    borderBottom: `2px solid ${color.brand}`,
  };
  const dimCell: React.CSSProperties = {
    verticalAlign: "top",
    padding: "20px 22px",
    fontSize: 14.5,
    fontWeight: 700,
    color: color.ink,
    borderBottom: `1px solid ${inkA(0.1)}`,
    width: "22%",
  };
  const bodyCell: React.CSSProperties = {
    verticalAlign: "top",
    padding: "20px 22px",
    fontSize: 14.5,
    lineHeight: 1.55,
    color: inkA(0.74),
    borderBottom: `1px solid ${inkA(0.1)}`,
  };

  return (
    <div style={{ overflowX: "auto", borderRadius: 16, border: `1px solid ${inkA(0.1)}`, background: "#fff" }}>
      <table
        style={{
          width: "100%",
          minWidth: 720,
          borderCollapse: "collapse",
          fontFamily: "inherit",
        }}
      >
        <caption className="sr-only">
          {cmp.optionA.name} compared with {cmp.optionB.name} across key dimensions.
        </caption>
        <thead>
          <tr>
            <th scope="col" style={headCell}>
              Dimension
            </th>
            <th scope="col" style={headCell}>
              {cmp.optionA.name}
            </th>
            <th scope="col" style={headCell}>
              {cmp.optionB.name}
            </th>
          </tr>
        </thead>
        <tbody>
          {cmp.rows.map((row) => (
            <tr key={row.dimension}>
              <th scope="row" style={dimCell}>
                {row.dimension}
              </th>
              <td style={bodyCell}>{row.a}</td>
              <td style={bodyCell}>{row.b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cmp = getComparison(slug);

  // generateStaticParams enumerates every valid slug, so this is defensive only.
  if (!cmp) {
    return (
      <Section tone="paper">
        <p style={{ color: inkA(0.7) }}>Comparison not found.</p>
      </Section>
    );
  }

  const schema = serviceSchema({
    name: cmp.h1,
    description: cmp.metaDescription,
    url: absoluteUrl(`/compare/${slug}`),
  });

  const trail = [
    { label: "Home", href: "/" },
    { label: "Compare", href: "/compare" },
    { label: cmp.h1, href: `/compare/${slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema(
              trail.map((t) => ({ name: t.label, url: absoluteUrl(t.href) })),
            ),
          ),
        }}
      />

      <PageHero eyebrow="Compare" title={cmp.h1} lede={cmp.intro} breadcrumbs={trail} />

      {/* Back-to-hub text link, near the top. */}
      <div
        className="mx-auto w-full max-w-[1340px] px-6 md:px-10 lg:px-[50px]"
        style={{ paddingTop: 8, paddingBottom: 8 }}
      >
        <Link
          href="/compare"
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: color.brand,
            textDecoration: "none",
          }}
        >
          ← All comparisons
        </Link>
      </div>

      {/* The two options, side by side, before the table. */}
      <Section tone="paper2">
        <Eyebrow label="The two options" tone="brand" style={{ marginBottom: 40 }} />
        <CardGrid columns={2}>
          <Card kicker="Option A" title={cmp.optionA.name} desc={cmp.optionA.summary} />
          <Card kicker="Option B" title={cmp.optionB.name} desc={cmp.optionB.summary} />
        </CardGrid>
      </Section>

      {/* Comparison table. */}
      <Section tone="paper">
        <Eyebrow label="Side by side" tone="brand" style={{ marginBottom: 40 }} />
        <h2
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 500,
            fontSize: "clamp(28px,3vw,40px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: color.ink,
            maxWidth: "22ch",
            marginBottom: 40,
          }}
        >
          {cmp.optionA.name} vs {cmp.optionB.name}, dimension by dimension
        </h2>
        <ComparisonTable cmp={cmp} />
      </Section>

      {/* Honest verdict — when each option wins. */}
      <Section tone="ink">
        <Eyebrow label="The honest verdict" tone="azure" style={{ marginBottom: 32 }} />
        <h2
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 500,
            fontSize: "clamp(28px,3vw,40px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: color.mist,
            maxWidth: "20ch",
            marginBottom: 28,
          }}
        >
          When each one wins
        </h2>
        <p
          style={{
            fontSize: "clamp(17px,1.5vw,20px)",
            lineHeight: 1.6,
            color: "rgba(234,241,251,0.82)",
            maxWidth: "62ch",
          }}
        >
          {cmp.verdict}
        </p>
      </Section>

      {/* Related comparisons + pillar + contact. */}
      <Section tone="paper">
        <Eyebrow label="Related" tone="brand" style={{ marginBottom: 48 }} />
        <CardGrid columns={3}>
          {cmp.related.map((r) => (
            <Card key={r.href} href={r.href} kicker="Compare" title={r.label} />
          ))}
          <Card
            href="/ai-consulting"
            kicker="Service"
            title="AI consulting"
            desc="Strategy and production engineering in one continuous engagement."
          />
          <Card
            href="/contact"
            kicker="Talk to us"
            title="Start a conversation"
            desc="Bring us the metric you need to move and we'll tell you what we'd build."
          />
        </CardGrid>
      </Section>

      <CTASection
        title="Still weighing the trade-off?"
        body="We'll give you a straight answer about which model fits your problem — even when that answer isn't us."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "Explore AI consulting", href: "/ai-consulting" }}
        shader
      />
    </>
  );
}
