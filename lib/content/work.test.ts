import { describe, it, expect } from "vitest";
import { WORK_CASES, FIRM_STATS, getCase, formatStat } from "./work";
import type { Stat } from "./services";

function expectWellFormedStat(s: Stat, ctx: string) {
  expect(typeof s.value, ctx).toBe("number");
  expect(Number.isNaN(s.value), ctx).toBe(false);
  expect(s.label.length, ctx).toBeGreaterThan(0);
  if (s.decimals != null) {
    expect(Number.isInteger(s.decimals), ctx).toBe(true);
    expect(s.decimals, ctx).toBeGreaterThanOrEqual(0);
  }
}

describe("WORK_CASES data", () => {
  it("has at least one case", () => {
    expect(WORK_CASES.length).toBeGreaterThan(0);
  });

  it("has a unique slug per case", () => {
    const slugs = WORK_CASES.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has well-formed fields on every case", () => {
    for (const c of WORK_CASES) {
      expect(c.slug.length, c.slug).toBeGreaterThan(0);
      expect(c.slug, c.slug).toMatch(/^[a-z0-9-]+$/);
      expect(c.client.length, c.slug).toBeGreaterThan(0);
      expect(c.sector.length, c.slug).toBeGreaterThan(0);
      expect(c.headline.length, c.slug).toBeGreaterThan(0);
      expect(c.summary.length, c.slug).toBeGreaterThan(0);
      expect(c.challenge.length, c.slug).toBeGreaterThan(0);

      // headline stat
      expectWellFormedStat(c.stat, `${c.slug} headline stat`);

      // approach rows
      expect(c.approach.length, c.slug).toBeGreaterThan(0);
      for (const a of c.approach) {
        expect(a.title.length, `${c.slug} approach`).toBeGreaterThan(0);
        expect(a.desc.length, `${c.slug} approach`).toBeGreaterThan(0);
      }

      // outcome stats
      expect(c.outcome.length, c.slug).toBeGreaterThan(0);
      for (const o of c.outcome) {
        expectWellFormedStat(o, `${c.slug} outcome`);
      }
    }
  });

  it("includes the headline stat among (or matching) the outcome stats", () => {
    // The card stat should be one the case can actually point to.
    for (const c of WORK_CASES) {
      const labels = c.outcome.map((o) => o.label.toLowerCase());
      const headlineWords = c.stat.label.toLowerCase();
      // Either the exact label appears, or a close match (outcome labels
      // sometimes add "Returned"/"Per" framing). Assert the value lines up.
      const matchByValue = c.outcome.some((o) => o.value === c.stat.value);
      expect(matchByValue || labels.includes(headlineWords), c.slug).toBe(true);
    }
  });
});

describe("FIRM_STATS", () => {
  it("has firm-wide stats, all well-formed", () => {
    expect(FIRM_STATS.length).toBeGreaterThan(0);
    for (const s of FIRM_STATS) {
      expectWellFormedStat(s, `firm stat ${s.label}`);
    }
  });
});

describe("getCase", () => {
  it("returns the matching case for every known slug", () => {
    for (const c of WORK_CASES) {
      const found = getCase(c.slug);
      expect(found, c.slug).toBeDefined();
      expect(found).toBe(c);
    }
  });

  it("returns undefined for an unknown slug", () => {
    expect(getCase("totally-made-up-case")).toBeUndefined();
  });
});

describe("formatStat", () => {
  it("renders an integer value with no prefix/suffix (both fallback branches)", () => {
    expect(formatStat({ value: 40, label: "x" })).toBe("40");
  });

  it("renders a fixed-decimal value when decimals is set", () => {
    expect(formatStat({ value: 2.1, decimals: 1, label: "x" })).toBe("2.1");
    // pads to the requested precision even for whole numbers
    expect(formatStat({ value: 2, decimals: 1, label: "x" })).toBe("2.0");
  });

  it("renders a plain string value when decimals is absent", () => {
    expect(formatStat({ value: 63, label: "x" })).toBe("63");
  });

  it("applies prefix and suffix around the number", () => {
    expect(
      formatStat({ value: 180, prefix: "$", suffix: "M", label: "x" })
    ).toBe("$180M");
    expect(
      formatStat({ value: 63, prefix: "−", suffix: "%", label: "x" })
    ).toBe("−63%");
  });

  it("combines decimals with prefix and suffix", () => {
    expect(
      formatStat({
        value: 2.4,
        decimals: 1,
        prefix: "$",
        suffix: "B",
        label: "x",
      })
    ).toBe("$2.4B");
  });

  it("formats every real Stat in the dataset to a non-empty string", () => {
    for (const c of WORK_CASES) {
      expect(formatStat(c.stat).length, c.slug).toBeGreaterThan(0);
      for (const o of c.outcome) {
        expect(formatStat(o).length, c.slug).toBeGreaterThan(0);
      }
    }
    for (const s of FIRM_STATS) {
      expect(formatStat(s).length).toBeGreaterThan(0);
    }
  });
});
