/**
 * CardGrid — a responsive grid wrapper for Card tiles. Always one column on
 * mobile, expanding to `columns` (2 · 3 · 4) at the `lg` breakpoint.
 *
 * Pure presentational — safe as a server component.
 */

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
  style?: React.CSSProperties;
};

/** Responsive column classes per `columns`. Shared with RevealGrid. */
export const GRID_COLS: Record<2 | 3 | 4, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export default function CardGrid({
  children,
  columns = 3,
  className = "",
  style,
}: Props) {
  return (
    <div
      className={`grid ${GRID_COLS[columns]} ${className}`.trim()}
      style={{ gap: 24, ...style }}
    >
      {children}
    </div>
  );
}
