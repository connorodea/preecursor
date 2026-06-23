import { describe, it, expect, vi, afterEach } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Analytics from "./Analytics";

const ID = "G-TEST12345";

afterEach(() => {
  vi.unstubAllEnvs();
});

const render = () => renderToStaticMarkup(createElement(Analytics));

describe("Analytics (GA4, env-gated)", () => {
  it("renders nothing when NEXT_PUBLIC_GA_ID is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "");
    expect(render()).toBe("");
  });

  it("injects the gtag loader for the configured measurement id", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", ID);
    expect(render()).toContain(
      `https://www.googletagmanager.com/gtag/js?id=${ID}`,
    );
  });

  it("configures gtag with the id, dataLayer bootstrap, and IP anonymization", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", ID);
    const out = render();
    expect(out).toContain("dataLayer");
    expect(out).toContain(`'config','${ID}'`);
    expect(out).toContain("anonymize_ip");
    // id appears in both the loader src and the config call
    expect((out.match(new RegExp(ID, "g")) ?? []).length).toBeGreaterThanOrEqual(2);
  });

  it("does not leak the gtag loader when the id is blank", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "");
    expect(render()).not.toContain("googletagmanager");
  });
});
