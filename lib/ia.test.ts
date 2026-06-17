import { describe, it, expect } from "vitest";
import {
  slugify,
  PANELS,
  LEFT_ENTRIES,
  FOOTER,
  INDUSTRY_LEAVES,
  CAPABILITY_LEAVES,
  type Leaf,
} from "./ia";

/** Every hub page that actually exists under app/. */
const HUB_ROUTES = new Set([
  "/",
  "/industries",
  "/capabilities",
  "/labs",
  "/insights",
  "/work",
  "/about",
  "/careers",
  "/worldwide",
  "/leadership",
  "/contact",
]);

/** Templated detail routes generated via generateStaticParams. */
const DETAIL_ROUTES = new Set<string>([
  ...INDUSTRY_LEAVES.map((l) => l.href),
  ...CAPABILITY_LEAVES.map((l) => l.href),
]);

/** A link resolves if it's external, or its path (minus #anchor) is a real route. */
function resolves(href: string): boolean {
  if (/^(mailto:|tel:|https?:)/.test(href)) return true;
  const path = href.split("#")[0];
  return HUB_ROUTES.has(path) || DETAIL_ROUTES.has(path);
}

const ALL_LEAVES: Leaf[] = Object.values(PANELS).flatMap((p) => [
  ...p.col1,
  ...p.col2,
]);

describe("slugify", () => {
  it("lowercases and hyphenates words", () => {
    expect(slugify("Applied Builds")).toBe("applied-builds");
  });

  it("expands ampersands to 'and'", () => {
    expect(slugify("Healthcare & Life Sciences")).toBe(
      "healthcare-and-life-sciences"
    );
    expect(slugify("AI Strategy & Diagnostics")).toBe(
      "ai-strategy-and-diagnostics"
    );
  });

  it("trims leading/trailing separators and collapses runs", () => {
    expect(slugify("  New York!  ")).toBe("new-york");
  });
});

describe("Industries & Capabilities leaves", () => {
  it("has the expected counts", () => {
    expect(INDUSTRY_LEAVES).toHaveLength(12);
    expect(CAPABILITY_LEAVES).toHaveLength(8);
  });

  it("points each leaf at its own /{section}/{slug} detail route", () => {
    for (const l of INDUSTRY_LEAVES) {
      expect(l.href).toBe(`/industries/${l.slug}`);
    }
    for (const l of CAPABILITY_LEAVES) {
      expect(l.href).toBe(`/capabilities/${l.slug}`);
    }
  });

  it("has unique slugs within each section", () => {
    const ind = INDUSTRY_LEAVES.map((l) => l.slug);
    const cap = CAPABILITY_LEAVES.map((l) => l.slug);
    expect(new Set(ind).size).toBe(ind.length);
    expect(new Set(cap).size).toBe(cap.length);
  });
});

describe("PANELS shape", () => {
  it("every panel has a title, desc, hub href, and two columns", () => {
    for (const [key, p] of Object.entries(PANELS)) {
      expect(p.id, key).toBe(key);
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.desc.length).toBeGreaterThan(0);
      expect(p.href.startsWith("/")).toBe(true);
      expect(Array.isArray(p.col1)).toBe(true);
      expect(Array.isArray(p.col2)).toBe(true);
    }
  });

  it("every leaf has a label, href and slug", () => {
    for (const leaf of ALL_LEAVES) {
      expect(leaf.label.length).toBeGreaterThan(0);
      expect(leaf.href.length).toBeGreaterThan(0);
      expect(leaf.slug.length).toBeGreaterThan(0);
    }
  });
});

describe("route integrity — no broken nav links", () => {
  it("resolves every mega-menu leaf to a real route", () => {
    const broken = ALL_LEAVES.filter((l) => !resolves(l.href)).map(
      (l) => l.href
    );
    expect(broken).toEqual([]);
  });

  it("resolves every left-index entry", () => {
    const broken = LEFT_ENTRIES.filter(
      (e) => e.type !== "header" && !resolves(e.href)
    ).map((e) => (e.type !== "header" ? e.href : ""));
    expect(broken).toEqual([]);
  });

  it("maps every left-index child/link id to a real panel", () => {
    for (const e of LEFT_ENTRIES) {
      if (e.type === "header") continue;
      expect(PANELS[e.id], e.id).toBeDefined();
    }
  });

  it("resolves every footer link", () => {
    const all = [...FOOTER.firm, ...FOOTER.industries, ...FOOTER.contact];
    const broken = all.filter((l) => !resolves(l.href)).map((l) => l.href);
    expect(broken).toEqual([]);
  });
});
