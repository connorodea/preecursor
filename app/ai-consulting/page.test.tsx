import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Page, { metadata } from "./page";
import { getPillar, INDUSTRY_SPOKE_ROUTES } from "@/lib/content/programmatic";

const pillar = getPillar("ai-consulting")!;
const out = renderToStaticMarkup(createElement(Page));

describe("app/ai-consulting/page (pillar)", () => {
  it("renders without throwing and shows the pillar h1", () => {
    expect(out.length).toBeGreaterThan(0);
    // h1 contains no special chars to escape here.
    expect(out).toContain(pillar.h1);
  });

  it("emits ProfessionalService + FAQPage JSON-LD", () => {
    expect(out).toContain('type="application/ld+json"');
    expect(out).toContain('"@type":"ProfessionalService"');
    expect(out).toContain('"@type":"FAQPage"');
    // The first FAQ question is part of the FAQ JSON-LD payload.
    expect(out).toContain(JSON.stringify(pillar.faqs[0].q).slice(1, -1));
  });

  it("links to its industry spokes and sibling pillar", () => {
    // every industry spoke route is linked in the hub
    for (const route of INDUSTRY_SPOKE_ROUTES) {
      expect(out, route).toContain(`href="${route}"`);
    }
    expect(out).toContain('href="/ai-consultant"');
    expect(out).toContain('href="/capabilities"');
    expect(out).toContain('href="/contact"');
  });

  it("exports canonical metadata", () => {
    expect(metadata.title).toBe(pillar.title);
    expect(metadata.description).toBe(pillar.metaDescription);
    expect(metadata.alternates?.canonical).toBe("https://preecursor.com/ai-consulting/");
  });
});
