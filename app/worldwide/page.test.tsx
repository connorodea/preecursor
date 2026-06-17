import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import WorldwidePage, { metadata } from "./page";
import { OFFICES } from "@/lib/content/world";

describe("app/worldwide/page", () => {
  it("exposes title + description metadata", () => {
    expect(metadata.title).toBe("Worldwide");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("renders without throwing and includes signature copy + every office", () => {
    const out = renderToStaticMarkup(createElement(WorldwidePage));
    expect(out).toContain("Preecursor Worldwide");
    expect(out).toContain("Remote-first teams");
    expect(out).toContain("The right senior person, in your time zone");
    for (const office of OFFICES) {
      expect(out, office.city).toContain(office.city);
    }
  });
});
