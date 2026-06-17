import { describe, it, expect } from "vitest";
import { color, inkA, mistA, gradient, glass, shadow, container } from "./theme";

describe("theme palette", () => {
  it("exposes the brand colours", () => {
    expect(color.brand).toBe("#1b4fc7");
    expect(color.ink).toBe("#112138");
    expect(color.mist).toBe("#eaf1fb");
  });
});

describe("alpha helpers", () => {
  it("inkA builds rgba over ink", () => {
    expect(inkA(0.5)).toBe("rgba(17,33,56,0.5)");
    expect(inkA(0)).toBe("rgba(17,33,56,0)");
  });
  it("mistA builds rgba over mist", () => {
    expect(mistA(0.2)).toBe("rgba(234,241,251,0.2)");
  });
});

describe("gradients", () => {
  it("heroWash + cardOverlay are gradient strings", () => {
    expect(gradient.heroWash).toContain("linear-gradient");
    expect(gradient.cardOverlay).toContain("linear-gradient");
  });
  it("inkBand defaults to the ink base and accepts a corner", () => {
    expect(gradient.inkBand()).toContain(color.ink);
    expect(gradient.inkBand()).toContain("82% -10%");
    expect(gradient.inkBand("18% -10%")).toContain("18% -10%");
  });
});

describe("glass()", () => {
  it("produces a frosted surface at the given alpha", () => {
    const g = glass(0.5);
    expect(g.background).toBe("rgba(255,255,255,0.5)");
    expect(g.backdropFilter).toContain("blur");
    expect(g.WebkitBackdropFilter).toContain("blur");
  });
  it("defaults to 0.62", () => {
    expect(glass().background).toBe("rgba(255,255,255,0.62)");
  });
});

describe("misc tokens", () => {
  it("shadow + container are defined", () => {
    expect(shadow.nav).toContain("rgba");
    expect(container).toContain("max-w-[1340px]");
  });
});
