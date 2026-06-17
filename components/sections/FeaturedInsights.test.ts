import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import FeaturedInsights from "./FeaturedInsights";

const html = () => renderToStaticMarkup(createElement(FeaturedInsights));

describe("FeaturedInsights", () => {
  it("renders to markup without throwing", () => {
    expect(() => html()).not.toThrow();
  });

  it("contains the section label + headline", () => {
    const out = html();
    expect(out).toContain("Featured Insights");
    expect(out).toContain("Our sharpest thinking on the systems shaping applied AI.");
  });

  it("renders the newsletter signup with its signature heading", () => {
    expect(html()).toContain("Get the latest delivered to you");
  });

  it("renders the email input + subscribe button", () => {
    const out = html();
    expect(out).toContain('type="email"');
    expect(out).toContain('placeholder="Enter email"');
    expect(out).toContain('aria-label="Email address"');
    expect(out).toContain("Subscribe →");
  });

  it("renders two de-fogged EdgeFades — neighbour seam colours + blue waypoint (top 120, bottom 132)", () => {
    const out = html();
    expect(out).toContain("height:120px"); // top-only fade → Careers
    expect(out).toContain("height:132px"); // bottom-only fade → ContactCTA
    expect(out).toContain("linear-gradient(180deg, #e1e8f1 0%"); // top → paper2
    expect(out).toContain("linear-gradient(0deg, #d8e6f7 0%"); // bottom → heroWash light
    expect(out).toContain("rgba(60,98,164,0.42)"); // saturated-blue waypoint, not grey
    expect(out).not.toContain("#e6eefb, transparent"); // old grey-fog form gone
  });
});
