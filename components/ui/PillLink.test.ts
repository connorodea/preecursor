import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import PillLink from "./PillLink";
import { color, shadow } from "@/lib/theme";

const html = (props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(PillLink, props as never));

describe("PillLink — variants", () => {
  it("brand: mist text + brand cta shadow + brand bg hover class", () => {
    const out = html({ href: "/x", children: "Go" });
    expect(out).toContain(`color:${color.mist}`);
    expect(out).toContain(shadow.ctaBrand);
    expect(out).toContain("bg-[#1b4fc7] hover:bg-[#112138]");
  });

  it("azure: dark text on azure bg", () => {
    const out = html({ href: "/x", children: "Go", variant: "azure" });
    expect(out).toContain("color:#0b1322");
    expect(out).toContain("bg-[#5b8def] hover:bg-[#7fa6f2]");
  });

  it("dark: mist text on ink bg", () => {
    const out = html({ href: "/x", children: "Go", variant: "dark" });
    expect(out).toContain(`color:${color.mist}`);
    expect(out).toContain("bg-[#112138] hover:bg-[#1b4fc7]");
  });

  it("outline: ink text, transparent bg, bordered", () => {
    const out = html({ href: "/x", children: "Go", variant: "outline" });
    expect(out).toContain(`color:${color.ink}`);
    expect(out).toContain("background:transparent");
    expect(out).toContain("border-[1.5px] border-[rgba(17,33,56,0.3)]");
  });

  it("ghost: mist text, transparent bg, light border", () => {
    const out = html({ href: "/x", children: "Go", variant: "ghost" });
    expect(out).toContain(`color:${color.mist}`);
    expect(out).toContain("background:transparent");
    expect(out).toContain("border-[rgba(234,241,251,0.3)]");
  });
});

describe("PillLink — sizes", () => {
  it("md (default): 15px 28px / 13px", () => {
    const out = html({ href: "/x", children: "Go" });
    expect(out).toContain("padding:15px 28px");
    expect(out).toContain("font-size:13px");
  });

  it("sm: 13px 22px / 12.5px", () => {
    const out = html({ href: "/x", children: "Go", size: "sm" });
    expect(out).toContain("padding:13px 22px");
    expect(out).toContain("font-size:12.5px");
  });
});

describe("PillLink — arrow", () => {
  it("default → arrow renders as an aria-hidden span", () => {
    const out = html({ href: "/x", children: "Go" });
    expect(out).toContain('<span aria-hidden="true">→</span>');
  });

  it("↗ arrow glyph", () => {
    const out = html({ href: "/x", children: "Go", arrow: "↗" });
    expect(out).toContain('<span aria-hidden="true">↗</span>');
  });

  it("arrow=false omits the trailing glyph", () => {
    const out = html({ href: "/x", children: "Go", arrow: false });
    expect(out).not.toContain("aria-hidden");
  });
});

describe("PillLink — anchor vs next/link", () => {
  it("internal href renders an <a href> (next/link), no target", () => {
    const out = html({ href: "/work", children: "Go" });
    expect(out).toContain('href="/work"');
    expect(out).toContain("<a ");
    expect(out).not.toContain('target="_blank"');
  });

  it("https href is auto-detected as a plain anchor", () => {
    const out = html({ href: "https://example.com", children: "Go" });
    expect(out).toContain('href="https://example.com"');
    expect(out).toContain("<a ");
  });

  it("mailto href is auto-detected as a plain anchor", () => {
    const out = html({ href: "mailto:hi@preecursor.com", children: "Email" });
    expect(out).toContain('href="mailto:hi@preecursor.com"');
    expect(out).toContain("<a ");
  });

  it("tel href is auto-detected as a plain anchor", () => {
    const out = html({ href: "tel:+15555550123", children: "Call" });
    expect(out).toContain('href="tel:+15555550123"');
  });

  it("explicit external=true adds target + rel", () => {
    const out = html({ href: "/internal-but-external", children: "Go", external: true });
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="noopener noreferrer"');
  });
});

describe("PillLink — magnetic wrapper", () => {
  it("filled brand variant is wrapped in the Magnetic inline-block div by default", () => {
    const out = html({ href: "/x", children: "Go" });
    expect(out).toContain("display:inline-block");
    expect(out).toContain("will-change:transform");
  });

  it("outline variant is NOT wrapped by default", () => {
    const out = html({ href: "/x", children: "Go", variant: "outline" });
    expect(out).not.toContain("display:inline-block");
  });

  it("ghost variant is NOT wrapped by default", () => {
    const out = html({ href: "/x", children: "Go", variant: "ghost" });
    expect(out).not.toContain("display:inline-block");
  });

  it("magnetic can be forced off on a filled variant", () => {
    const out = html({ href: "/x", children: "Go", magnetic: false });
    expect(out).not.toContain("display:inline-block");
  });

  it("magnetic can be forced on for an outline variant", () => {
    const out = html({ href: "/x", children: "Go", variant: "outline", magnetic: true });
    expect(out).toContain("display:inline-block");
  });
});

describe("PillLink — className + style passthrough", () => {
  it("appends className and merges inline style override", () => {
    const out = html({
      href: "/x",
      children: "Go",
      variant: "outline",
      className: "w-full",
      style: { letterSpacing: "0.2em" },
    });
    expect(out).toContain("w-full");
    expect(out).toContain("letter-spacing:0.2em");
  });
});
