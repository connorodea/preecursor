import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Hero from "./Hero";

const html = () => renderToStaticMarkup(createElement(Hero));

describe("Hero", () => {
  it("renders to markup without throwing", () => {
    expect(() => html()).not.toThrow();
    expect(html()).toContain('id="top"');
  });

  it("contains the signature headline", () => {
    expect(html()).toContain("Where strategic clarity meets applied AI");
  });

  it("contains the welcome eyebrow + subhead + CTA", () => {
    const out = html();
    expect(out).toContain("Welcome to Preecursor");
    // curly quotes + em-dash are decoded in static markup
    expect(out).toContain(
      "We’re built for leaders who need more than advice — they need",
    );
    expect(out).toContain("See how we work");
  });

  it("links the primary CTA to /capabilities", () => {
    expect(html()).toContain('href="/capabilities"');
  });

  it("renders the animated (non-reduced-motion) ShaderField host div", () => {
    // matchMedia is stubbed matches:false, so the animated path renders.
    const out = html();
    expect(out).toContain('aria-hidden="true"');
  });
});
