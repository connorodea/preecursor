import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import FeatureRows from "./FeatureRows";
import { color } from "@/lib/theme";

const html = (props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(FeatureRows, props as never));

describe("FeatureRows", () => {
  it("renders each row's title and description", () => {
    const rows = [
      { title: "Discovery", desc: "We map the terrain." },
      { title: "Design", desc: "We shape the system." },
    ];
    const out = html({ rows });
    expect(out).toContain("Discovery");
    expect(out).toContain("We map the terrain.");
    expect(out).toContain("Design");
    expect(out).toContain("We shape the system.");
  });

  it("auto-numbers rows as zero-padded indices when index is omitted", () => {
    const rows = [
      { title: "A", desc: "a" },
      { title: "B", desc: "b" },
    ];
    const out = html({ rows });
    expect(out).toContain("01");
    expect(out).toContain("02");
  });

  it("uses an explicit index when provided", () => {
    const rows = [{ index: "→", title: "A", desc: "a" }];
    const out = html({ rows });
    expect(out).toContain("→");
    expect(out).not.toContain("01");
  });

  it("indices are rendered in brand colour", () => {
    const out = html({ rows: [{ title: "A", desc: "a" }] });
    expect(out).toContain(color.brand);
  });

  it("the last row gets a bottom border in addition to its top border", () => {
    const out = html({ rows: [{ title: "Only", desc: "x" }] });
    expect(out).toContain("border-bottom");
    expect(out).toContain("border-top");
  });

  it("renders one row block per row", () => {
    const rows = [
      { title: "A", desc: "a" },
      { title: "B", desc: "b" },
      { title: "C", desc: "c" },
    ];
    const out = html({ rows });
    // each row is a 3-col md grid
    expect((out.match(/md:grid-cols-\[84px_1fr_1\.1fr\]/g) ?? []).length).toBe(3);
  });
});
