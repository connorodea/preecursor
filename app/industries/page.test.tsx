import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import IndustriesPage, { metadata } from "./page";
import { INDUSTRY_LEAVES } from "@/lib/ia";

describe("app/industries/page (hub)", () => {
  it("exposes title + description metadata", () => {
    expect(metadata.title).toBe("Industries");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("renders without throwing and includes signature copy + every leaf card", () => {
    const out = renderToStaticMarkup(createElement(IndustriesPage));
    expect(out).toContain("AI that changes the numbers in your sector");
    expect(out).toContain("Sector judgment, paired with engineers who ship");
    for (const leaf of INDUSTRY_LEAVES) {
      // Card labels are HTML-escaped (& -> &amp;) in static markup.
      expect(out, leaf.slug).toContain(leaf.label.replace(/&/g, "&amp;"));
    }
  });

  it("gives every sector card an accent icon (one per leaf)", () => {
    const out = renderToStaticMarkup(createElement(IndustriesPage));
    // PlaceholderImage uses no currentColor stroke, so the only such SVGs are
    // the sector card icons — one per leaf, none left plain.
    const icons = (out.match(/stroke="currentColor"/g) ?? []).length;
    expect(icons).toBe(INDUSTRY_LEAVES.length);
  });
});
