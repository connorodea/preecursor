import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import CapabilitiesPage, { metadata } from "./page";
import { CAPABILITY_LEAVES } from "@/lib/ia";

describe("app/capabilities/page (hub)", () => {
  it("exposes title + description metadata", () => {
    expect(metadata.title).toBe("Capabilities");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("renders without throwing and includes signature copy + every leaf card", () => {
    const out = renderToStaticMarkup(createElement(CapabilitiesPage));
    expect(out).toContain("From first diagnostic to production scale");
    expect(out).toContain("One continuous engagement, not a relay of vendors");
    for (const leaf of CAPABILITY_LEAVES) {
      // Card labels are HTML-escaped (& -> &amp;) in static markup.
      expect(out, leaf.slug).toContain(leaf.label.replace(/&/g, "&amp;"));
    }
  });

  it("gives every discipline card an accent icon (one per leaf)", () => {
    const out = renderToStaticMarkup(createElement(CapabilitiesPage));
    // PlaceholderImage uses no currentColor stroke, so the only such SVGs are
    // the capability card icons — one per leaf, none left plain.
    const icons = (out.match(/stroke="currentColor"/g) ?? []).length;
    expect(icons).toBe(CAPABILITY_LEAVES.length);
  });
});
