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

  it("leads with the co-founders' university trust strip", () => {
    const out = html();
    expect(out).toContain("Our co-founders studied at");
    expect(out).toContain("University of Michigan");
    expect(out).toContain("Harvard University");
    expect(out).toContain("UC Berkeley");
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

  it("is a solid-navy pool — no EdgeFade band, no gradient background", () => {
    const out = html();
    // Background is solid ink; the dissolve is owned by the light neighbours.
    expect(out).toContain("background:#112138");
    // No EdgeFade / gradient band lives inside this section any more.
    expect(out).not.toContain("linear-gradient");
    expect(out).not.toContain("rgba(60,98,164,0.42)"); // old EdgeFade waypoint gone
    // Content still renders above the (now external) seam.
    expect(out).toContain("How we work");
    expect(out).toContain("Senior-only");
  });
});
