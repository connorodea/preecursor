import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Home from "./page";

describe("app/page (landing)", () => {
  it("renders without throwing and includes the hero headline", () => {
    const out = renderToStaticMarkup(createElement(Home));
    expect(out.length).toBeGreaterThan(0);
    expect(out).toContain("strategic clarity meets applied AI");
  });
});
