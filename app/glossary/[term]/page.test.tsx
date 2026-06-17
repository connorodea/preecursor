import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Page, { generateStaticParams, generateMetadata } from "./page";
import { GLOSSARY, getTerm } from "@/lib/content/glossary";

// notFound() normally throws a Next.js redirect that jsdom can't navigate;
// stub it to a plain throw so the unknown-slug branch is exercised cleanly.
vi.mock("next/navigation", async (importActual) => {
  const actual = await importActual<typeof import("next/navigation")>();
  return {
    ...actual,
    notFound: () => {
      throw new Error("NEXT_NOT_FOUND");
    },
  };
});

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

const params = generateStaticParams();

describe("app/glossary/[term]/page", () => {
  it("generateStaticParams returns one entry per glossary term", () => {
    expect(params).toEqual(GLOSSARY.map((t) => ({ term: t.slug })));
    expect(params.length).toBeGreaterThan(0);
  });

  it("renders every term with its h1, breadcrumbs, JSON-LD, and related section", async () => {
    for (const { term } of params) {
      const entry = getTerm(term)!;
      const el = await Page({ params: Promise.resolve({ term }) });
      const out = renderToStaticMarkup(el);

      // H1 is "What is {term}?" — assert the escaped term appears.
      expect(out, term).toContain(esc(`What is ${entry.term}?`));
      // Breadcrumb marker (PageHero nav + BreadcrumbList JSON-LD).
      expect(out, term).toContain('aria-label="Breadcrumb"');
      expect(out, term).toContain("BreadcrumbList");
      // Glossary-specific DefinedTerm JSON-LD.
      expect(out, term).toContain("DefinedTerm");
      // Related cross-link section.
      expect(out, term).toContain("Related");
      for (const r of entry.related) {
        expect(out, `${term} -> ${r.href}`).toContain(r.href);
      }
    }
  });

  it("generateMetadata returns the term's title + description for every slug", async () => {
    for (const { term } of params) {
      const entry = getTerm(term)!;
      const meta = await generateMetadata({ params: Promise.resolve({ term }) });
      expect(meta.title, term).toBe(entry.title);
      expect(meta.description, term).toBe(entry.metaDescription);
    }
  });

  it("generateMetadata returns an empty object for an unknown slug", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ term: "not-a-real-term" }),
    });
    expect(meta).toEqual({});
  });

  it("triggers notFound() (throws) for an unknown slug", async () => {
    await expect(
      Page({ params: Promise.resolve({ term: "not-a-real-term" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
