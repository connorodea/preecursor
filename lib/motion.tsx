"use client";

/**
 * Motion primitives built on framer-motion (`motion/react`).
 *
 * House animation language: calm, "expensive", boutique-consulting. Short
 * travel, soft easing, nothing bouncy. Everything degrades to a static,
 * fully-visible state under `prefers-reduced-motion`.
 */

import {
  motion,
  useInView,
  useReducedMotion,
  animate,
  type Variants,
  type HTMLMotionProps,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Signature easing — a soft, decelerating ease-out. */
export const EASE = [0.16, 1, 0.3, 1] as const;

const VIEWPORT = { once: true, margin: "-12% 0px -10% 0px" } as const;

/* ----------------------------------------------------------------
   Reveal — fade + short rise as the element scrolls into view.
   ---------------------------------------------------------------- */
type RevealProps = HTMLMotionProps<"div"> & {
  /** Seconds of delay before the reveal starts. */
  delay?: number;
  /** Vertical travel in px (default 28). */
  y?: number;
  duration?: number;
  children: ReactNode;
};

export function Reveal({
  delay = 0,
  y = 8,
  duration = 0.85,
  children,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <motion.div {...rest}>{children}</motion.div>;
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------------------------------------------
   Stagger — a container that reveals its <StaggerItem> children in
   sequence. Use for lists / grids where children should cascade.
   ---------------------------------------------------------------- */
const staggerParent = (stagger: number, start: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: start } },
});

const staggerChild = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE } },
});

export function Stagger({
  children,
  stagger = 0.09,
  start = 0.05,
  ...rest
}: HTMLMotionProps<"div"> & { stagger?: number; start?: number; children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <motion.div {...rest}>{children}</motion.div>;
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={staggerParent(stagger, start)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  y = 8,
  ...rest
}: HTMLMotionProps<"div"> & { y?: number; children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <motion.div {...rest}>{children}</motion.div>;
  return (
    <motion.div variants={staggerChild(y)} {...rest}>
      {children}
    </motion.div>
  );
}

/* ----------------------------------------------------------------
   HeroStagger — page-load entrance for hero content (no scroll
   trigger). Children rise + fade in sequence on mount.
   ---------------------------------------------------------------- */
export function HeroStagger({
  children,
  start = 0.12,
  stagger = 0.09,
  ...rest
}: HTMLMotionProps<"div"> & { start?: number; stagger?: number; children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <motion.div {...rest}>{children}</motion.div>;
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerParent(stagger, start)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function HeroItem({
  children,
  y = 30,
  ...rest
}: HTMLMotionProps<"div"> & { y?: number; children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <motion.div {...rest}>{children}</motion.div>;
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------------------------------------------
   CountUp — animates a number from 0 to `value` when scrolled into
   view. Renders `prefix + number + suffix`.
   ---------------------------------------------------------------- */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  durationMs = 1400,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // Reduced-motion / not-yet-in-view: don't animate (and don't setState in
    // the effect body — the final value is derived at render time below).
    if (!inView || reduce) return;
    const controls = animate(0, value, {
      duration: durationMs / 1000,
      ease: EASE,
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, reduce, value, durationMs]);

  const shown = reduce ? value : display;
  return (
    <span ref={ref}>
      {prefix}
      {shown.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ----------------------------------------------------------------
   Magnetic — a subtle pointer-follow + lift on hover. Wrap CTAs.
   ---------------------------------------------------------------- */
export function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: ReactNode;
  /** 0–1: how far the element drifts toward the cursor. */
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ display: "inline-block", willChange: "transform" }}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 250, damping: 18, mass: 0.4 }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        setPos({ x: x * strength, y: y * strength });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
    >
      {children}
    </motion.div>
  );
}
