import { afterEach, describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import Analytics from "./Analytics";

vi.mock("next/script", () => ({ default: (props: Record<string, unknown>) => createElement("script", props) }));
afterEach(() => { cleanup(); localStorage.clear(); vi.unstubAllEnvs(); });

describe("Optional analytics consent", () => {
  it("renders nothing without a valid measurement ID", () => {
    for (const id of ["", "invalid' <script>"]) {
      vi.stubEnv("NEXT_PUBLIC_GA_ID", id);
      expect(renderToStaticMarkup(createElement(Analytics))).toBe("");
    }
  });
  it("does not render Google scripts in the static HTML even with an ID", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST12345");
    const output = renderToStaticMarkup(createElement(Analytics));
    expect(output).not.toContain("googletagmanager");
    expect(output).toContain("Decline");
  });
  it("loads only after permission and allows withdrawal", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST12345");
    const { container } = render(createElement(Analytics));
    expect(container.querySelector("script[src]")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Allow" }));
    expect(container.querySelector("script[src]")?.getAttribute("src")).toContain("G-TEST12345");
    fireEvent.click(screen.getByRole("button", { name: "Disable optional analytics" }));
    expect(container.querySelector("script[src]")).toBeNull();
    expect(localStorage.getItem("preecursor-optional-analytics-v1")).toBe("declined");
  });
  it("remembers a refusal", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST12345");
    localStorage.setItem("preecursor-optional-analytics-v1", "declined");
    const { container } = render(createElement(Analytics));
    expect(container.querySelector("script[src]")).toBeNull();
    expect(screen.getByRole("button", { name: "Allow optional analytics" })).toBeTruthy();
  });
});
