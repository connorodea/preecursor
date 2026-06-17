import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Careers from "./Careers";

const html = () => renderToStaticMarkup(createElement(Careers));

describe("Careers", () => {
  it("renders to markup without throwing", () => {
    expect(() => html()).not.toThrow();
  });

  it("contains the eyebrow + headline", () => {
    const out = html();
    expect(out).toContain("Preecursor careers");
    expect(out).toContain("Go beyond the expected");
  });

  it("renders the body copy", () => {
    expect(html()).toContain("We hire operators and engineers who would rather ship");
  });

  it("renders both top + bottom SectionSeams (navy↔paper2 pool walls)", () => {
    const out = html();
    // top: rises out of People navy pool into paper2
    expect(out).toContain("linear-gradient(180deg, #112138 0%, #e1e8f1 100%)");
    expect(out).toContain("radial-gradient(140% 75% at 50% 0%");
    // bottom: sinks from paper2 into FeaturedInsights navy pool
    expect(out).toContain("linear-gradient(180deg, #e1e8f1 0%, #112138 100%)");
    expect(out).toContain("radial-gradient(140% 75% at 50% 100%");
  });

  it("renders both CTA links to /careers", () => {
    const out = html();
    expect(out).toContain("Explore roles");
    expect(out).toContain("Apply today");
    expect((out.match(/href="\/careers"/g) ?? []).length).toBe(2);
  });
});
