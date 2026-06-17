import type { Metadata } from "next";
import Link from "next/link";
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
import { PANELS } from "@/lib/ia";
import {
  INSIGHTS,
  INSIGHT_CATEGORIES,
  articlesByCategory,
} from "@/lib/content/insights";

export const metadata: Metadata = {
  title: "Our insights",
  description: PANELS.insights.desc,
};

const featured = INSIGHTS[0];

const CATEGORY_BLURB: Record<string, string> = {
  Reports:
    "In-depth pieces that take a position and back it with what we have seen across forty-plus production systems.",
  "Field Notes":
    "Shorter dispatches from the build — the unglamorous engineering lessons that decide whether AI survives real users.",
  "Executive Briefings":
    "Decision frameworks for leaders: where to build, where to buy, where to wait, and how to satisfy risk without theater.",
};

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Our sharpest thinking on applied AI"
        lede="Reports, field notes, and briefings from the people who ship the systems — opinionated, specific, and free of hype."
        cta={{ label: "Read the latest", href: `/insights/${featured.slug}` }}
        secondaryCta={{ label: "See our work", href: "/work" }}
      />

      {/* Featured article. */}
      <ContentSplit
        eyebrow={`Featured · ${featured.category}`}
        title={featured.title}
        body={[featured.dek, `${featured.author} · ${featured.date} · ${featured.readMins} min read`]}
        media={
          <PlaceholderImage
            seed="ins-feature"
            variant="dark"
            style={{ position: "absolute", inset: 0 }}
          />
        }
        cta={{ label: "Read the report", href: `/insights/${featured.slug}` }}
      />

      {/* Reports — first menu leaf; also anchors the full index grid lead. */}
      <Section id="reports" className="scroll-mt-[110px]" tone="paper2">
        <Eyebrow label="The latest" tone="brand" style={{ marginBottom: 40 }} />
        <CardGrid columns={3}>
          {INSIGHTS.map((a) => (
            <Card
              key={a.slug}
              href={`/insights/${a.slug}`}
              kicker={a.category}
              title={a.title}
              desc={a.dek}
            />
          ))}
        </CardGrid>
      </Section>

      {/* Category anchors — Field Notes / Executive Briefings group the writing. */}
      {INSIGHT_CATEGORIES.filter((cat) => cat !== "Reports").map((cat) => {
        const items = articlesByCategory(cat);
        const id = cat.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        return (
          <Section key={cat} id={id} className="scroll-mt-[110px]" tone="paper">
            <Eyebrow label={cat} tone="brand" style={{ marginBottom: 22 }} />
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.62,
                color: "rgba(17,33,56,0.66)",
                maxWidth: "60ch",
                marginBottom: items.length ? 40 : 0,
              }}
            >
              {CATEGORY_BLURB[cat]}
            </p>
            {items.length > 0 && (
              <CardGrid columns={3}>
                {items.map((a) => (
                  <Card
                    key={a.slug}
                    href={`/insights/${a.slug}`}
                    kicker={`${a.date} · ${a.readMins} min`}
                    title={a.title}
                    desc={a.dek}
                  />
                ))}
              </CardGrid>
            )}
          </Section>
        );
      })}

      {/* The Preecursor Newsletter — anchor + newsletter CTA. */}
      <Section id="the-preecursor-newsletter" className="scroll-mt-[110px]" tone="ink">
        <Eyebrow label="The Preecursor Newsletter" tone="azure" style={{ marginBottom: 28 }} />
        <h2
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 400,
            fontSize: "clamp(30px,3vw,46px)",
            lineHeight: 1.05,
            letterSpacing: "-0.018em",
            color: "#eaf1fb",
            maxWidth: "20ch",
          }}
        >
          One sharp idea on applied AI, every other week.
        </h2>
        <p
          style={{
            marginTop: 24,
            fontSize: 18,
            lineHeight: 1.6,
            color: "rgba(234,241,251,0.66)",
            maxWidth: "56ch",
          }}
        >
          No roundups, no reheated press releases — just what we are learning from
          shipping production AI, written for leaders who have to decide what to
          build next. Reach us to subscribe or to suggest a topic.
        </p>
        <Link
          href="/contact"
          className="bg-[#5b8def] hover:bg-[#7fa6f2] transition-colors"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            marginTop: 32,
            borderRadius: 999,
            padding: "15px 28px",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#0b1322",
            textDecoration: "none",
          }}
        >
          Subscribe <span aria-hidden="true">→</span>
        </Link>
      </Section>

      {/* Webinars. */}
      <Section id="webinars" className="scroll-mt-[110px]" tone="paper2">
        <Eyebrow label="Webinars" tone="brand" style={{ marginBottom: 28 }} />
        <h2
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 400,
            fontSize: "clamp(28px,2.6vw,40px)",
            lineHeight: 1.08,
            letterSpacing: "-0.018em",
            color: "#112138",
            maxWidth: "22ch",
          }}
        >
          Live sessions and teardowns
        </h2>
        <p
          style={{
            marginTop: 22,
            fontSize: 18,
            lineHeight: 1.62,
            color: "rgba(17,33,56,0.66)",
            maxWidth: "60ch",
          }}
        >
          We run periodic working sessions where our engineers walk through a real
          build — the eval harness, the agent architecture, the production
          hardening — and take questions. Get in touch to be notified of the next
          one or to request a private session for your team.
        </p>
      </Section>

      {/* Index of work — cross-link back to the case studies. */}
      <Section id="index-of-work" className="scroll-mt-[110px]" tone="paper">
        <Eyebrow label="Index of work" tone="brand" style={{ marginBottom: 28 }} />
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.62,
            color: "rgba(17,33,56,0.66)",
            maxWidth: "60ch",
            marginBottom: 28,
          }}
        >
          Our thinking is grounded in what we ship. Every idea here traces back to
          a system in production — see the outcomes behind the writing.
        </p>
        <Link
          href="/work"
          className="border-[1.5px] border-[rgba(17,33,56,0.3)] hover:border-[#112138] transition-colors"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            borderRadius: 999,
            padding: "15px 28px",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#112138",
            textDecoration: "none",
          }}
        >
          See client impact <span aria-hidden="true">→</span>
        </Link>
      </Section>

      <CTASection
        title="Want this thinking applied to your problem?"
        body="Reading about it is one thing. Bring us the metric you need to move and we will tell you what we would build."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "See our work", href: "/work" }}
        shader
      />
    </>
  );
}
