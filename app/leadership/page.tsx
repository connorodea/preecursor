import type { Metadata } from "next";
import PlaceholderImage from "@/components/PlaceholderImage";
import {
  PageHero,
  Section,
  CardGrid,
  CTASection,
  Eyebrow,
} from "@/components/ui";
import { PANELS, slugify } from "@/lib/ia";
import { LEADERSHIP, peopleByGroup, type Person } from "@/lib/content/company";
import { color, inkA, mistA, shadow } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Leadership",
  description: PANELS.leadership.desc,
};

/**
 * A single person tile: square PlaceholderImage avatar over name + role + bio.
 * Pure presentational — server-safe (no client hooks).
 */
function PersonCard({ person }: { person: Person }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        borderRadius: 16,
        border: `1px solid ${inkA(0.08)}`,
        boxShadow: shadow.card,
        overflow: "hidden",
        height: "100%",
      }}
    >
      <div style={{ position: "relative", aspectRatio: "1 / 1", width: "100%" }}>
        <PlaceholderImage
          seed={person.seed}
          variant="dark"
          style={{ position: "absolute", inset: 0 }}
        />
      </div>
      <div style={{ padding: "26px 28px 30px", display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: 24,
            fontWeight: 500,
            lineHeight: 1.15,
            color: color.ink,
          }}
        >
          {person.name}
        </span>
        <span
          style={{
            marginTop: 8,
            fontSize: 12.5,
            fontWeight: 700,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: color.brand,
          }}
        >
          {person.role}
        </span>
        <span
          style={{
            marginTop: 16,
            fontSize: 15.5,
            lineHeight: 1.55,
            color: inkA(0.62),
          }}
        >
          {person.bio}
        </span>
      </div>
    </div>
  );
}

export default function LeadershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Our people"
        title={LEADERSHIP.hero.title}
        lede={LEADERSHIP.hero.lede}
        cta={{ label: "Work with us", href: "/careers" }}
        secondaryCta={{ label: "Start a conversation", href: "/contact" }}
      />

      {/* One anchored section per group: Partners / Advisors / Operators / Researchers */}
      {LEADERSHIP.groups.map((g, i) => {
        const people = peopleByGroup(g.group);
        if (people.length === 0) return null;
        return (
          <Section
            key={g.group}
            id={slugify(g.label)}
            className="scroll-mt-[110px]"
            tone={i % 2 === 0 ? "paper" : "paper2"}
          >
            <Eyebrow label={g.label} tone="brand" style={{ marginBottom: 22 }} />
            <p
              style={{
                fontSize: 18,
                lineHeight: 1.62,
                color: inkA(0.66),
                maxWidth: "60ch",
                marginBottom: 44,
              }}
            >
              {g.blurb}
            </p>
            <CardGrid columns={3}>
              {people.map((p) => (
                <PersonCard key={p.name} person={p} />
              ))}
            </CardGrid>
          </Section>
        );
      })}

      {/* How we staff — honest, no false company-affiliation logos. */}
      <Section tone="ink">
        <Eyebrow label="How we staff an engagement" tone="azure" style={{ marginBottom: 28 }} />
        <h2
          style={{
            fontFamily: "var(--font-newsreader)",
            fontWeight: 400,
            fontSize: "clamp(28px,3vw,44px)",
            lineHeight: 1.06,
            letterSpacing: "-0.015em",
            color: color.mist,
            maxWidth: "22ch",
          }}
        >
          Senior practitioners, on the work from day one
        </h2>
        <p
          style={{
            marginTop: 28,
            maxWidth: "62ch",
            fontSize: 18,
            lineHeight: 1.62,
            color: mistA(0.7),
          }}
        >
          Every engagement is led by a senior practitioner who has built and
          shipped real systems — no junior bench, no hand-off to a team you
          never met. You work directly with the people doing the work, and we
          hold ourselves to the bar we&rsquo;d expect on the other side of the
          table.
        </p>
      </Section>

      <CTASection
        title="Want to build with people like this?"
        body="We hire operators and engineers who would rather ship than advise. If that sounds like you, we should talk."
        primary={{ label: "See open roles", href: "/careers" }}
        secondary={{ label: "Start a conversation", href: "/contact" }}
        shader
      />
    </>
  );
}
