"use client";

import Link from "next/link";
import ShaderField from "@/components/ShaderField";
import { Reveal, Magnetic } from "@/lib/motion";
import { color, inkA } from "@/lib/theme";

export default function ContactCTA() {
  return (
    <section
      id="contact"
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(125deg,#d8e6f7 0%,#e6eefb 45%,#d2e4f5 100%)",
      }}
    >
      <ShaderField style={{ zIndex: 0 }} />

      <div
        className="mx-auto max-w-[1340px] px-6 py-24 md:px-10 lg:px-[50px] lg:py-[128px]"
        style={{
          position: "relative",
          zIndex: 5,
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
              fontSize: "clamp(44px,5.6vw,84px)",
              lineHeight: 0.98,
              letterSpacing: "-0.025em",
              color: color.ink,
              maxWidth: "16ch",
              textWrap: "balance",
            }}
          >
            Let&rsquo;s build what&rsquo;s next.
          </h2>
        </Reveal>

        <Reveal delay={0.08}>
          <p
            style={{
              marginTop: 30,
              fontSize: "clamp(18px,1.5vw,22px)",
              lineHeight: 1.5,
              color: inkA(0.7),
              maxWidth: "46ch",
            }}
          >
            Tell us the outcome you&rsquo;re chasing. We&rsquo;ll tell you,
            honestly, whether AI is the way to get there — and how fast.
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          <div
            style={{
              marginTop: 44,
              display: "flex",
              gap: 18,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Magnetic>
              <a
                href="mailto:hello@preecursor.com"
                className="bg-[#112138] hover:bg-[#1b4fc7] transition-colors"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 999,
                  padding: "18px 36px",
                  color: color.mist,
                  fontWeight: 700,
                  fontSize: 14,
                  letterSpacing: "0.05em",
                  textDecoration: "none",
                }}
              >
                Start a conversation
              </a>
            </Magnetic>

            <Magnetic>
              <Link
                href="/work"
                className="border-[1.5px] border-[rgba(17,33,56,0.3)] hover:border-[#112138] transition-colors"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 999,
                  padding: "18px 36px",
                  color: color.ink,
                  fontWeight: 600,
                  fontSize: 14,
                  textDecoration: "none",
                }}
              >
                See our work
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
