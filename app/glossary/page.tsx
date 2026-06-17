import type { Metadata } from "next";
import {
  PageHero,
  Section,
  CardGrid,
  Card,
  CTASection,
  Eyebrow,
} from "@/components/ui";
import { GLOSSARY } from "@/lib/content/glossary";
import { socialMeta } from "@/lib/seo";

const TITLE = "Applied-AI Glossary";
const DESCRIPTION =
  "Plain-English, production-grade definitions of the applied-AI terms that matter — agents, RAG, evals, embeddings, MLOps, guardrails, and more — written by an applied-AI studio.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  ...socialMeta({
    title: TITLE,
    description: DESCRIPTION,
    path: "/glossary",
  }),
};

// Alphabetical so the hub reads like a real reference, not a content dump.
const TERMS = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term));

export default function GlossaryPage() {
  return (
    <>
      <PageHero
        eyebrow="Glossary"
        title="The applied-AI glossary"
        lede="The terms that come up when AI meets production — defined the way we'd explain them to a client, not the way a textbook would."
        cta={{ label: "Start a conversation", href: "/contact" }}
        secondaryCta={{ label: "See our capabilities", href: "/capabilities" }}
      />

      <Section tone="paper2">
        <Eyebrow label="A–Z" tone="brand" style={{ marginBottom: 48 }} />
        <CardGrid columns={3}>
          {TERMS.map((t) => (
            <Card
              key={t.slug}
              href={`/glossary/${t.slug}`}
              kicker="Term"
              title={t.term}
              desc={t.short}
            />
          ))}
        </CardGrid>
      </Section>

      <CTASection
        title="Past the definitions, into production"
        body="Knowing the terms is the easy part. We build the systems behind them — and prove they moved the number you care about."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "Explore AI consulting", href: "/ai-consulting" }}
        shader
      />
    </>
  );
}
