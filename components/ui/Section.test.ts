import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Section from "./Section";
import { color } from "@/lib/theme";

const html = (props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(Section, props as never));

describe("Section — tones", () => {
  it("paper (default): flat paper surface, ink text", () => {
    const out = html({ children: "hi" });
    expect(out).toContain(`background:${color.paper}`);
    expect(out).toContain(`color:${color.ink}`);
  });

  it("paper2 surface", () => {
    expect(html({ children: "hi", tone: "paper2" })).toContain(`background:${color.paper2}`);
  });

  it("paper3 surface", () => {
    expect(html({ children: "hi", tone: "paper3" })).toContain(`background:${color.paper3}`);
  });

  it("ink: inkBand gradient + mist text", () => {
    const out = html({ children: "hi", tone: "ink" });
    expect(out).toContain("radial-gradient");
    expect(out).toContain(color.ink);
    expect(out).toContain(`color:${color.mist}`);
  });

  it("inkDeep: deeper band anchored to inkDeep + mist text", () => {
    const out = html({ children: "hi", tone: "inkDeep" });
    expect(out).toContain(color.inkDeep);
    expect(out).toContain(`color:${color.mist}`);
  });
});

describe("Section — structure", () => {
  it("renders a <section> with the inner container column + children", () => {
    const out = html({ children: "body-content" });
    expect(out).toContain("<section");
    expect(out).toContain("max-w-[1340px]");
    expect(out).toContain("body-content");
  });

  it("applies the id when provided", () => {
    expect(html({ children: "x", id: "work" })).toContain('id="work"');
  });

  it("defaults vertical padding to 108px", () => {
    const out = html({ children: "x" });
    expect(out).toContain("padding-top:108px");
    expect(out).toContain("padding-bottom:108px");
  });

  it("honours a custom py", () => {
    const out = html({ children: "x", py: 60 });
    expect(out).toContain("padding-top:60px");
    expect(out).toContain("padding-bottom:60px");
  });

  it("forwards className and merges custom style", () => {
    const out = html({ children: "x", className: "scroll-mt-24", style: { minHeight: 200 } });
    expect(out).toContain("scroll-mt-24");
    expect(out).toContain("min-height:200px");
  });
});
