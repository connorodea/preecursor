"use client";

import PlaceholderImage from "@/components/PlaceholderImage";
import { Reveal } from "@/lib/motion";
import { gradient, color, mistA } from "@/lib/theme";

export default function FeaturedInsights() {
  return (
    <section style={{ background: gradient.inkBand("15% -10%"), color: color.mist }}>
      {/* Top split grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <Reveal
          style={{
            padding:
              "104px 56px 0 max(50px, calc((100vw - 1340px) / 2 + 50px))",
          }}
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
          style={{
            position: "relative",
            minHeight: 440,
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
      <div
        style={{
          maxWidth: 1340,
          margin: "0 auto",
          padding: "0 50px",
          position: "relative",
        }}
      >
        <div
          style={{
            marginTop: -46,
            marginBottom: 88,
            background: mistA(0.1),
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border: `1px solid ${mistA(0.14)}`,
            borderRadius: 18,
            padding: "30px 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 32,
            flexWrap: "wrap",
            boxShadow: "0 24px 60px -24px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-newsreader)",
              fontSize: "clamp(22px,2vw,30px)",
              color: "#fff",
            }}
          >
            Get the latest delivered to you
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#fff",
              borderRadius: 999,
              padding: "6px 6px 6px 24px",
              minWidth: 340,
              flex: 1,
              maxWidth: 460,
            }}
          >
            <input
              type="email"
              placeholder="Enter email"
              aria-label="Email address"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 15,
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
                padding: "12px 22px",
                fontWeight: 700,
                fontSize: 13.5,
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
