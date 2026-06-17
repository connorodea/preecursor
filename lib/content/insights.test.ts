import { describe, it, expect } from "vitest";
import {
  INSIGHTS,
  INSIGHT_CATEGORIES,
  getArticle,
  articlesByCategory,
  type InsightCategory,
} from "./insights";

describe("INSIGHTS data", () => {
  it("has at least one article", () => {
    expect(INSIGHTS.length).toBeGreaterThan(0);
  });

  it("has a unique slug per article", () => {
    const slugs = INSIGHTS.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has well-formed fields on every article", () => {
    const validCategories = new Set(INSIGHT_CATEGORIES);
    for (const a of INSIGHTS) {
      expect(a.slug.length, a.slug).toBeGreaterThan(0);
      // slug should be URL-safe (used in /insights/[slug])
      expect(a.slug, a.slug).toMatch(/^[a-z0-9-]+$/);
      expect(a.title.length, a.slug).toBeGreaterThan(0);
      expect(a.dek.length, a.slug).toBeGreaterThan(0);
      expect(a.author.length, a.slug).toBeGreaterThan(0);
      expect(a.date.length, a.slug).toBeGreaterThan(0);
      expect(a.readMins, a.slug).toBeGreaterThan(0);
      expect(Number.isInteger(a.readMins), a.slug).toBe(true);
      expect(validCategories.has(a.category), a.slug).toBe(true);
      // body is 4-6 non-empty paragraphs per the type doc.
      expect(a.body.length, a.slug).toBeGreaterThanOrEqual(4);
      for (const p of a.body) {
        expect(p.length, `${a.slug} body para`).toBeGreaterThan(0);
      }
    }
  });

  it("declares the three menu categories", () => {
    expect(INSIGHT_CATEGORIES).toEqual([
      "Reports",
      "Field Notes",
      "Executive Briefings",
    ]);
  });
});

describe("getArticle", () => {
  it("returns the matching article for every known slug", () => {
    for (const a of INSIGHTS) {
      const found = getArticle(a.slug);
      expect(found, a.slug).toBeDefined();
      expect(found).toBe(a);
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getArticle("totally-made-up-article")).toBeUndefined();
  });
});

describe("articlesByCategory", () => {
  it("returns only articles in the requested category", () => {
    for (const category of INSIGHT_CATEGORIES) {
      const result = articlesByCategory(category);
      expect(result.every((a) => a.category === category), category).toBe(true);
    }
  });

  it("partitions every article across the declared categories", () => {
    const total = INSIGHT_CATEGORIES.reduce(
      (sum, c) => sum + articlesByCategory(c).length,
      0
    );
    expect(total).toBe(INSIGHTS.length);
  });

  it("returns an empty array for a category with no articles", () => {
    expect(articlesByCategory("Nonexistent" as InsightCategory)).toEqual([]);
  });
});
