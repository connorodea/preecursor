"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import PlaceholderImage from "@/components/PlaceholderImage";
import { Eyebrow } from "./_shared";
import { color, inkA, gradient, shadow } from "@/lib/theme";

const PAD_LEFT = 2; // matches scroller padding-left

type Card = {
  seed: string;
  width: number;
  stat: string;
  statLabel: string;
  eyebrow: string;
  title: string;
  /** larger card carries a full body + CTA */
  body?: string;
  subtitle?: string;
  href?: string;
  large?: boolean;
};

const CARDS: Card[] = [
  {
    seed: "work-1",
    width: 700,
    stat: "−63%",
    statLabel: "Cycle time",
    eyebrow: "Client impact",
    title: "Underwriting copilot",
    body: "For a global bank: an agent that drafts and checks credit memos against policy in real time — in production in eight weeks.",
    href: "/work/underwriting-copilot",
    large: true,
  },
  {
    seed: "work-2",
    width: 440,
    stat: "$180M",
    statLabel: "Annual savings",
    eyebrow: "Client impact",
    title: "Predictive operations",
    subtitle: "Industrial manufacturer",
  },
  {
    seed: "work-3",
    width: 440,
    stat: "11 hrs",
    statLabel: "Per clinician / week",
    eyebrow: "Client impact",
    title: "Clinical documentation",
    subtitle: "Healthcare network",
  },
  {
    seed: "work-4",
    width: 440,
    stat: "−41%",
    statLabel: "Mean time to repair",
    eyebrow: "Client impact",
    title: "Network ops copilot",
    subtitle: "Telecommunications",
  },
];

export default function SelectedWork() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(0);

  // drag-to-scroll state
  const drag = useRef({ down: false, startX: 0, startScroll: 0, moved: false });

  const onScrollWork = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const target = el.scrollLeft + PAD_LEFT;
    let nearest = 0;
    let best = Infinity;
    cardRefs.current.forEach((c, i) => {
      if (!c) return;
      const d = Math.abs(c.offsetLeft - target);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    setActive(nearest);
  }, []);

  const scrollWorkTo = useCallback((i: number) => {
    const el = scrollerRef.current;
    const card = cardRefs.current[i];
    if (!el || !card) return;
    el.scrollTo({ left: card.offsetLeft - PAD_LEFT, behavior: "smooth" });
  }, []);

  // keep dots accurate on mount / resize
  useEffect(() => {
    onScrollWork();
  }, [onScrollWork]);

  // --- pointer drag handlers ---
  const onPointerDown = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = {
      down: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
    };
    el.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    if (!el || !drag.current.down) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.startScroll - dx;
  };
  const endDrag = (e: React.PointerEvent) => {
    const el = scrollerRef.current;
    drag.current.down = false;
    el?.releasePointerCapture?.(e.pointerId);
  };
  // suppress click navigation that happens right after a drag
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <section id="work" style={{ background: "#e1e8f1" }}>
      <div style={{ maxWidth: 1340, margin: "0 auto", padding: "104px 50px" }}>
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 40,
            marginBottom: 54,
          }}
        >
          <div>
            <Eyebrow
              label="Selected work"
              barColor={color.brand}
              textColor={color.brand}
              style={{ marginBottom: 22 }}
            />
            <h2
              style={{
                fontFamily: "var(--font-newsreader)",
                fontSize: "clamp(34px,3.4vw,50px)",
                lineHeight: 1.04,
                letterSpacing: "-0.015em",
                color: color.ink,
                maxWidth: "18ch",
              }}
            >
              Outcomes we can point to.
            </h2>
          </div>
          <Link
            href="/work"
            className="group inline-flex items-center transition-[gap] duration-300 [gap:8px] hover:[gap:14px]"
            style={{ color: color.ink, textDecoration: "none", fontWeight: 600 }}
          >
            All case studies <span style={{ color: color.brand }}>&rarr;</span>
          </Link>
        </div>

        {/* Horizontal scroller */}
        <div
          ref={scrollerRef}
          className="no-scrollbar"
          onScroll={onScrollWork}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={onClickCapture}
          style={{
            display: "flex",
            gap: 24,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            padding: "22px 2px 42px",
            cursor: "grab",
            touchAction: "pan-y",
          }}
        >
          {CARDS.map((card, i) => (
            <div
              key={card.seed}
              ref={(node) => {
                cardRefs.current[i] = node;
              }}
              style={{
                position: "relative",
                flex: `0 0 ${card.width}px`,
                height: 540,
                borderRadius: 10,
                overflow: "hidden",
                scrollSnapAlign: "start",
                boxShadow: shadow.card,
              }}
            >
              <PlaceholderImage
                seed={card.seed}
                variant="dark"
                style={{ position: "absolute", inset: 0 }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: gradient.cardOverlay,
                  mixBlendMode: "multiply",
                }}
              />

              {/* top-left glass stat card */}
              <div
                style={{
                  position: "absolute",
                  top: 24,
                  left: 24,
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                  borderRadius: 16,
                  padding: "16px 22px",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-newsreader)",
                    fontSize: 34,
                    lineHeight: 1,
                    color: color.ink,
                  }}
                >
                  {card.stat}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: inkA(0.6),
                    marginTop: 6,
                  }}
                >
                  {card.statLabel}
                </div>
              </div>

              {/* bottom content card */}
              {card.large ? (
                <div
                  style={{
                    position: "absolute",
                    right: 24,
                    bottom: 24,
                    width: "62%",
                    maxWidth: 380,
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    borderRadius: 20,
                    padding: 28,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: color.brand,
                    }}
                  >
                    {card.eyebrow}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-newsreader)",
                      fontSize: 30,
                      lineHeight: 1.05,
                      color: color.ink,
                      marginTop: 10,
                    }}
                  >
                    {card.title}
                  </div>
                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 1.5,
                      color: inkA(0.66),
                      marginTop: 12,
                    }}
                  >
                    {card.body}
                  </p>
                  <Link
                    href={card.href ?? "/work"}
                    className="bg-[#1b4fc7] hover:bg-[#112138] transition-colors"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      marginTop: 18,
                      color: color.mist,
                      borderRadius: 999,
                      padding: "10px 20px",
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      textDecoration: "none",
                    }}
                  >
                    Learn more &rarr;
                  </Link>
                </div>
              ) : (
                <div
                  style={{
                    position: "absolute",
                    left: 24,
                    right: 24,
                    bottom: 24,
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    borderRadius: 20,
                    padding: 24,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      color: color.brand,
                    }}
                  >
                    {card.eyebrow}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-newsreader)",
                      fontSize: 25,
                      lineHeight: 1.1,
                      color: color.ink,
                      marginTop: 10,
                    }}
                  >
                    {card.title}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: inkA(0.6),
                      marginTop: 6,
                    }}
                  >
                    {card.subtitle}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Below scroller */}
        <div
          style={{
            marginTop: 34,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <Link
            href="/work"
            className="border-[1.5px] border-[rgba(17,33,56,0.28)] hover:border-[#112138] transition-colors"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              borderRadius: 999,
              padding: "14px 26px",
              color: color.ink,
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            See more stories &rarr;
          </Link>

          {/* dots */}
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            {CARDS.map((_, i) => {
              const isActive = i === active;
              return (
                <button
                  key={i}
                  type="button"
                  aria-label={`Show case study ${i + 1}`}
                  onClick={() => scrollWorkTo(i)}
                  style={{
                    width: isActive ? 26 : 9,
                    height: 9,
                    borderRadius: 999,
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    background: isActive ? color.brand : inkA(0.22),
                    transition: "width .3s, background .3s",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
