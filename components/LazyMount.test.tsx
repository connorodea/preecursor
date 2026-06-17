import { describe, it, expect, afterEach, vi } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { act, createElement } from "react";
import LazyMount from "./LazyMount";

const origIO = globalThis.IntersectionObserver;

afterEach(() => {
  cleanup();
  globalThis.IntersectionObserver = origIO;
  vi.restoreAllMocks();
});

/** Install an IntersectionObserver whose observe() optionally fires at once. */
function installIO(fireIntersecting: boolean) {
  globalThis.IntersectionObserver = class {
    private cb: IntersectionObserverCallback;
    constructor(cb: IntersectionObserverCallback) {
      this.cb = cb;
    }
    observe() {
      if (fireIntersecting) {
        this.cb(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          this as unknown as IntersectionObserver,
        );
      }
    }
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  } as unknown as typeof IntersectionObserver;
}

const child = () => createElement("span", null, "deferred-child");

describe("LazyMount", () => {
  it("renders nothing inside until the observer reports intersection", () => {
    installIO(false);
    const { container } = render(createElement(LazyMount, null, child()));
    expect(container.textContent).not.toContain("deferred-child");
  });

  it("mounts children once the observer intersects", () => {
    installIO(true);
    let res!: ReturnType<typeof render>;
    act(() => {
      res = render(createElement(LazyMount, null, child()));
    });
    expect(res.container.textContent).toContain("deferred-child");
  });

  it("leaves children deferred when IntersectionObserver is unavailable", () => {
    (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver =
      undefined;
    let res!: ReturnType<typeof render>;
    act(() => {
      res = render(createElement(LazyMount, null, child()));
    });
    expect(res.container.textContent).not.toContain("deferred-child");
  });
});
