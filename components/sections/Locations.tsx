"use client";

import PlaceholderImage from "@/components/PlaceholderImage";
import { Reveal, Magnetic } from "@/lib/motion";
import { Eyebrow, PillLink } from "./_shared";
import SectionSeam from "./SectionSeam";
import { color, inkA } from "@/lib/theme";

export default function Locations() {
  return (
    <section
      style={{ position: "relative", overflow: "hidden", background: color.paper }}
    >
      {/* Bottom seam — the page sinks from paper into the navy People pool. */}
      <SectionSeam edge="bottom" from={color.paper} to={color.ink} />
      <div
        className="relative z-[1] mx-auto grid max-w-[1340px] grid-cols-1 items-center px-6 pt-20 pb-[180px] md:px-10 lg:grid-cols-[1.12fr_0.88fr] lg:px-[50px] lg:pt-[108px] lg:pb-[240px]"
        style={{
          gap: 60,
        }}
      >
        {/* Left — image */}
        <Reveal
          style={{
            position: "relative",
            height: 460,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 26px 56px -22px rgba(17,33,56,0.32)",
          }}
        >
          <PlaceholderImage
            seed="loc-1"
            variant="light"
            style={{ position: "absolute", inset: 0 }}
          />
        </Reveal>

        {/* Right — copy */}
        <Reveal delay={0.1}>
          <Eyebrow
            label="Our locations"
            barColor={color.brand}
            textColor={color.brand}
            style={{ marginBottom: 22 }}
          />
          <h2
            style={{
              fontFamily: "var(--font-newsreader)",
              fontSize: "clamp(36px,3.8vw,56px)",
              lineHeight: 1.02,
              letterSpacing: "-0.018em",
              color: color.ink,
            }}
          >
            Preecursor Worldwide
          </h2>
          <p
            style={{
              marginTop: 24,
              fontSize: 18,
              lineHeight: 1.6,
              color: inkA(0.66),
              maxWidth: "42ch",
            }}
          >
            Teams embedded close to where our clients build — Denver and
            Detroit, with remote-first practitioners across every major time
            zone.
          </p>
          <div style={{ marginTop: 32 }}>
            <Magnetic>
              <PillLink
                href="/worldwide"
                className="bg-[#1b4fc7] hover:bg-[#112138] transition-colors"
                style={{
                  color: color.mist,
                  padding: "14px 26px",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.04em",
                }}
              >
                Learn more &rarr;
              </PillLink>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
