import type { Metadata } from "next";
import PlaceholderImage from "@/components/PlaceholderImage";
import {
  PageHero,
  Section,
  ContentSplit,
  CardGrid,
  Card,
  FeatureRows,
  CTASection,
  Eyebrow,
} from "@/components/ui";
import { PANELS } from "@/lib/ia";
import { ABOUT } from "@/lib/content/company";

export const metadata: Metadata = {
  title: "About Preecursor",
  description: PANELS.about.desc,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Preecursor"
        title={ABOUT.hero.title}
        lede={ABOUT.hero.lede}
        cta={{ label: "Start a conversation", href: "/contact" }}
        secondaryCta={{ label: "Meet our people", href: "/leadership" }}
      />

      {/* Our Story */}
      <section id="our-story" className="scroll-mt-[110px]">
        <ContentSplit
          eyebrow="Our story"
          title="We built the firm we wished we could have hired"
          body={ABOUT.story}
          media={
            <PlaceholderImage
              seed="about-story"
              variant="light"
              style={{ position: "absolute", inset: 0 }}
            />
          }
        />
      </section>

      {/* Values */}
      <Section id="values" className="scroll-mt-[110px]" tone="paper2">
        <Eyebrow label="What we believe" tone="brand" style={{ marginBottom: 40 }} />
        <CardGrid columns={3}>
          {ABOUT.values.map((v) => (
            <Card key={v.title} title={v.title} desc={v.desc} />
          ))}
        </CardGrid>
      </Section>

      {/* How We Work — footer links /about#how-we-work, id MUST be how-we-work */}
      <Section id="how-we-work" className="scroll-mt-[110px]">
        <Eyebrow label="How we work" tone="brand" style={{ marginBottom: 48 }} />
        <FeatureRows
          rows={ABOUT.howWeWork.map((p) => ({ title: p.title, desc: p.desc }))}
        />
      </Section>

      {/* Partnerships */}
      <Section id="partnerships" className="scroll-mt-[110px]" tone="paper3">
        <Eyebrow label="Partnerships" tone="brand" style={{ marginBottom: 22 }} />
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.62,
            color: "rgba(17,33,56,0.66)",
            maxWidth: "62ch",
            marginBottom: 48,
          }}
        >
          {ABOUT.partnerships.body}
        </p>
        <FeatureRows rows={ABOUT.partnerships.rows} />
      </Section>

      {/* Press */}
      <Section id="press" className="scroll-mt-[110px]" tone="ink">
        <Eyebrow label="Press" tone="azure" style={{ marginBottom: 22 }} />
        <p
          style={{
            fontSize: "clamp(20px,2vw,28px)",
            lineHeight: 1.5,
            fontFamily: "var(--font-newsreader)",
            color: "rgba(234,241,251,0.86)",
            maxWidth: "40ch",
          }}
        >
          {ABOUT.press.body}
        </p>
        <p
          style={{
            marginTop: 24,
            fontSize: 16,
            lineHeight: 1.6,
            color: "rgba(234,241,251,0.62)",
          }}
        >
          Media inquiries:{" "}
          <a
            href="/contact"
            style={{ color: "#7fa6f2", textDecoration: "none" }}
          >
            get in touch
          </a>
          .
        </p>
      </Section>

      <CTASection
        title="Let's talk about what's actually possible"
        body="Tell us the number you need to move. We will tell you, candidly, whether AI is the right lever — and if it is, what we would build first."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "See our work", href: "/work" }}
        shader
      />
    </>
  );
}
