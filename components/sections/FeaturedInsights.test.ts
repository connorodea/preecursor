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

  it("is a solid-navy pool — no EdgeFade band; the dissolve is on the neighbours", () => {
    const out = html();
    // Background resolves to solid ink (the dissolve lives on Careers + ContactCTA).
    expect(out).toContain("background:#112138");
    // The old EdgeFade waypoint band is gone from this section.
    expect(out).not.toContain("rgba(60,98,164,0.42)");
    expect(out).not.toContain("linear-gradient(0deg,"); // no bottom EdgeFade form
    // Content (newsletter card) still renders.
    expect(out).toContain("Get the latest delivered to you");
  });
});
