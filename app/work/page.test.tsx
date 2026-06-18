import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import WorkPage, { metadata } from "./page";
import { WORK_CASES } from "@/lib/content/work";

describe("app/work/page (hub)", () => {
  it("exposes title + description metadata", () => {
    expect(metadata.title).toBe("The work");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("renders without throwing, frames work as illustrative, and lists every example", () => {
    const out = renderToStaticMarkup(createElement(WorkPage));
    expect(out).toContain("The kind of work we do");
    expect(out).toContain("illustrative examples of the kind of work we do");
    expect(out).toContain("How an engagement runs");
    expect(out).toContain("Sectors served");
    for (const c of WORK_CASES) {
      expect(out, c.slug).toContain(c.headline);
      expect(out, c.slug).toContain(`/work/${c.slug}`);
    }
  });

  it("gives every case-study card an accent icon (one per case)", () => {
    const out = renderToStaticMarkup(createElement(WorkPage));
    // FeatureRows/figures use no currentColor stroke, so the only such SVGs are
    // the case-study card icons — one per case.
    const icons = (out.match(/stroke="currentColor"/g) ?? []).length;
    expect(icons).toBe(WORK_CASES.length);
  });
});
