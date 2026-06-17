import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import BrandMark from "./BrandMark";

const html = (props = {}) => renderToStaticMarkup(createElement(BrandMark, props));

describe("BrandMark", () => {
  it("renders an svg with 12 rays + a star (13 paths)", () => {
    const out = html();
    expect(out).toContain("<svg");
    expect((out.match(/<path/g) ?? []).length).toBe(13);
    expect(out).toContain("rotate(330)"); // last ray
  });

  it("color variant: periwinkle rays, indigo star", () => {
    const out = html({ variant: "color" });
    expect(out).toContain("#7184f5");
    expect(out).toContain("#3a4fe8");
  });

  it("reversed variant: white star for dark surfaces", () => {
    expect(html({ variant: "reversed" })).toContain("#ffffff");
  });

  it("ink variant: navy", () => {
    const out = html({ variant: "ink" });
    expect(out).toContain("#3a4569");
    expect(out).toContain("#0d1b2e");
  });

  it("honours size + accessible label", () => {
    const out = html({ size: 48, title: "Preecursor mark" });
    expect(out).toContain('width="48"');
    expect(out).toContain('aria-label="Preecursor mark"');
  });
});
