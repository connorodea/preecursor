import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ImpactBand from "./ImpactBand";

const html = () => renderToStaticMarkup(createElement(ImpactBand));

describe("ImpactBand", () => {
  it("renders to markup without throwing", () => {
    expect(() => html()).not.toThrow();
  });

  it("contains the 'How we work' eyebrow (no 'Client impact' metric framing)", () => {
    const out = html();
    expect(out).toContain("How we work");
    expect(out).not.toContain("Client impact");
  });

  it("renders four operating-principle headlines + their explanations", () => {
    const out = html();
    expect(out).toContain("Senior-only");
    expect(out).toContain("The people in the pitch are the people who build");
    expect(out).toContain("One team");
    expect(out).toContain("Strategists and engineers");
    expect(out).toContain("In production");
    expect(out).toContain("running systems, not slideware");
    expect(out).toContain("Embedded");
    expect(out).toContain("your stack");
  });

  it("renders no fabricated aggregate metrics", () => {
    const out = html();
    // None of the invented figures may survive.
    expect(out).not.toContain("$0.0B");
    expect(out).not.toContain("$2.4B");
    expect(out).not.toContain("/10");
    expect(out).not.toContain(" wks");
    expect(out).not.toContain("Enterprise value influenced");
  });

  it("renders the de-fogged EdgeFade — neighbour seam colours, blue waypoint, size 132", () => {
    const out = html();
    expect(out).toContain("linear-gradient(180deg, #d9e6f7 0%"); // top → hero light
    expect(out).toContain("linear-gradient(0deg, #edf1f7 0%"); // bottom → paper
    expect(out).toContain("rgba(60,98,164,0.42)"); // saturated-blue waypoint, not grey
    expect(out).not.toContain("#e6eefb, transparent"); // old grey-fog form gone
    expect((out.match(/height:132px/g) ?? []).length).toBe(2);
  });
});
