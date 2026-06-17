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

  it("shows the co-founders' graduate credentials (Michigan + Columbia)", () => {
    const out = html();
    expect(out).toContain("master"); // "...earned their master's degrees at"
    expect(out).toContain("University of Michigan");
    expect(out).toContain("Columbia University");
  });

  it("contains the eyebrow + headline", () => {
    const out = html();
    expect(out).toContain("Our people");
    expect(out).toContain(
      "Senior engineers and operators who hold the work to a high",
    );
  });

  it("renders no false company-affiliation logos", () => {
    const out = html();
    for (const name of ["OpenAI", "DeepMind", "McKinsey", "Stripe", "Google", "Palantir"]) {
      expect(out, name).not.toContain(name);
    }
  });

  it("renders the body copy with an escaped P&L ampersand", () => {
    // The source uses a literal &amp; entity, which survives into static markup.
    expect(html()).toContain("P&amp;L");
  });

  it("is a solid-navy pool — no EdgeFade band, no gradient background", () => {
    const out = html();
    expect(out).toContain("background:#112138");
    expect(out).not.toContain("linear-gradient"); // no EdgeFade band inside
    expect(out).not.toContain("rgba(60,98,164,0.42)"); // old EdgeFade waypoint gone
    // Credentials still present (regression guard for the seam rework).
    expect(out).toContain("University of Michigan");
    expect(out).toContain("Columbia University");
  });
});
