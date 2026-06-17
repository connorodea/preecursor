import { describe, it, expect } from "vitest";
import robots from "./robots";
import { BASE_URL } from "@/lib/seo";

describe("app/robots", () => {
  const result = robots();

  it("allows all user agents at the root", () => {
    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
  });

  it("points at the absolute sitemap URL and host", () => {
    expect(result.sitemap).toBe(`${BASE_URL}/sitemap.xml`);
    expect(result.host).toBe(BASE_URL);
  });
});
