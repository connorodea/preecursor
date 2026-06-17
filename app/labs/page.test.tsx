import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import LabsPage, { metadata } from "./page";
import { LABS } from "@/lib/content/world";

describe("app/labs/page", () => {
  it("exposes title + description metadata", () => {
    expect(metadata.title).toBe("Labs");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("renders without throwing and includes signature copy", () => {
    const out = renderToStaticMarkup(createElement(LabsPage));
    expect(out).toContain(
      "Where we sharpen the methods before they reach a client",
    );
    expect(out).toContain("Publications");
    expect(out).toContain(LABS.fellowship.title);
    // Publications list renders the authored items.
    for (const pub of LABS.publications) {
      expect(out, pub.title).toContain(pub.title);
    }
  });
});
