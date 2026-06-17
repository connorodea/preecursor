import type { Metadata } from "next";
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
import { PANELS, slugify } from "@/lib/ia";
import { CAREERS, rolesByTeam } from "@/lib/content/company";
import { color, inkA } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Careers",
  description: PANELS.careers.desc,
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Preecursor careers"
        title={CAREERS.hero.title}
        lede={CAREERS.hero.lede}
        cta={{ label: "Explore roles", href: "#open-roles" }}
        secondaryCta={{ label: "Meet our people", href: "/leadership" }}
      />

      {/* Intro */}
      <Section py={80}>
        <Eyebrow label="Why Preecursor" tone="brand" style={{ marginBottom: 24 }} />
        <p
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 400,
            fontSize: "clamp(24px,2.4vw,34px)",
            lineHeight: 1.32,
            letterSpacing: "-0.01em",
            color: color.ink,
            maxWidth: "30ch",
          }}
        >
          {CAREERS.intro}
        </p>
      </Section>

      {/* Open Roles */}
      <Section id="open-roles" className="scroll-mt-[110px]" tone="paper2">
        <Eyebrow label="Open roles" tone="brand" style={{ marginBottom: 40 }} />
        <CardGrid columns={2}>
          {CAREERS.openRoles.map((role) => (
            <Card
              key={role.title}
              href="/contact"
              kicker={role.team}
              title={role.title}
              desc={`${role.location} · ${role.type}`}
            />
          ))}
        </CardGrid>
      </Section>

      {/* Per-team anchored blurbs: Engineering / Strategy / Research / Internships */}
      {CAREERS.teams.map((t, i) => {
        const roles = rolesByTeam(t.team);
        return (
          <Section
            key={t.team}
            id={slugify(t.label)}
            className="scroll-mt-[110px]"
            tone={i % 2 === 0 ? "paper" : "paper3"}
            py={84}
          >
            <Eyebrow label={t.label} tone="brand" style={{ marginBottom: 22 }} />
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.62,
                color: inkA(0.66),
                maxWidth: "62ch",
                marginBottom: roles.length ? 40 : 0,
              }}
            >
              {t.blurb}
            </p>
            {roles.length > 0 && (
              <CardGrid columns={2}>
                {roles.map((role) => (
                  <Card
                    key={role.title}
                    href="/contact"
                    kicker={role.team}
                    title={role.title}
                    desc={`${role.location} · ${role.type}`}
                  />
                ))}
              </CardGrid>
            )}
          </Section>
        );
      })}

      {/* Life at Preecursor */}
      <section id="life-at-preecursor" className="scroll-mt-[110px]">
        <ContentSplit
          eyebrow="Life at Preecursor"
          title="Small, senior, and built to do the best work of your career"
          body={CAREERS.life.body}
          reverse
          media={
            <PlaceholderImage
              seed="careers-life"
              variant="dark"
              style={{ position: "absolute", inset: 0 }}
            />
          }
        />
        <Section tone="paper2">
          <Eyebrow label="What you get" tone="brand" style={{ marginBottom: 40 }} />
          <CardGrid columns={3}>
            {CAREERS.life.perks.map((perk) => (
              <Card key={perk.title} title={perk.title} desc={perk.desc} />
            ))}
          </CardGrid>
        </Section>
      </section>

      <CTASection
        title="Don't see your role? Tell us anyway."
        body="We hire ahead of need when we meet the right person. If you would rather ship than advise, start a conversation."
        primary={{ label: "Get in touch", href: "/contact" }}
        secondary={{ label: "Meet our people", href: "/leadership" }}
        shader
      />
    </>
  );
}
