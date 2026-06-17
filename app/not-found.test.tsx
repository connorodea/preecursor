import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import NotFound from "./not-found";

const html = () => renderToStaticMarkup(createElement(NotFound));

describe("app/not-found (custom 404)", () => {
  it("renders the branded 404 messaging", () => {
    const out = html();
    expect(out).toContain("404 — Page not found");
    expect(out).toContain("This page took a different path.");
  });

  it("offers recovery links back into the key sections", () => {
    const out = html();
    expect(out).toContain('href="/"'); // back to home
    for (const href of [
      "/ai-consulting",
      "/industries",
      "/capabilities",
      "/work",
      "/insights",
      "/contact",
    ]) {
      expect(out, href).toContain(`href="${href}"`);
    }
  });
});
