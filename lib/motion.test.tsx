import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { act } from "react";
// framer-motion's `useReducedMotion` lazily reads `matchMedia` once and caches
// the result in this module-level singleton. We reset the singleton before each
// render so toggling `window.matchMedia` actually re-reads.
import { hasReducedMotionListener } from "motion-dom";

/**
 * Motion-primitive tests. Each primitive has two branches gated by
 * `useReducedMotion()`: the reduced-motion branch renders plain children (no
 * scroll/animation props), and the normal branch wires up framer-motion. We
 * exercise both by swapping `window.matchMedia` before each render —
 * `useReducedMotion` reads it on mount.
 */

import {
  Reveal,
  Stagger,
  StaggerItem,
  HeroStagger,
  HeroItem,
  CountUp,
  Magnetic,
  EASE,
} from "./motion";

/** Make `useReducedMotion()` resolve to `matches` on the next render. */
function setReducedMotion(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
  // Force framer-motion to re-init its cached reduced-motion preference from
  // the matchMedia we just installed.
  hasReducedMotionListener.current = false;
}

const origMatchMedia = window.matchMedia;

afterEach(() => {
  cleanup();
  window.matchMedia = origMatchMedia;
  hasReducedMotionListener.current = false;
  vi.restoreAllMocks();
});

describe("EASE", () => {
  it("is the signature ease-out curve", () => {
    expect(EASE).toEqual([0.16, 1, 0.3, 1]);
  });
});

/* ----------------------------------------------------------------
   Reveal / Stagger / StaggerItem / HeroStagger / HeroItem all share
   the same shape: render children in both branches.
   ---------------------------------------------------------------- */
describe("Reveal", () => {
  it("renders children in the normal (animated) branch", () => {
    setReducedMotion(false);
    render(
      <Reveal data-testid="reveal">
        <span>hello</span>
      </Reveal>
    );
    expect(screen.getByTestId("reveal")).toBeTruthy();
    expect(screen.getByText("hello")).toBeTruthy();
  });

  it("renders plain children under reduced motion", () => {
    setReducedMotion(true);
    render(
      <Reveal data-testid="reveal">
        <span>hello</span>
      </Reveal>
    );
    expect(screen.getByText("hello")).toBeTruthy();
  });
});

describe("Stagger", () => {
  it("renders children in the normal branch", () => {
    setReducedMotion(false);
    render(
      <Stagger data-testid="stagger">
        <span>a</span>
      </Stagger>
    );
    expect(screen.getByTestId("stagger")).toBeTruthy();
    expect(screen.getByText("a")).toBeTruthy();
  });

  it("renders plain children under reduced motion", () => {
    setReducedMotion(true);
    render(
      <Stagger data-testid="stagger">
        <span>a</span>
      </Stagger>
    );
    expect(screen.getByText("a")).toBeTruthy();
  });
});

describe("StaggerItem", () => {
  it("renders children in the normal branch", () => {
    setReducedMotion(false);
    render(<StaggerItem data-testid="item">item</StaggerItem>);
    expect(screen.getByTestId("item").textContent).toBe("item");
  });

  it("renders plain children under reduced motion", () => {
    setReducedMotion(true);
    render(<StaggerItem data-testid="item">item</StaggerItem>);
    expect(screen.getByText("item")).toBeTruthy();
  });
});

describe("HeroStagger", () => {
  it("renders children in the normal branch", () => {
    setReducedMotion(false);
    render(
      <HeroStagger data-testid="hero">
        <span>hero</span>
      </HeroStagger>
    );
    expect(screen.getByTestId("hero")).toBeTruthy();
    expect(screen.getByText("hero")).toBeTruthy();
  });

  it("renders plain children under reduced motion", () => {
    setReducedMotion(true);
    render(
      <HeroStagger data-testid="hero">
        <span>hero</span>
      </HeroStagger>
    );
    expect(screen.getByText("hero")).toBeTruthy();
  });
});

describe("HeroItem", () => {
  it("renders children in the normal branch", () => {
    setReducedMotion(false);
    render(<HeroItem data-testid="hi">hi</HeroItem>);
    expect(screen.getByTestId("hi").textContent).toBe("hi");
  });

  it("renders plain children under reduced motion", () => {
    setReducedMotion(true);
    render(<HeroItem data-testid="hi">hi</HeroItem>);
    expect(screen.getByText("hi")).toBeTruthy();
  });
});

/* ----------------------------------------------------------------
   CountUp — prefix/suffix + number; reduced-motion shows the final
   value immediately.
   ---------------------------------------------------------------- */
describe("CountUp", () => {
  it("renders the final value immediately under reduced motion (with prefix/suffix)", () => {
    setReducedMotion(true);
    const { container } = render(<CountUp value={1234} prefix="$" suffix="+" />);
    // 1234 formatted en-US is "1,234"; reduced motion shows the full value.
    expect(container.textContent).toBe("$1,234+");
  });

  it("formats with decimals and respects prefix/suffix", () => {
    setReducedMotion(true);
    const { container } = render(
      <CountUp value={9.5} decimals={1} prefix="~" suffix="%" />
    );
    expect(container.textContent).toBe("~9.5%");
  });

  it("normal branch renders prefix/suffix + a number (starts at 0 before in-view)", () => {
    setReducedMotion(false);
    const { container } = render(<CountUp value={50} prefix="$" suffix="k" />);
    // useInView is false in jsdom (no real IO), so display stays 0; the
    // surrounding prefix/suffix and a numeric value are still present.
    expect(container.textContent).toMatch(/^\$\d/);
    expect(container.textContent).toContain("$");
    expect(container.textContent).toContain("k");
  });

  it("animates to the final value once the element scrolls into view", async () => {
    setReducedMotion(false);

    // motion's `useInView` watches via IntersectionObserver. The setup.ts stub
    // never fires, so here we install an IO that captures the observer callback
    // and lets us report `isIntersecting: true` to flip `inView`. That runs the
    // effect's animate(0, value) path; with MotionGlobalConfig.skipAnimations
    // the animation resolves to its final keyframe synchronously.
    const callbacks: Array<(entries: unknown[]) => void> = [];
    const realIO = globalThis.IntersectionObserver;
    class CapturingIO {
      cb: (entries: unknown[]) => void;
      constructor(cb: (entries: unknown[]) => void) {
        this.cb = cb;
        callbacks.push(cb);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    }
    (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
      CapturingIO;

    try {
      const { container } = render(<CountUp value={250} suffix="+" />);
      // Before intersection the value is still 0.
      expect(container.textContent).toBe("0+");

      // Report the element as on-screen — drives useInView → true.
      act(() => {
        callbacks.forEach((cb) => cb([{ isIntersecting: true }]));
      });

      // skipAnimations makes animate() jump to its final keyframe; the effect's
      // onUpdate sets display to the end value. Allow microtasks to flush.
      await waitFor(() => {
        expect(container.textContent).toBe("250+");
      });
    } finally {
      (globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
        realIO;
    }
  });
});

/* ----------------------------------------------------------------
   Magnetic — pointer-follow handlers in the normal branch; a plain
   div under reduced motion.
   ---------------------------------------------------------------- */
describe("Magnetic", () => {
  it("renders a plain div under reduced motion", () => {
    setReducedMotion(true);
    render(
      <Magnetic className="cta">
        <button>Go</button>
      </Magnetic>
    );
    expect(screen.getByText("Go")).toBeTruthy();
  });

  it("normal branch exercises pointer move/leave handlers without throwing", () => {
    setReducedMotion(false);
    render(
      <Magnetic className="cta" strength={0.3}>
        <button>Go</button>
      </Magnetic>
    );
    const wrapper = screen.getByText("Go").parentElement as HTMLElement;
    expect(wrapper).toBeTruthy();

    // jsdom getBoundingClientRect returns zeros; the handler maths still runs.
    act(() => {
      fireEvent.mouseMove(wrapper, { clientX: 120, clientY: 80 });
    });
    act(() => {
      fireEvent.mouseLeave(wrapper);
    });

    // Still rendered after the interaction.
    expect(screen.getByText("Go")).toBeTruthy();
  });
});
