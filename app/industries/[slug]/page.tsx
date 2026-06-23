import type { Metadata } from "next";
import PlaceholderImage from "@/components/PlaceholderImage";
import {
  PageHero,
  Section,
  ContentSplit,
  RevealGrid,
  Card,
  FeatureRows,
  CTASection,
  Eyebrow,
} from "@/components/ui";
import { INDUSTRY_LEAVES } from "@/lib/ia";
import { getIndustry } from "@/lib/content/services";
import { breadcrumbSchema, absoluteUrl } from "@/lib/seo";

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

  const trail = [
    { label: "Home", href: "/" },
    { label: "Industries", href: "/industries" },
    { label, href: `/industries/${slug}` },
  ];

  return (
    <>
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

      <PageHero
        eyebrow="Industries"
        title={c.title}
        lede={c.lede}
        breadcrumbs={trail}
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

      {/* A metrics band would go here, but we publish no invented figures,
          so it is intentionally omitted. */}

      <Section tone="paper">
        <Eyebrow
          label="Related capabilities"
          tone="brand"
          style={{ marginBottom: 48 }}
        />
        <RevealGrid columns={3}>
          {c.related.map((r) => (
            <Card
              key={r.href}
              href={r.href}
              kicker="Capability"
              title={r.label}
            />
          ))}
        </RevealGrid>
      </Section>

      <CTASection
        title={`Put AI to work in ${label.toLowerCase()}`}
        body={`Tell us the number that matters most in ${label.toLowerCase()} right now, and we'll tell you what we'd build to move it — and what that's worth.`}
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "See our work", href: "/work" }}
        shader
      />
    </>
  );
}
