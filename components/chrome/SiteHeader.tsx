"use client";

/**
 * SiteHeader — the global, fixed header.
 *
 * Transparent container with two frosted-glass pills (left: hamburger + logo,
 * right: search glyph + Log in). The header is `position: fixed` and reserves
 * no layout space — the hero will sit underneath it.
 *
 * Owns no menu state itself; it asks its parent to open the mega-menu via
 * `onOpenMenu`.
 */

import Link from "next/link";
import { glass, shadow, color } from "@/lib/theme";
import { Magnetic } from "@/lib/motion";

const PILL_BASE: React.CSSProperties = {
  ...glass(0.62),
  borderRadius: 18,
  boxShadow: shadow.nav,
  display: "flex",
  alignItems: "center",
};

/** The diamond + wordmark used in the header (and mega-menu). */
function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Preecursor — home"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        textDecoration: "none",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 12,
          height: 12,
          background: color.brand,
          transform: "rotate(45deg)",
          flex: "0 0 auto",
        }}
      />
      <span
        className="text-[18px] tracking-[0.12em] sm:text-[22px] sm:tracking-[0.18em]"
        style={{
          fontWeight: 800,
          color: color.ink,
        }}
      >
        PREECURSOR
      </span>
    </Link>
  );
}

export default function SiteHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
      }}
    >
      <div
        className="mx-auto flex w-full max-w-[1340px] items-center justify-between gap-5 px-4 py-[26px] md:px-[34px]"
      >
        {/* Left pill: hamburger + logo */}
        <div style={{ ...PILL_BASE, padding: "14px 22px", gap: 18 }}>
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open menu"
            aria-haspopup="dialog"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 4,
              width: 22,
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{ width: 22, height: 2, background: color.ink, display: "block" }}
              />
            ))}
          </button>
          <Logo />
        </div>

        {/* Right pill: search glyph + Log in — hidden on mobile (Log in is
            reachable inside the mega-menu), so the two pills never overflow.
            `display` is left to the `hidden md:flex` class — setting it inline
            would override the class and defeat the hide. */}
        <div
          className="hidden md:flex"
          style={{ ...PILL_BASE, display: undefined, padding: "13px 22px", gap: 16 }}
        >
          <SearchGlyph />
          <Magnetic strength={0.2}>
            <Link
              href="/contact"
              style={{
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.08em",
                color: color.ink,
                textDecoration: "none",
              }}
            >
              Log in
            </Link>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}

/** A small magnifying-glass glyph: 17px circle (2px ink border) + handle. */
function SearchGlyph() {
  return (
    <span
      aria-hidden="true"
      style={{ position: "relative", display: "inline-block", width: 21, height: 21 }}
    >
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 17,
          height: 17,
          border: `2px solid ${color.ink}`,
          borderRadius: "50%",
        }}
      />
      <span
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 8,
          height: 2,
          background: color.ink,
          transform: "rotate(45deg)",
          transformOrigin: "right",
          borderRadius: 2,
        }}
      />
    </span>
  );
}
