// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { validateLead } from "./validate-lead.mjs";

const inquiry = () => ({ headers: { origin: "https://preecursor.com" }, body: {
  submissionId: "8422f4ab-a313-42f4-8b54-55900c03d80c", schemaVersion: 1,
  name: "Test Buyer", email: "BUYER@example.com", company: "Example Company",
  budget: "15k-50k", timeline: "30-days", outcome: "Reduce manual quote entry and improve follow-up.",
  attribution: { utm_source: "partner" }, fax: "",
} });

describe("n8n inquiry boundary", () => {
  it("normalizes email and assigns only a review priority", () => {
    const result = validateLead(inquiry());
    expect(result.ok).toBe(true);
    if (!("payload" in result)) throw new Error("Expected a validated inquiry");
    expect(result.payload.email).toBe("buyer@example.com");
    expect(result.priority).toBe("high");
    expect(result).not.toHaveProperty("qualified");
  });
  it("rejects malformed payloads, unsupported origins, invalid enums, and spam", () => {
    expect(validateLead(null).ok).toBe(false);
    expect(validateLead({ body: [] }).ok).toBe(false);
    const wrongOrigin = inquiry(); wrongOrigin.headers.origin = "https://attacker.example";
    expect(validateLead(wrongOrigin).status).toBe(403);
    for (const patch of [{ email: "bad" }, { company: 1 }, { outcome: "tiny" }, { outcome: "x".repeat(3001) }, { budget: "fake" }, { timeline: "fake" }, { fax: "bot" }, { submissionId: "x" }, { name: "header\r\ninjection" }, { attribution: [] }]) {
      expect(validateLead({ ...inquiry(), body: { ...inquiry().body, ...patch } }).ok).toBe(false);
    }
  });
  it("exports the tested validation function unchanged to the n8n Code node", () => {
    const workflow = JSON.parse(readFileSync(new URL("./n8n/01-lead-intake.json", import.meta.url), "utf8"));
    const code = workflow.nodes.find((node: { name: string }) => node.name === "Validate inquiry").parameters.jsCode;
    const run = new Function("$input", code);
    expect(run({ first: () => ({ json: inquiry() }) })[0].json).toEqual(validateLead(inquiry()));
  });
  it("keeps all workflows inactive and contains no send action or embedded credentials", () => {
    for (const filename of ["01-lead-intake", "02-followup-draft-queue", "03-daily-pipeline"]) {
      const workflow = JSON.parse(readFileSync(new URL(`./n8n/${filename}.json`, import.meta.url), "utf8"));
      expect(workflow.active).toBe(false);
      for (const node of workflow.nodes) {
        expect(node).not.toHaveProperty("credentials");
        expect(node.type).not.toMatch(/gmail|emailSend|smtp/);
      }
      const names = new Set(workflow.nodes.map((node: { name: string }) => node.name));
      for (const connection of Object.values(workflow.connections) as { main: { node: string }[][] }[]) {
        for (const branch of connection.main) for (const edge of branch) expect(names.has(edge.node)).toBe(true);
      }
    }
  });
});
