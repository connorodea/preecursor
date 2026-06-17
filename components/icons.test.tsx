import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { StrategyIcon, BuildIcon, ScaleIcon, EnableIcon } from "./icons";

const ICONS = { StrategyIcon, BuildIcon, ScaleIcon, EnableIcon };

describe("icons", () => {
  it("each icon renders a 24x24 currentColor stroke SVG", () => {
    for (const [name, Icon] of Object.entries(ICONS)) {
      const out = renderToStaticMarkup(createElement(Icon));
      expect(out, name).toContain("<svg");
      expect(out, name).toContain('viewBox="0 0 24 24"');
      expect(out, name).toContain('stroke="currentColor"');
    }
  });

  it("is decorative (aria-hidden) by default, labelled when given a title", () => {
    expect(renderToStaticMarkup(createElement(StrategyIcon))).toContain(
      'aria-hidden="true"',
    );
    const labelled = renderToStaticMarkup(
      createElement(StrategyIcon, { title: "Strategy" }),
    );
    expect(labelled).toContain('role="img"');
    expect(labelled).toContain('aria-label="Strategy"');
  });

  it("passes a custom size + className through", () => {
    const out = renderToStaticMarkup(
      createElement(BuildIcon, { size: 30, className: "x-cls" }),
    );
    expect(out).toContain('width="30"');
    expect(out).toContain('class="x-cls"');
  });
});
