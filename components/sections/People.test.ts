import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import People from "./People";

const html = () => renderToStaticMarkup(createElement(People));

describe("People", () => {
  it("renders to markup without throwing", () => {
    expect(() => html()).not.toThrow();
    expect(html()).toContain('id="people"');
  });

  it("contains the eyebrow + headline", () => {
    const out = html();
    expect(out).toContain("Our people");
    expect(out).toContain(
      "Engineers and operators from the rooms where the standard gets",
    );
  });

  it("renders all six affiliation names", () => {
    const out = html();
    for (const name of ["OpenAI", "DeepMind", "McKinsey", "Stripe", "Google", "Palantir"]) {
      expect(out).toContain(name);
    }
  });

  it("renders the body copy with an escaped P&L ampersand", () => {
    // The source uses a literal &amp; entity, which survives into static markup.
    expect(html()).toContain("P&amp;L");
  });

  it("renders the EdgeFade gradients at size 90", () => {
    const out = html();
    expect(out).toContain("linear-gradient(180deg, #e6eefb, transparent)");
    expect((out.match(/height:90px/g) ?? []).length).toBe(2);
  });
});
