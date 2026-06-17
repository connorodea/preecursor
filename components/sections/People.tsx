"use client";

import { Reveal } from "@/lib/motion";
import { Eyebrow, EdgeFade } from "./_shared";
import { gradient, color, mistA } from "@/lib/theme";

const LOGOS = ["OpenAI", "DeepMind", "McKinsey", "Stripe", "Google", "Palantir"];

export default function People() {
  return (
    <section
      id="people"
      style={{
        position: "relative",
        overflow: "hidden",
        background: gradient.inkBand("18% -10%"),
        color: color.mist,
      }}
    >
      <EdgeFade topColor={color.paper} bottomColor={color.paper2} size={130} />
      <div className="relative mx-auto max-w-[1340px] px-6 py-20 md:px-10 lg:px-[50px] lg:py-[104px]">
        <div
          className="grid grid-cols-1 items-end lg:grid-cols-2"
          style={{
            gap: 60,
          }}
        >
          <Reveal>
            <Eyebrow
              label="Our people"
              barColor={color.azure}
              textColor={color.azure}
              style={{ marginBottom: 22 }}
            />
            <h2
              style={{
                fontFamily: "var(--font-newsreader)",
                fontSize: "clamp(34px,3.4vw,52px)",
                lineHeight: 1.04,
                letterSpacing: "-0.015em",
                color: color.mist,
              }}
            >
              Engineers and operators from the rooms where the standard gets
              set.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p
              style={{
                fontSize: 18.5,
                lineHeight: 1.62,
                color: mistA(0.7),
              }}
            >
              Our partners have led research at frontier labs, scaled platforms
              at the companies you use every day, and run the kind of P&amp;L our
              clients answer to. We&rsquo;ve been on your side of the table.
            </p>
          </Reveal>
        </div>

        {/* Logo row */}
        <div
          style={{
            marginTop: 64,
            borderTop: `1px solid ${mistA(0.2)}`,
            paddingTop: 38,
            display: "flex",
            flexWrap: "wrap",
            gap: "18px 56px",
          }}
        >
          {LOGOS.map((logo) => (
            <span
              key={logo}
              style={{
                fontFamily: "var(--font-newsreader)",
                fontSize: 26,
                color: mistA(0.82),
              }}
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
