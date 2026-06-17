import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Spotlight from "./Spotlight";

const html = () => renderToStaticMarkup(createElement(Spotlight));

describe("Spotlight", () => {
  it("renders to markup without throwing", () => {
    expect(() => html()).not.toThrow();
  });

  it("renders all three card headlines", () => {
    const out = html();
    expect(out).toContain("Our Client Impact");
    expect(out).toContain("Applied AI at Scale");
    expect(out).toContain("Meet Preecursor Labs");
  });

  it("renders the eyebrows for each card", () => {
    const out = html();
    expect(out).toContain("From ambition to outcomes");
    expect(out).toContain("Lead with advantage");
    expect(out).toContain("Build tomorrow");
  });

  it("renders the azure pills with their destinations", () => {
    const out = html();
    expect(out).toContain("Explore →");
    expect(out).toContain("Navigate what’s next →");
    expect(out).toContain("Start your transformation →");
    expect(out).toContain('href="/work"');
    expect(out).toContain('href="/capabilities"');
    expect(out).toContain('href="/labs"');
  });

  it("renders an icon on each of the two right cards", () => {
    // The two right cards carry currentColor-stroke line icons; the left card
    // is image-led, so it has none.
    expect((html().match(/stroke="currentColor"/g) ?? []).length).toBe(2);
  });
});
