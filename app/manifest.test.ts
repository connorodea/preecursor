import { describe, it, expect } from "vitest";
import manifest from "./manifest";

describe("app/manifest", () => {
  const m = manifest();

  it("declares the installable PWA identity", () => {
    expect(m.name).toBe("Preecursor");
    expect(m.short_name).toBe("Preecursor");
    expect(m.start_url).toBe("/");
    expect(m.display).toBe("standalone");
  });

  it("uses the brand colors (navy background, light hero theme)", () => {
    expect(m.background_color).toBe("#0d1b2e");
    expect(m.theme_color).toBe("#dce8f7");
  });

  it("ships 192 + 512 install icons including a maskable variant", () => {
    const sizes = (m.icons ?? []).map((i) => i.sizes);
    expect(sizes).toContain("192x192");
    expect(sizes).toContain("512x512");
    const purposes = (m.icons ?? []).map((i) => i.purpose);
    expect(purposes).toContain("maskable");
    for (const icon of m.icons ?? []) {
      expect(icon.src.startsWith("/icon-")).toBe(true);
      expect(icon.type).toBe("image/png");
    }
  });
});
