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
});
