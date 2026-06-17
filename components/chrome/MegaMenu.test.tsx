import { describe, it, expect, vi, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
  waitFor,
} from "@testing-library/react";
import { act } from "react";
import MegaMenu from "./MegaMenu";

afterEach(() => {
  cleanup();
  // Effects restore body overflow on unmount, but reset defensively.
  document.body.style.overflow = "";
});

/** The right-hand panel's title is the only <h3> in the overlay. */
function panelTitle(): string | null {
  return screen.getByRole("heading", { level: 3 }).textContent;
}

describe("MegaMenu", () => {
  it("renders nothing when closed", () => {
    const { container } = render(<MegaMenu open={false} onClose={() => {}} />);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders the dialog overlay when open with the default panel", () => {
    act(() => {
      render(<MegaMenu open onClose={() => {}} />);
    });
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("aria-label")).toBe("Site navigation");
    // Default panel is "industries".
    expect(panelTitle()).toBe("Industries");
  });

  it("locks body scroll while open and restores it on close", async () => {
    document.body.style.overflow = "scroll";
    const { rerender } = render(<MegaMenu open onClose={() => {}} />);
    act(() => {}); // flush mount effect
    expect(document.body.style.overflow).toBe("hidden");

    // Closing unmounts the overlay (after the exit animation) → the effect
    // cleanup restores the previous overflow value.
    act(() => {
      rerender(<MegaMenu open={false} onClose={() => {}} />);
    });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
      // Poll the restore too — the cleanup can lag the unmount by a tick under
      // parallel load; waiting here makes the assertion deterministic.
      expect(document.body.style.overflow).toBe("scroll");
    });
  });

  it("switches the active right panel on mouseEnter of a left row", async () => {
    act(() => {
      render(<MegaMenu open onClose={() => {}} />);
    });
    expect(panelTitle()).toBe("Industries");

    // The "Capabilities" left-nav row (a link). Scope to the nav so we don't
    // accidentally grab a leaf with the same text.
    const nav = screen.getByRole("navigation");
    const capRow = within(nav).getByRole("link", { name: "Capabilities" });

    act(() => {
      fireEvent.mouseEnter(capRow);
    });
    // The right panel cross-fades (AnimatePresence mode="wait"); wait for the
    // new keyed panel to mount.
    await waitFor(() => {
      expect(panelTitle()).toBe("Capabilities");
    });
  });

  it("switches the active right panel on focus of a left row", async () => {
    act(() => {
      render(<MegaMenu open onClose={() => {}} />);
    });
    const nav = screen.getByRole("navigation");
    const labsRow = within(nav).getByRole("link", { name: "Preecursor Labs" });

    act(() => {
      fireEvent.focus(labsRow);
    });
    await waitFor(() => {
      expect(panelTitle()).toBe("Preecursor Labs");
    });
  });

  it("calls onClose when a right-panel leaf link is clicked", () => {
    const onClose = vi.fn();
    act(() => {
      render(<MegaMenu open onClose={onClose} />);
    });
    // A leaf in the default (industries) right panel.
    const leaf = screen.getByRole("link", { name: "Insurance" });
    fireEvent.click(leaf);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    act(() => {
      render(<MegaMenu open onClose={onClose} />);
    });
    fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape keydown", () => {
    const onClose = vi.fn();
    act(() => {
      render(<MegaMenu open onClose={onClose} />);
    });
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close on a non-Escape keydown", () => {
    const onClose = vi.fn();
    act(() => {
      render(<MegaMenu open onClose={onClose} />);
    });
    act(() => {
      fireEvent.keyDown(document, { key: "a" });
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  /* --------------------------------------------------------------
     Tab focus-trap (MenuOverlay onKey, the `e.key === "Tab"` branch).
     The overlay collects all focusables and wraps:
       - Shift+Tab while on the FIRST focusable → focus moves to the LAST.
       - Tab while on the LAST focusable        → focus moves to the FIRST.
     Tabbing from the middle is left to the browser (no preventDefault).
     -------------------------------------------------------------- */
  describe("Tab focus trap", () => {
    function focusables(dialog: HTMLElement): HTMLElement[] {
      return Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        )
      );
    }

    it("Shift+Tab on the first focusable wraps focus to the last", () => {
      act(() => {
        render(<MegaMenu open onClose={() => {}} />);
      });
      const dialog = screen.getByRole("dialog");
      const els = focusables(dialog);
      const first = els[0];
      const last = els[els.length - 1];

      act(() => {
        first.focus();
      });
      expect(document.activeElement).toBe(first);

      act(() => {
        fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
      });
      expect(document.activeElement).toBe(last);
    });

    it("Tab on the last focusable wraps focus to the first", () => {
      act(() => {
        render(<MegaMenu open onClose={() => {}} />);
      });
      const dialog = screen.getByRole("dialog");
      const els = focusables(dialog);
      const first = els[0];
      const last = els[els.length - 1];

      act(() => {
        last.focus();
      });
      expect(document.activeElement).toBe(last);

      act(() => {
        fireEvent.keyDown(document, { key: "Tab" });
      });
      expect(document.activeElement).toBe(first);
    });

    it("Tab from a middle focusable does not wrap (left to the browser)", () => {
      act(() => {
        render(<MegaMenu open onClose={() => {}} />);
      });
      const dialog = screen.getByRole("dialog");
      const els = focusables(dialog);
      // A focusable that is neither first nor last.
      const middle = els[1];

      act(() => {
        middle.focus();
      });
      act(() => {
        fireEvent.keyDown(document, { key: "Tab" });
      });
      // No wrap → the handler leaves focus where it is.
      expect(document.activeElement).toBe(middle);
    });

    it("Shift+Tab from a middle focusable does not wrap", () => {
      act(() => {
        render(<MegaMenu open onClose={() => {}} />);
      });
      const dialog = screen.getByRole("dialog");
      const els = focusables(dialog);
      const middle = els[1];

      act(() => {
        middle.focus();
      });
      act(() => {
        fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
      });
      expect(document.activeElement).toBe(middle);
    });
  });
});
