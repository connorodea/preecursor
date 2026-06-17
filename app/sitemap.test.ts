import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";
import { siteRoutes, absoluteUrl, BASE_URL } from "@/lib/seo";

describe("app/sitemap", () => {
  const entries = sitemap();

  it("emits one entry per site route", () => {
    expect(entries.length).toBe(siteRoutes().length);
  });

  it("uses absolute, trailing-slashed URLs under the base URL", () => {
    for (const e of entries) {
      expect(e.url.startsWith(BASE_URL)).toBe(true);
      expect(e.url.endsWith("/")).toBe(true);
    }
    // Homepage maps to the bare base + slash.
    expect(entries[0].url).toBe(absoluteUrl("/"));
    expect(entries[0].url).toBe(`${BASE_URL}/`);
  });

  it("assigns priority/changeFrequency by route depth", () => {
    const home = entries.find((e) => e.url === `${BASE_URL}/`)!;
    expect(home.priority).toBe(1);
    expect(home.changeFrequency).toBe("weekly");

    const hub = entries.find((e) => e.url === absoluteUrl("/industries"))!;
    expect(hub.priority).toBe(0.8);
    expect(hub.changeFrequency).toBe("monthly");

    // A two-segment detail page sits at the deepest tier.
    const detail = entries.find((e) => e.url === absoluteUrl(siteRoutes()[siteRoutes().length - 1]))!;
    expect(detail.priority).toBe(0.6);
    expect(detail.changeFrequency).toBe("monthly");
  });

  it("sets lastModified on every entry, preferring an insight's published date", () => {
    for (const e of entries) {
      expect(e.lastModified).toBeInstanceOf(Date);
    }
    // An insights article carries its own parsed published date ("May 2026").
    const ev = entries.find(
      (e) => e.url === absoluteUrl("/insights/evals-are-the-product"),
    )!;
    expect((ev.lastModified as Date).toISOString().slice(0, 10)).toBe(
      "2026-05-01",
    );
  });
});
