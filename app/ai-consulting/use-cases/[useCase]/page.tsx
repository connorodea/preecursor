import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PlaceholderImage from "@/components/PlaceholderImage";
import {
  PageHero,
  Section,
  ContentSplit,
  CardGrid,
  Card,
  FeatureRows,
  CTASection,
  Eyebrow,
} from "@/components/ui";
import { USE_CASES, getUseCase } from "@/lib/content/usecases";
import { serviceSchema, breadcrumbSchema, absoluteUrl, socialMeta } from "@/lib/seo";
import { color } from "@/lib/theme";

export function generateStaticParams() {
  return USE_CASES.map((u) => ({ useCase: u.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ useCase: string }>;
}): Promise<Metadata> {
  const { useCase } = await params;
  const uc = getUseCase(useCase);
  if (!uc) return {};
  return {
    title: uc.title,
    description: uc.metaDescription,
    ...socialMeta({
      title: uc.title,
      description: uc.metaDescription,
      path: `/ai-consulting/use-cases/${useCase}`,
    }),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ useCase: string }>;
}) {
  const { useCase } = await params;
  const uc = getUseCase(useCase);
  if (!uc) notFound();

  const schema = serviceSchema({
    name: `AI consulting for ${uc.name}`,
    description: uc.metaDescription,
    url: absoluteUrl(`/ai-consulting/use-cases/${useCase}`),
  });

  const trail = [
    { label: "Home", href: "/" },
    { label: "AI Consulting", href: "/ai-consulting" },
    { label: "Use Cases", href: "/ai-consulting/use-cases" },
    { label: uc.name, href: `/ai-consulting/use-cases/${useCase}` },
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

      <PageHero
        eyebrow="AI consulting use case"
        title={uc.h1}
        lede={uc.lede}
        breadcrumbs={trail}
        cta={{ label: "Start a conversation", href: "/contact" }}
      />

      {/* Back-to-hub text link, near the top. */}
      <div
        className="mx-auto w-full max-w-[1340px] px-6 md:px-10 lg:px-[50px]"
        style={{ paddingTop: 8, paddingBottom: 8 }}
      >
        <Link
          href="/ai-consulting/use-cases"
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: color.brand,
            textDecoration: "none",
          }}
        >
          ← All AI consulting use cases
        </Link>
      </div>

      <ContentSplit
        eyebrow="The problem"
        title={`Why ${uc.name.toLowerCase()} is hard to get right`}
        body={uc.problem}
        media={
          <PlaceholderImage
            seed={`uc-${useCase}`}
            variant="dark"
            style={{ position: "absolute", inset: 0 }}
          />
        }
      />

      <Section tone="paper2">
        <Eyebrow label="How we build it" tone="brand" style={{ marginBottom: 48 }} />
        <FeatureRows rows={uc.approach} />
      </Section>

      <Section tone="paper">
        <Eyebrow label="The outcome" tone="brand" style={{ marginBottom: 18 }} />
        <h2
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 400,
            fontSize: "clamp(28px,3vw,42px)",
            lineHeight: 1.08,
            letterSpacing: "-0.018em",
            color: color.ink,
            maxWidth: "30ch",
          }}
        >
          {uc.outcome}
        </h2>
      </Section>

      <Section tone="paper2">
        <Eyebrow label="Related" tone="brand" style={{ marginBottom: 48 }} />
        <CardGrid columns={3}>
          {/* Capability / industry cross-links from the use case's own data. */}
          {uc.relatedCapabilities.map((r) => (
            <Card key={r.href} href={r.href} kicker="Related" title={r.label} />
          ))}

          {/* Back to the use-case hub. */}
          <Card
            href="/ai-consulting/use-cases"
            kicker="Use cases"
            title="All AI consulting use cases"
            desc="Browse the full set of applied-AI services we build, by the problem they solve."
          />

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
        title={`Put AI to work on ${uc.name.toLowerCase()}`}
        body="Bring us the metric you need to move. We will tell you what we would build, how long it takes, and what it is worth."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "See our work", href: "/work" }}
        shader
      />
    </>
  );
}
