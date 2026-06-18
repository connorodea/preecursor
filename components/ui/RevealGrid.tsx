"use client";

/**
 * RevealGrid — a CardGrid whose tiles cascade in (fade + short rise) as the
 * grid scrolls into view. Same responsive layout as CardGrid, but the grid
 * container is a Stagger and each child is wrapped in a StaggerItem.
 *
 * StaggerItems must be *direct* children of the Stagger for the stagger timing
 * to apply, so the Stagger itself carries the grid classes. Under
 * prefers-reduced-motion the children render fully visible with no animation
 * (handled by Stagger/StaggerItem).
 */

import { Children, type ReactNode } from "react";
import { Stagger, StaggerItem } from "@/lib/motion";
import { GRID_COLS } from "./CardGrid";

type Props = {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  /** Seconds between each tile's entrance. */
  stagger?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function RevealGrid({
  children,
  columns = 3,
  stagger = 0.06,
  className = "",
  style,
}: Props) {
  return (
    <Stagger
      stagger={stagger}
      className={`grid ${GRID_COLS[columns]} ${className}`.trim()}
      style={{ gap: 24, ...style }}
    >
      {Children.map(children, (child) => (
        <StaggerItem style={{ height: "100%" }}>{child}</StaggerItem>
      ))}
    </Stagger>
  );
}
