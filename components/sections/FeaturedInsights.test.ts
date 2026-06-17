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

  it("renders the two EdgeFade gradients (top size 88, bottom size 120)", () => {
    const out = html();
    expect(out).toContain("height:88px"); // top-only fade
    expect(out).toContain("height:120px"); // bottom-only fade
    expect(out).toContain("linear-gradient(180deg, #e6eefb, transparent)");
    expect(out).toContain("linear-gradient(0deg, #e6eefb, transparent)");
  });
});
