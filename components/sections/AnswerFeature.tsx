"use client";

import ShaderField from "@/components/ShaderField";
import { Reveal, Magnetic } from "@/lib/motion";
import { Eyebrow, PillLink } from "./_shared";
import { color, inkA, shadow } from "@/lib/theme";

export default function AnswerFeature() {
  return (
    <section style={{ background: "#edf1f7" }}>
      <div
        className="mx-auto grid max-w-[1340px] grid-cols-1 items-center px-6 py-20 md:px-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-[50px] lg:py-[108px]"
        style={{
          gap: 64,
        }}
      >
        {/* Left */}
        <Reveal>
          <Eyebrow
            label="New · AI-powered"
            barColor={color.brand}
            textColor={color.brand}
            style={{ marginBottom: 22 }}
          />
          <h2
            style={{
              fontFamily: "var(--font-newsreader)",
              fontSize: "clamp(40px,4.4vw,64px)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: color.ink,
            }}
          >
            Preecursor Answer
          </h2>
          <p
            style={{
              marginTop: 26,
              fontSize: 18.5,
              lineHeight: 1.62,
              color: inkA(0.66),
              maxWidth: "46ch",
            }}
          >
            Bring your hardest question. Answer assembles a grounded response
            from our applied-AI playbooks, live benchmarks, and the patterns
            behind every system we&rsquo;ve shipped — so you start from what
            already works, not a blank page.
          </p>
          <div style={{ marginTop: 36 }}>
            <Magnetic>
              <PillLink
                href="/contact"
                className="bg-[#1b4fc7] hover:bg-[#112138] transition-colors"
                style={{
                  color: color.mist,
                  padding: "18px 34px",
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.05em",
                }}
              >
                Ask us a question &rarr;
              </PillLink>
            </Magnetic>
          </div>
        </Reveal>

        {/* Right — shader tile */}
        <Reveal
          delay={0.1}
          style={{
            position: "relative",
            height: 480,
            borderRadius: 22,
            overflow: "hidden",
            boxShadow: shadow.cardLg,
          }}
        >
          <ShaderField style={{ zIndex: 0 }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: 22,
                background: "rgba(255,255,255,0.86)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Spark / asterisk mark: horizontal + vertical brand bars +
                  two azure diagonal bars at ±45° */}
              <span
                style={{
                  position: "relative",
                  width: 30,
                  height: 30,
                  display: "block",
                }}
                aria-hidden="true"
              >
                {/* horizontal brand */}
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 0,
                    width: 30,
                    height: 4,
                    marginTop: -2,
                    background: color.brand,
                    borderRadius: 2,
                  }}
                />
                {/* vertical brand */}
                <span
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: 0,
                    width: 4,
                    height: 30,
                    marginLeft: -2,
                    background: color.brand,
                    borderRadius: 2,
                  }}
                />
                {/* azure diagonal +45 */}
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 30,
                    height: 4,
                    marginTop: -2,
                    marginLeft: -15,
                    background: color.azure,
                    borderRadius: 2,
                    transform: "rotate(45deg)",
                  }}
                />
                {/* azure diagonal -45 */}
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: 30,
                    height: 4,
                    marginTop: -2,
                    marginLeft: -15,
                    background: color.azure,
                    borderRadius: 2,
                    transform: "rotate(-45deg)",
                  }}
                />
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
