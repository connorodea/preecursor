import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import EducationMarks from "./EducationMarks";

const html = () => renderToStaticMarkup(createElement(EducationMarks));

describe("EducationMarks", () => {
  it("renders both institutions by name", () => {
    const out = html();
    expect(out).toContain("University of Michigan");
    expect(out).toContain("Columbia University");
  });

  it("renders an emblem (svg) for each institution", () => {
    const out = html();
    expect((out.match(/<svg/g) ?? []).length).toBe(2);
  });

  it("uses Michigan maize for its emblem on the dark band", () => {
    expect(html()).toContain("#ffcb05");
  });

  it("marks the decorative emblems aria-hidden", () => {
    expect((html().match(/aria-hidden="true"/g) ?? []).length).toBe(2);
  });
});
