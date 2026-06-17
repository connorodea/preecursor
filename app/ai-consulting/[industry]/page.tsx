import type { Metadata } from "next";
import Link from "next/link";
import PlaceholderImage from "@/components/PlaceholderImage";
import {
  PageHero,
  Section,
  ContentSplit,
  CardGrid,
  Card,
  StatBand,
  FeatureRows,
  CTASection,
  Eyebrow,
} from "@/components/ui";
import { INDUSTRY_LEAVES } from "@/lib/ia";
import { industrySpoke } from "@/lib/content/programmatic";
import { serviceSchema, absoluteUrl } from "@/lib/seo";
import { color } from "@/lib/theme";

export function generateStaticParams() {
  return INDUSTRY_LEAVES.map((l) => ({ industry: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>;
}): Promise<Metadata> {
  const { industry } = await params;
  const spoke = industrySpoke(industry);
  return {
    title: spoke.title,
    description: spoke.metaDescription,
    alternates: { canonical: absoluteUrl(`/ai-consulting/${industry}`) },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ industry: string }>;
}) {
  const { industry } = await params;
  const spoke = industrySpoke(industry);
  const { label, content } = spoke;

  const schema = serviceSchema({
    name: `AI consulting for ${label}`,
    description: spoke.metaDescription,
    url: absoluteUrl(`/ai-consulting/${industry}`),
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <PageHero
        eyebrow="AI consulting"
        title={spoke.h1}
        lede={content.lede}
        cta={{ label: "Start a conversation", href: "/contact" }}
      />

      {/* Back-to-pillar text link, near the top. */}
      <div
        className="mx-auto w-full max-w-[1340px] px-6 md:px-10 lg:px-[50px]"
        style={{ paddingTop: 8, paddingBottom: 8 }}
      >
        <Link
          href="/ai-consulting"
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: color.brand,
            textDecoration: "none",
          }}
        >
          ← All AI consulting services
        </Link>
      </div>

      <ContentSplit
        eyebrow="Overview"
        title={`Where AI earns its place in ${label}`}
        body={content.overview}
        media={
          <PlaceholderImage
            seed={`aic-${industry}`}
            variant="dark"
            style={{ position: "absolute", inset: 0 }}
          />
        }
      />

      <Section tone="paper2">
        <Eyebrow label="What we build" tone="brand" style={{ marginBottom: 48 }} />
        <FeatureRows rows={content.approach} />
      </Section>

      <StatBand eyebrow="By the numbers" stats={content.stats} />

      <Section tone="paper">
        <Eyebrow label="Related" tone="brand" style={{ marginBottom: 48 }} />
        <CardGrid columns={3}>
          {/* The matching deep sector overview. */}
          <Card
            href={`/industries/${spoke.slug}`}
            kicker="Industry"
            title={`${label} overview`}
            desc={`How we put AI to work across ${label.toLowerCase()} — the full sector view.`}
          />

          {/* Related capabilities pulled from the industry's own content. */}
          {content.related.map((r) => (
            <Card key={r.href} href={r.href} kicker="Capability" title={r.label} />
          ))}

          {/* Back to the AI consulting pillar. */}
          <Card
            href="/ai-consulting"
            kicker="Service"
            title="AI consulting"
            desc="Strategy and production engineering in one continuous engagement."
          />
        </CardGrid>
      </Section>

      <CTASection
        title={`Put AI to work in ${label.toLowerCase()}`}
        body="Bring us the metric you need to move. We will tell you what we would build, how long it takes, and what it is worth."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "See our work", href: "/work" }}
        shader
      />
    </>
  );
}
