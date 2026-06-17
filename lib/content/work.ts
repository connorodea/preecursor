/**
 * lib/content/work.ts — the four flagship case studies that back the
 * "Client Impact" pillar.
 *
 * Each entry matches a card on the landing SelectedWork section (same slug,
 * client, headline, and headline stat) and expands it into a full case-study
 * detail page: the challenge, what we built, and the outcomes we can point to.
 *
 * Tone: boutique applied-AI studio — a sharper, smaller BCG. Specific,
 * outcome-led, engineering-credible. Stats are illustrative first-draft figures.
 */

import type { Stat } from "./services";

export type Approach = { title: string; desc: string };

export type WorkCase = {
  slug: string;
  client: string;
  sector: string;
  headline: string;
  /** The single headline figure, shown on the landing + hub cards. */
  stat: Stat;
  /** One-line summary used as the hub-card description + hero lede. */
  summary: string;
  /** 2–3 sentence problem statement. */
  challenge: string;
  /** "What we built" rows for the detail page. */
  approach: Approach[];
  /** The measured outcomes — the StatBand on the detail page. */
  outcome: Stat[];
};

export const WORK_CASES: WorkCase[] = [
  {
    slug: "underwriting-copilot",
    client: "A global systemically important bank",
    sector: "Financial institutions",
    headline: "An underwriting copilot that cut credit-memo cycle time by 63%",
    stat: { value: 63, prefix: "−", suffix: "%", label: "Credit-memo cycle time" },
    summary:
      "An agent that drafts and checks credit memos against policy in real time — in production at a global bank in eight weeks.",
    challenge:
      "Commercial credit officers were spending the better part of a week assembling each memo — spreading financials, reconciling covenants, and hand-checking every figure against a 400-page policy manual. The backlog throttled deal velocity, and the manual reconciliation introduced exactly the kind of inconsistency the second line of defense exists to catch. Off-the-shelf copilots had stalled in pilot because nothing in them could survive model risk review.",
    approach: [
      {
        title: "Grounded memo drafting",
        desc: "A retrieval pipeline over financial statements, deal documents, and the policy manual drafts each memo section with every figure cited back to its source page, so officers review rather than re-key.",
      },
      {
        title: "Policy & covenant checks",
        desc: "The agent runs each draft against codified credit policy and covenant terms, surfacing exceptions and missing conditions as a ranked checklist instead of a wall of prose.",
      },
      {
        title: "Human-in-the-loop sign-off",
        desc: "Officers stay the decision-maker: every claim is traceable, every edit is logged, and nothing reaches committee without an explicit human approval step.",
      },
      {
        title: "Model risk evidence",
        desc: "We shipped the eval harness, documentation, and monitoring the validation team needed up front — so the system cleared SR 11-7 review and went to production rather than to a shelf.",
      },
    ],
    outcome: [
      { value: 63, prefix: "−", suffix: "%", label: "Credit-memo cycle time" },
      { value: 8, suffix: " wks", label: "From kickoff to production" },
      { value: 100, suffix: "%", label: "Figures traced to source" },
      { value: 2.1, decimals: 1, prefix: "+", suffix: "×", label: "Deals reviewed per officer" },
    ],
  },
  {
    slug: "predictive-operations",
    client: "A Fortune 200 industrial manufacturer",
    sector: "Industrial goods",
    headline: "Predictive operations that took $180M out of annual cost",
    stat: { value: 180, prefix: "$", suffix: "M", label: "Annual savings" },
    summary:
      "Sensor-grounded models and a maintenance copilot that turned unplanned downtime into scheduled work across 40 plants.",
    challenge:
      "Across forty plants, unplanned downtime was the single largest controllable cost — and the playbook for avoiding it lived in the heads of a shrinking pool of senior reliability engineers. Maintenance ran on fixed calendars that over-serviced healthy assets and missed the ones about to fail. Decades of sensor and work-order history sat unused because no one could turn it into an action a floor supervisor would trust.",
    approach: [
      {
        title: "Failure-prediction models",
        desc: "Models trained on sensor streams and maintenance history flag impending failures days ahead, ranked by the downtime and dollars each one puts at risk.",
      },
      {
        title: "Maintenance copilot",
        desc: "A grounded assistant turns each prediction into a specific, cited maintenance action — pulling the right procedure from manuals and service history so any technician can act like the best one.",
      },
      {
        title: "Plant-floor integration",
        desc: "Predictions flow straight into the existing CMMS and shift planning, so the system schedules work into the plan instead of becoming another dashboard no one opens.",
      },
      {
        title: "Closed-loop tuning",
        desc: "Every intervention feeds back into the models and a plant-level scorecard, so accuracy and savings compound quarter over quarter instead of decaying.",
      },
    ],
    outcome: [
      { value: 180, prefix: "$", suffix: "M", label: "Annual savings" },
      { value: 31, prefix: "−", suffix: "%", label: "Unplanned downtime" },
      { value: 40, suffix: "", label: "Plants live" },
      { value: 4, suffix: "×", label: "Faster fault diagnosis" },
    ],
  },
  {
    slug: "clinical-documentation",
    client: "A multi-state nonprofit health network",
    sector: "Healthcare & life sciences",
    headline: "Clinical documentation that returned 11 hours a week to every clinician",
    stat: { value: 11, suffix: " hrs", label: "Per clinician / week" },
    summary:
      "Ambient, grounded note generation that gave clinicians back their evenings — without compromising coding accuracy or the chart.",
    challenge:
      "Clinicians across the network were losing two-plus hours every day to documentation — much of it after their last patient, the so-called pajama time that drives burnout and attrition. Earlier generative pilots had been pulled because they hallucinated findings and miscoded encounters, exactly the failure modes a clinical setting cannot tolerate. Any system had to be measurably accurate against the chart and defensible under audit before it could touch a patient note.",
    approach: [
      {
        title: "Ambient note generation",
        desc: "The system drafts structured notes from the visit and the existing record, keeping terminology, coding, and the chart accurate rather than fluent-but-wrong.",
      },
      {
        title: "Provenance on every claim",
        desc: "Each statement in a note links back to its source in the encounter or record, so clinicians verify in seconds and quality teams can audit after the fact.",
      },
      {
        title: "Clinical eval harness",
        desc: "We built an eval suite tuned to clinical risk — citation accuracy, coding correctness, omission and hallucination rates — and gated every release on it.",
      },
      {
        title: "Specialty-aware rollout",
        desc: "We tuned and rolled out specialty by specialty with the clinicians in the loop, so adoption stuck instead of stalling at the first bad note.",
      },
    ],
    outcome: [
      { value: 11, suffix: " hrs", label: "Returned per clinician / week" },
      { value: 99.2, decimals: 1, suffix: "%", label: "Citation accuracy in eval" },
      { value: 87, suffix: "%", label: "Active adoption at 90 days" },
      { value: 0, suffix: "", label: "Material audit findings" },
    ],
  },
  {
    slug: "network-ops-copilot",
    client: "A national telecommunications carrier",
    sector: "Telecommunications",
    headline: "A network-ops copilot that cut mean time to repair by 41%",
    stat: { value: 41, prefix: "−", suffix: "%", label: "Mean time to repair" },
    summary:
      "Anomaly detection and a root-cause agent that quieted the NOC and got crews to the real fault faster.",
    challenge:
      "The network operations center drowned in alarms — tens of thousands a day, the overwhelming majority noise — while the incidents that mattered hid inside the storm. Diagnosing the true root cause meant correlating signals across systems by hand, and the tribal knowledge for doing it well was concentrated in a handful of veteran engineers. Every extra minute of mean time to repair showed up as churn and SLA penalties.",
    approach: [
      {
        title: "Alarm correlation & dedup",
        desc: "Anomaly detection collapses alarm storms into a short list of genuine incidents, ranked by customer and revenue impact, so the NOC works the real problems first.",
      },
      {
        title: "Root-cause agent",
        desc: "A tool-using agent correlates topology, telemetry, and change history to propose the most likely root cause — with the evidence trail an engineer needs to confirm it.",
      },
      {
        title: "Guided dispatch",
        desc: "The agent drafts the remediation and equips the dispatched crew with the right cited procedure on site, cutting the back-and-forth between the field and the NOC.",
      },
      {
        title: "Observable by design",
        desc: "Every agent run is traced and replayable, so operations can trust, debug, and govern the system instead of treating it as a black box.",
      },
    ],
    outcome: [
      { value: 41, prefix: "−", suffix: "%", label: "Mean time to repair" },
      { value: 92, prefix: "−", suffix: "%", label: "Alarm noise to the NOC" },
      { value: 2.4, decimals: 1, prefix: "+", suffix: "pts", label: "Churn-save rate" },
      { value: 100, suffix: "%", label: "Agent actions traced" },
    ],
  },
];

/** Firm-wide figures for the hub "By the numbers" band. */
export const FIRM_STATS: Stat[] = [
  { value: 2.4, decimals: 1, prefix: "$", suffix: "B", label: "Enterprise value influenced" },
  { value: 40, suffix: "+", label: "AI systems shipped" },
  { value: 6, suffix: " wks", label: "Median time to first deploy" },
  { value: 9, suffix: "/10", label: "Engagements that expand" },
];

export function getCase(slug: string): WorkCase | undefined {
  return WORK_CASES.find((c) => c.slug === slug);
}

/** Format a Stat into the compact display string the Card `stat` prop expects. */
export function formatStat(s: Stat): string {
  const num = s.decimals != null ? s.value.toFixed(s.decimals) : String(s.value);
  return `${s.prefix ?? ""}${num}${s.suffix ?? ""}`;
}
