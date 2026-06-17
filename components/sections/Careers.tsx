"use client";

import Link from "next/link";
import PlaceholderImage from "@/components/PlaceholderImage";
import { Reveal } from "@/lib/motion";
import { Eyebrow } from "./_shared";
import SectionSeam from "./SectionSeam";
import { color, inkA } from "@/lib/theme";

export default function Careers() {
  return (
    <section
      style={{ position: "relative", overflow: "hidden", background: color.paper2 }}
    >
      {/* Symmetric seams — rises out of the People navy pool at the top and
          sinks into the FeaturedInsights navy pool at the bottom. */}
      <SectionSeam edge="top" from={color.ink} to={color.paper2} />
      <SectionSeam edge="bottom" from={color.paper2} to={color.ink} />
      <div className="relative z-[1] grid grid-cols-1 items-stretch lg:grid-cols-2">
        {/* Left — copy */}
        <Reveal
          className="px-6 pt-[180px] pb-[180px] md:px-10 lg:pt-[240px] lg:pb-[240px] lg:pr-14 lg:pl-[max(50px,calc((100vw-1340px)/2+50px))]"
        >
          <Eyebrow
            label="Preecursor careers"
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
            Go beyond the expected
          </h2>
          <p
            style={{
              marginTop: 26,
              fontSize: 18.5,
              lineHeight: 1.6,
              color: inkA(0.66),
              maxWidth: "42ch",
            }}
          >
            We hire operators and engineers who would rather ship than advise.
            Join a team that builds the systems other firms only present.
          </p>
          <div style={{ marginTop: 36, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link
              href="/careers"
              className="border-[1.5px] border-[rgba(17,33,56,0.28)] hover:border-[#112138] transition-colors"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                padding: "16px 28px",
                color: color.ink,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
              }}
            >
              Explore roles &#8599;
            </Link>
            <Link
              href="/careers"
              className="bg-[#1b4fc7] hover:bg-[#112138] transition-colors"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                padding: "16px 28px",
                color: color.mist,
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.04em",
                textDecoration: "none",
              }}
            >
              Apply today &#8599;
            </Link>
          </div>
        </Reveal>

        {/* Right — framed image. Extra vertical padding keeps the frame clear
            of the top + bottom ramps. */}
        <div
          className="min-h-[420px] px-10 py-[200px] md:min-h-[560px] md:px-14 md:py-[240px]"
          style={{
            position: "relative",
            overflow: "hidden",
            background:
              "radial-gradient(circle at 70% 40%, rgba(95,200,232,0.5), transparent 55%), radial-gradient(circle at 40% 80%, rgba(91,141,239,0.45), transparent 55%), #0b1322",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "78%",
              maxWidth: 440,
              aspectRatio: "4 / 5",
              border: "10px solid #fff",
              boxShadow: "0 30px 70px -24px rgba(11,19,34,0.6)",
              overflow: "hidden",
            }}
          >
            <PlaceholderImage
              seed="car-1"
              variant="dark"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
