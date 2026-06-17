import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ContactPage, { metadata } from "./page";
import { CONTACT_EMAIL, LOCATIONS } from "@/lib/ia";

describe("app/contact/page", () => {
  it("exposes title + description metadata", () => {
    expect(metadata.title).toBe("Contact");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("renders without throwing and includes signature copy, the form, and details", () => {
    const out = renderToStaticMarkup(createElement(ContactPage));
    // Hero headline contains curly apostrophes -> rendered as HTML entities.
    expect(out).toContain("build what");
    expect(out).toContain("One inbox, every time zone");
    expect(out).toContain(`mailto:${CONTACT_EMAIL}`);
    expect(out).toContain(CONTACT_EMAIL);
    // Presentational form fields.
    expect(out).toContain("<form");
    expect(out).toContain('name="outcome"');
    for (const city of LOCATIONS) {
      expect(out, city).toContain(city);
    }
  });
});
