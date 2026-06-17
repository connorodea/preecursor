import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  PageHero,
  Section,
  CardGrid,
  Card,
  CTASection,
  Eyebrow,
} from "@/components/ui";
import { GLOSSARY, getTerm } from "@/lib/content/glossary";
import { breadcrumbSchema, absoluteUrl, socialMeta } from "@/lib/seo";
import { color, inkA } from "@/lib/theme";

export function generateStaticParams() {
  return GLOSSARY.map((t) => ({ term: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>;
}): Promise<Metadata> {
  const { term } = await params;
  const entry = getTerm(term);
  if (!entry) return {};
  return {
    title: entry.title,
    description: entry.metaDescription,
    ...socialMeta({
      title: entry.title,
      description: entry.metaDescription,
      path: `/glossary/${entry.slug}`,
    }),
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term } = await params;
  const entry = getTerm(term);
  if (!entry) notFound();

  // DefinedTerm node — marks this page up as a dictionary entry in the
  // Preecursor applied-AI glossary, for richer informational-intent results.
  const definedTermLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: entry.term,
    description: entry.short,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Preecursor Applied-AI Glossary",
      url: absoluteUrl("/glossary"),
    },
  };

  const trail = [
    { label: "Home", href: "/" },
    { label: "Glossary", href: "/glossary" },
    { label: entry.term, href: `/glossary/${entry.slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermLd) }}
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
        eyebrow="Glossary"
        title={`What is ${entry.term}?`}
        lede={entry.short}
        breadcrumbs={trail}
      />

      {/* Back-to-glossary text link, near the top. */}
      <div
        className="mx-auto w-full max-w-[1340px] px-6 md:px-10 lg:px-[50px]"
        style={{ paddingTop: 8, paddingBottom: 8 }}
      >
        <Link
          href="/glossary"
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: color.brand,
            textDecoration: "none",
          }}
        >
          ← All glossary terms
        </Link>
      </div>

      {/* Prose definition — readable measure (~68ch). */}
      <Section tone="paper">
        <div style={{ maxWidth: "68ch" }}>
          {entry.body.map((paragraph, i) => (
            <p
              key={i}
              style={{
                fontSize: 18,
                lineHeight: 1.7,
                color: inkA(0.78),
                marginBottom: i === entry.body.length - 1 ? 0 : 26,
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </Section>

      {/* Related — cross-links to capabilities, industries, and sibling terms. */}
      <Section tone="paper2">
        <Eyebrow label="Related" tone="brand" style={{ marginBottom: 48 }} />
        <CardGrid columns={3}>
          {entry.related.map((r) => (
            <Card key={r.href} href={r.href} kicker="Related" title={r.label} />
          ))}
          <Card
            href="/glossary"
            kicker="Reference"
            title="The applied-AI glossary"
            desc="Every term, defined for production — agents, RAG, evals, embeddings, and more."
          />
          <Card
            href="/ai-consulting"
            kicker="Service"
            title="AI consulting"
            desc="Strategy and production engineering in one continuous engagement."
          />
        </CardGrid>
      </Section>

      <CTASection
        title="From definition to deployment"
        body="Understanding the term is step one. Bring us the problem and we'll build the system that solves it — and prove it moved the number."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "See our work", href: "/work" }}
        shader
      />
    </>
  );
}
