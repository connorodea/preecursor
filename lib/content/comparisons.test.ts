import { describe, it, expect } from "vitest";
import {
  COMPARISONS,
  getComparison,
  COMPARISON_ROUTES,
  type Comparison,
  type ComparisonOption,
} from "./comparisons";

const SLUG_RE = /^[a-z0-9-]+$/;

function expectWellFormedOption(o: ComparisonOption, where: string) {
  expect(o, where).toBeDefined();
  expect(o.name.length, `${where} name`).toBeGreaterThan(0);
  expect(o.summary.length, `${where} summary`).toBeGreaterThan(0);
}

function expectWellFormedComparison(c: Comparison) {
  const where = c.slug;
  expect(c, where).toBeDefined();
  expect(c.slug.length, where).toBeGreaterThan(0);
  expect(SLUG_RE.test(c.slug), `${where} slug url-safe`).toBe(true);
  expect(c.title.length, `${where} title`).toBeGreaterThan(0);
  expect(c.h1.length, `${where} h1`).toBeGreaterThan(0);
  expect(c.metaDescription.length, `${where} metaDescription`).toBeGreaterThan(0);
  expect(c.intro.length, `${where} intro`).toBeGreaterThan(0);
  expect(c.verdict.length, `${where} verdict`).toBeGreaterThan(0);

  expectWellFormedOption(c.optionA, `${where} optionA`);
  expectWellFormedOption(c.optionB, `${where} optionB`);

  expect(Array.isArray(c.rows), `${where} rows`).toBe(true);
  expect(c.rows.length, `${where} rows`).toBeGreaterThan(0);
  for (const row of c.rows) {
    expect(row.dimension.length, `${where} row dimension`).toBeGreaterThan(0);
    expect(row.a.length, `${where} row a`).toBeGreaterThan(0);
    expect(row.b.length, `${where} row b`).toBeGreaterThan(0);
  }

  expect(Array.isArray(c.related), `${where} related`).toBe(true);
  expect(c.related.length, `${where} related`).toBeGreaterThan(0);
  for (const r of c.related) {
    expect(r.label.length, `${where} related label`).toBeGreaterThan(0);
    expect(r.href.length, `${where} related href`).toBeGreaterThan(0);
    expect(r.href.startsWith("/"), `${where} related href leading slash`).toBe(true);
  }
}

describe("COMPARISONS", () => {
  it("is a non-empty collection of well-formed comparisons", () => {
    expect(Array.isArray(COMPARISONS)).toBe(true);
    expect(COMPARISONS.length).toBeGreaterThan(0);
    for (const c of COMPARISONS) expectWellFormedComparison(c);
  });

  it("has unique, URL-safe slugs", () => {
    const slugs = COMPARISONS.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(SLUG_RE.test(s), s).toBe(true);
  });
});

describe("getComparison", () => {
  it("returns the right record for a known slug", () => {
    const known = COMPARISONS[0];
    const c = getComparison(known.slug);
    expect(c).toBeDefined();
    expect(c).toBe(known);
    expect(c!.h1).toBe(known.h1);
  });

  it("resolves every known slug to its own record", () => {
    for (const c of COMPARISONS) {
      expect(getComparison(c.slug), c.slug).toBe(c);
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getComparison("not-a-real-comparison")).toBeUndefined();
  });
});

describe("COMPARISON_ROUTES", () => {
  it("is the hub plus one /compare/<slug> route per comparison", () => {
    expect(COMPARISON_ROUTES).toEqual([
      "/compare",
      ...COMPARISONS.map((c) => `/compare/${c.slug}`),
    ]);
    expect(COMPARISON_ROUTES).toHaveLength(COMPARISONS.length + 1);
    expect(COMPARISON_ROUTES[0]).toBe("/compare");
    for (const r of COMPARISON_ROUTES) {
      expect(r.startsWith("/compare")).toBe(true);
    }
  });

  it("contains only unique routes", () => {
    expect(new Set(COMPARISON_ROUTES).size).toBe(COMPARISON_ROUTES.length);
  });
});
