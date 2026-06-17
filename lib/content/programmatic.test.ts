import { describe, it, expect } from "vitest";
import {
  PILLARS,
  PILLAR_ROUTES,
  getPillar,
  industrySpoke,
  INDUSTRY_SPOKE_ROUTES,
  CITIES,
  getCity,
  CITY_SPOKE_ROUTES,
  PROGRAMMATIC_ROUTES,
  type Pillar,
} from "./programmatic";
import { INDUSTRY_LEAVES } from "@/lib/ia";

const EXPECTED_PILLAR_SLUGS = [
  "ai-consulting",
  "ai-consultant",
  "technology-consulting",
] as const;

function expectWellFormedPillar(p: Pillar, slug: string) {
  expect(p, slug).toBeDefined();
  expect(p.slug, slug).toBe(slug);
  expect(p.keyword.length, slug).toBeGreaterThan(0);
  expect(p.title.length, slug).toBeGreaterThan(0);
  expect(p.h1.length, slug).toBeGreaterThan(0);
  expect(p.eyebrow.length, slug).toBeGreaterThan(0);
  expect(p.metaDescription.length, slug).toBeGreaterThan(0);
  expect(p.lede.length, slug).toBeGreaterThan(0);
  expect(Array.isArray(p.sections), slug).toBe(true);
  expect(p.sections.length, slug).toBeGreaterThan(0);
  for (const s of p.sections) {
    expect(s.heading.length, `${slug} section heading`).toBeGreaterThan(0);
    expect(s.body.length, `${slug} section body`).toBeGreaterThan(0);
  }
  expect(Array.isArray(p.faqs), slug).toBe(true);
  expect(p.faqs.length, slug).toBeGreaterThan(0);
  for (const f of p.faqs) {
    expect(f.q.length, `${slug} faq q`).toBeGreaterThan(0);
    expect(f.a.length, `${slug} faq a`).toBeGreaterThan(0);
  }
}

describe("PILLARS", () => {
  it("has exactly the three expected keys", () => {
    expect(Object.keys(PILLARS).sort()).toEqual([...EXPECTED_PILLAR_SLUGS].sort());
  });

  it("each pillar is well-formed", () => {
    for (const slug of EXPECTED_PILLAR_SLUGS) {
      expectWellFormedPillar(PILLARS[slug], slug);
    }
  });

  it("each pillar's own slug matches its record key", () => {
    for (const [key, pillar] of Object.entries(PILLARS)) {
      expect(pillar.slug).toBe(key);
    }
  });
});

describe("getPillar", () => {
  it("returns the pillar for a known slug", () => {
    const p = getPillar("ai-consulting");
    expect(p).toBeDefined();
    expect(p).toBe(PILLARS["ai-consulting"]);
    expect(p!.keyword).toBe("AI consulting");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getPillar("not-a-pillar")).toBeUndefined();
  });
});

describe("PILLAR_ROUTES", () => {
  it("is one leading-slash route per pillar", () => {
    expect(PILLAR_ROUTES).toEqual(["/ai-consulting", "/ai-consultant", "/technology-consulting"]);
    for (const r of PILLAR_ROUTES) expect(r.startsWith("/")).toBe(true);
  });
});

describe("industrySpoke", () => {
  it("produces well-formed content for EVERY industry leaf slug", () => {
    for (const leaf of INDUSTRY_LEAVES) {
      const spoke = industrySpoke(leaf.slug);
      expect(spoke.slug, leaf.slug).toBe(leaf.slug);
      // label resolves from the IA leaf
      expect(spoke.label, leaf.slug).toBe(leaf.label);
      expect(spoke.title, leaf.slug).toBe(`AI Consulting for ${leaf.label}`);
      expect(spoke.h1, leaf.slug).toBe(`AI consulting for ${leaf.label.toLowerCase()}`);
      expect(
        spoke.metaDescription.startsWith(`Applied-AI consulting for ${leaf.label.toLowerCase()}:`),
        leaf.slug
      ).toBe(true);
      // metaDescription embeds the real industry lede
      expect(spoke.metaDescription, leaf.slug).toContain(spoke.content.lede);
      // composed content is the real ServiceContent for this slug
      expect(spoke.content.slug, leaf.slug).toBe(leaf.slug);
      expect(spoke.content.title.length, leaf.slug).toBeGreaterThan(0);
      expect(spoke.content.overview.length, leaf.slug).toBeGreaterThan(0);
      expect(spoke.content.approach.length, leaf.slug).toBeGreaterThan(0);
      expect(spoke.content.stats.length, leaf.slug).toBeGreaterThan(0);
    }
  });

  it("falls back to the content title for an unauthored slug's label", () => {
    // Unknown slug: not in INDUSTRY_LEAVES, so label falls back to content.title
    // (getIndustry itself returns an on-brand fallback rather than throwing).
    const spoke = industrySpoke("totally-made-up-sector");
    expect(spoke.slug).toBe("totally-made-up-sector");
    expect(spoke.label.length).toBeGreaterThan(0);
    expect(spoke.label).toBe(spoke.content.title);
    expect(spoke.title).toBe(`AI Consulting for ${spoke.content.title}`);
  });
});

describe("INDUSTRY_SPOKE_ROUTES", () => {
  it("is one /ai-consulting/<slug> route per industry leaf", () => {
    expect(INDUSTRY_SPOKE_ROUTES).toEqual(
      INDUSTRY_LEAVES.map((l) => `/ai-consulting/${l.slug}`)
    );
    expect(INDUSTRY_SPOKE_ROUTES).toHaveLength(INDUSTRY_LEAVES.length);
    for (const r of INDUSTRY_SPOKE_ROUTES) {
      expect(r.startsWith("/ai-consulting/")).toBe(true);
    }
  });
});

describe("CITIES", () => {
  it("has 12 entries", () => {
    expect(CITIES).toHaveLength(12);
  });

  it("has unique, non-empty, well-formed slugs", () => {
    const slugs = CITIES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const c of CITIES) {
      expect(c.slug.length, c.city).toBeGreaterThan(0);
      // slug is a slugified city name
      expect(c.slug, c.city).toBe(c.city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  });

  it("each city carries an office boolean and non-empty sectors + copy", () => {
    for (const c of CITIES) {
      expect(typeof c.office, c.city).toBe("boolean");
      expect(c.city.length, c.city).toBeGreaterThan(0);
      expect(c.region.length, c.city).toBeGreaterThan(0);
      expect(c.intro.length, c.city).toBeGreaterThan(0);
      expect(c.nearestOffice.length, c.city).toBeGreaterThan(0);
      expect(Array.isArray(c.sectors), c.city).toBe(true);
      expect(c.sectors.length, c.city).toBeGreaterThan(0);
      for (const s of c.sectors) expect(s.length, `${c.city} sector`).toBeGreaterThan(0);
    }
  });

  it("exactly the two real offices have office === true", () => {
    const offices = CITIES.filter((c) => c.office).map((c) => c.city).sort();
    expect(offices).toEqual(["Denver", "Detroit"]);
    // Offices point their nearestOffice at themselves.
    for (const c of CITIES.filter((c) => c.office)) {
      expect(c.nearestOffice, c.city).toBe(c.city);
    }
  });
});

describe("getCity", () => {
  it("returns the city for a known slug", () => {
    const c = getCity("denver");
    expect(c).toBeDefined();
    expect(c!.city).toBe("Denver");
    expect(c!.office).toBe(true);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getCity("atlantis")).toBeUndefined();
  });
});

describe("CITY_SPOKE_ROUTES", () => {
  it("is one /ai-consultant/<slug> route per city", () => {
    expect(CITY_SPOKE_ROUTES).toEqual(CITIES.map((c) => `/ai-consultant/${c.slug}`));
    expect(CITY_SPOKE_ROUTES).toHaveLength(CITIES.length);
    for (const r of CITY_SPOKE_ROUTES) {
      expect(r.startsWith("/ai-consultant/")).toBe(true);
    }
  });
});

describe("PROGRAMMATIC_ROUTES", () => {
  it("is the concatenation of pillar + industry + city routes", () => {
    expect(PROGRAMMATIC_ROUTES).toEqual([
      ...PILLAR_ROUTES,
      ...INDUSTRY_SPOKE_ROUTES,
      ...CITY_SPOKE_ROUTES,
    ]);
    expect(PROGRAMMATIC_ROUTES).toHaveLength(
      PILLAR_ROUTES.length + INDUSTRY_SPOKE_ROUTES.length + CITY_SPOKE_ROUTES.length
    );
  });

  it("contains only unique routes", () => {
    expect(new Set(PROGRAMMATIC_ROUTES).size).toBe(PROGRAMMATIC_ROUTES.length);
  });
});
