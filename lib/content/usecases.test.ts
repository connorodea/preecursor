import { describe, it, expect } from "vitest";
import {
  USE_CASES,
  getUseCase,
  USE_CASE_ROUTES,
  USE_CASE_CONCEPTS,
  type UseCase,
} from "./usecases";
import { getTerm } from "./glossary";

const SLUG_RE = /^[a-z0-9-]+$/;

function expectWellFormedUseCase(u: UseCase) {
  const where = u.slug;
  expect(u, where).toBeDefined();
  expect(u.slug.length, where).toBeGreaterThan(0);
  expect(SLUG_RE.test(u.slug), `${where} slug url-safe`).toBe(true);
  expect(u.name.length, `${where} name`).toBeGreaterThan(0);
  expect(u.h1.length, `${where} h1`).toBeGreaterThan(0);
  expect(u.title.length, `${where} title`).toBeGreaterThan(0);
  expect(u.metaDescription.length, `${where} metaDescription`).toBeGreaterThan(0);
  expect(u.lede.length, `${where} lede`).toBeGreaterThan(0);
  expect(u.problem.length, `${where} problem`).toBeGreaterThan(0);
  expect(u.outcome.length, `${where} outcome`).toBeGreaterThan(0);

  expect(Array.isArray(u.approach), `${where} approach`).toBe(true);
  expect(u.approach.length, `${where} approach`).toBeGreaterThan(0);
  for (const a of u.approach) {
    expect(a.title.length, `${where} approach title`).toBeGreaterThan(0);
    expect(a.desc.length, `${where} approach desc`).toBeGreaterThan(0);
  }

  expect(Array.isArray(u.relatedCapabilities), `${where} relatedCapabilities`).toBe(true);
  expect(u.relatedCapabilities.length, `${where} relatedCapabilities`).toBeGreaterThan(0);
  for (const r of u.relatedCapabilities) {
    expect(r.label.length, `${where} related label`).toBeGreaterThan(0);
    expect(r.href.length, `${where} related href`).toBeGreaterThan(0);
    expect(r.href.startsWith("/"), `${where} related href leading slash`).toBe(true);
  }
}

describe("USE_CASES", () => {
  it("is a non-empty collection of well-formed use cases", () => {
    expect(Array.isArray(USE_CASES)).toBe(true);
    expect(USE_CASES.length).toBeGreaterThan(0);
    for (const u of USE_CASES) expectWellFormedUseCase(u);
  });

  it("has unique, URL-safe slugs", () => {
    const slugs = USE_CASES.map((u) => u.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(SLUG_RE.test(s), s).toBe(true);
  });
});

describe("getUseCase", () => {
  it("returns the right record for a known slug", () => {
    const known = USE_CASES[0];
    const u = getUseCase(known.slug);
    expect(u).toBeDefined();
    expect(u).toBe(known);
    expect(u!.name).toBe(known.name);
  });

  it("resolves every known slug to its own record", () => {
    for (const u of USE_CASES) {
      expect(getUseCase(u.slug), u.slug).toBe(u);
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getUseCase("not-a-real-use-case")).toBeUndefined();
  });
});

describe("USE_CASE_ROUTES", () => {
  it("is the hub plus one /ai-consulting/use-cases/<slug> route per use case", () => {
    expect(USE_CASE_ROUTES).toEqual([
      "/ai-consulting/use-cases",
      ...USE_CASES.map((u) => `/ai-consulting/use-cases/${u.slug}`),
    ]);
    expect(USE_CASE_ROUTES).toHaveLength(USE_CASES.length + 1);
    expect(USE_CASE_ROUTES[0]).toBe("/ai-consulting/use-cases");
    for (const r of USE_CASE_ROUTES) {
      expect(r.startsWith("/ai-consulting/use-cases")).toBe(true);
    }
  });

  it("contains only unique routes", () => {
    expect(new Set(USE_CASE_ROUTES).size).toBe(USE_CASE_ROUTES.length);
  });
});

describe("USE_CASE_CONCEPTS", () => {
  it("maps every use case to its glossary concepts", () => {
    for (const u of USE_CASES) {
      const concepts = USE_CASE_CONCEPTS[u.slug];
      expect(concepts, u.slug).toBeDefined();
      expect(concepts.length, u.slug).toBeGreaterThanOrEqual(2);
    }
  });

  it("references only valid glossary slugs (no broken cross-links)", () => {
    for (const [useCase, slugs] of Object.entries(USE_CASE_CONCEPTS)) {
      for (const slug of slugs) {
        expect(getTerm(slug), `${useCase} -> ${slug}`).toBeDefined();
      }
    }
  });

  it("does not reference a key that isn't a real use case", () => {
    const valid = new Set(USE_CASES.map((u) => u.slug));
    for (const key of Object.keys(USE_CASE_CONCEPTS)) {
      expect(valid.has(key), key).toBe(true);
    }
  });
});
