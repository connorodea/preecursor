import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { validateLead } from "./validate-lead.mjs";

const folder = fileURLToPath(new URL("./n8n/", import.meta.url));
mkdirSync(folder, { recursive: true });
const node = (name, type, parameters, position, extra = {}) => ({ id: name.toLowerCase().replaceAll(" ", "-"), name, type: `n8n-nodes-base.${type}`, typeVersion: 1, position, parameters, ...extra });
const pg = (name, query, position, options = {}, extra = {}) => node(name, "postgres", { operation: "executeQuery", query, options }, position, { typeVersion: 2.6, ...extra });
const link = (name) => ({ node: name, type: "main", index: 0 });
const save = (filename, name, nodes, edges) => {
  const workflow = { name, active: false, nodes, connections: Object.fromEntries(Object.entries(edges).map(([key, branches]) => [key, { main: branches.map((branch) => branch.map(link)) }])), settings: { executionOrder: "v1", timezone: "America/Denver", saveDataSuccessExecution: "none", saveDataErrorExecution: "none", saveManualExecutions: false } };
  writeFileSync(`${folder}${filename}.json`, JSON.stringify(workflow, null, 2) + "\n");
};

export const intakeSql = `INSERT INTO preecursor.leads (submission_id, payload, priority)
VALUES ($1::uuid, $2::jsonb, $3)
ON CONFLICT (submission_id) DO UPDATE SET submission_id = EXCLUDED.submission_id
WHERE preecursor.leads.payload = EXCLUDED.payload
RETURNING submission_id::text AS "submissionId";`;

const respond = (name, responseBody, responseCode, position) => node(name, "respondToWebhook", {
  respondWith: "json", responseBody, options: { responseCode, responseHeaders: { entries: [{ name: "Cache-Control", value: "no-store" }] } },
}, position, { typeVersion: 1.4 });

save("01-lead-intake", "Preecursor | Save and qualify an inquiry", [
  node("Website inquiry", "webhook", { httpMethod: "POST", path: "preecursor-inquiry-v1", responseMode: "responseNode", options: { allowedOrigins: "https://preecursor.com,https://www.preecursor.com" } }, [0, 0], { typeVersion: 2, webhookId: "af72f9e7-6e1e-4cd5-927a-d416b48cdf33" }),
  node("Validate inquiry", "code", { jsCode: `${validateLead.toString()}\nreturn [{ json: validateLead($input.first().json) }];` }, [240, 0], { typeVersion: 2 }),
  node("Valid inquiry", "if", { conditions: { boolean: [{ value1: "={{ $json.ok }}", value2: true }] } }, [480, 0]),
  pg("Save inquiry", intakeSql, [720, -100], { queryReplacement: "={{ [$json.submissionId, JSON.stringify($json.payload), $json.priority] }}" }, { alwaysOutputData: true, onError: "continueErrorOutput" }),
  respond("Confirm saved", "={{ $json.submissionId ? { accepted: true, submissionId: $json.submissionId } : { accepted: false, error: 'Conflicting submission. Please reload and retry.' } }}", "={{ $json.submissionId ? 200 : 409 }}", [960, -150]),
  respond("Storage unavailable", "={{ { accepted: false, error: 'Unable to save inquiry. Please retry.' } }}", 503, [960, 0]),
  respond("Reject inquiry", "={{ { accepted: false, error: $json.error } }}", "={{ $json.status }}", [720, 160]),
], {
  "Website inquiry": [["Validate inquiry"]], "Validate inquiry": [["Valid inquiry"]],
  "Valid inquiry": [["Save inquiry"], ["Reject inquiry"]], "Save inquiry": [["Confirm saved"], ["Storage unavailable"]],
});

export const draftSql = `INSERT INTO preecursor.followup_drafts (submission_id, recipient, subject, body)
SELECT l.submission_id, l.email, 'Your Preecursor workflow inquiry',
  'Hi ' || replace(l.payload->>'name', chr(10), ' ') || E',\n\nThanks for contacting Preecursor. For our first conversation, let’s map your current process, the systems involved, and the result you want to improve.\n\n' ||
  CASE WHEN $1::text <> '' THEN 'You can choose a discovery time here: ' || $1::text
       ELSE 'What are two times that would work for a discovery conversation?' END ||
  E'\n\nPreecursor\nhello@preecursor.com'
FROM preecursor.leads l
WHERE l.stage IN ('new', 'qualified')
  AND NOT EXISTS (SELECT 1 FROM preecursor.suppression s WHERE s.email = l.email)
  AND NOT EXISTS (SELECT 1 FROM preecursor.followup_drafts d WHERE d.submission_id = l.submission_id)
ORDER BY l.created_at LIMIT 100
ON CONFLICT (submission_id) DO NOTHING
RETURNING id;`;

save("02-followup-draft-queue", "Preecursor | Prepare inquiry follow-ups for review", [
  node("Every fifteen minutes", "scheduleTrigger", { rule: { interval: [{ field: "minutes", minutesInterval: 15 }] } }, [0, 0], { typeVersion: 1.2 }),
  node("Booking configuration", "code", { jsCode: `// Optional: set your actual HTTPS booking page. This workflow never sends email.\nconst bookingUrl = "";\nif (bookingUrl && (!/^https:\\/\\//.test(bookingUrl) || /[\\r\\n]/.test(bookingUrl))) throw new Error("Use a valid HTTPS booking link");\nreturn [{ json: { bookingUrl } }];` }, [250, 0], { typeVersion: 2 }),
  pg("Prepare drafts", draftSql, [500, 0], { queryReplacement: "={{ [$json.bookingUrl] }}" }),
], { "Every fifteen minutes": [["Booking configuration"]], "Booking configuration": [["Prepare drafts"]] });

export const digestSql = `INSERT INTO preecursor.pipeline_snapshots (snapshot_date, metrics)
SELECT (now() AT TIME ZONE 'America/Denver')::date,
  jsonb_build_object(
    'new_inquiries_7d', (SELECT count(*) FROM preecursor.leads WHERE created_at >= now() - interval '7 days'),
    'high_priority_open', (SELECT count(*) FROM preecursor.leads WHERE priority = 'high' AND stage IN ('new', 'qualified')),
    'drafts_to_review', (SELECT count(*) FROM preecursor.review_queue),
    'booked', (SELECT count(*) FROM preecursor.leads WHERE stage = 'booked'),
    'proposals', (SELECT count(*) FROM preecursor.leads WHERE stage = 'proposal'),
    'won', (SELECT count(*) FROM preecursor.leads WHERE stage = 'won'),
    'contracted_monthly_fee_cents', (SELECT coalesce(sum(monthly_fee_cents), 0) FROM preecursor.leads WHERE stage = 'won')
  )
ON CONFLICT (snapshot_date) DO UPDATE SET metrics = EXCLUDED.metrics, updated_at = now()
RETURNING snapshot_date, metrics;`;

save("03-daily-pipeline", "Preecursor | Daily pipeline snapshot", [
  node("Daily at eight thirty", "scheduleTrigger", { rule: { interval: [{ field: "days", triggerAtHour: 8, triggerAtMinute: 30 }] } }, [0, 0], { typeVersion: 1.2 }),
  pg("Record pipeline", digestSql, [260, 0]),
], { "Daily at eight thirty": [["Record pipeline"]] });
