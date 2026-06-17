import type { Metadata } from "next";
import PlaceholderImage from "@/components/PlaceholderImage";
import {
  PageHero,
  Section,
  ContentSplit,
  CardGrid,
  Card,
  CTASection,
  Eyebrow,
} from "@/components/ui";
import { INDUSTRY_LEAVES } from "@/lib/ia";
import { getPillar } from "@/lib/content/programmatic";
import { serviceSchema, absoluteUrl, socialMeta } from "@/lib/seo";
import { color, inkA, container } from "@/lib/theme";

const SLUG = "ai-consulting";
const pillar = getPillar(SLUG)!;

export const metadata: Metadata = {
  title: pillar.title,
  description: pillar.metaDescription,
  ...socialMeta({
    title: pillar.title,
    description: pillar.metaDescription,
    path: `/${SLUG}`,
  }),
};

const serviceLd = serviceSchema({
  name: pillar.keyword,
  description: pillar.metaDescription,
  url: absoluteUrl(`/${SLUG}`),
});

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: pillar.faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function AiConsultingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <PageHero
        eyebrow={pillar.eyebrow}
        title={pillar.h1}
        lede={pillar.lede}
        cta={{ label: "Start a conversation", href: "/contact" }}
        secondaryCta={{ label: "See our work", href: "/work" }}
        shader
      />

      {/* Pillar sections — alternating text + media splits. */}
      {pillar.sections.map((s, i) => (
        <ContentSplit
          key={i}
          eyebrow={i === 0 ? "Overview" : i === 1 ? "How we work" : "Why us"}
          title={s.heading}
          body={s.body}
          reverse={i % 2 === 1}
          media={
            <PlaceholderImage
              seed={`${SLUG}-${i}`}
              variant="dark"
              style={{ position: "absolute", inset: 0 }}
            />
          }
        />
      ))}

      {/* Internal-linking hub — the 12 industry spokes + sibling pillar + capabilities. */}
      <Section tone="paper2">
        <Eyebrow
          label="AI consulting by industry"
          tone="brand"
          style={{ marginBottom: 18 }}
        />
        <h2
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 400,
            fontSize: "clamp(28px,3vw,42px)",
            lineHeight: 1.05,
            letterSpacing: "-0.018em",
            color: color.ink,
            maxWidth: "20ch",
            marginBottom: 40,
          }}
        >
          Sector-specific AI consulting, built on real domain depth
        </h2>
        <CardGrid columns={3}>
          {INDUSTRY_LEAVES.map((leaf) => (
            <Card
              key={leaf.slug}
              href={`/ai-consulting/${leaf.slug}`}
              kicker="Industry"
              title={`AI consulting for ${leaf.label}`}
            />
          ))}
        </CardGrid>

        <div style={{ marginTop: 48 }}>
          <Eyebrow label="Go deeper" tone="brand" style={{ marginBottom: 24 }} />
          <CardGrid columns={2}>
            <Card
              href="/ai-consultant"
              kicker="Pillar"
              title="Hire an AI consultant"
              desc="Senior, hands-on practitioners who embed in your teams, build production systems, and transfer the capability."
            />
            <Card
              href="/capabilities"
              kicker="Capabilities"
              title="The disciplines we bring"
              desc="From first diagnostic to production scale — strategy, applied builds, agentic systems, evaluation, and MLOps."
            />
          </CardGrid>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="paper">
        <Eyebrow label="FAQ" tone="brand" style={{ marginBottom: 18 }} />
        <h2
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 400,
            fontSize: "clamp(28px,3vw,42px)",
            lineHeight: 1.05,
            letterSpacing: "-0.018em",
            color: color.ink,
            marginBottom: 48,
          }}
        >
          Common questions about AI consulting
        </h2>
        <div className={container} style={{ display: "grid", gap: 40 }}>
          {pillar.faqs.map((f, i) => (
            <div
              key={i}
              style={{
                paddingTop: 32,
                borderTop: `1px solid ${inkA(0.14)}`,
                ...(i === pillar.faqs.length - 1
                  ? { borderBottom: `1px solid ${inkA(0.14)}`, paddingBottom: 32 }
                  : null),
              }}
            >
              <h3
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  lineHeight: 1.25,
                  color: color.ink,
                  marginBottom: 14,
                  maxWidth: "44ch",
                }}
              >
                {f.q}
              </h3>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.62,
                  color: inkA(0.66),
                  maxWidth: "64ch",
                }}
              >
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <CTASection
        title="Bring us the number you need to move"
        body="Tell us the metric. We will tell you what we would build, how long it takes, and what it is worth."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "See our work", href: "/work" }}
        shader
      />
    </>
  );
}
