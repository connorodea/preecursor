import type { Metadata } from "next";
import PlaceholderImage from "@/components/PlaceholderImage";
import {
  PageHero,
  Section,
  ContentSplit,
  StatBand,
  CTASection,
  Eyebrow,
} from "@/components/ui";
import { PANELS, slugify } from "@/lib/ia";
import { OFFICES, REMOTE } from "@/lib/content/world";
import { color, inkA } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Worldwide",
  description: PANELS.worldwide.desc,
};

export default function WorldwidePage() {
  return (
    <>
      <PageHero
        eyebrow="Our locations"
        title="Preecursor Worldwide"
        lede="One firm, embedded close to where our clients build. Studios in New York, London, and Singapore, with remote-first practitioners across every major time zone."
        cta={{ label: "Start a conversation", href: "/contact" }}
        secondaryCta={{ label: "See our work", href: "/work" }}
      />

      {/* Per-office anchored splits — alternating media side. */}
      {OFFICES.map((office, i) => (
        <Section
          key={office.city}
          id={slugify(office.city)}
          className="scroll-mt-[110px]"
          tone={i % 2 === 0 ? "paper" : "paper3"}
          py={0}
        >
          <ContentSplit
            eyebrow={office.region}
            title={office.city}
            body={office.blurb}
            reverse={i % 2 === 1}
            media={
              <PlaceholderImage
                seed={office.seed}
                variant="light"
                style={{ position: "absolute", inset: 0 }}
              />
            }
          />
          <div
            className="mx-auto max-w-[1340px] px-6 pb-2 md:px-10 lg:px-[50px]"
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: inkA(0.5),
            }}
          >
            {office.addressHint}
          </div>
        </Section>
      ))}

      {/* Remote-first teams — note exact id "remote-first-teams". */}
      <Section
        id="remote-first-teams"
        className="scroll-mt-[110px]"
        tone="paper2"
      >
        <div style={{ maxWidth: "62ch" }}>
          <Eyebrow
            label="Remote-first teams"
            tone="brand"
            style={{ marginBottom: 22 }}
          />
          <h2
            style={{
              fontFamily: "var(--font-newsreader)",
              fontWeight: 400,
              fontSize: "clamp(30px,3vw,46px)",
              lineHeight: 1.04,
              letterSpacing: "-0.018em",
              color: color.ink,
            }}
          >
            The right senior person, in your time zone
          </h2>
          {REMOTE.blurb.map((p, i) => (
            <p
              key={i}
              style={{
                marginTop: i === 0 ? 24 : 18,
                fontSize: 18,
                lineHeight: 1.62,
                color: inkA(0.66),
              }}
            >
              {p}
            </p>
          ))}
        </div>
      </Section>

      <StatBand
        eyebrow="By the numbers"
        stats={[
          { value: 24, suffix: "/7", label: "Coverage across every major time zone" },
          { value: 14, suffix: "+", label: "Countries our practitioners work from" },
          { value: 3, label: "Studios — New York, London, Singapore" },
          { value: 100, suffix: "%", label: "Engagements led by a senior practitioner" },
        ]}
      />

      <CTASection
        title="Wherever you build, we can be there"
        body="Tell us where your teams sit and what you need to move. We will staff the engagement with senior people in your time zone — on-site when it matters."
        primary={{ label: "Start a conversation", href: "/contact" }}
        secondary={{ label: "See our work", href: "/work" }}
        shader
      />
    </>
  );
}
