import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import SiteFooter from "./SiteFooter";
import { FOOTER } from "@/lib/ia";

afterEach(cleanup);

describe("SiteFooter", () => {
  it("renders the brand, tagline, and copyright", () => {
    render(<SiteFooter />);
    expect(screen.getByText("PREECURSOR")).toBeTruthy();
    expect(
      screen.getByText(/An applied-AI studio for leaders/)
    ).toBeTruthy();
    expect(
      screen.getByText(/© 2026 Preecursor Intelligence, Inc\./)
    ).toBeTruthy();
  });

  it("renders the three column headings", () => {
    render(<SiteFooter />);
    expect(screen.getByText("Firm")).toBeTruthy();
    expect(screen.getByText("Industries")).toBeTruthy();
    expect(screen.getByText("Contact")).toBeTruthy();
  });

  it("renders every link defined in FOOTER with the right href", () => {
    render(<SiteFooter />);
    const allLinks = [
      ...FOOTER.firm,
      ...FOOTER.industries,
      ...FOOTER.contact,
    ];
    for (const link of allLinks) {
      const el = screen.getByRole("link", { name: link.label });
      expect(el.getAttribute("href")).toBe(link.href);
    }
  });

  it("footer nav links carry the draw-in underline hover treatment", () => {
    render(<SiteFooter />);
    const el = screen.getByRole("link", { name: FOOTER.firm[0].label });
    const cls = el.getAttribute("class") ?? "";
    // hairline azure underline that scales from 0 → full on hover...
    expect(cls).toContain("after:scale-x-0");
    expect(cls).toContain("hover:after:scale-x-100");
    expect(cls).toContain("after:bg-azure");
    // ...and the draw is motion-safe-gated for reduced motion.
    expect(cls).toContain("motion-safe:after:transition-transform");
  });
});
