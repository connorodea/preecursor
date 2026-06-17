import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import ArticlePage, { generateStaticParams, generateMetadata } from "./page";
import { INSIGHTS, getArticle } from "@/lib/content/insights";

const params = generateStaticParams();

describe("app/insights/[slug]/page", () => {
  it("generateStaticParams returns one entry per article", () => {
    expect(params).toEqual(INSIGHTS.map((a) => ({ slug: a.slug })));
    expect(params.length).toBeGreaterThan(0);
  });

  it("renders every article slug without throwing and includes its content", async () => {
    for (const { slug } of params) {
      const a = getArticle(slug)!;
      const el = await ArticlePage({ params: Promise.resolve({ slug }) });
      const out = renderToStaticMarkup(el);
      expect(out, slug).toContain(a.title);
      expect(out, slug).toContain(a.author);
      // First body paragraph is rendered in the article.
      expect(out, slug).toContain(a.body[0].slice(0, 40));
    }
  });

  it("generateMetadata returns title + dek for every article slug", async () => {
    for (const { slug } of params) {
      const a = getArticle(slug)!;
      const meta = await generateMetadata({ params: Promise.resolve({ slug }) });
      expect(meta.title, slug).toBe(a.title);
      expect(meta.description, slug).toBe(a.dek);
    }
  });

  it("generateMetadata falls back to a title for an unknown slug", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "does-not-exist" }),
    });
    expect(meta.title).toBe("Insights");
  });
});
