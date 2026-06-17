import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SelectedWork from "./SelectedWork";

const html = () => renderToStaticMarkup(createElement(SelectedWork));

describe("SelectedWork", () => {
  it("renders to markup without throwing", () => {
    // Smoke test only — deep drag/scroll handler coverage is out of scope.
    expect(() => html()).not.toThrow();
    expect(html()).toContain('id="work"');
  });

  it("contains the eyebrow + section headline + illustrative disclaimer", () => {
    const out = html();
    expect(out).toContain("The kind of work we do");
    expect(out).toContain("The systems we build.");
    // Honest framing: these are examples, not delivered client results.
    expect(out).toContain("Illustrative examples of the kind of work we do");
    expect(out).toContain("not specific");
  });

  it("renders all four example cards with qualitative descriptors (no fake metrics)", () => {
    const out = html();
    expect(out).toContain("Underwriting copilot");
    expect(out).toContain("Predictive operations");
    expect(out).toContain("Clinical documentation");
    expect(out).toContain("Network ops copilot");
    // qualitative chips replace the fabricated stat numbers
    expect(out).toContain("Underwriting");
    expect(out).toContain("Predictive maintenance");
    expect(out).toContain("Network operations");
    // none of the invented outcome figures may survive
    expect(out).not.toContain("−63%");
    expect(out).not.toContain("$180M");
    expect(out).not.toContain("11 hrs");
    expect(out).not.toContain("−41%");
  });

  it("renders the large card body + CTA linking to its example", () => {
    const out = html();
    expect(out).toContain("an agent that drafts and checks credit memos");
    expect(out).toContain('href="/work/underwriting-copilot"');
    expect(out).toContain("Learn more →");
  });

  it("renders one carousel dot button per card with accessible labels", () => {
    const out = html();
    const dots = out.match(/aria-label="Show case study \d+"/g) ?? [];
    expect(dots.length).toBe(4);
    expect(out).toContain('aria-label="Show case study 1"');
    expect(out).toContain('aria-label="Show case study 4"');
  });

  it("renders the 'See how we work' + 'See more stories' links to /work", () => {
    const out = html();
    expect(out).toContain("See how we work");
    expect(out).toContain("See more stories →");
    expect(out).toContain('href="/work"');
  });
});
