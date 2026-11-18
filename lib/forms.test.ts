import { afterEach, describe, expect, it, vi } from "vitest";
import { FORMS_ENDPOINT, submitForm } from "./forms";

afterEach(() => vi.restoreAllMocks());

describe("submitForm", () => {
  it("posts JSON to the worker route and reports success", async () => {
    const f = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response('{"ok":true}'));
    expect(await submitForm("subscribe", { email: "a@b.co" })).toEqual({ ok: true });
    expect(f.mock.calls[0][0]).toBe(`${FORMS_ENDPOINT}/subscribe`);
    expect(JSON.parse((f.mock.calls[0][1] as RequestInit).body as string)).toEqual({ email: "a@b.co" });
  });

  it("surfaces the worker's error message", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response('{"ok":false,"error":"Please enter a valid email address."}', { status: 422 }),
    );
    expect(await submitForm("contact", {})).toEqual({ ok: false, error: "Please enter a valid email address." });
  });

  it("never throws on network failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new TypeError("offline"));
    const r = await submitForm("contact", {});
    expect(r.ok).toBe(false);
  });
});
