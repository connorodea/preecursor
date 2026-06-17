import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import InsightsPage, { metadata } from "./page";
import { INSIGHTS } from "@/lib/content/insights";

describe("app/insights/page (hub)", () => {
  it("exposes title + description metadata", () => {
    expect(metadata.title).toBe("Our insights");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("renders without throwing and includes signature copy + every article card", () => {
    const out = renderToStaticMarkup(createElement(InsightsPage));
    expect(out).toContain("Our sharpest thinking on applied AI");
    expect(out).toContain("The Preecursor Newsletter");
    for (const a of INSIGHTS) {
      expect(out, a.slug).toContain(a.title);
      expect(out, a.slug).toContain(`/insights/${a.slug}`);
    }
  });
});
