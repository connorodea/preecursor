"use client";

/**
 * MegaMenu — the full-screen white navigation overlay.
 *
 * Driven entirely by `lib/ia.ts` (LEFT_ENTRIES + PANELS). The left index lists
 * sections; hovering or focusing a child/link row switches the right-hand panel
 * *without* navigating, while clicking the row navigates (next/link) and closes
 * the menu. The right panel cross-fades when the active panel changes.
 *
 * Behavior: open/close animated via AnimatePresence (reduced-motion safe),
 * body-scroll lock while open, Esc to close, search input auto-focused on open.
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { LEFT_ENTRIES, PANELS, type LeftEntry, type Leaf } from "@/lib/ia";
import { color, inkA } from "@/lib/theme";
import { EASE } from "@/lib/motion";

const DEFAULT_PANEL = "industries";
const HAIRLINE = inkA(0.08);
const HAIRLINE_STRONG = inkA(0.12);

export default function MegaMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // The overlay is mounted only while open, so its `active` panel state resets
  // to the default on every open — no setState-in-effect needed.
  return (
    <AnimatePresence>{open && <MenuOverlay onClose={onClose} />}</AnimatePresence>
  );
}

function MenuOverlay({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<string>(DEFAULT_PANEL);
  const searchRef = useRef<HTMLInputElement>(null);

  // Esc closes; lock body scroll while mounted; focus search on open.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const raf = requestAnimationFrame(() => searchRef.current?.focus());

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      cancelAnimationFrame(raf);
    };
  }, [onClose]);

  const panel = PANELS[active] ?? PANELS[DEFAULT_PANEL];

  return (
    <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          initial={reduce ? false : { opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "#fff",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ---- Top bar ---- */}
          <div
            className="flex items-center gap-4 px-5 py-4 md:gap-[30px] md:px-10 md:py-[22px]"
            style={{
              borderBottom: `1px solid ${HAIRLINE}`,
            }}
          >
            <CloseButton onClick={onClose} />
            <Logo onClick={onClose} />
            {/* Search box is hidden below md so the close button + logo + Log in
                fit on phones; full search returns at md+. */}
            <SearchBox ref={searchRef} className="hidden md:flex" />
            <Link
              href="/contact"
              onClick={onClose}
              className="ml-auto md:ml-0"
              style={{
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: "0.08em",
                color: color.ink,
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Log in
            </Link>
          </div>

          {/* ---- Body ---- */}
          {/* Mobile: single column, the whole body scrolls (index above panel).
              Desktop (lg): the prototype's 0.8fr/1.2fr split with each pane
              scrolling independently and a divider between them. */}
          <div className="flex-1 grid grid-cols-1 overflow-y-auto lg:grid-cols-[0.8fr_1.2fr] lg:overflow-hidden">
            {/* Left index */}
            <nav className="px-5 pt-4 pb-8 lg:overflow-y-auto lg:border-r lg:border-[rgba(17,33,56,0.08)] lg:px-10 lg:pt-[18px] lg:pb-[60px]">
              {LEFT_ENTRIES.map((entry, i) => (
                <LeftRow
                  key={entry.type === "header" ? `header-${i}` : entry.id}
                  entry={entry}
                  active={active}
                  setActive={setActive}
                  onClose={onClose}
                />
              ))}
            </nav>

            {/* Right panel — cross-fades on active change */}
            <div className="px-5 pt-6 pb-10 lg:overflow-y-auto lg:px-[60px] lg:pt-[50px] lg:pb-[60px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.32, ease: EASE }}
                >
                  <RightPanel panel={panel} onClose={onClose} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
  );
}

/* ---------------------------------------------------------------- */

function LeftRow({
  entry,
  active,
  setActive,
  onClose,
}: {
  entry: LeftEntry;
  active: string;
  setActive: (id: string) => void;
  onClose: () => void;
}) {
  if (entry.type === "header") {
    return (
      <div
        style={{
          fontFamily: "var(--font-newsreader)",
          fontSize: 30,
          fontWeight: 500,
          color: color.ink,
          padding: "26px 0 12px",
          borderTop: `1px solid ${HAIRLINE_STRONG}`,
          marginTop: 6,
        }}
      >
        {entry.label}
      </div>
    );
  }

  const isActive = active === entry.id;
  const switchPanel = () => setActive(entry.id);

  if (entry.type === "link") {
    return (
      <Link
        href={entry.href}
        onMouseEnter={switchPanel}
        onFocus={switchPanel}
        onClick={onClose}
        style={{
          display: "block",
          fontFamily: "var(--font-newsreader)",
          fontSize: 30,
          fontWeight: 500,
          color: isActive ? color.brand : color.ink,
          padding: "26px 0",
          borderTop: `1px solid ${HAIRLINE_STRONG}`,
          marginTop: 6,
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        {entry.label}
      </Link>
    );
  }

  // child
  return (
    <Link
      href={entry.href}
      onMouseEnter={switchPanel}
      onFocus={switchPanel}
      onClick={onClose}
      style={{
        display: "block",
        fontFamily: "var(--font-archivo)",
        fontSize: 18,
        fontWeight: 500,
        color: isActive ? color.ink : "#34425a",
        padding: "11px 20px",
        borderRadius: 12,
        margin: "3px 0",
        cursor: "pointer",
        textDecoration: "none",
        background: isActive ? inkA(0.07) : "transparent",
      }}
    >
      {entry.label}
    </Link>
  );
}

function RightPanel({
  panel,
  onClose,
}: {
  panel: (typeof PANELS)[string];
  onClose: () => void;
}) {
  return (
    <div>
      <div
        style={{
          paddingBottom: 22,
          borderBottom: `1px solid ${HAIRLINE_STRONG}`,
          marginBottom: 38,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-newsreader)",
            fontSize: 33,
            fontWeight: 500,
            letterSpacing: "-0.01em",
            color: color.ink,
            margin: 0,
          }}
        >
          {panel.title}
        </h3>
        <p
          style={{
            marginTop: 10,
            marginBottom: 0,
            fontSize: 17,
            lineHeight: 1.5,
            color: inkA(0.6),
            maxWidth: "62ch",
          }}
        >
          {panel.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-0 sm:grid-cols-2 sm:gap-x-16">
        <div>
          {panel.col1.map((leaf) => (
            <LeafLink key={leaf.href} leaf={leaf} onClose={onClose} />
          ))}
        </div>
        <div>
          {panel.col2.map((leaf) => (
            <LeafLink key={leaf.href} leaf={leaf} onClose={onClose} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LeafLink({ leaf, onClose }: { leaf: Leaf; onClose: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={leaf.href}
      onClick={onClose}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "block",
        fontSize: 19,
        fontWeight: 500,
        color: hover ? color.brand : "#28384f",
        padding: "14px 0",
        borderBottom: `1px solid ${inkA(0.07)}`,
        textDecoration: "none",
        transition: "color 0.18s ease",
      }}
    >
      {leaf.label}
    </Link>
  );
}

/* ---------------------------------------------------------------- */

function Logo({ onClick }: { onClick: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="Preecursor — home"
      style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}
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
        style={{
          fontWeight: 800,
          fontSize: 22,
          letterSpacing: "0.18em",
          color: color.ink,
        }}
      >
        PREECURSOR
      </span>
    </Link>
  );
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close menu"
      style={{
        position: "relative",
        width: 30,
        height: 30,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: 0,
        flex: "0 0 auto",
      }}
    >
      {[45, -45].map((deg) => (
        <span
          key={deg}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 24,
            height: 2,
            background: color.ink,
            transform: `translate(-50%, -50%) rotate(${deg}deg)`,
          }}
        />
      ))}
    </button>
  );
}

const SearchBox = ({
  ref,
  className = "",
}: {
  ref: React.Ref<HTMLInputElement>;
  className?: string;
}) => {
  return (
    <div
      className={className}
      style={{
        flex: 1,
        maxWidth: 760,
        alignItems: "center",
        gap: 14,
        border: `1px solid ${inkA(0.22)}`,
        borderRadius: 14,
        padding: "7px 18px 7px 7px",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 46,
          height: 40,
          background: color.brand,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: "0 0 auto",
        }}
      >
        <SearchGlyphSmall />
      </span>
      <input
        ref={ref}
        type="text"
        placeholder="Type to search"
        aria-label="Search"
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: 16,
          width: "100%",
          color: color.ink,
          fontFamily: "var(--font-archivo)",
        }}
      />
    </div>
  );
};

/** Mist-colored magnifying glass for the search tile. */
function SearchGlyphSmall() {
  return (
    <span style={{ position: "relative", display: "inline-block", width: 18, height: 18 }}>
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 14,
          height: 14,
          border: `2px solid ${color.mist}`,
          borderRadius: "50%",
        }}
      />
      <span
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          width: 7,
          height: 2,
          background: color.mist,
          transform: "rotate(45deg)",
          transformOrigin: "right",
          borderRadius: 2,
        }}
      />
    </span>
  );
}
