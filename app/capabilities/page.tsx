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
import { PANELS, CAPABILITY_LEAVES } from "@/lib/ia";
import { getCapability, cardBlurb } from "@/lib/content/services";
import {
  StrategyIcon,
  BuildIcon,
  NetworkIcon,
  DatabaseIcon,
  ShieldIcon,
  ScaleIcon,
  EnableIcon,
  BalanceIcon,
} from "@/components/icons";

/** One accent icon per capability discipline, keyed by slug. */
const CAPABILITY_ICONS: Record<
  string,
  React.ComponentType<{ size?: number; style?: React.CSSProperties }>
> = {
  "ai-strategy-and-diagnostics": StrategyIcon,
  "applied-builds": BuildIcon,
  "agentic-systems": NetworkIcon,
  "data-and-platform-engineering": DatabaseIcon,
  "evaluation-and-safety": ShieldIcon,
  "mlops-and-scale": ScaleIcon,
  "change-and-enablement": EnableIcon,
  "responsible-ai": BalanceIcon,
};

export const metadata: Metadata = {
  title: "Capabilities",
  description: PANELS.capabilities.desc,
};

export default function CapabilitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Capabilities"
        title="From first diagnostic to production scale"
        lede={PANELS.capabilities.desc}
        cta={{ label: "Start a conversation", href: "/contact" }}
        secondaryCta={{ label: "See our work", href: "/work" }}
      />

      <ContentSplit
        eyebrow="How we work"
        title="One continuous engagement, not a relay of vendors"
        body={[
          "Most firms hand you off — strategy to one team, build to another, operations to a third — and the value leaks at every seam. We carry one engagement from the first diagnostic through production and adoption.",
          "These are the disciplines we bring to that arc. They are not a menu of separate services; they are the moving parts of getting AI from an idea to a system your organization depends on.",
        ]}
        media={
          <PlaceholderImage
            seed="cap-hub"
            variant="dark"
            style={{ position: "absolute", inset: 0 }}
          />
        }
      />

      <Section tone="paper2">
        <CardGrid columns={3}>
          {CAPABILITY_LEAVES.map((leaf) => {
            const c = getCapability(leaf.slug);
            const Icon = CAPABILITY_ICONS[leaf.slug];
            return (
              <Card
                key={leaf.slug}
                href={leaf.href}
                icon={Icon ? <Icon size={26} /> : undefined}
                kicker="Capability"
                title={leaf.label}
                desc={cardBlurb(c)}
              />
            );
          })}
        </CardGrid>
      </Section>

      <CTASection
        title="Bring us the hard part"
        body="Whether you need a diagnostic, a first build, or the operations to keep one running, we start from the outcome and work backward."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "See our work", href: "/work" }}
        shader
      />
    </>
  );
}
