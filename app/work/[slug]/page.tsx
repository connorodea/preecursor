import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PlaceholderImage from "@/components/PlaceholderImage";
import {
  PageHero,
  Section,
  ContentSplit,
  StatBand,
  FeatureRows,
  CTASection,
  Eyebrow,
} from "@/components/ui";
import { WORK_CASES, getCase } from "@/lib/content/work";
import { breadcrumbSchema, absoluteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return WORK_CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return { title: "Client impact" };
  return { title: c.headline, description: c.summary };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();

  const trail = [
    { label: "Home", href: "/" },
    { label: "Work", href: "/work" },
    { label: c.headline, href: `/work/${slug}` },
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
        eyebrow={c.sector}
        title={c.headline}
        lede={c.summary}
        breadcrumbs={trail}
        cta={{ label: "Start a conversation", href: "/contact" }}
        secondaryCta={{ label: "See more work", href: "/work" }}
      />

      <ContentSplit
        eyebrow="The challenge"
        title="What stood in the way"
        body={c.challenge}
        media={
          <PlaceholderImage
            seed={`case-${slug}`}
            variant="dark"
            style={{ position: "absolute", inset: 0 }}
          />
        }
      />

      <Section tone="paper2">
        <Eyebrow label="What we built" tone="brand" style={{ marginBottom: 48 }} />
        <FeatureRows rows={c.approach} />
      </Section>

      <StatBand eyebrow="The outcome" stats={c.outcome} />

      <CTASection
        title="Could we move a number like this for you?"
        body={`We brought ${c.client.replace(/^A /, "a ").replace(/^An /, "an ")} a measurable result. Tell us the metric you need to move and we will tell you what we would build first.`}
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "See more work", href: "/work" }}
        shader
      />
    </>
  );
}
