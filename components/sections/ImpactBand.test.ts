import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ImpactBand from "./ImpactBand";

const html = () => renderToStaticMarkup(createElement(ImpactBand));

describe("ImpactBand", () => {
  it("renders to markup without throwing", () => {
    expect(() => html()).not.toThrow();
  });

  it("contains the 'Client impact' eyebrow", () => {
    expect(html()).toContain("Client impact");
  });

  it("renders all four stat labels", () => {
    const out = html();
    expect(out).toContain("Enterprise value influenced across engagements");
    expect(out).toContain("AI systems shipped into production");
    expect(out).toContain("Median time to first live deployment");
    expect(out).toContain("Engagements that expand within a year");
  });

  it("renders CountUp markup with its prefix/suffix scaffolding", () => {
    // Effects don't run under SSR, so CountUp shows its initial (0) value, but
    // the static prefix/suffix decoration is still present.
    const out = html();
    expect(out).toContain("$0.0B"); // $ prefix + B suffix on the first stat
    expect(out).toContain(" wks"); // suffix span on stat 3
    expect(out).toContain("/10"); // suffix span on stat 4
  });

  it("renders the EdgeFade top + bottom gradient at size 90", () => {
    const out = html();
    expect(out).toContain("linear-gradient(180deg, #e6eefb, transparent)");
    expect(out).toContain("linear-gradient(0deg, #e6eefb, transparent)");
    expect((out.match(/height:90px/g) ?? []).length).toBe(2);
  });
});
