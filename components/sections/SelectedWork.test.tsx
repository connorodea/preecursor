import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { act } from "react";
import SelectedWork from "./SelectedWork";

/**
 * SelectedWork — a client section with a horizontal drag-to-scroll carousel.
 * jsdom doesn't lay anything out, so `scrollLeft`/`offsetLeft` are always 0 and
 * `scrollTo`/`setPointerCapture` don't exist. We stub the minimum needed and
 * drive layout values via Object.defineProperty so the handler maths runs over
 * realistic inputs.
 *
 * Branches under test:
 *  - onScrollWork  → computes nearest card from offsetLeft and sets active dot
 *  - onPointerDown → records drag start (scrollLeft + clientX), captures pointer
 *  - onPointerMove → updates scrollLeft by delta; flips `moved` past 4px
 *  - endDrag       → clears the down flag, releases capture
 *  - onClickCapture→ after a moved drag, prevents the next click (and resets)
 *  - dot button    → scrollWorkTo calls Element.scrollTo({ left, behavior })
 */

let scrollToSpy: ReturnType<typeof vi.fn>;

beforeEach(() => {
  // jsdom has no Element.scrollTo — install a spy so scrollWorkTo is observable.
  scrollToSpy = vi.fn();
  // @ts-expect-error jsdom Element lacks scrollTo; we add it for the test.
  Element.prototype.scrollTo = scrollToSpy;
  // Pointer-capture APIs are also absent in jsdom; the component calls them
  // optionally (`?.`) but install no-ops so the happy path doesn't depend on
  // the optional-chain short-circuit.
  // @ts-expect-error add for test
  Element.prototype.setPointerCapture = vi.fn();
  // @ts-expect-error add for test
  Element.prototype.releasePointerCapture = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  // restoreAllMocks doesn't remove prototype props we assigned; delete them.
  // @ts-expect-error cleanup test-only prototype additions
  delete Element.prototype.scrollTo;
  // @ts-expect-error cleanup
  delete Element.prototype.setPointerCapture;
  // @ts-expect-error cleanup
  delete Element.prototype.releasePointerCapture;
});

/** The carousel scroller is the only element carrying the `no-scrollbar` class. */
function getScroller(container: HTMLElement): HTMLElement {
  const el = container.querySelector<HTMLElement>(".no-scrollbar");
  if (!el) throw new Error("scroller not found");
  return el;
}

/** The four dot buttons (aria-label "Show case study N"). */
function getDots(): HTMLButtonElement[] {
  return screen
    .getAllByRole("button")
    .filter((b) => /^Show case study/.test(b.getAttribute("aria-label") ?? "")) as HTMLButtonElement[];
}

/** Active dot is the wide one (26px) per inline style; width is the tell. */
function activeDotIndex(): number {
  const dots = getDots();
  return dots.findIndex((d) => d.style.width === "26px");
}

/** Assign offsetLeft to each card so onScrollWork has real geometry to chew on.
 *  The cards are the direct children of the scroller. */
function setCardOffsets(scroller: HTMLElement, offsets: number[]) {
  const cards = Array.from(scroller.children) as HTMLElement[];
  cards.forEach((card, i) => {
    Object.defineProperty(card, "offsetLeft", {
      configurable: true,
      get: () => offsets[i] ?? 0,
    });
  });
}

/** Make scrollLeft a writable own-property on the scroller (jsdom leaves it 0). */
function makeScrollLeftWritable(scroller: HTMLElement, initial = 0) {
  let v = initial;
  Object.defineProperty(scroller, "scrollLeft", {
    configurable: true,
    get: () => v,
    set: (n: number) => {
      v = n;
    },
  });
}

describe("SelectedWork", () => {
  it("renders the section, all four cards, and four dots; first dot active on mount", () => {
    let container!: HTMLElement;
    act(() => {
      ({ container } = render(<SelectedWork />));
    });

    // Section + heading present.
    expect(screen.getByText("Outcomes we can point to.")).toBeTruthy();
    // Four case-study cards → four dots.
    expect(getDots()).toHaveLength(4);
    // Mount effect runs onScrollWork; with all offsets 0 the nearest is index 0.
    expect(activeDotIndex()).toBe(0);
  });

  it("onScroll computes the nearest card and updates the active dot", () => {
    let container!: HTMLElement;
    act(() => {
      ({ container } = render(<SelectedWork />));
    });
    const scroller = getScroller(container);

    // Lay out the four cards at increasing offsets.
    setCardOffsets(scroller, [0, 700, 1160, 1620]);
    makeScrollLeftWritable(scroller, 0);

    // Scroll so that scrollLeft + PAD_LEFT(2) ≈ 1160 → nearest card is index 2.
    scroller.scrollLeft = 1158;
    act(() => {
      fireEvent.scroll(scroller);
    });
    expect(activeDotIndex()).toBe(2);

    // Scroll near the last card.
    scroller.scrollLeft = 1610;
    act(() => {
      fireEvent.scroll(scroller);
    });
    expect(activeDotIndex()).toBe(3);

    // Back to the start.
    scroller.scrollLeft = 0;
    act(() => {
      fireEvent.scroll(scroller);
    });
    expect(activeDotIndex()).toBe(0);
  });

  it("pointer drag updates scrollLeft by the inverse of the horizontal delta", () => {
    let container!: HTMLElement;
    act(() => {
      ({ container } = render(<SelectedWork />));
    });
    const scroller = getScroller(container);
    makeScrollLeftWritable(scroller, 100);

    act(() => {
      fireEvent.pointerDown(scroller, { clientX: 200, pointerId: 1 });
    });
    // Drag left by 60px → scrollLeft = startScroll(100) - dx(-60) = 160.
    act(() => {
      fireEvent.pointerMove(scroller, { clientX: 140, pointerId: 1 });
    });
    expect(scroller.scrollLeft).toBe(160);

    // Drag the pointer to the right of the start → scrollLeft decreases.
    act(() => {
      fireEvent.pointerMove(scroller, { clientX: 230, pointerId: 1 });
    });
    // startScroll(100) - dx(30) = 70.
    expect(scroller.scrollLeft).toBe(70);

    act(() => {
      fireEvent.pointerUp(scroller, { pointerId: 1 });
    });
  });

  it("a moved drag sets the moved flag and suppresses the next click", () => {
    let container!: HTMLElement;
    act(() => {
      ({ container } = render(<SelectedWork />));
    });
    const scroller = getScroller(container);
    makeScrollLeftWritable(scroller, 0);

    act(() => {
      fireEvent.pointerDown(scroller, { clientX: 100, pointerId: 1 });
    });
    // Move > 4px so `moved` flips true.
    act(() => {
      fireEvent.pointerMove(scroller, { clientX: 130, pointerId: 1 });
    });
    act(() => {
      fireEvent.pointerUp(scroller, { pointerId: 1 });
    });

    // The next click should be suppressed by onClickCapture (preventDefault +
    // stopPropagation). fireEvent.click returns false when preventDefault ran.
    const notDefaultPrevented = fireEvent.click(scroller);
    expect(notDefaultPrevented).toBe(false);

    // The flag is reset, so a subsequent click is NOT suppressed.
    const secondClick = fireEvent.click(scroller);
    expect(secondClick).toBe(true);
  });

  it("a non-moved drag (tiny delta) does not suppress the click", () => {
    let container!: HTMLElement;
    act(() => {
      ({ container } = render(<SelectedWork />));
    });
    const scroller = getScroller(container);
    makeScrollLeftWritable(scroller, 0);

    act(() => {
      fireEvent.pointerDown(scroller, { clientX: 100, pointerId: 1 });
    });
    // Move only 2px (≤ 4) → `moved` stays false.
    act(() => {
      fireEvent.pointerMove(scroller, { clientX: 102, pointerId: 1 });
    });
    act(() => {
      fireEvent.pointerUp(scroller, { pointerId: 1 });
    });

    // Click is allowed through (no preventDefault).
    expect(fireEvent.click(scroller)).toBe(true);
  });

  it("pointerMove without a preceding pointerDown is a no-op (down flag false)", () => {
    let container!: HTMLElement;
    act(() => {
      ({ container } = render(<SelectedWork />));
    });
    const scroller = getScroller(container);
    makeScrollLeftWritable(scroller, 50);

    // No pointerDown → drag.down is false → handler returns early, scrollLeft
    // unchanged and no `moved` set (so the click is not suppressed).
    act(() => {
      fireEvent.pointerMove(scroller, { clientX: 400, pointerId: 1 });
    });
    expect(scroller.scrollLeft).toBe(50);
    expect(fireEvent.click(scroller)).toBe(true);
  });

  it("clicking a dot calls scrollTo with the smooth-scroll target for that card", () => {
    let container!: HTMLElement;
    act(() => {
      ({ container } = render(<SelectedWork />));
    });
    const scroller = getScroller(container);
    setCardOffsets(scroller, [0, 700, 1160, 1620]);

    scrollToSpy.mockClear();
    const dots = getDots();
    act(() => {
      fireEvent.click(dots[2]);
    });

    expect(scrollToSpy).toHaveBeenCalledTimes(1);
    // scrollWorkTo(2): left = card.offsetLeft(1160) - PAD_LEFT(2) = 1158.
    expect(scrollToSpy).toHaveBeenCalledWith({ left: 1158, behavior: "smooth" });
  });

  it("pointerCancel ends the drag (down flag cleared) like pointerUp", () => {
    let container!: HTMLElement;
    act(() => {
      ({ container } = render(<SelectedWork />));
    });
    const scroller = getScroller(container);
    makeScrollLeftWritable(scroller, 0);

    act(() => {
      fireEvent.pointerDown(scroller, { clientX: 100, pointerId: 1 });
    });
    act(() => {
      fireEvent.pointerMove(scroller, { clientX: 130, pointerId: 1 });
    });
    // Cancel instead of up.
    act(() => {
      fireEvent.pointerCancel(scroller, { pointerId: 1 });
    });

    // down is now false: a further move should not change scrollLeft.
    scroller.scrollLeft = 0;
    act(() => {
      fireEvent.pointerMove(scroller, { clientX: 500, pointerId: 1 });
    });
    expect(scroller.scrollLeft).toBe(0);
  });
});
