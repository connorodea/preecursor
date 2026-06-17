/**
 * lib/content/work.ts — four ILLUSTRATIVE example engagements that show the
 * *kind* of work we do.
 *
 * These are not records of specific delivered client results. As a new studio
 * we don't publish invented aggregate metrics, fabricated outcome figures, or
 * real client identities. Each entry is a clearly-illustrative scenario — an
 * archetype like "a global bank" — describing the challenge, what such a
 * system looks like, and the qualitative outcomes it's designed to produce.
 *
 * Tone: boutique applied-AI studio — a sharper, smaller BCG. Specific,
 * engineering-credible, and honest about what is illustration versus fact.
 */

import type { Stat } from "./services";

export type Approach = { title: string; desc: string };

export type WorkCase = {
  slug: string;
  client: string;
  sector: string;
  headline: string;
  /**
   * Reserved for any genuinely measured headline figure. Left empty on these
   * illustrative engagements — no invented numbers. StatBand and the hub card
   * suppress themselves when this is undefined.
   */
  stat?: Stat;
  /** One-line summary used as the hub-card description + hero lede. */
  summary: string;
  /** 2–3 sentence problem statement. */
  challenge: string;
  /** "What we built" rows for the detail page. */
  approach: Approach[];
  /**
   * Reserved for measured outcome figures on real engagements. Empty here so
   * the StatBand on the detail page renders nothing rather than fake numbers.
   */
  outcome: Stat[];
  /**
   * Qualitative outcomes the system is designed to produce — the honest
   * stand-in for fabricated metrics, rendered as prose on the detail page.
   */
  outcomes: string[];
};

export const WORK_CASES: WorkCase[] = [
  {
    slug: "underwriting-copilot",
    client: "A global bank (illustrative)",
    sector: "Financial institutions",
    headline: "An underwriting copilot that drafts and checks credit memos",
    summary:
      "An illustration of the kind of system we build: an agent that drafts and checks credit memos against policy in real time, with every figure cited back to source.",
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
    outcome: [],
    outcomes: [
      "Credit officers review and approve rather than re-key, so each memo starts from a grounded draft instead of a blank page.",
      "Every figure in a memo is traceable to its source document, so review is faster and the second line can audit with confidence.",
      "The eval harness, documentation, and monitoring are built up front, so a system like this is designed to clear model risk review rather than stall in pilot.",
    ],
  },
  {
    slug: "predictive-operations",
    client: "An industrial manufacturer (illustrative)",
    sector: "Industrial goods",
    headline: "Predictive operations that turn downtime into scheduled work",
    summary:
      "An illustration of sensor-grounded models and a maintenance copilot that turn unplanned downtime into scheduled work across a plant network.",
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
    outcome: [],
    outcomes: [
      "Impending failures surface days ahead, ranked by the downtime and dollars each one puts at risk — turning reactive firefighting into planned maintenance.",
      "Each prediction becomes a specific, cited maintenance action, so any technician can act on it like the most experienced one on the floor.",
      "Predictions flow into the existing CMMS and shift plan, so the work gets scheduled into operations instead of becoming another dashboard no one opens.",
    ],
  },
  {
    slug: "clinical-documentation",
    client: "A health network (illustrative)",
    sector: "Healthcare & life sciences",
    headline: "Clinical documentation that gives clinicians back their evenings",
    summary:
      "An illustration of ambient, grounded note generation designed to return time to clinicians without compromising coding accuracy or the chart.",
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
    outcome: [],
    outcomes: [
      "Notes are drafted from the visit and the existing record, keeping terminology, coding, and the chart accurate rather than fluent-but-wrong.",
      "Every statement links back to its source in the encounter or record, so clinicians verify in seconds and quality teams can audit after the fact.",
      "A clinical eval suite gates every release on citation accuracy, coding correctness, and hallucination rate — so accuracy is measured, not asserted.",
    ],
  },
  {
    slug: "network-ops-copilot",
    client: "A telecommunications carrier (illustrative)",
    sector: "Telecommunications",
    headline: "A network-ops copilot that quiets the NOC and finds the real fault",
    summary:
      "An illustration of anomaly detection and a root-cause agent designed to cut through alarm storms and get crews to the real fault faster.",
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
    outcome: [],
    outcomes: [
      "Anomaly detection collapses alarm storms into a short list of genuine incidents, ranked by customer and revenue impact, so the NOC works the real problems first.",
      "A tool-using agent correlates topology, telemetry, and change history to propose the most likely root cause — with the evidence trail an engineer needs to confirm it.",
      "Every agent run is traced and replayable, so operations can trust, debug, and govern the system instead of treating it as a black box.",
    ],
  },
];

/**
 * Firm-wide aggregate figures intentionally left empty. As a new studio we do
 * not publish invented book-of-business metrics; the StatBand that reads this
 * renders nothing while the array is empty.
 */
export const FIRM_STATS: Stat[] = [];

export function getCase(slug: string): WorkCase | undefined {
  return WORK_CASES.find((c) => c.slug === slug);
}

/** Format a Stat into the compact display string the Card `stat` prop expects. */
export function formatStat(s: Stat): string {
  const num = s.decimals != null ? s.value.toFixed(s.decimals) : String(s.value);
  return `${s.prefix ?? ""}${num}${s.suffix ?? ""}`;
}
