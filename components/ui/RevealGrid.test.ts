import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import RevealGrid from "./RevealGrid";

const html = (props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(RevealGrid, props as never));

describe("RevealGrid", () => {
  it("renders a grid using the shared column classes (3-col default mapping)", () => {
    const out = html({
      columns: 3,
      children: [
        createElement("span", { key: "a" }, "Alpha"),
        createElement("span", { key: "b" }, "Beta"),
      ],
    });
    expect(out).toContain("grid");
    expect(out).toContain("lg:grid-cols-3");
  });

  it("renders every child (wrapped, not dropped)", () => {
    const out = html({
      columns: 2,
      children: [
        createElement("span", { key: "a" }, "Alpha"),
        createElement("span", { key: "b" }, "Beta"),
        createElement("span", { key: "c" }, "Gamma"),
      ],
    });
    expect(out).toContain("Alpha");
    expect(out).toContain("Beta");
    expect(out).toContain("Gamma");
  });

  it("columns=2 uses the two-column class and not the three-column one", () => {
    const out = html({ columns: 2, children: createElement("span", null, "X") });
    expect(out).toContain("sm:grid-cols-2");
    expect(out).not.toContain("lg:grid-cols-3");
  });
});
