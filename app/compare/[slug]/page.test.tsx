import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Page, { generateStaticParams, generateMetadata } from "./page";
import { COMPARISONS, getComparison } from "@/lib/content/comparisons";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const params = generateStaticParams();

describe("app/compare/[slug]/page", () => {
  it("generateStaticParams returns one entry per comparison", () => {
    expect(params).toEqual(COMPARISONS.map((c) => ({ slug: c.slug })));
    expect(params.length).toBeGreaterThan(0);
  });

  it("renders every comparison with its h1, breadcrumbs, JSON-LD, table, and related", async () => {
    for (const { slug } of params) {
      const cmp = getComparison(slug)!;
      const el = await Page({ params: Promise.resolve({ slug }) });
      const out = renderToStaticMarkup(el);

      expect(out, slug).toContain(esc(cmp.h1));
      // Breadcrumb markers.
      expect(out, slug).toContain('aria-label="Breadcrumb"');
      expect(out, slug).toContain("BreadcrumbList");
      // ProfessionalService JSON-LD.
      expect(out, slug).toContain("ProfessionalService");
      // Both option names appear (table headers + option cards).
      expect(out, slug).toContain(esc(cmp.optionA.name));
      expect(out, slug).toContain(esc(cmp.optionB.name));
      // Each comparison-table dimension renders.
      for (const row of cmp.rows) {
        expect(out, `${slug} dim`).toContain(esc(row.dimension));
      }
      // Related cross-link section.
      expect(out, slug).toContain("Related");
      for (const r of cmp.related) {
        expect(out, `${slug} -> ${r.href}`).toContain(r.href);
      }
    }
  });

  it("renders the defensive fallback for an unknown slug", async () => {
    const el = await Page({ params: Promise.resolve({ slug: "not-a-real-comparison" }) });
    const out = renderToStaticMarkup(el);
    expect(out).toContain("Comparison not found.");
  });

  it("generateMetadata returns the comparison's title + description for every slug", async () => {
    for (const { slug } of params) {
      const cmp = getComparison(slug)!;
      const meta = await generateMetadata({ params: Promise.resolve({ slug }) });
      expect(meta.title, slug).toBe(cmp.title);
      expect(meta.description, slug).toBe(cmp.metaDescription);
    }
  });

  it("generateMetadata returns an empty object for an unknown slug", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "not-a-real-comparison" }),
    });
    expect(meta).toEqual({});
  });
});
