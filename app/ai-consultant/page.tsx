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
import { getPillar, CITIES } from "@/lib/content/programmatic";
import { serviceSchema, absoluteUrl } from "@/lib/seo";
import { color, inkA, container } from "@/lib/theme";

const SLUG = "ai-consultant";
const pillar = getPillar(SLUG)!;

export const metadata: Metadata = {
  title: pillar.title,
  description: pillar.metaDescription,
  alternates: { canonical: absoluteUrl(`/${SLUG}`) },
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

export default function AiConsultantPage() {
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
          eyebrow={i === 0 ? "What they deliver" : i === 1 ? "How we work" : "Why us"}
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

      {/* Internal-linking hub — the city spokes + sibling pillar. */}
      <Section tone="paper2">
        <Eyebrow
          label="AI consultants near you"
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
          Embedded in your market, in your time zone
        </h2>
        <CardGrid columns={3}>
          {CITIES.map((city) => (
            <Card
              key={city.slug}
              href={`/ai-consultant/${city.slug}`}
              kicker={city.office ? "Office" : "Remote-first"}
              title={`AI consultant in ${city.city}`}
              desc={city.region}
            />
          ))}
        </CardGrid>

        <div style={{ marginTop: 48 }}>
          <Eyebrow label="Go deeper" tone="brand" style={{ marginBottom: 24 }} />
          <CardGrid columns={2}>
            <Card
              href="/ai-consulting"
              kicker="Pillar"
              title="AI consulting that ships"
              desc="Our applied-AI consulting studio — strategy paired with engineers who put AI into production and prove it moved the number."
            />
            <Card
              href="/capabilities"
              kicker="Capabilities"
              title="The disciplines we bring"
              desc="From first diagnostic to production scale — the moving parts of getting AI from an idea to a system you depend on."
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
          Common questions about working with an AI consultant
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
        title="Put a senior AI consultant in the room"
        body="We embed, build, and transfer the capability — so the advantage compounds after we leave."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "See our work", href: "/work" }}
        shader
      />
    </>
  );
}
