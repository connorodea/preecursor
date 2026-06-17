import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Page, { generateStaticParams, generateMetadata } from "./page";
import { CAPABILITY_LEAVES } from "@/lib/ia";
import { getCapability } from "@/lib/content/services";

const params = generateStaticParams();

describe("app/capabilities/[slug]/page", () => {
  it("generateStaticParams returns one entry per capability leaf", () => {
    expect(params).toEqual(CAPABILITY_LEAVES.map((l) => ({ slug: l.slug })));
    expect(params.length).toBeGreaterThan(0);
  });

  it("renders every slug without throwing and includes its content", async () => {
    for (const { slug } of params) {
      const c = getCapability(slug);
      const el = await Page({ params: Promise.resolve({ slug }) });
      const out = renderToStaticMarkup(el);
      // Titles are HTML-escaped (& -> &amp;) in static markup.
      expect(out, slug).toContain(c.title.replace(/&/g, "&amp;"));
      expect(out, slug).toContain("Related work");
    }
  });

  it("generateMetadata returns a title + description for every slug", async () => {
    for (const { slug } of params) {
      const c = getCapability(slug);
      const meta = await generateMetadata({ params: Promise.resolve({ slug }) });
      expect(meta.title, slug).toBe(c.title);
      expect(meta.description, slug).toBe(c.lede);
    }
  });
});
