"use client";

import PlaceholderImage from "@/components/PlaceholderImage";
import { Reveal } from "@/lib/motion";
import { gradient, color, mistA } from "@/lib/theme";

export default function FeaturedInsights() {
  return (
    <section style={{ background: gradient.inkBand("15% -10%"), color: color.mist }}>
      {/* Top split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Reveal
          className="px-6 pt-20 md:px-10 lg:pt-[104px] lg:pr-14 lg:pb-0 lg:pl-[max(50px,calc((100vw-1340px)/2+50px))]"
        >
          <p
            style={{
              fontSize: 18,
              color: mistA(0.7),
              marginBottom: 24,
            }}
          >
            Featured Insights
          </p>
          <h2
            style={{
              fontFamily: "var(--font-newsreader)",
              fontSize: "clamp(36px,3.8vw,56px)",
              lineHeight: 1.04,
              letterSpacing: "-0.018em",
              color: color.mist,
              maxWidth: "16ch",
            }}
          >
            Our sharpest thinking on the systems shaping applied AI.
          </h2>
        </Reveal>

        <div
          className="mt-12 min-h-[300px] md:mt-0 md:min-h-[440px]"
          style={{
            position: "relative",
            overflow: "hidden",
          }}
        >
          <PlaceholderImage
            seed="ins-1"
            variant="dark"
            style={{ position: "absolute", inset: 0 }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(120deg,#112138 0%,rgba(17,33,56,0.2) 45%,rgba(95,200,232,0.25))",
            }}
          />
        </div>
      </div>

      {/* Newsletter bar */}
      <div className="relative mx-auto max-w-[1340px] px-6 md:px-10 lg:px-[50px]">
        <div
          className="relative z-10 mt-[-64px] mb-[-52px] flex flex-col items-start gap-7 p-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-10 md:mt-[-84px] md:mb-[-68px] md:p-[46px_52px]"
          style={{
            // Semi-opaque frosted navy so the card reads as one cohesive piece
            // whether it sits over the dark band above or the light section it
            // now overlaps below.
            background: "rgba(17,33,56,0.78)",
            backdropFilter: "blur(16px) saturate(1.2)",
            WebkitBackdropFilter: "blur(16px) saturate(1.2)",
            border: `1px solid ${mistA(0.16)}`,
            borderRadius: 22,
            boxShadow: "0 34px 80px -26px rgba(11,19,34,0.62)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-newsreader)",
              fontSize: "clamp(26px,2.4vw,38px)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              color: "#fff",
            }}
          >
            Get the latest delivered to you
          </div>

          <div
            className="w-full pl-6 sm:w-auto sm:min-w-[400px] sm:max-w-[540px] sm:flex-1 sm:pl-7"
            style={{
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: 999,
              paddingTop: 7,
              paddingRight: 7,
              paddingBottom: 7,
            }}
          >
            <input
              type="email"
              placeholder="Enter email"
              aria-label="Email address"
              style={{
                flex: 1,
                border: "none",
                background: "transparent",
                fontSize: 16,
                color: color.ink,
                minWidth: 0,
              }}
            />
            <button
              type="button"
              className="bg-[#1b4fc7] hover:bg-[#112138] transition-colors"
              style={{
                border: "none",
                cursor: "pointer",
                color: color.mist,
                borderRadius: 999,
                padding: "15px 30px",
                fontWeight: 700,
                fontSize: 14.5,
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}
            >
              Subscribe &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
