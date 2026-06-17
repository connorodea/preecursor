import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Page, { generateStaticParams, generateMetadata } from "./page";
import { CITIES, getCity } from "@/lib/content/programmatic";
import { slugify } from "@/lib/ia";

const params = generateStaticParams();

describe("app/ai-consultant/[city]/page", () => {
  it("generateStaticParams returns one { city } entry per city", () => {
    expect(params).toEqual(CITIES.map((c) => ({ city: c.slug })));
    expect(params).toHaveLength(CITIES.length);
    expect(params).toHaveLength(10);
    for (const p of params) expect(typeof p.city).toBe("string");
  });

  it("renders every city slug without throwing and contains 'AI consultant in {City}'", async () => {
    for (const { city } of params) {
      const c = getCity(city)!;
      const el = await Page({ params: Promise.resolve({ city }) });
      const html = renderToStaticMarkup(el);
      expect(html.length, city).toBeGreaterThan(0);
      // h1 + hero title: "AI consultant in {City}"
      expect(html, city).toContain(`AI consultant in ${c.city}`);
      // ProfessionalService JSON-LD with the city as areaServed
      expect(html, city).toContain('"@type":"ProfessionalService"');
      expect(html, city).toContain(`"areaServed":"${c.city}"`);
      // every city sector links to its AI-consulting industry spoke
      for (const sector of c.sectors) {
        expect(html, `${city}/${sector}`).toContain(
          `href="/ai-consulting/${slugify(sector)}"`
        );
      }
      // back-to-pillar link
      expect(html, city).toContain('href="/ai-consultant"');
    }
  });

  it("renders the office branch for a real office (New York)", async () => {
    const html = renderToStaticMarkup(await Page({ params: Promise.resolve({ city: "new-york" }) }));
    expect(html).toContain("On the ground");
    expect(html).toContain("on the ground in New York");
    // office region eyebrow, not the remote one
    expect(html).toContain("Office ");
    expect(html).not.toContain("We serve New York remote-first");
  });

  it("renders the remote branch for a non-office city (San Francisco)", async () => {
    const html = renderToStaticMarkup(
      await Page({ params: Promise.resolve({ city: "san-francisco" }) })
    );
    expect(html).toContain("How we serve you");
    expect(html).toContain("We serve San Francisco remote-first");
    expect(html).toContain("Remote-first ");
    // remote copy names the nearest office
    const c = getCity("san-francisco")!;
    expect(html).toContain(`office in ${c.nearestOffice}`);
  });

  it("generateMetadata returns title + canonical for every known city", async () => {
    for (const { city } of params) {
      const c = getCity(city)!;
      const meta = await generateMetadata({ params: Promise.resolve({ city }) });
      expect(meta.title, city).toBe(`AI Consultant in ${c.city}`);
      expect(meta.alternates?.canonical, city).toBe(
        `https://preecursor.com/ai-consultant/${city}/`
      );
      expect(typeof meta.description, city).toBe("string");
      // remote cities flag "(remote-first)" in the description; offices don't.
      if (c.office) {
        expect(meta.description, city).not.toContain("(remote-first)");
      } else {
        expect(meta.description, city).toContain("(remote-first)");
      }
    }
  });

  it("generateMetadata returns the bare fallback title for an unknown slug", async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ city: "atlantis" }) });
    expect(meta.title).toBe("AI Consultant");
    expect(meta.description).toBeUndefined();
    expect(meta.alternates).toBeUndefined();
  });
});
