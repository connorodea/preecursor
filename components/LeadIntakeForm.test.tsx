import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import LeadIntakeForm from "./LeadIntakeForm";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); sessionStorage.clear(); });
function fill() {
  fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Test Buyer" } });
  fireEvent.change(screen.getByLabelText("Work email"), { target: { value: "buyer@example.com" } });
  fireEvent.change(screen.getByLabelText("Company"), { target: { value: "Example Company" } });
  fireEvent.change(screen.getByLabelText("What outcome are you chasing?"), { target: { value: "Reduce manual quote entry and improve follow-up." } });
  fireEvent.click(screen.getByRole("checkbox"));
}
function submit() { fireEvent.submit(screen.getByLabelText("Name").closest("form")!); }

describe("LeadIntakeForm", () => {
  it("uses an explicit email-draft fallback without an endpoint", () => {
    render(<LeadIntakeForm endpoint="" />);
    expect(screen.getByRole("button").textContent).toContain("Open email draft");
    expect(screen.getByLabelText("Name").closest("form")!.getAttribute("action")).toBe("mailto:hello@preecursor.com");
  });
  it("shows booking only after durable receipt is acknowledged", async () => {
    vi.stubGlobal("fetch", vi.fn(async (_url, options) => ({ ok: true, json: async () => ({ accepted: true, submissionId: JSON.parse(options.body).submissionId }) })));
    render(<LeadIntakeForm endpoint="https://automation.example.com/webhook/lead" bookingUrl="https://cal.com/example/discovery" />);
    fill(); submit();
    await screen.findByText("Your inquiry is saved.");
    expect(screen.getByRole("link", { name: /Choose a discovery/ }).getAttribute("href")).toBe("https://cal.com/example/discovery");
  });
  it("rejects an HTTP 200 without acknowledgement, preserves input, and reuses the ID on retry", async () => {
    const send = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });
    vi.stubGlobal("fetch", send);
    render(<LeadIntakeForm endpoint="https://automation.example.com/webhook/lead" />);
    fill(); submit(); await screen.findByRole("alert");
    expect((screen.getByLabelText("Work email") as HTMLInputElement).value).toBe("buyer@example.com");
    const id = JSON.parse(send.mock.calls[0][1].body).submissionId;
    submit(); await waitFor(() => expect(send).toHaveBeenCalledTimes(2));
    expect(JSON.parse(send.mock.calls[1][1].body).submissionId).toBe(id);
    expect(screen.queryByText("Your inquiry is saved.")).toBeNull();
  });
  it("allocates a new ID when the submission changes after a failure", async () => {
    const send = vi.fn().mockRejectedValue(new Error("offline"));
    vi.stubGlobal("fetch", send);
    render(<LeadIntakeForm endpoint="https://automation.example.com/webhook/lead" />);
    fill(); submit(); await screen.findByRole("alert");
    fireEvent.change(screen.getByLabelText("Company"), { target: { value: "Different Company" } });
    submit(); await waitFor(() => expect(send).toHaveBeenCalledTimes(2));
    expect(JSON.parse(send.mock.calls[0][1].body).submissionId).not.toBe(JSON.parse(send.mock.calls[1][1].body).submissionId);
  });
  it("prevents duplicate in-flight requests", async () => {
    let resolve!: (value: unknown) => void;
    const send = vi.fn(() => new Promise((done) => { resolve = done; }));
    vi.stubGlobal("fetch", send);
    render(<LeadIntakeForm endpoint="https://automation.example.com/webhook/lead" />);
    fill(); submit(); submit();
    expect(send).toHaveBeenCalledTimes(1);
    resolve({ ok: false, json: async () => ({}) });
    await screen.findByRole("alert");
  });
  it("sends the inquiry consent version and prefers the correlated booking link", async () => {
    const send = vi.fn(async (_url, options) => ({ ok: true, json: async () => ({ accepted: true, submissionId: JSON.parse(options.body).submissionId, bookingUrl: "https://preecursor.com/acquisition/booking/opaque" }) }));
    vi.stubGlobal("fetch", send);
    render(<LeadIntakeForm endpoint="https://preecursor.com/acquisition/leads" />);
    fill(); submit();
    await screen.findByText("Your inquiry is saved.");
    expect(JSON.parse(send.mock.calls[0][1].body).consent).toBe("inquiry-v1");
    expect(screen.getByRole("link", { name: /Choose a discovery/ }).getAttribute("href")).toBe("https://preecursor.com/acquisition/booking/opaque");
  });
  it("does not trust an unrelated booking URL in a response", async () => {
    vi.stubGlobal("fetch", vi.fn(async (_url, options) => ({ ok: true, json: async () => ({ accepted: true, submissionId: JSON.parse(options.body).submissionId, bookingUrl: "https://untrusted.example/phishing" }) })));
    render(<LeadIntakeForm endpoint="https://preecursor.com/acquisition/leads" />);
    fill(); submit();
    await screen.findByText("Your inquiry is saved.");
    expect(screen.queryByRole("link", { name: /Choose a discovery/ })).toBeNull();
  });
  it("requires the configured spam challenge before sending", async () => {
    const send = vi.fn();
    vi.stubGlobal("fetch", send);
    render(<LeadIntakeForm endpoint="https://preecursor.com/acquisition/leads" siteKey="test-key" />);
    fill(); submit();
    await screen.findByText("Please complete the verification challenge.");
    expect(send).not.toHaveBeenCalled();
  });
});
