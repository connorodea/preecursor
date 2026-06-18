import type { Metadata } from "next";
import PlaceholderImage from "@/components/PlaceholderImage";
import {
  PageHero,
  Section,
  ContentSplit,
  RevealGrid,
  Card,
  CTASection,
} from "@/components/ui";
import { PANELS, INDUSTRY_LEAVES } from "@/lib/ia";
import { getIndustry, cardBlurb } from "@/lib/content/services";
import {
  BankIcon,
  UmbrellaIcon,
  PulseIcon,
  GearIcon,
  BoltIcon,
  BagIcon,
  ChipIcon,
  TrendIcon,
  FlagIcon,
  NetworkIcon,
  TruckIcon,
  PlaneIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Industries",
  description: PANELS.industries.desc,
};

/** One accent icon per sector, keyed by slug. Reuses pulse/gear/network. */
const INDUSTRY_ICONS: Record<
  string,
  React.ComponentType<{ size?: number; style?: React.CSSProperties }>
> = {
  "financial-institutions": BankIcon,
  insurance: UmbrellaIcon,
  "healthcare-and-life-sciences": PulseIcon,
  "industrial-goods": GearIcon,
  "energy-and-utilities": BoltIcon,
  "consumer-and-retail": BagIcon,
  "technology-and-software": ChipIcon,
  "private-equity": TrendIcon,
  "public-sector": FlagIcon,
  telecommunications: NetworkIcon,
  "transportation-and-logistics": TruckIcon,
  "travel-and-hospitality": PlaneIcon,
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
        <RevealGrid columns={3}>
          {INDUSTRY_LEAVES.map((leaf) => {
            const c = getIndustry(leaf.slug);
            const Icon = INDUSTRY_ICONS[leaf.slug];
            return (
              <Card
                key={leaf.slug}
                href={leaf.href}
                icon={Icon ? <Icon size={26} /> : undefined}
                kicker="Industry"
                title={leaf.label}
                desc={cardBlurb(c)}
              />
            );
          })}
        </RevealGrid>
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
