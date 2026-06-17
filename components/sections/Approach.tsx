"use client";

import { Reveal } from "@/lib/motion";
import { Eyebrow } from "./_shared";
import { EmbedIcon, OutcomeIcon, HandoffIcon } from "@/components/icons";
import { color, inkA } from "@/lib/theme";

const ITEMS = [
  {
    Icon: EmbedIcon,
    title: "Embedded, not arm's length",
    body: "We sit inside your teams, in your tools and your standups. Decisions happen in the room, not three weeks later in a readout.",
  },
  {
    Icon: OutcomeIcon,
    title: "Outcomes, not decks",
    body: "Every engagement is measured against a number you agreed to move. The work isn't done when the slides are pretty — it's done when the metric moves.",
  },
  {
    Icon: HandoffIcon,
    title: "Built to hand off",
    body: "We're optimizing for the day we leave. Documentation, training, and clean architecture mean your people run it — and improve it — without us.",
  },
];

export default function Approach() {
  return (
    <section id="approach">
      <div className="mx-auto max-w-[1340px] px-6 py-20 md:px-10 lg:px-[50px] lg:py-[108px]">
        <Eyebrow
          label="How we work"
          barColor={color.brand}
          textColor={color.brand}
          style={{ marginBottom: 54 }}
        />
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {ITEMS.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.08} className="group">
              <it.Icon
                size={30}
                className="text-brand transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-azure"
                style={{ marginBottom: 22, transformOrigin: "left bottom" }}
              />
              <h3
                style={{
                  fontFamily: "var(--font-newsreader)",
                  fontWeight: 500,
                  fontSize: 30,
                  lineHeight: 1.1,
                  color: color.ink,
                  marginBottom: 16,
                }}
              >
                {it.title}
              </h3>
              <p
                style={{
                  fontSize: 16.5,
                  lineHeight: 1.6,
                  color: inkA(0.64),
                }}
              >
                {it.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
