import { describe, it, expect, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import { act } from "react";
import SiteChrome from "./SiteChrome";

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

describe("SiteChrome", () => {
  it("renders its children and the header, with the menu closed by default", () => {
    render(
      <SiteChrome>
        <main data-testid="page">content</main>
      </SiteChrome>
    );
    expect(screen.getByTestId("page").textContent).toBe("content");
    // Header hamburger is present.
    expect(screen.getByRole("button", { name: "Open menu" })).toBeTruthy();
    // Menu overlay is not open initially.
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens the mega-menu overlay when the hamburger is clicked", () => {
    render(
      <SiteChrome>
        <main>content</main>
      </SiteChrome>
    );
    expect(screen.queryByRole("dialog")).toBeNull();

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    });
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("closes the overlay again via the menu close button", async () => {
    render(
      <SiteChrome>
        <main>content</main>
      </SiteChrome>
    );
    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    });
    expect(screen.getByRole("dialog")).toBeTruthy();

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Close menu" }));
    });
    // The overlay unmounts after its AnimatePresence exit transition.
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });
});
