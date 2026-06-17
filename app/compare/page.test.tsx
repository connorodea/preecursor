import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Page, { metadata } from "./page";
import { COMPARISONS } from "@/lib/content/comparisons";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

describe("app/compare/page (hub)", () => {
  const out = renderToStaticMarkup(<Page />);

  it("renders without throwing and links every comparison (no orphans)", () => {
    expect(out.length).toBeGreaterThan(0);
    for (const c of COMPARISONS) {
      expect(out, c.slug).toContain(esc(c.h1));
      expect(out, c.slug).toContain(`/compare/${c.slug}`);
    }
  });

  it("exposes non-empty metadata title + description", () => {
    expect(typeof metadata.title).toBe("string");
    expect((metadata.title as string).length).toBeGreaterThan(0);
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});
