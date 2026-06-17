import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import LeadershipPage, { metadata } from "./page";
import { LEADERSHIP, peopleByGroup } from "@/lib/content/company";

describe("app/leadership/page", () => {
  it("exposes title + description metadata", () => {
    expect(metadata.title).toBe("Leadership");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("renders without throwing and includes signature copy + people", () => {
    const out = renderToStaticMarkup(createElement(LeadershipPage));
    expect(out).toContain(LEADERSHIP.hero.title);
    expect(out).toContain(
      "From frontier labs, top firms, and the platforms you use every day",
    );
    // PersonCard tiles render for every populated group.
    for (const g of LEADERSHIP.groups) {
      for (const p of peopleByGroup(g.group)) {
        expect(out, p.name).toContain(p.name);
      }
    }
  });
});
