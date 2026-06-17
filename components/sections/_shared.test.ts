import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Eyebrow, PillLink, EdgeFade } from "./_shared";
import { color } from "@/lib/theme";

/* ----------------------------------------------------------------
   Eyebrow
   ---------------------------------------------------------------- */
describe("Eyebrow (section helper)", () => {
  const html = (props: Record<string, unknown>) =>
    renderToStaticMarkup(createElement(Eyebrow, props as never));

  it("renders the label + an aria-hidden hairline bar (two spans)", () => {
    const out = html({ label: "What we do" });
    expect(out).toContain("What we do");
    expect(out).toContain("text-transform:uppercase");
    expect(out).toContain('aria-hidden="true"');
    expect((out.match(/<span/g) ?? []).length).toBe(2);
  });

  it("defaults bar + text to azure", () => {
    const out = html({ label: "Default" });
    // both the bar background and the label color use the azure default
    expect((out.match(new RegExp(color.azure, "g")) ?? []).length).toBe(2);
  });

  it("brand tone: bar + text recoloured to brand, no azure left", () => {
    const out = html({
      label: "Brand",
      barColor: color.brand,
      textColor: color.brand,
    });
    expect((out.match(new RegExp(color.brand, "g")) ?? []).length).toBe(2);
    expect(out).not.toContain(color.azure);
  });

  it("forwards className and merges custom style", () => {
    const out = html({ label: "X", className: "mb-4", style: { marginBottom: 22 } });
    expect(out).toContain('class="mb-4"');
    expect(out).toContain("margin-bottom:22px");
    // base flex layout is preserved alongside the override
    expect(out).toContain("display:flex");
  });
});

/* ----------------------------------------------------------------
   PillLink
   ---------------------------------------------------------------- */
describe("PillLink (section helper)", () => {
  const html = (props: Record<string, unknown>) =>
    renderToStaticMarkup(createElement(PillLink, props as never));

  it("renders an internal next/link anchor with the pill base styles", () => {
    const out = html({ href: "/contact", children: "Go" });
    expect(out).toContain("<a ");
    expect(out).toContain('href="/contact"');
    expect(out).toContain("border-radius:999px");
    expect(out).toContain("display:inline-flex");
    expect(out).toContain("Go");
  });

  it("passes className through and merges inline style override", () => {
    const out = html({
      href: "/x",
      children: "Go",
      className: "bg-[#1b4fc7] hover:bg-[#112138]",
      style: { color: color.mist, padding: "18px 34px" },
    });
    expect(out).toContain('class="bg-[#1b4fc7] hover:bg-[#112138]"');
    expect(out).toContain(`color:${color.mist}`);
    expect(out).toContain("padding:18px 34px");
    // base style is not clobbered by the override
    expect(out).toContain("border-radius:999px");
  });

  it("renders arrow glyph children verbatim inside the anchor", () => {
    const out = html({ href: "/x", children: "Ask us a question →" });
    expect(out).toContain("Ask us a question →");
  });
});

/* ----------------------------------------------------------------
   EdgeFade
   ---------------------------------------------------------------- */
describe("EdgeFade (section helper)", () => {
  const html = (props: Record<string, unknown> = {}) =>
    renderToStaticMarkup(createElement(EdgeFade, props as never));

  // The waypoints that keep the seam blue instead of grey.
  const GLOW = "rgba(60,98,164,0.42)";
  const DEEP = "rgba(24,48,92,0.28)";

  it("default: renders both a top and a bottom gradient div", () => {
    const out = html();
    expect((out.match(/<div/g) ?? []).length).toBe(2);
    expect(out).toContain("linear-gradient(180deg, #e6eefb 0%"); // top, default paper3
    expect(out).toContain("linear-gradient(0deg, #e6eefb 0%"); // bottom
    expect(out).toContain("top:0");
    expect(out).toContain("bottom:0");
    // default size 124
    expect((out.match(/height:124px/g) ?? []).length).toBe(2);
    expect(out).toContain('aria-hidden="true"');
  });

  it("routes the blend through saturated-blue waypoints, never a flat grey fade", () => {
    const out = html();
    // both waypoints present on each edge → no light→transparent grey midpoint
    expect((out.match(new RegExp(GLOW.replace(/[().]/g, "\\$&"), "g")) ?? []).length).toBe(2);
    expect((out.match(new RegExp(DEEP.replace(/[().]/g, "\\$&"), "g")) ?? []).length).toBe(2);
    expect(out).toContain("transparent 100%");
    // the old foggy form must be gone
    expect(out).not.toContain("#e6eefb, transparent");
  });

  it("top only: single top-anchored gradient div, no bottom", () => {
    const out = html({ bottom: false });
    expect((out.match(/<div/g) ?? []).length).toBe(1);
    expect(out).toContain("linear-gradient(180deg, #e6eefb 0%");
    expect(out).toContain(GLOW);
    expect(out).toContain("top:0");
    expect(out).not.toContain("bottom:0");
  });

  it("bottom only: single bottom-anchored gradient div, no top", () => {
    const out = html({ top: false });
    expect((out.match(/<div/g) ?? []).length).toBe(1);
    expect(out).toContain("linear-gradient(0deg, #e6eefb 0%");
    expect(out).toContain("bottom:0");
    expect(out).not.toContain("top:0");
  });

  it("topColor / bottomColor set the exact seam colour per edge + size flows through", () => {
    const out = html({ topColor: "#102030", bottomColor: "#405060", size: 64 });
    expect(out).toContain("linear-gradient(180deg, #102030 0%");
    expect(out).toContain("linear-gradient(0deg, #405060 0%");
    expect((out.match(/height:64px/g) ?? []).length).toBe(2);
    expect(out).not.toContain("#e6eefb");
  });
});
