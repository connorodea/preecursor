"use client";

import { Reveal } from "@/lib/motion";
import { Eyebrow, EdgeFade } from "./_shared";
import EducationMarks from "./EducationMarks";
import { gradient, color, mistA } from "@/lib/theme";

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
              Senior engineers and operators who hold the work to a high
              standard.
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
              Every engagement is led by a senior practitioner — someone who has
              built and shipped real systems and carried the kind of P&amp;L our
              clients answer to. You work directly with the people doing the
              work, and we hold ourselves to the bar we&rsquo;d expect on the
              other side of the table.
            </p>
          </Reveal>
        </div>

        {/* Co-founder graduate credentials */}
        <Reveal delay={0.18}>
          <div
            style={{
              marginTop: 56,
              paddingTop: 32,
              borderTop: `1px solid ${mistA(0.18)}`,
            }}
          >
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: mistA(0.5),
                marginBottom: 24,
              }}
            >
              Our co-founders earned their master&rsquo;s degrees at
            </div>
            <EducationMarks />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
