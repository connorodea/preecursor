import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import SectionSeam from "./SectionSeam";

const html = (props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(SectionSeam, props as never));

describe("SectionSeam", () => {
  it("renders a two-colour linear ramp with both colours at 0% and 100%", () => {
    const out = html({ edge: "bottom", from: "#dce8f7", to: "#112138" });
    expect(out).toContain("linear-gradient(180deg, #dce8f7 0%, #112138 100%)");
  });

  it("renders a soft radial junction glow", () => {
    const out = html({ edge: "bottom", from: "#dce8f7", to: "#112138" });
    expect(out).toContain("radial-gradient(140% 75% at 50%");
    expect(out).toContain("transparent 72%");
  });

  it("anchors a top seam to top:0 with a 0% glow, never bottom", () => {
    const out = html({ edge: "top", from: "#112138", to: "#edf1f7" });
    expect(out).toContain("top:0");
    expect(out).not.toContain("bottom:0");
    expect(out).toContain("at 50% 0%");
    // top seam ramps navy → light
    expect(out).toContain("linear-gradient(180deg, #112138 0%, #edf1f7 100%)");
  });

  it("anchors a bottom seam to bottom:0 with a 100% glow, never top", () => {
    const out = html({ edge: "bottom", from: "#edf1f7", to: "#112138" });
    expect(out).toContain("bottom:0");
    expect(out).not.toContain("top:0");
    expect(out).toContain("at 50% 100%");
  });

  it("defaults height to 240 and lets it flow through", () => {
    expect(html({ edge: "top", from: "#112138", to: "#edf1f7" })).toContain(
      "height:240px",
    );
    expect(
      html({ edge: "top", from: "#edf1f7", to: "#e1e8f1", height: 150 }),
    ).toContain("height:150px");
  });

  it("derives the glow from the lighter ramp colour at 0.5 alpha when not given", () => {
    // light #edf1f7 is lighter than navy #112138 → glow is the light colour
    const out = html({ edge: "top", from: "#112138", to: "#edf1f7" });
    // #edf1f7 → rgb(237,241,247)
    expect(out).toContain("rgba(237,241,247,0.5)");
  });

  it("expands #rgb shorthand hex when deriving the glow", () => {
    // #abc → #aabbcc → rgb(170,187,204); lighter than navy, so it's the glow.
    const out = html({ edge: "top", from: "#112138", to: "#abc" });
    expect(out).toContain("rgba(170,187,204,0.5)");
  });

  it("accepts an explicit glow override verbatim", () => {
    const out = html({
      edge: "bottom",
      from: "#dce8f7",
      to: "#112138",
      glow: "rgba(1,2,3,0.4)",
    });
    expect(out).toContain("rgba(1,2,3,0.4)");
  });

  it("is aria-hidden and pointer-events:none (purely presentational)", () => {
    const out = html({ edge: "top", from: "#112138", to: "#edf1f7" });
    expect(out).toContain('aria-hidden="true"');
    expect(out).toContain("pointer-events:none");
    expect(out).toContain("z-index:0");
  });
});
