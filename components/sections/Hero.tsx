"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import ShaderField from "@/components/ShaderField";
import SectionSeam from "./SectionSeam";
import { EASE, Magnetic } from "@/lib/motion";
import { gradient, inkA, shadow, color, WASH_EDGE } from "@/lib/theme";

export default function Hero() {
  const reduce = useReducedMotion();

  // A fade + short rise, sequenced by `delay`. Static under reduced motion.
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, ease: EASE, delay },
        };

  return (
    <section
      id="top"
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        // Wash flattened so its bottom edge is a uniform WASH_EDGE — the seam
        // below ramps cleanly from that single colour into the navy band.
        background: gradient.washFlat(WASH_EDGE),
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Animated aurora field — reacts subtly to the pointer in the hero.
          Masked so the aurora thins out toward the navy band below. */}
      <ShaderField
        interactive
        style={{ zIndex: 0 }}
        maskImage="linear-gradient(180deg, #000 0%, #000 52%, transparent 88%)"
      />

      {/* Bottom seam — the page sinks from the light wash into the navy
          ImpactBand below. Owned here (the light side carries the ramp). */}
      <SectionSeam edge="bottom" from={WASH_EDGE} to={color.ink} />

      {/* Light vignette for headline legibility. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "radial-gradient(115% 100% at 15% 42%, rgba(255,255,255,0.62), rgba(255,255,255,0.12) 46%, rgba(255,255,255,0) 70%)",
        }}
      />

      {/* Hero content */}
      <div
        className="mx-auto w-full max-w-[1340px] px-6 pt-10 pb-[180px] md:px-10 lg:px-[50px] lg:pb-[240px]"
        style={{
          position: "relative",
          zIndex: 5,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <motion.p
          {...rise(0.15)}
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            letterSpacing: "0.24em",
            color: "#112138",
            textTransform: "uppercase",
            marginBottom: 40,
          }}
        >
          Welcome to Preecursor
        </motion.p>

        {/* Headline — cinematic mask reveal (wipes up from behind a clip). */}
        <div style={{ overflow: "hidden", paddingBottom: "0.12em" }}>
          {reduce ? (
            <h1 style={headlineStyle}>Where strategic clarity meets applied AI</h1>
          ) : (
            <motion.h1
              initial={{ y: "115%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.05, ease: EASE, delay: 0.28 }}
              style={headlineStyle}
            >
              Where strategic clarity meets applied AI
            </motion.h1>
          )}
        </div>

        <motion.p
          {...rise(0.55)}
          style={{
            marginTop: 38,
            fontSize: "clamp(20px,1.7vw,26px)",
            lineHeight: 1.4,
            color: inkA(0.72),
            maxWidth: "34ch",
          }}
        >
          We&rsquo;re built for leaders who need more than advice &mdash; they need
          it shipped.
        </motion.p>

        <motion.div {...rise(0.68)} style={{ marginTop: 44 }}>
          <Magnetic>
            <Link
              href="/capabilities"
              className="bg-[#5b8def] hover:bg-[#3f6fd8] transition-colors"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                color: "#112138",
                borderRadius: 999,
                padding: "18px 34px",
                boxShadow: shadow.cta,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              See how we work
            </Link>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}

const headlineStyle: React.CSSProperties = {
  fontFamily: "var(--font-newsreader)",
  fontWeight: 500,
  fontSize: "clamp(52px,7.4vw,108px)",
  lineHeight: 0.96,
  letterSpacing: "-0.025em",
  color: "#112138",
  maxWidth: "14ch",
  textWrap: "balance",
};
