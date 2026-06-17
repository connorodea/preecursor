import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import CTASection from "./CTASection";
import { gradient } from "@/lib/theme";

const html = (props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(CTASection, props as never));

describe("CTASection — core", () => {
  it("renders the headline + heroWash section", () => {
    const out = html({ title: "Lets build it", primary: { label: "Talk", href: "/contact" } });
    expect(out).toContain("<h2");
    expect(out).toContain("Lets build it");
    expect(out).toContain(gradient.heroWash);
  });

  it("renders the primary CTA as a dark pill", () => {
    const out = html({ title: "T", primary: { label: "Talk", href: "/contact" } });
    expect(out).toContain("Talk");
    expect(out).toContain('href="/contact"');
    expect(out).toContain("bg-[#112138] hover:bg-[#1b4fc7]"); // dark variant
  });
});

describe("CTASection — body", () => {
  it("renders the body paragraph when provided", () => {
    const out = html({
      title: "T",
      body: "A closing line of copy.",
      primary: { label: "Go", href: "/x" },
    });
    expect(out).toContain("A closing line of copy.");
    expect(out).toContain("<p");
  });

  it("omits the body paragraph when absent", () => {
    const out = html({ title: "T", primary: { label: "Go", href: "/x" } });
    expect(out).not.toContain("<p");
  });
});

describe("CTASection — secondary", () => {
  it("renders the secondary outline pill when provided", () => {
    const out = html({
      title: "T",
      primary: { label: "Go", href: "/x" },
      secondary: { label: "Docs", href: "/docs" },
    });
    expect(out).toContain("Docs");
    expect(out).toContain('href="/docs"');
    expect(out).toContain("border-[1.5px]"); // outline variant
  });

  it("omits the secondary pill when absent", () => {
    const out = html({ title: "T", primary: { label: "Go", href: "/x" } });
    expect(out).not.toContain("Docs");
  });
});

describe("CTASection — primary external", () => {
  it("external primary renders a plain anchor with target + rel", () => {
    const out = html({
      title: "T",
      primary: { label: "Email", href: "/somewhere", external: true },
    });
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="noopener noreferrer"');
  });
});

// The ShaderField host is an absolutely-positioned aria-hidden div (zIndex 0).
// Distinct from the PillLink arrow's <span aria-hidden>, so match the host's
// signature style rather than the bare aria-hidden attribute.
const SHADER_HOST = "position:absolute;inset:0;overflow:hidden";

describe("CTASection — shader", () => {
  it("shader=true (default): renders the ShaderField host without throwing", () => {
    const out = html({ title: "T", primary: { label: "Go", href: "/x" } });
    expect(out).toContain(SHADER_HOST);
    expect(out).toContain("z-index:0");
  });

  it("shader=false: no ShaderField host", () => {
    const out = html({ title: "T", primary: { label: "Go", href: "/x" }, shader: false });
    expect(out).not.toContain(SHADER_HOST);
  });
});
