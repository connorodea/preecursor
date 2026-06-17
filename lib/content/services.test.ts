import { describe, it, expect } from "vitest";
import {
  getIndustry,
  getCapability,
  cardBlurb,
  type ServiceContent,
} from "./services";
import { INDUSTRY_LEAVES, CAPABILITY_LEAVES } from "@/lib/ia";

/** A well-formed ServiceContent has non-empty copy and at least some structure. */
function expectWellFormed(c: ServiceContent, slug: string) {
  expect(c, slug).toBeDefined();
  expect(c.slug, slug).toBe(slug);
  expect(c.title.length, slug).toBeGreaterThan(0);
  expect(c.lede.length, slug).toBeGreaterThan(0);
  expect(c.overview.length, slug).toBeGreaterThan(0);
  expect(c.approach.length, slug).toBeGreaterThan(0);
  // stats are intentionally empty (no invented metrics); the field exists but
  // carries no fabricated figures. StatBand suppresses itself on an empty array.
  expect(Array.isArray(c.stats), slug).toBe(true);
  expect(c.stats.length, slug).toBe(0);
  for (const r of c.related) {
    expect(r.href.startsWith("/"), `${slug} related ${r.href}`).toBe(true);
  }
}

describe("service content coverage", () => {
  it("returns well-formed content for every industry slug", () => {
    for (const l of INDUSTRY_LEAVES) {
      expectWellFormed(getIndustry(l.slug), l.slug);
    }
  });

  it("returns well-formed content for every capability slug", () => {
    for (const l of CAPABILITY_LEAVES) {
      expectWellFormed(getCapability(l.slug), l.slug);
    }
  });
});

describe("unknown slug fallback (build must never break)", () => {
  it("getIndustry returns a usable fallback for an unknown slug", () => {
    const c = getIndustry("totally-made-up-sector");
    expect(c).toBeDefined();
    expect(c.title.length).toBeGreaterThan(0);
    expect(c.approach.length).toBeGreaterThan(0);
    // fallback also publishes no invented metrics
    expect(c.stats.length).toBe(0);
  });

  it("getCapability returns a usable fallback for an unknown slug", () => {
    const c = getCapability("totally-made-up-capability");
    expect(c).toBeDefined();
    expect(c.title.length).toBeGreaterThan(0);
  });
});

describe("cardBlurb", () => {
  // Only `overview` is read, so a minimal cast keeps the test focused.
  const mk = (overview: string) => ({ overview }) as unknown as ServiceContent;

  it("returns the first sentence untouched when it's short", () => {
    expect(cardBlurb(mk("A short first sentence. And then more detail."))).toBe(
      "A short first sentence.",
    );
  });

  it("truncates a long first sentence to ≤140 chars with an ellipsis", () => {
    const long =
      "We design and ship production AI systems that move a real operating number for large organizations across many regulated markets and time zones every single day";
    const out = cardBlurb(mk(long));
    expect(out.endsWith("…")).toBe(true);
    expect(out.length).toBeLessThanOrEqual(140);
  });
});
