import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import SiteHeader from "./SiteHeader";

afterEach(cleanup);

describe("SiteHeader", () => {
  it("renders the logo, hamburger, and Log in link", () => {
    render(<SiteHeader onOpenMenu={() => {}} />);

    // Wordmark appears in the logo link.
    expect(screen.getByText("PREECURSOR")).toBeTruthy();
    // Home link via the logo's accessible label.
    expect(screen.getByLabelText("Preecursor — home")).toBeTruthy();
    // Hamburger button.
    expect(screen.getByRole("button", { name: "Open menu" })).toBeTruthy();
    // Log in link points at /contact.
    const login = screen.getByRole("link", { name: "Log in" });
    expect(login.getAttribute("href")).toBe("/contact");
  });

  it("calls onOpenMenu when the hamburger is clicked", () => {
    const onOpenMenu = vi.fn();
    render(<SiteHeader onOpenMenu={onOpenMenu} />);

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(onOpenMenu).toHaveBeenCalledTimes(1);
  });
});
