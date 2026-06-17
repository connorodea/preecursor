import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import AnswerFeature from "./AnswerFeature";

const html = () => renderToStaticMarkup(createElement(AnswerFeature));

describe("AnswerFeature", () => {
  it("renders to markup without throwing", () => {
    expect(() => html()).not.toThrow();
  });

  it("contains the eyebrow, product name, and body copy", () => {
    const out = html();
    expect(out).toContain("New · AI-powered");
    expect(out).toContain("Preecursor Answer");
    expect(out).toContain("Bring your hardest question.");
  });

  it("renders the 'Ask us a question' pill linking to /contact", () => {
    const out = html();
    expect(out).toContain("Ask us a question →");
    expect(out).toContain('href="/contact"');
  });

  it("renders the right-hand shader tile host (aria-hidden)", () => {
    expect(html()).toContain('aria-hidden="true"');
  });
});
