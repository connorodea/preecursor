import type { Metadata } from "next";
import Link from "next/link";
import {
  PageHero,
  Section,
  CardGrid,
  Card,
  CTASection,
  Eyebrow,
} from "@/components/ui";
import { USE_CASES } from "@/lib/content/usecases";
import { socialMeta } from "@/lib/seo";
import { color } from "@/lib/theme";
import {
  ShieldIcon,
  DocumentIcon,
  ChatIcon,
  ScaleIcon,
  GaugeIcon,
  PulseIcon,
  GearIcon,
  SearchIcon,
  SparkIcon,
  ChecklistIcon,
  NetworkIcon,
} from "@/components/icons";

/** One accent icon per use case, keyed by slug (matches USE_CASES). */
const USE_CASE_ICONS: Record<
  string,
  React.ComponentType<{ size?: number; style?: React.CSSProperties }>
> = {
  "fraud-and-aml-detection": ShieldIcon,
  "document-and-data-extraction": DocumentIcon,
  "customer-support-copilots": ChatIcon,
  "demand-forecasting": ScaleIcon,
  "underwriting-and-credit": GaugeIcon,
  "clinical-documentation": PulseIcon,
  "predictive-maintenance": GearIcon,
  "knowledge-retrieval-rag": SearchIcon,
  "content-generation": SparkIcon,
  "contract-and-policy-review": ChecklistIcon,
  "agentic-workflow-automation": NetworkIcon,
};

const TITLE = "AI Consulting Use Cases";
const DESCRIPTION =
  "Applied-AI consulting by use case — fraud detection, document extraction, support copilots, forecasting, RAG, and more. The services we build, not slideware.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  ...socialMeta({
    title: TITLE,
    description: DESCRIPTION,
    path: "/ai-consulting/use-cases",
  }),
};

export default function UseCasesHubPage() {
  return (
    <>
      <PageHero
        eyebrow="AI consulting"
        title="AI consulting, by use case"
        lede="The applied-AI services we build most — chosen by the problem they solve, not the industry they sit in. Each one is a production system we ship and prove."
        cta={{ label: "Start a conversation", href: "/contact" }}
        secondaryCta={{ label: "See our work", href: "/work" }}
        shader
      />

      {/* Back-to-pillar text link, near the top. */}
      <div
        className="mx-auto w-full max-w-[1340px] px-6 md:px-10 lg:px-[50px]"
        style={{ paddingTop: 8, paddingBottom: 8 }}
      >
        <Link
          href="/ai-consulting"
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: color.brand,
            textDecoration: "none",
          }}
        >
          ← All AI consulting services
        </Link>
      </div>

      <Section tone="paper">
        <Eyebrow
          label="Pick the problem"
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
            maxWidth: "22ch",
            marginBottom: 24,
          }}
        >
          Start from the outcome you need to move
        </h2>
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.62,
            color: "rgba(17,33,56,0.66)",
            maxWidth: "62ch",
            marginBottom: 48,
          }}
        >
          Most engagements begin with a single, sharply-defined problem — a
          backlog to clear, a loss to stop, a queue to drain. These are the
          applied-AI use cases we put into production most often. Each page
          covers the problem, exactly how we build it, and the result we hold
          ourselves to.
        </p>

        <CardGrid columns={3}>
          {USE_CASES.map((uc) => {
            const Icon = USE_CASE_ICONS[uc.slug];
            return (
              <Card
                key={uc.slug}
                href={`/ai-consulting/use-cases/${uc.slug}`}
                icon={Icon ? <Icon size={26} /> : undefined}
                kicker="Use case"
                title={uc.name}
                desc={uc.lede}
              />
            );
          })}
        </CardGrid>
      </Section>

      <Section tone="paper2">
        <Eyebrow label="Go deeper" tone="brand" style={{ marginBottom: 24 }} />
        <CardGrid columns={2}>
          <Card
            href="/ai-consulting"
            kicker="Pillar"
            title="AI consulting"
            desc="Strategy and production engineering in one continuous engagement — the full picture of how we work."
          />
          <Card
            href="/capabilities"
            kicker="Capabilities"
            title="The disciplines we bring"
            desc="From first diagnostic to production scale — strategy, applied builds, agentic systems, evaluation, and MLOps."
          />
        </CardGrid>
      </Section>

      <CTASection
        title="Tell us the problem you need to solve"
        body="Bring us the use case. We will tell you what we would build, how long it takes, and what it is worth."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "See our work", href: "/work" }}
        shader
      />
    </>
  );
}
