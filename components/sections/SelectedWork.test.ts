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

  it("contains the eyebrow + section headline", () => {
    const out = html();
    expect(out).toContain("Selected work");
    expect(out).toContain("Outcomes we can point to.");
  });

  it("renders all four case-study cards (titles + stats)", () => {
    const out = html();
    expect(out).toContain("Underwriting copilot");
    expect(out).toContain("Predictive operations");
    expect(out).toContain("Clinical documentation");
    expect(out).toContain("Network ops copilot");
    // stats from each card
    expect(out).toContain("−63%");
    expect(out).toContain("$180M");
    expect(out).toContain("11 hrs");
    expect(out).toContain("−41%");
  });

  it("renders the large card body + CTA linking to its case study", () => {
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

  it("renders the 'All case studies' + 'See more stories' links to /work", () => {
    const out = html();
    expect(out).toContain("All case studies");
    expect(out).toContain("See more stories →");
    expect(out).toContain('href="/work"');
  });
});
