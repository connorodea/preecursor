import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Capabilities from "./Capabilities";

const html = () => renderToStaticMarkup(createElement(Capabilities));

describe("Capabilities", () => {
  it("renders to markup without throwing", () => {
    expect(() => html()).not.toThrow();
    expect(html()).toContain('id="capabilities"');
  });

  it("contains the 'What we do' eyebrow + section headline", () => {
    const out = html();
    expect(out).toContain("What we do");
    expect(out).toContain(
      "A complete arc — from where AI matters to systems your teams run.",
    );
  });

  it("renders a top SectionSeam ramping out of the navy pool into paper", () => {
    const out = html();
    expect(out).toContain("linear-gradient(180deg, #112138 0%, #edf1f7 100%)");
    expect(out).toContain("radial-gradient(140% 75% at 50% 0%");
  });

  it("renders all four capability rows by number + title", () => {
    const out = html();
    expect(out).toContain("01");
    expect(out).toContain("AI Strategy &amp; Diagnostics");
    expect(out).toContain("02");
    expect(out).toContain("Applied Builds");
    expect(out).toContain("03");
    expect(out).toContain("Scale &amp; Operate");
    expect(out).toContain("04");
    expect(out).toContain("Capability &amp; Enablement");
  });
});
