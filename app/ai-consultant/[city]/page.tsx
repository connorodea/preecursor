import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  PageHero,
  Section,
  CardGrid,
  Card,
  CTASection,
  Eyebrow,
} from "@/components/ui";
import { slugify } from "@/lib/ia";
import { CITIES, getCity } from "@/lib/content/programmatic";
import { serviceSchema, breadcrumbSchema, absoluteUrl, socialMeta } from "@/lib/seo";
import { color, inkA } from "@/lib/theme";

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city: slug } = await params;
  const c = getCity(slug);
  if (!c) return { title: "AI Consultant" };
  const title = `AI Consultant in ${c.city}`;
  const description = `Senior, hands-on AI consultants serving ${c.city}${
    c.office ? "" : " (remote-first)"
  } — applied AI from diagnostic to production. ${c.intro.slice(0, 90)}`;
  return {
    title,
    description,
    ...socialMeta({ title, description, path: `/ai-consultant/${slug}` }),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();

  // ProfessionalService node, with areaServed narrowed to this city
  // (serviceSchema defaults areaServed to "Worldwide" — override it here).
  const schema = {
    ...serviceSchema({
      name: `AI consultant in ${c.city}`,
      description: c.intro,
      url: absoluteUrl(`/ai-consultant/${city}`),
    }),
    areaServed: c.city,
  };

  const trail = [
    { label: "Home", href: "/" },
    { label: "AI Consultant", href: "/ai-consultant" },
    { label: c.city, href: `/ai-consultant/${city}` },
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
        eyebrow={
          c.office
            ? `Office · ${c.region}`
            : `Remote-first · ${c.region}`
        }
        title={`AI consultant in ${c.city}`}
        lede={c.intro}
        breadcrumbs={trail}
        cta={{ label: "Start a conversation", href: "/contact" }}
      />

      {/* Honest presence framing — differentiated by city/region and
          office-vs-remote, never claiming an office we don't have. */}
      <Section tone="paper">
        <Eyebrow
          label={c.office ? "On the ground" : "How we serve you"}
          tone="brand"
          style={{ marginBottom: 26 }}
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
            marginBottom: 28,
          }}
        >
          {c.office
            ? `We're on the ground in ${c.city}`
            : `We serve ${c.city} remote-first`}
        </h2>
        <div
          style={{
            display: "grid",
            gap: 20,
            maxWidth: "64ch",
            fontSize: 18,
            lineHeight: 1.62,
            color: inkA(0.7),
          }}
        >
          <p>{c.intro}</p>
          {c.office ? (
            <p>
              Our {c.city} office means partners and engineers in the room with
              your teams — in your standups, your tools, and your {c.region}{" "}
              regulatory context — so decisions happen on the spot rather than
              three weeks later in a readout.
            </p>
          ) : (
            <p>
              We don&apos;t keep an office in {c.city} — and we won&apos;t
              pretend otherwise. We work with {c.city} and the wider {c.region}{" "}
              market remote-first, embedded in your tools and your time zone,
              with our nearest office in {c.nearestOffice} for when on-site time
              matters.
            </p>
          )}
          <p>
            Either way, the engagement is the same: senior strategists paired
            with engineers who put AI into production — from a first diagnostic
            to a running, measured system your team owns after we leave.
          </p>
        </div>
      </Section>

      {/* City-specific sectors → each links to its industry AI-consulting spoke.
          This both differentiates the page and builds internal links. */}
      <Section tone="paper2">
        <Eyebrow label="What we build" tone="brand" style={{ marginBottom: 18 }} />
        <h2
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 400,
            fontSize: "clamp(28px,3vw,42px)",
            lineHeight: 1.05,
            letterSpacing: "-0.018em",
            color: color.ink,
            maxWidth: "24ch",
            marginBottom: 40,
          }}
        >
          What we build for {c.city} teams
        </h2>
        <CardGrid columns={3}>
          {c.sectors.map((sector) => (
            <Card
              key={sector}
              href={`/ai-consulting/${slugify(sector)}`}
              kicker="AI consulting"
              title={`AI consulting for ${sector}`}
              desc={`Applied AI for ${sector.toLowerCase()} teams — strategy through production.`}
            />
          ))}
        </CardGrid>

        {/* Internal links: back to the pillar (all locations) and to our work. */}
        <div
          style={{
            marginTop: 44,
            display: "flex",
            gap: 28,
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/ai-consultant"
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.03em",
              color: color.brand,
              textDecoration: "none",
            }}
          >
            All locations / AI consultants →
          </Link>
          <Link
            href="/work"
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.03em",
              color: color.brand,
              textDecoration: "none",
            }}
          >
            See our work →
          </Link>
        </div>
      </Section>

      <CTASection
        title={`Put a senior AI consultant on your ${c.city} team`}
        body={`Whether your team sits in ${c.city} or across time zones, tell us the metric you need to move and we'll tell you exactly what we'd build to move it.`}
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "Preecursor worldwide", href: "/worldwide" }}
        shader
      />
    </>
  );
}
