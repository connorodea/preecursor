import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import PlaceholderImage from "./PlaceholderImage";

const html = (props: { seed: string; variant?: "dark" | "light" }) =>
  renderToStaticMarkup(createElement(PlaceholderImage, props));

describe("PlaceholderImage", () => {
  it("renders a turbulence-warped svg", () => {
    const out = html({ seed: "work-1" });
    expect(out).toContain("<svg");
    expect(out).toContain("feTurbulence");
    expect(out).toContain("feDisplacementMap");
  });

  it("is deterministic for a given seed", () => {
    expect(html({ seed: "spot-1" })).toBe(html({ seed: "spot-1" }));
  });

  it("produces different art for different seeds", () => {
    expect(html({ seed: "a" })).not.toBe(html({ seed: "b" }));
  });

  it("light and dark variants differ", () => {
    expect(html({ seed: "s", variant: "dark" })).not.toBe(
      html({ seed: "s", variant: "light" })
    );
  });
});
