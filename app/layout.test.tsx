import { describe, it, expect, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

// next/font/google is not a runtime module under vitest — provide inert font
// loaders so the layout module can import them.
vi.mock("next/font/google", () => ({
  Newsreader: () => ({ variable: "--font-newsreader", className: "" }),
  Archivo: () => ({ variable: "--font-archivo", className: "" }),
}));

const { default: RootLayout, metadata } = await import("./layout");

describe("app/layout (RootLayout)", () => {
  it("exposes site-level metadata", () => {
    expect(metadata.title).toBeTruthy();
    expect(typeof metadata.description).toBe("string");
  });

  it("renders <html lang=en> with the JSON-LD Organization schema", () => {
    const out = renderToStaticMarkup(
      createElement(RootLayout, { children: createElement("div") }),
    );
    expect(out).toContain('lang="en"');
    expect(out).toContain('type="application/ld+json"');
    expect(out).toContain('"@type":"Organization"');
    expect(out).toContain('"@type":"WebSite"');
    expect(out).toContain("--font-newsreader");
  });

  it("provides a skip-to-content link targeting the main landmark (WCAG 2.4.1)", () => {
    const out = renderToStaticMarkup(
      createElement(RootLayout, { children: createElement("div") }),
    );
    expect(out).toContain('href="#main-content"');
    expect(out).toContain("Skip to main content");
    // the target landmark exists and is focusable
    expect(out).toContain('id="main-content"');
    expect(out).toMatch(/<main[^>]*id="main-content"[^>]*tabindex="-1"/);
  });
});
