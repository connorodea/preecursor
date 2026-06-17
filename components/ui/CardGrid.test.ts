import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import CardGrid from "./CardGrid";

const html = (props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(CardGrid, props as never));

describe("CardGrid", () => {
  it("renders children inside a grid with a 24px gap", () => {
    const out = html({ children: "tiles-here" });
    expect(out).toContain("tiles-here");
    expect(out).toContain("grid");
    expect(out).toContain("gap:24px");
  });

  it("defaults to 3 columns at lg", () => {
    const out = html({ children: "x" });
    expect(out).toContain("lg:grid-cols-3");
    expect(out).toContain("sm:grid-cols-2");
  });

  it("columns=2: sm two-up, no lg-3/4", () => {
    const out = html({ children: "x", columns: 2 });
    expect(out).toContain("sm:grid-cols-2");
    expect(out).not.toContain("lg:grid-cols-3");
    expect(out).not.toContain("lg:grid-cols-4");
  });

  it("columns=4: lg four-up", () => {
    const out = html({ children: "x", columns: 4 });
    expect(out).toContain("lg:grid-cols-4");
  });

  it("forwards className and merges style", () => {
    const out = html({ children: "x", className: "mt-10", style: { gap: 30 } });
    expect(out).toContain("mt-10");
    // explicit style override wins over the default 24px
    expect(out).toContain("gap:30px");
  });
});
