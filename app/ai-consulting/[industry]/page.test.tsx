import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Page, { generateStaticParams, generateMetadata } from "./page";
import { INDUSTRY_LEAVES } from "@/lib/ia";
import { industrySpoke } from "@/lib/content/programmatic";

const params = generateStaticParams();

describe("app/ai-consulting/[industry]/page", () => {
  it("generateStaticParams returns one { industry } entry per industry leaf", () => {
    expect(params).toEqual(INDUSTRY_LEAVES.map((l) => ({ industry: l.slug })));
    expect(params).toHaveLength(INDUSTRY_LEAVES.length);
    expect(params).toHaveLength(12);
    for (const p of params) expect(typeof p.industry).toBe("string");
  });

  it("renders every slug without throwing and contains 'AI consulting for' + spoke h1", async () => {
    for (const { industry } of params) {
      const spoke = industrySpoke(industry);
      const el = await Page({ params: Promise.resolve({ industry }) });
      const html = renderToStaticMarkup(el);
      expect(html.length, industry).toBeGreaterThan(0);
      expect(html, industry).toContain("AI consulting for");
      // The page renders the spoke h1 (label may contain & -> &amp; once lowercased).
      expect(html, industry).toContain(spoke.h1.replace(/&/g, "&amp;"));
      // back-to-pillar link + matching industry overview link are present
      expect(html, industry).toContain('href="/ai-consulting"');
      expect(html, industry).toContain(`href="/industries/${spoke.slug}"`);
      // ProfessionalService JSON-LD is emitted
      expect(html, industry).toContain('"@type":"ProfessionalService"');
    }
  });

  it("generateMetadata returns title + canonical for every slug", async () => {
    for (const { industry } of params) {
      const spoke = industrySpoke(industry);
      const meta = await generateMetadata({ params: Promise.resolve({ industry }) });
      expect(meta.title, industry).toBe(spoke.title);
      expect(meta.description, industry).toBe(spoke.metaDescription);
      expect(meta.alternates?.canonical, industry).toBe(
        `https://preecursor.com/ai-consulting/${industry}/`
      );
    }
  });
});
