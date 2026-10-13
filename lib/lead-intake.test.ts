import { afterEach, describe, expect, it } from "vitest";
import { ATTRIBUTION_KEY, campaignFromSearch, publicHttpsUrl, readAttribution } from "./lead-intake";
afterEach(() => sessionStorage.clear());
describe("lead configuration and attribution", () => {
  it("rejects unsafe or credential-bearing configuration URLs", () => {
    for (const value of ["", "javascript:alert(1)", "http://example.com", "https://user:secret@example.com", "/relative"]) expect(publicHttpsUrl(value)).toBeUndefined();
    expect(publicHttpsUrl("https://cal.com/example/discovery")).toBe("https://cal.com/example/discovery");
  });
  it("retains only the three supported campaign tags", () => {
    expect(campaignFromSearch("?email=private@example.com&utm_source=partner&utm_campaign=ops&token=secret")).toEqual({ utm_source: "partner", utm_campaign: "ops" });
  });
  it("ignores malformed session storage and strips unknown properties", () => {
    sessionStorage.setItem(ATTRIBUTION_KEY, "not json");
    expect(readAttribution()).toEqual({});
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify({ utm_source: "partner", email: "private@example.com" }));
    expect(readAttribution()).toEqual({ utm_source: "partner" });
  });
});
