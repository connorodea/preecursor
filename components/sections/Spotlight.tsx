"use client";

import Link from "next/link";
import PlaceholderImage from "@/components/PlaceholderImage";
import { Reveal } from "@/lib/motion";
import SectionSeam from "./SectionSeam";
import { NetworkIcon, LabsIcon } from "@/components/icons";
import { color, mistA } from "@/lib/theme";

/** Azure pill shared by the spotlight cards. */
function AzurePill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="bg-[#5b8def] hover:bg-[#7fa6f2] transition-colors"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        borderRadius: 999,
        padding: "12px 22px",
        color: "#0b1322",
        fontWeight: 700,
        fontSize: 13.5,
        letterSpacing: "0.03em",
        textDecoration: "none",
      }}
    >
      {children}
    </Link>
  );
}

function SmallEyebrow({ label }: { label: string }) {
  return (
    <span
      style={{
        fontSize: 12.5,
        fontWeight: 700,
        letterSpacing: "0.24em",
        textTransform: "uppercase",
        color: color.azure,
      }}
    >
      {label}
    </span>
  );
}

export default function Spotlight() {
  return (
    <section
      style={{ position: "relative", overflow: "hidden", background: color.paper }}
    >
      {/* Subtle light↔light seam — paper2 (SelectedWork) into paper. */}
      <SectionSeam edge="top" from={color.paper2} to={color.paper} height={150} />
      <div
        className="relative z-[1] mx-auto grid max-w-[1340px] grid-cols-1 px-6 py-20 md:px-10 lg:grid-cols-2 lg:grid-rows-[auto_auto] lg:px-[50px] lg:py-[108px]"
        style={{
          gap: 24,
        }}
      >
        {/* Tall left card */}
        <Reveal
          className="lg:row-span-2"
          style={{
            position: "relative",
            minHeight: 620,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 26px 56px -22px rgba(17,33,56,0.36)",
          }}
        >
          <PlaceholderImage
            seed="spot-1"
            variant="dark"
            style={{ position: "absolute", inset: 0 }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(155deg,rgba(27,79,199,0.5),rgba(95,200,232,0.24) 55%,rgba(17,33,56,0.5))",
              mixBlendMode: "multiply",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              bottom: 40,
            }}
          >
            <span
              style={{
                fontSize: 12.5,
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: mistA(0.85),
              }}
            >
              From ambition to outcomes
            </span>
            <h3
              style={{
                fontFamily: "var(--font-newsreader)",
                fontSize: "clamp(34px,3.4vw,50px)",
                lineHeight: 1.04,
                letterSpacing: "-0.015em",
                color: "#fff",
                margin: "16px 0 22px",
              }}
            >
              Our Client Impact
            </h3>
            <AzurePill href="/work">Explore &rarr;</AzurePill>
          </div>
        </Reveal>

        {/* Top-right card */}
        <Reveal
          delay={0.08}
          style={{
            minHeight: 298,
            borderRadius: 12,
            overflow: "hidden",
            background:
              "radial-gradient(circle at 78% 22%, rgba(95,200,232,0.4), transparent 55%), radial-gradient(circle at 92% 85%, rgba(91,141,239,0.38), transparent 52%), #0b1322",
            padding: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <NetworkIcon size={28} style={{ color: color.azure }} />
            <SmallEyebrow label="Lead with advantage" />
          </div>
          <div>
            <h3
              style={{
                fontFamily: "var(--font-newsreader)",
                fontSize: "clamp(28px,2.6vw,40px)",
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
                color: "#fff",
                maxWidth: "14ch",
                marginBottom: 22,
              }}
            >
              Applied AI at Scale
            </h3>
            <AzurePill href="/capabilities">
              Navigate what&rsquo;s next &rarr;
            </AzurePill>
          </div>
        </Reveal>

        {/* Bottom-right card */}
        <Reveal
          delay={0.16}
          style={{
            minHeight: 298,
            borderRadius: 12,
            overflow: "hidden",
            background:
              "repeating-linear-gradient(118deg, transparent 0 24px, rgba(91,141,239,0.1) 24px 25px), radial-gradient(circle at 86% 60%, rgba(95,200,232,0.34), transparent 55%), #0b1322",
            padding: 40,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <LabsIcon size={28} style={{ color: color.azure }} />
            <SmallEyebrow label="Build tomorrow" />
          </div>
          <div>
            <h3
              style={{
                fontFamily: "var(--font-newsreader)",
                fontSize: "clamp(28px,2.6vw,40px)",
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
                color: "#fff",
                maxWidth: "14ch",
                marginBottom: 22,
              }}
            >
              Meet Preecursor Labs
            </h3>
            <AzurePill href="/labs">
              Start your transformation &rarr;
            </AzurePill>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
