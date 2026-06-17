import { describe, it, expect } from "vitest";
import {
  siteRoutes,
  organizationSchema,
  websiteSchema,
  serviceSchema,
  breadcrumbSchema,
  socialMeta,
  BASE_URL,
} from "./seo";
import { INDUSTRY_LEAVES, CAPABILITY_LEAVES } from "./ia";
import { WORK_CASES } from "./content/work";
import { INSIGHTS } from "./content/insights";
import { PROGRAMMATIC_ROUTES } from "./content/programmatic";
import { USE_CASE_ROUTES } from "./content/usecases";
import { GLOSSARY_ROUTES } from "./content/glossary";
import { COMPARISON_ROUTES } from "./content/comparisons";

describe("siteRoutes", () => {
  it("includes the home page and every hub", () => {
    const r = siteRoutes();
    for (const p of [
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
    ]) {
      expect(r, p).toContain(p);
    }
  });

  it("includes every industry + capability detail route", () => {
    const r = siteRoutes();
    for (const l of INDUSTRY_LEAVES) expect(r).toContain(`/industries/${l.slug}`);
    for (const l of CAPABILITY_LEAVES) expect(r).toContain(`/capabilities/${l.slug}`);
  });

  it("includes every work case + insight article", () => {
    const r = siteRoutes();
    for (const c of WORK_CASES) expect(r).toContain(`/work/${c.slug}`);
    for (const a of INSIGHTS) expect(r).toContain(`/insights/${a.slug}`);
  });

  it("has no duplicate routes and they all start with '/'", () => {
    const r = siteRoutes();
    expect(new Set(r).size).toBe(r.length);
    expect(r.every((p) => p.startsWith("/"))).toBe(true);
  });
});

describe("JSON-LD schema", () => {
  it("organizationSchema is a valid Organization node", () => {
    const s = organizationSchema();
    expect(s["@context"]).toBe("https://schema.org");
    expect(s["@type"]).toBe("Organization");
    expect(s.name).toBe("Preecursor");
    expect(s.url).toBe(BASE_URL);
    expect(s.email).toContain("@preecursor.com");
  });

  it("websiteSchema is a valid WebSite node pointing at the org", () => {
    const s = websiteSchema();
    expect(s["@type"]).toBe("WebSite");
    expect(s.url).toBe(BASE_URL);
    expect(s.name).toBe("Preecursor");
  });

  it("serviceSchema builds a ProfessionalService provided by Preecursor", () => {
    const s = serviceSchema({
      name: "AI consulting",
      description: "Applied-AI consulting.",
      url: `${BASE_URL}/ai-consulting/`,
    });
    expect(s["@type"]).toBe("ProfessionalService");
    expect(s.name).toBe("AI consulting");
    expect(s.url).toBe(`${BASE_URL}/ai-consulting/`);
    expect(s.provider["@type"]).toBe("Organization");
    expect(s.provider.name).toBe("Preecursor");
  });

  it("breadcrumbSchema builds a BreadcrumbList with 1-indexed ListItems", () => {
    const items = [
      { name: "Home", url: `${BASE_URL}/` },
      { name: "Glossary", url: `${BASE_URL}/glossary/` },
      { name: "RAG", url: `${BASE_URL}/glossary/rag/` },
    ];
    const s = breadcrumbSchema(items);

    expect(s["@context"]).toBe("https://schema.org");
    expect(s["@type"]).toBe("BreadcrumbList");
    expect(s.itemListElement).toHaveLength(3);

    s.itemListElement.forEach((el, i) => {
      expect(el["@type"]).toBe("ListItem");
      expect(el.position).toBe(i + 1); // 1-indexed
      expect(el.name).toBe(items[i].name);
      expect(el.item).toBe(items[i].url);
    });

    // First item is position 1 (not 0), last carries the deepest URL.
    expect(s.itemListElement[0].position).toBe(1);
    expect(s.itemListElement[2].item).toBe(`${BASE_URL}/glossary/rag/`);
  });
});

describe("socialMeta", () => {
  it("builds canonical + OpenGraph + Twitter for a path", () => {
    const m = socialMeta({
      title: "AI Consulting",
      description: "Applied-AI consulting.",
      path: "/ai-consulting",
    });
    expect(m.alternates.canonical).toBe(`${BASE_URL}/ai-consulting/`);
    expect(m.openGraph.title).toBe("AI Consulting");
    expect(m.openGraph.url).toBe(`${BASE_URL}/ai-consulting/`);
    expect(m.openGraph.siteName).toBe("Preecursor");
    expect(m.twitter.card).toBe("summary_large_image");
    expect(m.twitter.title).toBe("AI Consulting");
  });
});

describe("programmatic SEO routes", () => {
  it("siteRoutes includes every pillar + industry/city spoke", () => {
    const r = siteRoutes();
    for (const p of PROGRAMMATIC_ROUTES) expect(r, p).toContain(p);
  });

  it("siteRoutes includes the use-case, glossary, and comparison clusters", () => {
    const r = siteRoutes();
    for (const p of [...USE_CASE_ROUTES, ...GLOSSARY_ROUTES, ...COMPARISON_ROUTES]) {
      expect(r, p).toContain(p);
    }
  });

  it("the programmatic routes are not duplicated in siteRoutes", () => {
    const r = siteRoutes();
    expect(new Set(r).size).toBe(r.length);
  });
});
