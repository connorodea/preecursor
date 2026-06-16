"use client";

/**
 * CTASection — the full-width closing call-to-action. Generalizes the landing
 * ContactCTA: centered serif headline + lede over the heroWash, with an
 * optional animated ShaderField behind it, and primary (dark) + secondary
 * (outline) pills.
 */

import ShaderField from "@/components/ShaderField";
import { Reveal } from "@/lib/motion";
import { color, gradient, inkA, container } from "@/lib/theme";
import PillLink from "./PillLink";

type Primary = { label: string; href: string; external?: boolean };
type Secondary = { label: string; href: string };

type Props = {
  title: string;
  body?: string;
  primary: Primary;
  secondary?: Secondary;
  /** Render the animated shader mesh behind the content. Defaults true. */
  shader?: boolean;
};

export default function CTASection({
  title,
  body,
  primary,
  secondary,
  shader = true,
}: Props) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: gradient.heroWash,
      }}
    >
      {shader && <ShaderField style={{ zIndex: 0 }} />}

      <div
        className={container}
        style={{
          position: "relative",
          zIndex: 5,
          padding: "120px 50px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Reveal>
          <h2
            style={{
              fontFamily: "var(--font-newsreader)",
              fontWeight: 500,
              fontSize: "clamp(40px,5.2vw,72px)",
              lineHeight: 0.99,
              letterSpacing: "-0.025em",
              color: color.ink,
              maxWidth: "16ch",
              textWrap: "balance",
            }}
          >
            {title}
          </h2>
        </Reveal>

        {body && (
          <Reveal delay={0.08}>
            <p
              style={{
                marginTop: 26,
                fontSize: "clamp(18px,1.5vw,22px)",
                lineHeight: 1.5,
                color: inkA(0.7),
                maxWidth: "46ch",
              }}
            >
              {body}
            </p>
          </Reveal>
        )}

        <Reveal delay={0.16}>
          <div
            style={{
              marginTop: 44,
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <PillLink
              href={primary.href}
              variant="dark"
              external={primary.external}
            >
              {primary.label}
            </PillLink>
            {secondary && (
              <PillLink href={secondary.href} variant="outline">
                {secondary.label}
              </PillLink>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
