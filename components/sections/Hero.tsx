"use client";

import Link from "next/link";
import ShaderField from "@/components/ShaderField";
import { HeroStagger, HeroItem, Magnetic } from "@/lib/motion";
import { gradient, inkA, shadow } from "@/lib/theme";

export default function Hero() {
  return (
    <section
      id="top"
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: gradient.heroWash,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Animated mesh */}
      <ShaderField style={{ zIndex: 0 }} />

      {/* Light vignette */}
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
        style={{
          position: "relative",
          zIndex: 5,
          flex: 1,
          maxWidth: 1340,
          width: "100%",
          margin: "0 auto",
          padding: "40px 50px 88px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <HeroStagger>
          <HeroItem>
            <p
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
            </p>
          </HeroItem>

          <HeroItem>
            <h1
              style={{
                fontFamily: "var(--font-newsreader)",
                fontWeight: 500,
                fontSize: "clamp(52px,7.4vw,108px)",
                lineHeight: 0.96,
                letterSpacing: "-0.025em",
                color: "#112138",
                maxWidth: "14ch",
                textWrap: "balance",
              }}
            >
              Where strategic clarity meets applied AI
            </h1>
          </HeroItem>

          <HeroItem>
            <p
              style={{
                marginTop: 38,
                fontSize: "clamp(20px,1.7vw,26px)",
                lineHeight: 1.4,
                color: inkA(0.72),
                maxWidth: "34ch",
              }}
            >
              We&rsquo;re built for leaders who need more than advice &mdash; they
              need it shipped.
            </p>
          </HeroItem>

          <HeroItem style={{ marginTop: 44 }}>
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
          </HeroItem>
        </HeroStagger>
      </div>
    </section>
  );
}
