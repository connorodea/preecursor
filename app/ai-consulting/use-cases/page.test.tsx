import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import Page, { metadata } from "./page";
import { USE_CASES } from "@/lib/content/usecases";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

describe("app/ai-consulting/use-cases/page (hub)", () => {
  const out = renderToStaticMarkup(<Page />);

  it("renders without throwing and links every use case (no orphans)", () => {
    expect(out.length).toBeGreaterThan(0);
    for (const uc of USE_CASES) {
      expect(out, uc.slug).toContain(esc(uc.name));
      expect(out, uc.slug).toContain(`/ai-consulting/use-cases/${uc.slug}`);
    }
  });

  it("exposes non-empty metadata title + description", () => {
    expect(typeof metadata.title).toBe("string");
    expect((metadata.title as string).length).toBeGreaterThan(0);
    expect(typeof metadata.description).toBe("string");
    expect((metadata.description as string).length).toBeGreaterThan(0);
  });

  it("renders one accent icon per use-case card (no card left plain)", () => {
    // The only currentColor-stroke SVGs on the hub are the use-case card icons,
    // so the count must match the number of use cases exactly.
    const icons = (out.match(/stroke="currentColor"/g) ?? []).length;
    expect(icons).toBe(USE_CASES.length);
  });
});
