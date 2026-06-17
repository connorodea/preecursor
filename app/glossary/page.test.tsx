import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Page, { metadata } from "./page";
import { GLOSSARY } from "@/lib/content/glossary";

// Matches the HTML-entity escaping renderToStaticMarkup applies to text nodes.
function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

describe("app/glossary/page (hub)", () => {
  const out = renderToStaticMarkup(<Page />);

  it("renders without throwing and links every term (no orphans)", () => {
    expect(out.length).toBeGreaterThan(0);
    for (const t of GLOSSARY) {
      expect(out, t.slug).toContain(esc(t.term));
      expect(out, t.slug).toContain(`/glossary/${t.slug}`);
    }
  });

  it("exposes non-empty metadata title + description", () => {
    expect(typeof metadata.title).toBe("string");
    expect((metadata.title as string).length).toBeGreaterThan(0);
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });
});
