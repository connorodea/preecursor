import { afterEach, describe, expect, it, vi } from "vitest";
import { handle, type Env } from "./index";

const ORIGIN = "https://preecursor.com";

function env(over: Partial<Env> = {}): Env {
  return {
    RESEND_API_KEY: "test-key",
    TO_EMAIL: "connor@preecursor.com",
    FROM_EMAIL: "Preecursor Website <forms@privilegedinfra.com>",
    ALLOWED_ORIGINS: `${ORIGIN},https://www.preecursor.com`,
    ...over,
  };
}

function post(path: string, body: unknown, origin = ORIGIN) {
  return new Request(`https://forms.example${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin, "CF-Connecting-IP": "1.2.3.4" },
    body: JSON.stringify(body),
  });
}

const good = { name: "Ada", email: "ada@example.com", company: "Acme", outcome: "Cut churn 10%" };

afterEach(() => vi.restoreAllMocks());

describe("preecursor-forms worker", () => {
  it("sends a valid contact submission through Resend with reply-to", async () => {
    const f = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 200 }));
    const res = await handle(post("/contact", good), env());
    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe(ORIGIN);
    const sent = JSON.parse((f.mock.calls[0][1] as RequestInit).body as string);
    expect(sent.to).toEqual(["connor@preecursor.com"]);
    expect(sent.reply_to).toBe("ada@example.com");
    expect(sent.subject).toBe("Website inquiry: Ada (Acme)");
    expect(sent.text).toContain("Cut churn 10%");
  });

  it("silently accepts but drops honeypot submissions", async () => {
    const f = vi.spyOn(globalThis, "fetch");
    const res = await handle(post("/contact", { ...good, website: "http://spam" }), env());
    expect(res.status).toBe(200);
    expect(f).not.toHaveBeenCalled();
  });

  it("rejects invalid email and missing fields with 422", async () => {
    vi.spyOn(globalThis, "fetch");
    expect((await handle(post("/contact", { ...good, email: "nope" }), env())).status).toBe(422);
    expect((await handle(post("/contact", { ...good, outcome: "  " }), env())).status).toBe(422);
    expect((await handle(post("/subscribe", { email: "" }), env())).status).toBe(422);
  });

  it("blocks foreign origins", async () => {
    const res = await handle(post("/contact", good, "https://evil.example"), env());
    expect(res.status).toBe(403);
  });

  it("returns 429 when the rate limiter says no", async () => {
    const LIMITER = { limit: vi.fn().mockResolvedValue({ success: false }) };
    const res = await handle(post("/subscribe", { email: "a@b.co" }), env({ LIMITER }));
    expect(res.status).toBe(429);
    expect(LIMITER.limit).toHaveBeenCalledWith({ key: "subscribe:1.2.3.4" });
  });

  it("strips newlines from the subject (header injection)", async () => {
    const f = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}"));
    await handle(post("/contact", { ...good, name: "Ada\r\nBcc: x@y.z" }), env());
    const sent = JSON.parse((f.mock.calls[0][1] as RequestInit).body as string);
    expect(sent.subject).not.toMatch(/[\r\n]/);
  });

  it("returns 502 when Resend fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("bad", { status: 500 }));
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect((await handle(post("/subscribe", { email: "a@b.co" }), env())).status).toBe(502);
  });

  it("answers CORS preflight", async () => {
    const res = await handle(new Request("https://forms.example/contact", { method: "OPTIONS", headers: { Origin: ORIGIN } }), env());
    expect(res.status).toBe(204);
    expect(res.headers.get("Access-Control-Allow-Methods")).toContain("POST");
  });

  it("sends a branded HTML body and escapes user input", async () => {
    const f = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 200 }));
    await handle(post("/contact", { ...good, outcome: "<script>alert(1)</script>" }), env());
    const sent = JSON.parse((f.mock.calls[0][1] as RequestInit).body as string);
    expect(sent.html).toContain("Preecursor");
    expect(sent.html).not.toMatch(/<script/i);
    expect(sent.html).toContain("&lt;script&gt;");
  });

  it("sends no customer confirmation by default", async () => {
    const f = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 200 }));
    await handle(post("/contact", good), env());
    expect(f).toHaveBeenCalledTimes(1);
  });

  it("sends a customer confirmation only when SEND_CONFIRMATIONS=true, and its failure never fails the submission", async () => {
    const f = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response("{}", { status: 200 }))
      .mockRejectedValueOnce(new Error("boom"));
    const res = await handle(post("/contact", good), env({ SEND_CONFIRMATIONS: "true" }));
    expect(res.status).toBe(200);
    expect(f).toHaveBeenCalledTimes(2);
    const c = JSON.parse((f.mock.calls[1][1] as RequestInit).body as string);
    expect(c.to).toEqual(["ada@example.com"]);
    expect(c.reply_to).toBe("connor@preecursor.com");
  });
});
