import type { Metadata } from "next";
import PlaceholderImage from "@/components/PlaceholderImage";
import {
  PageHero,
  Section,
  ContentSplit,
  CardGrid,
  Card,
  CTASection,
} from "@/components/ui";
import { PANELS, INDUSTRY_LEAVES } from "@/lib/ia";
import { getIndustry, cardBlurb } from "@/lib/content/services";

export const metadata: Metadata = {
  title: "Industries",
  description: PANELS.industries.desc,
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="AI that changes the numbers in your sector"
        lede={PANELS.industries.desc}
        cta={{ label: "Start a conversation", href: "/contact" }}
        secondaryCta={{ label: "See our work", href: "/work" }}
      />

      <ContentSplit
        eyebrow="How we work in your industry"
        title="Sector judgment, paired with engineers who ship"
        body={[
          "We do not arrive with a horizontal AI playbook and bend your business to fit it. We start from the metric your sector lives and dies on — loss ratio, cycle time, downtime, churn — and work backward to the system that moves it.",
          "Every engagement pairs people who understand your sector with engineers who put production AI in front of your customers and teams. The result is measurable change, not a strategy deck.",
        ]}
        media={
          <PlaceholderImage
            seed="ind-hub"
            variant="dark"
            style={{ position: "absolute", inset: 0 }}
          />
        }
      />

      <Section tone="paper2">
        <CardGrid columns={3}>
          {INDUSTRY_LEAVES.map((leaf) => {
            const c = getIndustry(leaf.slug);
            return (
              <Card
                key={leaf.slug}
                href={leaf.href}
                kicker="Industry"
                title={leaf.label}
                desc={cardBlurb(c)}
              />
            );
          })}
        </CardGrid>
      </Section>

      <CTASection
        title="Where could AI move your numbers?"
        body="Tell us the metric you need to move. We will tell you, candidly, whether AI is the right lever — and if it is, what we would build first."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "See our work", href: "/work" }}
        shader
      />
    </>
  );
}
