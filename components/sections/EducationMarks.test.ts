import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import EducationMarks from "./EducationMarks";

const html = () => renderToStaticMarkup(createElement(EducationMarks));

const SCHOOLS = [
  "University of Michigan",
  "Columbia University",
  "Harvard University",
  "Johns Hopkins University",
  "UC Berkeley",
];

describe("EducationMarks", () => {
  it("renders all five institutions by name", () => {
    const out = html();
    for (const s of SCHOOLS) expect(out, s).toContain(s);
  });

  it("renders an emblem (svg) for each institution", () => {
    const out = html();
    expect((out.match(/<svg/g) ?? []).length).toBe(SCHOOLS.length);
  });

  it("colours the Michigan emblem maize", () => {
    expect(html()).toContain("#ffcb05");
  });

  it("marks every decorative emblem aria-hidden", () => {
    expect((html().match(/aria-hidden="true"/g) ?? []).length).toBe(
      SCHOOLS.length,
    );
  });
});
