import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import PageHero from "./PageHero";
import { color, gradient } from "@/lib/theme";

const html = (props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(PageHero, props as never));

describe("PageHero — core", () => {
  it("renders the H1 title", () => {
    const out = html({ title: "Studios that ship." });
    expect(out).toContain("<h1");
    expect(out).toContain("Studios that ship.");
  });

  it("renders a relative, overflow-hidden section", () => {
    const out = html({ title: "T" });
    expect(out).toContain("<section");
    expect(out).toContain("position:relative");
    expect(out).toContain("overflow:hidden");
  });
});

describe("PageHero — optional eyebrow / lede", () => {
  it("renders the eyebrow when provided", () => {
    expect(html({ title: "T", eyebrow: "About" })).toContain("About");
  });

  it("omits the eyebrow when absent", () => {
    expect(html({ title: "T" })).not.toContain("About");
  });

  it("renders the lede paragraph when provided", () => {
    const out = html({ title: "T", lede: "We build the future." });
    expect(out).toContain("We build the future.");
    expect(out).toContain("<p");
  });

  it("omits the lede when absent", () => {
    expect(html({ title: "T" })).not.toContain("<p");
  });
});

describe("PageHero — CTAs", () => {
  it("renders only the primary CTA (default brand variant)", () => {
    const out = html({ title: "T", cta: { label: "Start", href: "/start" } });
    expect(out).toContain("Start");
    expect(out).toContain('href="/start"');
    expect(out).toContain("bg-[#1b4fc7]");
  });

  it("renders both primary and secondary CTAs (secondary default outline)", () => {
    const out = html({
      title: "T",
      cta: { label: "Start", href: "/start" },
      secondaryCta: { label: "Learn", href: "/learn" },
    });
    expect(out).toContain("Start");
    expect(out).toContain("Learn");
    expect(out).toContain("border-[1.5px]"); // outline secondary
  });

  it("renders a secondary CTA even without a primary", () => {
    const out = html({ title: "T", secondaryCta: { label: "Learn", href: "/learn" } });
    expect(out).toContain("Learn");
  });

  it("honours custom CTA variants", () => {
    const out = html({
      title: "T",
      cta: { label: "Start", href: "/start", variant: "dark" },
    });
    expect(out).toContain("bg-[#112138] hover:bg-[#1b4fc7]");
  });

  it("omits the CTA row when no CTAs are given", () => {
    const out = html({ title: "T" });
    expect(out).not.toContain("href=");
  });
});

// ShaderField host = absolutely-positioned aria-hidden div (zIndex 0).
const SHADER_HOST = "position:absolute;inset:0;overflow:hidden";

describe("PageHero — shader", () => {
  it("shader=false (default): flat paper bg, no shader host", () => {
    const out = html({ title: "T" });
    expect(out).toContain(`background:${color.paper}`);
    expect(out).not.toContain(SHADER_HOST);
  });

  it("shader=true: heroWash bg + renders the ShaderField host without throwing", () => {
    const out = html({ title: "T", shader: true });
    expect(out).toContain(gradient.heroWash);
    expect(out).toContain(SHADER_HOST);
    // plus the legibility vignette
    expect(out).toContain("radial-gradient");
  });
});

describe("PageHero — align", () => {
  it("left (default): no center text-align on the stagger container", () => {
    const out = html({ title: "T", lede: "x" });
    expect(out).not.toContain("text-align:center");
  });

  it("center: centers the content column", () => {
    const out = html({ title: "T", lede: "x", align: "center" });
    expect(out).toContain("text-align:center");
    expect(out).toContain("align-items:center");
  });
});
