import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Page, { generateStaticParams, generateMetadata } from "./page";
import { USE_CASES, getUseCase, USE_CASE_CONCEPTS } from "@/lib/content/usecases";

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

describe("app/ai-consulting/use-cases/[useCase]/page", () => {
  it("generateStaticParams returns one entry per use case", () => {
    expect(params).toEqual(USE_CASES.map((u) => ({ useCase: u.slug })));
    expect(params.length).toBeGreaterThan(0);
  });

  it("renders every use case with its h1, breadcrumbs, JSON-LD, approach, and related", async () => {
    for (const { useCase } of params) {
      const uc = getUseCase(useCase)!;
      const el = await Page({ params: Promise.resolve({ useCase }) });
      const out = renderToStaticMarkup(el);

      expect(out, useCase).toContain(esc(uc.h1));
      // Breadcrumb markers.
      expect(out, useCase).toContain('aria-label="Breadcrumb"');
      expect(out, useCase).toContain("BreadcrumbList");
      // ProfessionalService JSON-LD.
      expect(out, useCase).toContain("ProfessionalService");
      // The outcome prose renders.
      expect(out, useCase).toContain(esc(uc.outcome));
      // Each approach row renders its title.
      for (const a of uc.approach) {
        expect(out, `${useCase} approach`).toContain(esc(a.title));
      }
      // Related cross-link section.
      expect(out, useCase).toContain("Related");
      for (const r of uc.relatedCapabilities) {
        expect(out, `${useCase} -> ${r.href}`).toContain(r.href);
      }
      // Cross-cluster glossary links (key concepts) render when mapped.
      const concepts = USE_CASE_CONCEPTS[useCase] ?? [];
      if (concepts.length > 0) {
        expect(out, useCase).toContain("Key concepts");
        for (const c of concepts) {
          expect(out, `${useCase} -> glossary ${c}`).toContain(`/glossary/${c}`);
        }
      }
      // Sibling use-case interlinking (3 wrapping neighbours, never self).
      expect(out, useCase).toContain("More use cases");
      const idx = USE_CASES.findIndex((u) => u.slug === useCase);
      const siblings = [1, 2, 3].map((n) => USE_CASES[(idx + n) % USE_CASES.length]);
      for (const s of siblings) {
        expect(s.slug, `${useCase} sibling`).not.toBe(useCase);
        expect(out, `${useCase} -> sibling ${s.slug}`).toContain(
          `/ai-consulting/use-cases/${s.slug}`,
        );
      }
    }
  });

  it("generateMetadata returns the use case's title + description for every slug", async () => {
    for (const { useCase } of params) {
      const uc = getUseCase(useCase)!;
      const meta = await generateMetadata({ params: Promise.resolve({ useCase }) });
      expect(meta.title, useCase).toBe(uc.title);
      expect(meta.description, useCase).toBe(uc.metaDescription);
    }
  });

  it("generateMetadata returns an empty object for an unknown slug", async () => {
    const meta = await generateMetadata({
      params: Promise.resolve({ useCase: "not-a-real-use-case" }),
    });
    expect(meta).toEqual({});
  });

  it("triggers notFound() (throws) for an unknown slug", async () => {
    await expect(
      Page({ params: Promise.resolve({ useCase: "not-a-real-use-case" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
