import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AboutPage, { metadata } from "./page";
import { ABOUT } from "@/lib/content/company";

describe("app/about/page", () => {
  it("exposes a title + description in metadata", () => {
    expect(metadata.title).toBe("About Preecursor");
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("renders without throwing and includes signature copy", () => {
    const out = renderToStaticMarkup(createElement(AboutPage));
    expect(out).toContain("About Preecursor");
    expect(out).toContain(ABOUT.hero.title);
    expect(out).toContain("We built the firm we wished we could have hired");
    expect(out).toContain("Press");
  });
});
