import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import WorkPage, { metadata } from "./page";
import { WORK_CASES } from "@/lib/content/work";

describe("app/work/page (hub)", () => {
  it("exposes title + description metadata", () => {
    expect(metadata.title).toBe("Client impact");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("renders without throwing and includes signature copy + every case card", () => {
    const out = renderToStaticMarkup(createElement(WorkPage));
    expect(out).toContain("Outcomes we can point to");
    expect(out).toContain("How an engagement runs");
    expect(out).toContain("Sectors served");
    for (const c of WORK_CASES) {
      expect(out, c.slug).toContain(c.headline);
      expect(out, c.slug).toContain(`/work/${c.slug}`);
    }
  });
});
