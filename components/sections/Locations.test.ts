import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Locations from "./Locations";

const html = () => renderToStaticMarkup(createElement(Locations));

describe("Locations", () => {
  it("renders to markup without throwing", () => {
    expect(() => html()).not.toThrow();
  });

  it("contains the eyebrow + headline", () => {
    const out = html();
    expect(out).toContain("Our locations");
    expect(out).toContain("Preecursor Worldwide");
  });

  it("names the office cities in the body copy", () => {
    const out = html();
    expect(out).toContain("New York, London");
    expect(out).toContain("Singapore");
  });

  it("renders the 'Learn more' pill linking to /worldwide", () => {
    const out = html();
    expect(out).toContain("Learn more →");
    expect(out).toContain('href="/worldwide"');
  });
});
