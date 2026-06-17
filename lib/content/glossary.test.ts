import { describe, it, expect } from "vitest";
import {
  GLOSSARY,
  getTerm,
  GLOSSARY_ROUTES,
  type GlossaryTerm,
} from "./glossary";

const SLUG_RE = /^[a-z0-9-]+$/;

function expectWellFormedTerm(t: GlossaryTerm) {
  const where = t.slug;
  expect(t, where).toBeDefined();
  expect(t.slug.length, where).toBeGreaterThan(0);
  expect(SLUG_RE.test(t.slug), `${where} slug url-safe`).toBe(true);
  expect(t.term.length, `${where} term`).toBeGreaterThan(0);
  expect(t.title.length, `${where} title`).toBeGreaterThan(0);
  expect(t.metaDescription.length, `${where} metaDescription`).toBeGreaterThan(0);
  expect(t.short.length, `${where} short`).toBeGreaterThan(0);

  expect(Array.isArray(t.body), `${where} body`).toBe(true);
  expect(t.body.length, `${where} body`).toBeGreaterThan(0);
  for (const p of t.body) {
    expect(p.length, `${where} body paragraph`).toBeGreaterThan(0);
  }

  expect(Array.isArray(t.related), `${where} related`).toBe(true);
  expect(t.related.length, `${where} related`).toBeGreaterThan(0);
  for (const r of t.related) {
    expect(r.label.length, `${where} related label`).toBeGreaterThan(0);
    expect(r.href.length, `${where} related href`).toBeGreaterThan(0);
    expect(r.href.startsWith("/"), `${where} related href leading slash`).toBe(true);
  }
}

describe("GLOSSARY", () => {
  it("is a non-empty collection of well-formed terms", () => {
    expect(Array.isArray(GLOSSARY)).toBe(true);
    expect(GLOSSARY.length).toBeGreaterThan(0);
    for (const t of GLOSSARY) expectWellFormedTerm(t);
  });

  it("has unique, URL-safe slugs", () => {
    const slugs = GLOSSARY.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(SLUG_RE.test(s), s).toBe(true);
  });
});

describe("getTerm", () => {
  it("returns the right record for a known slug", () => {
    const known = GLOSSARY[0];
    const t = getTerm(known.slug);
    expect(t).toBeDefined();
    expect(t).toBe(known);
    expect(t!.term).toBe(known.term);
  });

  it("resolves every known slug to its own record", () => {
    for (const t of GLOSSARY) {
      expect(getTerm(t.slug), t.slug).toBe(t);
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getTerm("not-a-real-term")).toBeUndefined();
  });
});

describe("GLOSSARY_ROUTES", () => {
  it("is the hub plus one /glossary/<slug> route per term", () => {
    expect(GLOSSARY_ROUTES).toEqual([
      "/glossary",
      ...GLOSSARY.map((t) => `/glossary/${t.slug}`),
    ]);
    expect(GLOSSARY_ROUTES).toHaveLength(GLOSSARY.length + 1);
    expect(GLOSSARY_ROUTES[0]).toBe("/glossary");
    for (const r of GLOSSARY_ROUTES) {
      expect(r.startsWith("/glossary")).toBe(true);
    }
  });

  it("contains only unique routes", () => {
    expect(new Set(GLOSSARY_ROUTES).size).toBe(GLOSSARY_ROUTES.length);
  });
});
