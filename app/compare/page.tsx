import type { Metadata } from "next";
import { PageHero, Section, CardGrid, Card, CTASection, Eyebrow } from "@/components/ui";
import { COMPARISONS } from "@/lib/content/comparisons";
import { socialMeta } from "@/lib/seo";

const TITLE = "AI Consulting Comparisons";
const DESCRIPTION =
  "Honest, category-level comparisons to help you choose how to build with AI: boutique vs big firm, build vs buy, in-house vs consultancy, strategy deck vs shipped system, and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  ...socialMeta({ title: TITLE, description: DESCRIPTION, path: "/compare" }),
};

export default function ComparePage() {
  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="How to choose the way you build with AI"
        lede="Balanced, category-level comparisons — not sales pitches. Each one lays out the real trade-offs and says plainly when the other option is the right call."
        cta={{ label: "Start a conversation", href: "/contact" }}
        secondaryCta={{ label: "See our work", href: "/work" }}
        shader
      />

      <Section tone="paper">
        <Eyebrow label="Comparisons" tone="brand" style={{ marginBottom: 48 }} />
        <CardGrid columns={3}>
          {COMPARISONS.map((c) => (
            <Card
              key={c.slug}
              href={`/compare/${c.slug}`}
              kicker="Compare"
              title={c.h1}
              desc={c.metaDescription}
            />
          ))}
        </CardGrid>
      </Section>

      <CTASection
        title="Not sure which model fits your problem?"
        body="Tell us the metric you need to move. We'll tell you honestly whether to build, buy, hire, or bring in a partner — and what we'd do if it were ours."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "Explore AI consulting", href: "/ai-consulting" }}
        shader
      />
    </>
  );
}
