import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ContentSplit from "./ContentSplit";

const html = (props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(ContentSplit, props as never));

const media = createElement("img", { src: "/x.jpg", alt: "shot" });

describe("ContentSplit — body", () => {
  it("renders a single string body as one paragraph", () => {
    const out = html({ title: "Title", body: "One paragraph.", media });
    expect(out).toContain("Title");
    expect(out).toContain("One paragraph.");
    expect((out.match(/<p /g) ?? []).length).toBe(1);
  });

  it("renders a string[] body as multiple paragraphs", () => {
    const out = html({ title: "T", body: ["First.", "Second.", "Third."], media });
    expect(out).toContain("First.");
    expect(out).toContain("Second.");
    expect(out).toContain("Third.");
    expect((out.match(/<p /g) ?? []).length).toBe(3);
  });
});

describe("ContentSplit — media", () => {
  it("renders the media node inside the elevated frame", () => {
    const out = html({ title: "T", body: "b", media });
    expect(out).toContain('src="/x.jpg"');
    expect(out).toContain("border-radius:12px");
    expect(out).toContain("overflow:hidden");
  });
});

describe("ContentSplit — reverse", () => {
  it("default (not reversed): text column has no order override", () => {
    const out = html({ title: "T", body: "b", media });
    expect(out).not.toContain("order:2");
    expect(out).not.toContain("order:1");
  });

  it("reverse=true swaps desktop order (text order:2, media order:1)", () => {
    const out = html({ title: "T", body: "b", media, reverse: true });
    expect(out).toContain("order:2");
    expect(out).toContain("order:1");
  });
});

describe("ContentSplit — eyebrow + cta", () => {
  it("renders the eyebrow when provided", () => {
    const out = html({ title: "T", body: "b", media, eyebrow: "Case study" });
    expect(out).toContain("Case study");
  });

  it("omits the eyebrow when absent", () => {
    const out = html({ title: "T", body: "b", media });
    expect(out).not.toContain("Case study");
  });

  it("renders the CTA pill with its default brand variant", () => {
    const out = html({
      title: "T",
      body: "b",
      media,
      cta: { label: "Read more", href: "/work/x" },
    });
    expect(out).toContain("Read more");
    expect(out).toContain('href="/work/x"');
    expect(out).toContain("bg-[#1b4fc7]");
  });

  it("honours a custom CTA variant", () => {
    const out = html({
      title: "T",
      body: "b",
      media,
      cta: { label: "Read more", href: "/work/x", variant: "outline" },
    });
    expect(out).toContain("border-[1.5px]");
  });

  it("omits the CTA when absent", () => {
    const out = html({ title: "T", body: "b", media });
    expect(out).not.toContain("Read more");
  });
});
