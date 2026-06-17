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
  if (!c) return { title: "The work" };
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
        <Eyebrow label="What we build" tone="brand" style={{ marginBottom: 48 }} />
        <FeatureRows rows={c.approach} />
      </Section>

      {/* Measured figures, when we have them; otherwise honest qualitative
          outcomes. These illustrative engagements carry no invented numbers,
          so the StatBand suppresses itself and the prose renders instead. */}
      {c.outcome.length > 0 ? (
        <StatBand eyebrow="The outcome" stats={c.outcome} />
      ) : (
        <Section tone="paper">
          <Eyebrow
            label="What it's designed to do"
            tone="brand"
            style={{ marginBottom: 32 }}
          />
          <div style={{ maxWidth: "64ch" }}>
            {c.outcomes.map((o, i) => (
              <p
                key={i}
                style={{
                  marginTop: i === 0 ? 0 : 18,
                  fontSize: 18,
                  lineHeight: 1.62,
                  color: "rgba(17,33,56,0.7)",
                }}
              >
                {o}
              </p>
            ))}
          </div>
        </Section>
      )}

      <CTASection
        title="Could we build something like this for you?"
        body="This is an illustrative example of the kind of system we build. Tell us the metric you need to move and we will tell you, candidly, what we would build first."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "See more work", href: "/work" }}
        shader
      />
    </>
  );
}
