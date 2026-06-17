import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ContactCTA from "./ContactCTA";

const html = () => renderToStaticMarkup(createElement(ContactCTA));

describe("ContactCTA", () => {
  it("renders to markup without throwing", () => {
    expect(() => html()).not.toThrow();
    expect(html()).toContain('id="contact"');
  });

  it("contains the signature closing headline", () => {
    // &rsquo; decodes to a curly apostrophe in static markup.
    expect(html()).toContain("Let’s build what’s next.");
  });

  it("renders the supporting copy", () => {
    expect(html()).toContain("Tell us the outcome you’re chasing.");
  });

  it("renders both CTAs: mailto + see-our-work link", () => {
    const out = html();
    expect(out).toContain("Start a conversation");
    expect(out).toContain('href="mailto:hello@preecursor.com"');
    expect(out).toContain("See our work");
    expect(out).toContain('href="/work"');
  });

  it("is a solid-navy finale with the aurora lazy-mounted (deferred from SSR)", () => {
    const out = html();
    // Navy background — the aurora glows over it client-side; no grey wash.
    expect(out).toContain("background:#112138");
    // The decorative WebGL field is deferred until near-viewport, so its
    // aria-hidden host isn't present in the static markup.
    expect(out).not.toContain('aria-hidden="true"');
  });
});
