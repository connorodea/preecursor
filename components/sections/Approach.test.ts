import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Approach from "./Approach";

const html = () => renderToStaticMarkup(createElement(Approach));

describe("Approach", () => {
  it("renders to markup without throwing", () => {
    expect(() => html()).not.toThrow();
    expect(html()).toContain('id="approach"');
  });

  it("contains the 'How we work' eyebrow", () => {
    expect(html()).toContain("How we work");
  });

  it("renders all three principle titles", () => {
    const out = html();
    // React escapes the straight apostrophe to &#x27; in static markup.
    expect(out).toContain("Embedded, not arm&#x27;s length");
    expect(out).toContain("Outcomes, not decks");
    expect(out).toContain("Built to hand off");
  });

  it("renders the body copy for the principles", () => {
    const out = html();
    expect(out).toContain("We sit inside your teams");
    expect(out).toContain("We&#x27;re optimizing for the day we leave.");
  });

  it("renders an icon for each principle, with a hover group", () => {
    const out = html();
    expect((out.match(/<svg/g) ?? []).length).toBe(3);
    expect(out).toContain('stroke="currentColor"');
    expect(out).toContain("group-hover:scale-110");
    expect(out).toContain("group-hover:text-azure");
  });
});
