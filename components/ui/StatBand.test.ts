import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import StatBand from "./StatBand";
import { color } from "@/lib/theme";

const html = (props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(StatBand, props as never));

const stats = [
  { value: 12, label: "Projects shipped" },
  { value: 98, suffix: "%", label: "On-time delivery" },
  { value: 3.5, decimals: 1, prefix: "$", suffix: "M", label: "Value created" },
];

describe("StatBand", () => {
  it("renders a dark band section with inkBand gradient + mist text", () => {
    const out = html({ stats });
    expect(out).toContain("<section");
    expect(out).toContain("radial-gradient");
    expect(out).toContain(`color:${color.mist}`);
  });

  it("renders each stat's label", () => {
    const out = html({ stats });
    expect(out).toContain("Projects shipped");
    expect(out).toContain("On-time delivery");
    expect(out).toContain("Value created");
  });

  it("CountUp SSRs the formatted value with prefix/suffix/decimals", () => {
    const out = html({ stats });
    // jsdom matchMedia.matches=false => not reduced; SSR initial display is 0,
    // so values render formatted from their starting state with affixes intact.
    expect(out).toContain("%");
    expect(out).toContain("$");
    expect(out).toContain("M");
    // decimals=1 => one fractional digit shown
    expect(out).toContain("0.0");
  });

  it("renders the eyebrow (azure tone) when provided", () => {
    const out = html({ stats, eyebrow: "By the numbers" });
    expect(out).toContain("By the numbers");
    expect(out).toContain(color.azure);
  });

  it("omits the eyebrow when not provided", () => {
    const out = html({ stats });
    expect(out).not.toContain("By the numbers");
  });

  it("desktop column count tracks stat count (3 stats => lg-3)", () => {
    expect(html({ stats })).toContain("lg:grid-cols-3");
  });

  it("caps desktop columns at 4 when more than 4 stats", () => {
    const many = [1, 2, 3, 4, 5].map((n) => ({ value: n, label: `s${n}` }));
    expect(html({ stats: many })).toContain("lg:grid-cols-4");
  });

  it("single stat => lg-1", () => {
    expect(html({ stats: [{ value: 1, label: "one" }] })).toContain("lg:grid-cols-1");
  });
});
