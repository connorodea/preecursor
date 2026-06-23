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
import { CAPABILITY_LEAVES } from "@/lib/ia";
import { getCapability } from "@/lib/content/services";
import { breadcrumbSchema, absoluteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return CAPABILITY_LEAVES.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCapability(slug);
  return { title: c.title, description: c.lede };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCapability(slug);
  const label = CAPABILITY_LEAVES.find((l) => l.slug === slug)?.label ?? c.title;

  const trail = [
    { label: "Home", href: "/" },
    { label: "Capabilities", href: "/capabilities" },
    { label, href: `/capabilities/${slug}` },
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
        eyebrow="Capabilities"
        title={c.title}
        lede={c.lede}
        breadcrumbs={trail}
        cta={{ label: "Start a conversation", href: "/contact" }}
      />

      <ContentSplit
        eyebrow="Overview"
        title={`Where ${label.toLowerCase()} earns its place`}
        body={c.overview}
        media={
          <PlaceholderImage
            seed={`cap-${slug}`}
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
        <Eyebrow label="Related work" tone="brand" style={{ marginBottom: 48 }} />
        <RevealGrid columns={3}>
          {c.related.map((r) => (
            <Card
              key={r.href}
              href={r.href}
              kicker={r.href.startsWith("/industries") ? "Industry" : "Capability"}
              title={r.label}
            />
          ))}
        </RevealGrid>
      </Section>

      <CTASection
        title="Let's put this to work"
        body="Tell us the outcome you are aiming at. We will scope the build, the timeline, and what it is worth — candidly."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "See our work", href: "/work" }}
        shader
      />
    </>
  );
}
