// @vitest-environment node
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

const db = new PGlite();
const nodeQuery = (file: string, name: string) => JSON.parse(readFileSync(new URL(`./n8n/${file}.json`, import.meta.url), "utf8")).nodes.find((node: { name: string }) => node.name === name).parameters.query;
const intake = nodeQuery("01-lead-intake", "Save inquiry");
const draft = nodeQuery("02-followup-draft-queue", "Prepare drafts");
const digest = nodeQuery("03-daily-pipeline", "Record pipeline");
const id = "8422f4ab-a313-42f4-8b54-55900c03d80c";
const payload = { name: "Test Buyer", email: "buyer@example.com", company: "Example", outcome: "Improve quotes and follow-up" };
const save = () => db.query(intake, [id, JSON.stringify(payload), "high"]);

beforeAll(async () => { await db.exec(readFileSync(new URL("./schema.sql", import.meta.url), "utf8")); });
beforeEach(async () => { await db.exec("TRUNCATE preecursor.leads, preecursor.followup_drafts, preecursor.suppression, preecursor.pipeline_snapshots RESTART IDENTITY CASCADE"); });
afterAll(async () => { await db.close(); });

describe("lead persistence and review queue in PostgreSQL", () => {
  it("acknowledges retries without duplicating or overwriting a changed payload", async () => {
    expect((await save()).rows).toEqual([{ submissionId: id }]);
    expect((await save()).rows).toEqual([{ submissionId: id }]);
    expect((await db.query(intake, [id, JSON.stringify({ ...payload, email: "changed@example.com" }), "high"])).rows).toEqual([]);
    expect((await db.query("SELECT email FROM preecursor.leads")).rows).toEqual([{ email: "buyer@example.com" }]);
  });
  it("creates only one draft across repeated executions", async () => {
    await save();
    expect((await db.query(draft, ["https://cal.com/example/discovery"])).rows).toHaveLength(1);
    expect((await db.query(draft, ["https://cal.com/example/discovery"])).rows).toHaveLength(0);
    const result = await db.query<{ body: string }>("SELECT body FROM preecursor.review_queue");
    expect(result.rows[0].body).toContain("https://cal.com/example/discovery");
  });
  it("blocks suppressed addresses and removes existing drafts from the review view", async () => {
    await save();
    await db.query(draft, [""]);
    await db.query("INSERT INTO preecursor.suppression (email, reason) VALUES ($1, $2)", ["buyer@example.com", "opt-out"]);
    expect((await db.query("SELECT * FROM preecursor.review_queue")).rows).toHaveLength(0);
    await db.exec("TRUNCATE preecursor.followup_drafts");
    expect((await db.query(draft, [""])).rows).toHaveLength(0);
  });
  it("excludes booked prospects from new and queued follow-up drafts", async () => {
    await save(); await db.query(draft, [""]);
    await db.exec("UPDATE preecursor.leads SET stage = 'booked'");
    expect((await db.query("SELECT * FROM preecursor.review_queue")).rows).toHaveLength(0);
    expect((await db.query(draft, [""])).rows).toHaveLength(0);
  });
  it("updates one daily snapshot and only counts fees on won deals", async () => {
    await save();
    await db.exec("UPDATE preecursor.leads SET monthly_fee_cents = 500000");
    const first = await db.query<{ metrics: { contracted_monthly_fee_cents: number } }>(digest);
    expect(first.rows[0].metrics.contracted_monthly_fee_cents).toBe(0);
    await db.exec("UPDATE preecursor.leads SET stage = 'won'");
    const second = await db.query<{ metrics: { contracted_monthly_fee_cents: number } }>(digest);
    expect(second.rows[0].metrics.contracted_monthly_fee_cents).toBe(500000);
    expect((await db.query("SELECT * FROM preecursor.pipeline_snapshots")).rows).toHaveLength(1);
  });
});
