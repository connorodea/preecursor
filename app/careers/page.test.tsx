import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import CareersPage, { metadata } from "./page";
import { CAREERS } from "@/lib/content/company";

describe("app/careers/page", () => {
  it("exposes title + description metadata", () => {
    expect(metadata.title).toBe("Careers");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("renders without throwing and includes signature copy + open roles", () => {
    const out = renderToStaticMarkup(createElement(CareersPage));
    expect(out).toContain(CAREERS.hero.title);
    expect(out).toContain("Open roles");
    expect(out).toContain("Life at Preecursor");
    for (const role of CAREERS.openRoles) {
      // Role titles are HTML-escaped (& -> &amp;) in static markup.
      expect(out, role.title).toContain(role.title.replace(/&/g, "&amp;"));
    }
  });
});
