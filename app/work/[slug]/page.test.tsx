import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import CasePage, { generateStaticParams, generateMetadata } from "./page";
import { WORK_CASES, getCase } from "@/lib/content/work";

const params = generateStaticParams();

describe("app/work/[slug]/page", () => {
  it("generateStaticParams returns one entry per case study", () => {
    expect(params).toEqual(WORK_CASES.map((c) => ({ slug: c.slug })));
    expect(params.length).toBeGreaterThan(0);
  });

  it("renders every case slug without throwing and includes its content", async () => {
    for (const { slug } of params) {
      const c = getCase(slug)!;
      const el = await CasePage({ params: Promise.resolve({ slug }) });
      const out = renderToStaticMarkup(el);
      expect(out, slug).toContain(c.headline);
      expect(out, slug).toContain("What stood in the way");
    }
  });

  it("generateMetadata returns headline + summary for every case slug", async () => {
    for (const { slug } of params) {
      const c = getCase(slug)!;
      const meta = await generateMetadata({ params: Promise.resolve({ slug }) });
      expect(meta.title, slug).toBe(c.headline);
      expect(meta.description, slug).toBe(c.summary);
    }
  });

  it("generateMetadata falls back to a title for an unknown slug", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ slug: "does-not-exist" }),
    });
    expect(meta.title).toBe("Client impact");
  });
});
