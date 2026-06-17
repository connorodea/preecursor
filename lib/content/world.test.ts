import { describe, it, expect } from "vitest";
import { OFFICES, REMOTE, LABS } from "./world";
import { slugify } from "@/lib/ia";

describe("OFFICES", () => {
  it("has at least one office", () => {
    expect(OFFICES.length).toBeGreaterThan(0);
  });

  it("has a unique city and a unique seed per office", () => {
    const cities = OFFICES.map((o) => o.city);
    const seeds = OFFICES.map((o) => o.seed);
    expect(new Set(cities).size).toBe(cities.length);
    expect(new Set(seeds).size).toBe(seeds.length);
  });

  it("has required non-empty fields on every office", () => {
    for (const o of OFFICES) {
      expect(o.city.length, o.city).toBeGreaterThan(0);
      expect(o.region.length, o.city).toBeGreaterThan(0);
      expect(o.addressHint.length, o.city).toBeGreaterThan(0);
      expect(o.seed.length, o.city).toBeGreaterThan(0);
    }
  });

  it("has a non-empty blurb whether it is a string or string[]", () => {
    for (const o of OFFICES) {
      if (Array.isArray(o.blurb)) {
        expect(o.blurb.length, o.city).toBeGreaterThan(0);
        for (const p of o.blurb) {
          expect(p.length, o.city).toBeGreaterThan(0);
        }
      } else {
        expect(o.blurb.length, o.city).toBeGreaterThan(0);
      }
    }
  });

  it("produces a non-empty anchor id via slugify(city)", () => {
    // The page derives in-page anchors from slugify(city); ensure each is
    // non-empty and unique so anchors don't collide.
    const anchors = OFFICES.map((o) => slugify(o.city));
    for (const a of anchors) {
      expect(a.length).toBeGreaterThan(0);
    }
    expect(new Set(anchors).size).toBe(anchors.length);
    expect(slugify("New York")).toBe("new-york");
  });
});

describe("REMOTE", () => {
  it("has a non-empty blurb of non-empty paragraphs", () => {
    expect(REMOTE.blurb.length).toBeGreaterThan(0);
    for (const p of REMOTE.blurb) {
      expect(p.length).toBeGreaterThan(0);
    }
  });
});

describe("LABS", () => {
  it("has non-empty hero lede and intro", () => {
    expect(LABS.hero.lede.length).toBeGreaterThan(0);
    expect(LABS.intro.length).toBeGreaterThan(0);
  });

  it("declares the six Labs areas, each with title + desc", () => {
    expect(LABS.areas).toHaveLength(6);
    for (const a of LABS.areas) {
      expect(a.title.length, a.title).toBeGreaterThan(0);
      expect(a.desc.length, a.title).toBeGreaterThan(0);
    }
  });

  it("has a unique slugify(title) anchor per Labs area", () => {
    const anchors = LABS.areas.map((a) => slugify(a.title));
    for (const a of anchors) {
      expect(a.length).toBeGreaterThan(0);
    }
    expect(new Set(anchors).size).toBe(anchors.length);
  });

  it("has publications, each with title, venue, and a sane year", () => {
    expect(LABS.publications.length).toBeGreaterThan(0);
    for (const p of LABS.publications) {
      expect(p.title.length, p.title).toBeGreaterThan(0);
      expect(p.venue.length, p.title).toBeGreaterThan(0);
      expect(Number.isInteger(p.year), p.title).toBe(true);
      expect(p.year, p.title).toBeGreaterThanOrEqual(2000);
      expect(p.year, p.title).toBeLessThanOrEqual(2100);
    }
  });

  it("has a fellowship with a title and non-empty body paragraphs", () => {
    expect(LABS.fellowship.title.length).toBeGreaterThan(0);
    expect(LABS.fellowship.body.length).toBeGreaterThan(0);
    for (const p of LABS.fellowship.body) {
      expect(p.length).toBeGreaterThan(0);
    }
  });
});
