import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero, Section, CTASection } from "@/components/ui";
import { INSIGHTS, getArticle } from "@/lib/content/insights";
import { breadcrumbSchema, articleSchema, absoluteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return INSIGHTS.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return { title: "Insights" };
  return { title: a.title, description: a.dek };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();

  const trail = [
    { label: "Home", href: "/" },
    { label: "Insights", href: "/insights" },
    { label: a.title, href: `/insights/${slug}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            articleSchema({
              title: a.title,
              description: a.dek,
              author: a.author,
              date: a.date,
              url: absoluteUrl(`/insights/${slug}`),
            }),
            breadcrumbSchema(
              trail.map((t) => ({ name: t.label, url: absoluteUrl(t.href) })),
            ),
          ]),
        }}
      />

      <PageHero
        eyebrow={`${a.category} · ${a.date}`}
        title={a.title}
        lede={a.dek}
        breadcrumbs={trail}
        cta={{ label: "More insights", href: "/insights" }}
      />

      <Section tone="paper">
        <article
          style={{
            maxWidth: "68ch",
            marginInline: "auto",
          }}
        >
          {a.body.map((p, i) => (
            <p
              key={i}
              style={{
                marginTop: i === 0 ? 0 : 26,
                fontFamily: "var(--font-newsreader)",
                fontSize: 19,
                lineHeight: 1.7,
                color: "rgba(17,33,56,0.78)",
              }}
            >
              {p}
            </p>
          ))}

          <div
            style={{
              marginTop: 48,
              paddingTop: 28,
              borderTop: "1px solid rgba(17,33,56,0.14)",
              fontSize: 13.5,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#1b4fc7",
            }}
          >
            {a.author} · {a.date} · {a.readMins} min read
          </div>
        </article>
      </Section>

      <CTASection
        title="Put this thinking to work"
        body="If a piece here named your problem, the next step is a conversation about the system that solves it."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "Read more insights", href: "/insights" }}
        shader
      />
    </>
  );
}
