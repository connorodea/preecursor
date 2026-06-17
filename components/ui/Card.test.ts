import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Card from "./Card";
import { color, shadow } from "@/lib/theme";

const html = (props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(Card, props as never));

describe("Card — link vs div", () => {
  it("with href: renders an <a href> with group hover-lift classes", () => {
    const out = html({ href: "/services", title: "Services" });
    expect(out).toContain("<a ");
    expect(out).toContain('href="/services"');
    expect(out).toContain("group");
    expect(out).toContain("hover:-translate-y-1");
    // links also render the trailing arrow
    expect(out).toContain("→");
  });

  it("without href: renders a non-link <div> with the card shadow, no arrow", () => {
    const out = html({ title: "Plain" });
    expect(out).not.toContain("<a ");
    expect(out).toContain("<div");
    expect(out).toContain(shadow.card);
    expect(out).not.toContain("→");
    expect(out).not.toContain("hover:-translate-y-1");
  });
});

describe("Card — optional fields", () => {
  it("renders kicker, stat and desc when present", () => {
    const out = html({
      title: "Title",
      kicker: "PHASE 01",
      stat: "98%",
      desc: "A supporting line of copy.",
    });
    expect(out).toContain("PHASE 01");
    expect(out).toContain("98%");
    expect(out).toContain("A supporting line of copy.");
    expect(out).toContain("Title");
  });

  it("omits kicker/stat/desc spans when absent (title-only)", () => {
    const out = html({ title: "Just a title" });
    expect(out).toContain("Just a title");
    // title-only light card => exactly one inner span (the title)
    expect((out.match(/<span/g) ?? []).length).toBe(1);
  });
});

describe("Card — tone", () => {
  it("light (default): white surface, ink title, brand accents", () => {
    const out = html({ title: "T", kicker: "K", desc: "D" });
    expect(out).toContain("background:#fff");
    expect(out).toContain(`color:${color.ink}`);
    // light kicker is brand-coloured
    expect(out).toContain(color.brand);
  });

  it("dark: inkDeep surface, mist title, azure accents, no card shadow", () => {
    const out = html({ title: "T", kicker: "K", desc: "D", stat: "5x", tone: "dark" });
    expect(out).toContain(`background:${color.inkDeep}`);
    expect(out).toContain(color.azure);
    expect(out).toContain("rgba(234,241,251,0.1)"); // dark border
    expect(out).not.toContain(shadow.card);
  });

  it("dark linked card uses azure arrow", () => {
    const out = html({ href: "/x", title: "T", tone: "dark" });
    expect(out).toContain("→");
    expect(out).toContain(color.azure);
  });
});

describe("Card — className passthrough", () => {
  it("forwards className on the link variant", () => {
    expect(html({ href: "/x", title: "T", className: "col-span-2" })).toContain("col-span-2");
  });

  it("forwards className on the div variant", () => {
    expect(html({ title: "T", className: "col-span-2" })).toContain("col-span-2");
  });
});
