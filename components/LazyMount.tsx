"use client";

/**
 * LazyMount — renders its children only once the placeholder scrolls near the
 * viewport. Used to defer expensive below-the-fold work (e.g. a WebGL
 * ShaderField's GL context) so it isn't created at page load.
 *
 * SSR/first paint renders nothing inside, so static markup stays light and
 * there's no hydration mismatch; an IntersectionObserver mounts the children
 * (with a generous rootMargin pre-warm) before they're actually on screen.
 * On the rare engine without IntersectionObserver the children simply stay
 * deferred and the section's CSS background shows — a graceful, lossless degrade
 * for the decorative WebGL fields this wraps.
 */

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function LazyMount({
  children,
  rootMargin = "500px",
  className,
  style,
}: {
  children: ReactNode;
  rootMargin?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || show) return;
    // No IntersectionObserver → leave children deferred (CSS background shows).
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        // setState lives in the observer callback (an async subscription), not
        // synchronously in the effect body.
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, show]);

  return (
    <div ref={ref} className={className} style={style}>
      {show ? children : null}
    </div>
  );
}
