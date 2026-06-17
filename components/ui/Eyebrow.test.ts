import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Eyebrow from "./Eyebrow";
import { color } from "@/lib/theme";

const html = (props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(Eyebrow, props as never));

describe("Eyebrow", () => {
  it("renders the label uppercased via CSS, with the hairline bar", () => {
    const out = html({ label: "Our Work" });
    expect(out).toContain("Our Work");
    expect(out).toContain("text-transform:uppercase");
    // Two spans: the aria-hidden hairline + the label.
    expect(out).toContain('aria-hidden="true"');
    expect((out.match(/<span/g) ?? []).length).toBe(2);
  });

  it("brand tone (default) colours the bar + label brand blue", () => {
    const out = html({ label: "Brand" });
    expect(out).toContain(color.brand);
    expect(out).not.toContain(color.azure);
  });

  it("azure tone colours the bar + label azure (for dark sections)", () => {
    const out = html({ label: "Azure", tone: "azure" });
    expect(out).toContain(color.azure);
    expect(out).not.toContain(color.brand);
  });

  it("forwards className and merges custom style", () => {
    const out = html({ label: "X", className: "mb-4", style: { marginBottom: 22 } });
    expect(out).toContain('class="mb-4"');
    expect(out).toContain("margin-bottom:22px");
  });
});
