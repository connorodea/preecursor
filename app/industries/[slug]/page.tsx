import type { Metadata } from "next";
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
import { getIndustry } from "@/lib/content/services";

export function generateStaticParams() {
  return INDUSTRY_LEAVES.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getIndustry(slug);
  return { title: c.title, description: c.lede };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getIndustry(slug);
  const label = INDUSTRY_LEAVES.find((l) => l.slug === slug)?.label ?? c.title;

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title={c.title}
        lede={c.lede}
        cta={{ label: "Start a conversation", href: "/contact" }}
      />

      <ContentSplit
        eyebrow="Overview"
        title={`Where AI earns its place in ${label}`}
        body={c.overview}
        media={
          <PlaceholderImage
            seed={`ind-${slug}`}
            variant="dark"
            style={{ position: "absolute", inset: 0 }}
          />
        }
      />

      <Section tone="paper2">
        <Eyebrow label="What we do" tone="brand" style={{ marginBottom: 48 }} />
        <FeatureRows rows={c.approach} />
      </Section>

      <StatBand eyebrow="By the numbers" stats={c.stats} />

      <Section tone="paper">
        <Eyebrow
          label="Related capabilities"
          tone="brand"
          style={{ marginBottom: 48 }}
        />
        <CardGrid columns={3}>
          {c.related.map((r) => (
            <Card
              key={r.href}
              href={r.href}
              kicker="Capability"
              title={r.label}
            />
          ))}
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
