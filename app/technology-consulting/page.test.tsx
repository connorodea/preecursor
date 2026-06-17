import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Page, { metadata } from "./page";
import { getPillar } from "@/lib/content/programmatic";
import { CAPABILITY_LEAVES } from "@/lib/ia";

const pillar = getPillar("technology-consulting")!;
const out = renderToStaticMarkup(createElement(Page));

describe("app/technology-consulting/page (pillar)", () => {
  it("renders without throwing and shows the pillar h1", () => {
    expect(out.length).toBeGreaterThan(0);
    expect(out).toContain(pillar.h1);
  });

  it("emits ProfessionalService + FAQPage JSON-LD", () => {
    expect(out).toContain('type="application/ld+json"');
    expect(out).toContain('"@type":"ProfessionalService"');
    expect(out).toContain('"@type":"FAQPage"');
    expect(out).toContain(JSON.stringify(pillar.faqs[0].q).slice(1, -1));
  });

  it("links to the capabilities hub, every capability leaf, and the AI consulting pillar", () => {
    expect(out).toContain('href="/capabilities"');
    expect(out).toContain('href="/ai-consulting"');
    for (const leaf of CAPABILITY_LEAVES) {
      expect(out, leaf.href).toContain(`href="${leaf.href}"`);
    }
    expect(out).toContain('href="/contact"');
  });

  it("exports canonical metadata", () => {
    expect(metadata.title).toBe(pillar.title);
    expect(metadata.description).toBe(pillar.metaDescription);
    expect(metadata.alternates?.canonical).toBe("https://preecursor.com/technology-consulting/");
  });
});
