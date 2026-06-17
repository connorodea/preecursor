/**
 * Use-case pSEO cluster — "AI consulting for {use case}".
 *
 * A second programmatic spoke family under the /ai-consulting pillar, targeting
 * commercial long-tail by *applied-AI service* rather than by industry. Each
 * use case is a thing we actually build, with a differentiated problem,
 * approach, and outcome so every page carries genuine, non-thin value.
 *
 * Routing (coexists with the sibling /ai-consulting/[industry] dynamic segment):
 *   /ai-consulting/use-cases              — hub
 *   /ai-consulting/use-cases/[useCase]    — detail
 *
 * Cross-links point back to the capability and industry pages that already
 * exist (see lib/ia.ts CAPABILITY_LEAVES / INDUSTRY_LEAVES), reinforcing the
 * internal-link graph without inventing new routes.
 */

export type UseCase = {
  slug: string;
  /** Short, human-readable name used in cards and breadcrumbs. */
  name: string;
  /** Page H1 (one per page). */
  h1: string;
  /** <title>. */
  title: string;
  metaDescription: string;
  /** Hero lede — one sentence of positioning. */
  lede: string;
  /** The pain we solve, in plain operator language (2–3 sentences). */
  problem: string;
  /** 3–4 "how we build it" rows. */
  approach: { title: string; desc: string }[];
  /** The result we hold ourselves to (1–2 sentences). */
  outcome: string;
  /** Cross-links to existing capability / industry pages. */
  relatedCapabilities: { label: string; href: string }[];
};

export const USE_CASES: UseCase[] = [
  {
    slug: "fraud-and-aml-detection",
    name: "Fraud & AML detection",
    h1: "AI consulting for fraud and AML detection",
    title: "AI Consulting for Fraud & AML Detection",
    metaDescription:
      "Applied-AI consulting for fraud and AML detection: lift true-positive rates, cut alert backlogs, and build monitoring that survives model risk review.",
    lede: "Detection systems that catch more real fraud, flood analysts with fewer false alarms, and stand up to the second line of defense.",
    problem:
      "Rules engines fire on patterns yesterday's fraudsters used, so true fraud slips through while analysts drown in false positives — often 90-plus percent of alerts are noise. Every missed case is a loss and a regulatory exposure; every false alert is wasted investigator time. The hard part is lifting recall without making the backlog worse, and proving the model to a validation team that distrusts anything it cannot explain.",
    approach: [
      {
        title: "Behavioral and graph features",
        desc: "Entity-resolution and transaction-graph features that surface mule networks and layering the rules engine never sees, engineered from your own history.",
      },
      {
        title: "Risk-ranked alert triage",
        desc: "Models that score and rank alerts so investigators work the riskiest cases first, with the noisy long tail auto-dispositioned and logged.",
      },
      {
        title: "Explainability for the second line",
        desc: "Reason codes and case narratives on every alert so analysts act faster and model risk can validate what drove each decision.",
      },
      {
        title: "Monitoring against drift",
        desc: "Champion/challenger pipelines and drift detection that keep precision from decaying as typologies and customer behavior shift.",
      },
    ],
    outcome:
      "Analysts work a smaller, sharper queue — measurably higher true-positive rate and a shrinking backlog — with a documented, monitored model your validators can sign off on rather than fight.",
    relatedCapabilities: [
      { label: "Applied Builds", href: "/capabilities/applied-builds" },
      { label: "Evaluation & Safety", href: "/capabilities/evaluation-and-safety" },
      { label: "AI consulting for financial institutions", href: "/ai-consulting/financial-institutions" },
    ],
  },

  {
    slug: "document-and-data-extraction",
    name: "Document & data extraction",
    h1: "AI consulting for document and data extraction",
    title: "AI Consulting for Document & Data Extraction",
    metaDescription:
      "Applied-AI consulting for document and data extraction: turn PDFs, forms, and emails into structured, validated, source-cited data with human review where it matters.",
    lede: "Pipelines that turn messy documents into structured data you can trust — with validation and provenance, not just a parse.",
    problem:
      "The work that ages your team is reading: statements, contracts, invoices, forms, and email threads keyed by hand into a system of record. Off-the-shelf OCR gets the easy 80 percent and silently mangles the rest, and a wrong field downstream is worse than a slow one. The challenge is extraction that is accurate enough to act on, with a clean audit trail and review only where the stakes warrant it.",
    approach: [
      {
        title: "Layout-aware extraction",
        desc: "Models that read tables, multi-column forms, and handwriting across document types, normalizing to the schema your systems expect.",
      },
      {
        title: "Validation and reconciliation",
        desc: "Cross-checks against source totals, master data, and business rules so bad extractions are caught before they propagate.",
      },
      {
        title: "Confidence-routed human review",
        desc: "Low-confidence fields route to a reviewer; high-confidence ones pass straight through — review effort follows risk, not volume.",
      },
      {
        title: "Provenance on every field",
        desc: "Each extracted value links back to its location in the source document, so audits and disputes resolve in seconds.",
      },
    ],
    outcome:
      "Documents that used to sit in a keying queue become structured records within minutes — with field-level accuracy you can prove and a reviewer touching only the genuinely ambiguous cases.",
    relatedCapabilities: [
      { label: "Applied Builds", href: "/capabilities/applied-builds" },
      { label: "Data & Platform Engineering", href: "/capabilities/data-and-platform-engineering" },
      { label: "AI consulting for insurance", href: "/ai-consulting/insurance" },
    ],
  },

  {
    slug: "customer-support-copilots",
    name: "Customer support copilots",
    h1: "AI consulting for customer support copilots",
    title: "AI Consulting for Customer Support Copilots",
    metaDescription:
      "Applied-AI consulting for customer support copilots: grounded agent assist and self-serve resolution that cut handle time and deflect tickets without breaking trust.",
    lede: "Support AI that resolves real tickets and briefs your agents — grounded in your own policies, with clean handoffs when it shouldn't.",
    problem:
      "Support costs scale with volume while customers expect instant, correct answers. Generic chatbots either deflect to a help page or hallucinate a policy that doesn't exist, and both erode trust faster than they save money. The real difficulty is grounding answers in your current knowledge base, knowing when to escalate, and proving the copilot helps rather than hides behind a deflection metric.",
    approach: [
      {
        title: "Grounded retrieval over your KB",
        desc: "Retrieval pipelines tied to your live help center, policies, and macros, so every answer is current and cited — never invented.",
      },
      {
        title: "Agent-assist and full self-serve",
        desc: "A copilot that drafts replies for human agents and a customer-facing mode that resolves common issues end-to-end.",
      },
      {
        title: "Escalation and handoff logic",
        desc: "Clear thresholds for when the copilot stops and hands a fully-summarized case to a human, instead of looping a frustrated customer.",
      },
      {
        title: "Quality and tone evaluation",
        desc: "Evals for accuracy, policy compliance, and brand voice that run on every change, so resolution rate climbs without quality slipping.",
      },
    ],
    outcome:
      "First-contact resolution rises and handle time drops, with a copilot your agents trust and customers don't have to fight — measured on genuine resolution, not deflection.",
    relatedCapabilities: [
      { label: "Agentic Systems", href: "/capabilities/agentic-systems" },
      { label: "Evaluation & Safety", href: "/capabilities/evaluation-and-safety" },
      { label: "AI consulting for consumer & retail", href: "/ai-consulting/consumer-and-retail" },
    ],
  },

  {
    slug: "demand-forecasting",
    name: "Demand forecasting",
    h1: "AI consulting for demand forecasting",
    title: "AI Consulting for Demand Forecasting",
    metaDescription:
      "Applied-AI consulting for demand forecasting: probabilistic forecasts that cut stock-outs and markdowns and feed planning systems your team will actually use.",
    lede: "Forecasts that beat last year's average — probabilistic, explainable, and wired into the planning decisions they're meant to drive.",
    problem:
      "Most demand plans are a spreadsheet anchored to last year plus a gut adjustment, so you carry too much of the wrong stock and run out of the right. Promotions, weather, and new products break the model exactly when accuracy matters most. The challenge is forecasts that are accurate at the granularity decisions are made — SKU, store, week — and trusted enough that planners actually let them drive replenishment.",
    approach: [
      {
        title: "Hierarchical, probabilistic forecasts",
        desc: "Models that forecast at item-location-period and reconcile up the hierarchy, with prediction intervals planners can stock against.",
      },
      {
        title: "Drivers, not just history",
        desc: "Price, promotion, weather, and calendar effects modeled explicitly so the forecast reacts to the events that move demand.",
      },
      {
        title: "New-product and cold-start handling",
        desc: "Analog and attribute-based methods to forecast items with little or no history, where naive models simply fail.",
      },
      {
        title: "Decision integration",
        desc: "Forecasts pushed into replenishment, allocation, and S&OP so the accuracy gain shows up as fewer markdowns and stock-outs.",
      },
    ],
    outcome:
      "Sharper forecasts at the level you actually plan — fewer stock-outs and lower markdowns — backed by intervals and driver explanations that earn planner trust.",
    relatedCapabilities: [
      { label: "Data & Platform Engineering", href: "/capabilities/data-and-platform-engineering" },
      { label: "Applied Builds", href: "/capabilities/applied-builds" },
      { label: "AI consulting for transportation & logistics", href: "/ai-consulting/transportation-and-logistics" },
    ],
  },

  {
    slug: "underwriting-and-credit",
    name: "Underwriting & credit",
    h1: "AI consulting for underwriting and credit",
    title: "AI Consulting for Underwriting & Credit",
    metaDescription:
      "Applied-AI consulting for underwriting and credit: copilots that spread financials and draft memos with cited figures, built to pass model risk and fair-lending review.",
    lede: "Underwriting copilots that compress the read on a deal — spreading, memo drafting, and exception-spotting with every figure cited.",
    problem:
      "Underwriters spend more time gathering and re-keying than judging: spreading financials, chasing documents, and writing memos by hand. The slow part isn't the credit decision, it's the assembly. The challenge is automating that assembly without introducing a model the validation team won't approve or that fair-lending review can't defend.",
    approach: [
      {
        title: "Financial spreading and synthesis",
        desc: "Extraction and normalization of statements and filings into a clean, cited spread the underwriter can verify at a glance.",
      },
      {
        title: "Memo and exception drafting",
        desc: "Agents that draft the credit memo and flag covenant and policy exceptions, with every figure traced back to its source.",
      },
      {
        title: "Fair-lending and governance by design",
        desc: "Feature review, documentation, and monitoring built to SR 11-7 and fair-lending expectations, so models survive validation.",
      },
      {
        title: "Human-in-the-loop decisioning",
        desc: "The copilot prepares; the underwriter decides — with a defensible record of what the model surfaced and why.",
      },
    ],
    outcome:
      "Credit-memo cycle time drops sharply while the underwriter keeps the decision — with a documented, monitored model your second line can validate and defend.",
    relatedCapabilities: [
      { label: "Applied Builds", href: "/capabilities/applied-builds" },
      { label: "Responsible AI", href: "/capabilities/responsible-ai" },
      { label: "AI consulting for financial institutions", href: "/ai-consulting/financial-institutions" },
    ],
  },

  {
    slug: "clinical-documentation",
    name: "Clinical documentation",
    h1: "AI consulting for clinical documentation",
    title: "AI Consulting for Clinical Documentation",
    metaDescription:
      "Applied-AI consulting for clinical documentation: ambient and structured note generation that returns time to clinicians while keeping coding and the chart accurate.",
    lede: "Documentation AI that gives clinicians their evenings back — accurate notes, correct coding, and an audit trail the compliance team trusts.",
    problem:
      "Clinicians spend hours a day writing notes, and that documentation burden is a leading driver of burnout. But in healthcare a confidently wrong note is dangerous, so generic transcription rarely survives pilot. The challenge is generating notes accurate enough to sign, coded correctly, and grounded in the encounter — with the provenance quality and compliance teams require.",
    approach: [
      {
        title: "Ambient and structured capture",
        desc: "Note generation from the encounter that maps to your templates and terminology, not a free-text blob the clinician must rewrite.",
      },
      {
        title: "Coding and terminology accuracy",
        desc: "Alignment to ICD/CPT and your problem lists, so documentation supports correct coding instead of creating downstream rework.",
      },
      {
        title: "Clinical evaluation and guardrails",
        desc: "Eval harnesses and red-teaming tuned to clinical risk, measuring the failure modes that actually matter at the bedside.",
      },
      {
        title: "Clinician sign-off and provenance",
        desc: "The clinician reviews and signs; every generated claim links to what was said, keeping the chart defensible under audit.",
      },
    ],
    outcome:
      "Clinicians get measurable time back per day with notes accurate enough to sign and coding that holds up — under evaluation and audit, not just in a demo.",
    relatedCapabilities: [
      { label: "Evaluation & Safety", href: "/capabilities/evaluation-and-safety" },
      { label: "Responsible AI", href: "/capabilities/responsible-ai" },
      { label: "AI consulting for healthcare & life sciences", href: "/ai-consulting/healthcare-and-life-sciences" },
    ],
  },

  {
    slug: "predictive-maintenance",
    name: "Predictive maintenance",
    h1: "AI consulting for predictive maintenance",
    title: "AI Consulting for Predictive Maintenance",
    metaDescription:
      "Applied-AI consulting for predictive maintenance: failure prediction from sensor and history data that cuts unplanned downtime and ranks work by risk, not calendar.",
    lede: "Models that flag a failure before it stops a line — turning sensor and maintenance history into work ranked by downtime risk.",
    problem:
      "Maintenance on a fixed calendar either services equipment that was fine or misses the failure that takes down a line. Unplanned downtime is the expensive outcome, and the warning signs are buried in sensor streams and decades of work orders no one reads. The challenge is predicting failure early enough to act, with enough precision that crews trust the alert instead of ignoring it.",
    approach: [
      {
        title: "Condition models from sensor history",
        desc: "Failure and remaining-useful-life models built from your telemetry and maintenance logs, tuned to each asset class.",
      },
      {
        title: "Risk-ranked work orders",
        desc: "Predictions translated into maintenance actions ranked by downtime and safety risk, so crews fix what matters first.",
      },
      {
        title: "Alerting crews trust",
        desc: "Tuned thresholds and clear reason codes that keep false alarms low — because an alarm crews ignore is worse than none.",
      },
      {
        title: "Closed-loop improvement",
        desc: "Feedback from actual outcomes retrains the models, so accuracy compounds instead of decaying after go-live.",
      },
    ],
    outcome:
      "Unplanned downtime falls and maintenance effort shifts to the assets that actually need it — with alerts precise enough that the floor acts on them.",
    relatedCapabilities: [
      { label: "Data & Platform Engineering", href: "/capabilities/data-and-platform-engineering" },
      { label: "MLOps & Scale", href: "/capabilities/mlops-and-scale" },
      { label: "AI consulting for industrial goods", href: "/ai-consulting/industrial-goods" },
    ],
  },

  {
    slug: "knowledge-retrieval-rag",
    name: "Knowledge retrieval (RAG)",
    h1: "AI consulting for knowledge retrieval and RAG",
    title: "AI Consulting for Knowledge Retrieval & RAG",
    metaDescription:
      "Applied-AI consulting for knowledge retrieval and RAG: grounded assistants over your own documents that answer with citations, freshness, and permission-aware access.",
    lede: "Retrieval-grounded assistants that answer from your own knowledge — cited, current, and aware of who's allowed to see what.",
    problem:
      "Your answers exist — in wikis, tickets, contracts, and the heads of a few senior people — but finding them takes a search expedition or a Slack interruption. Naive RAG demos well and fails in production: stale content, missing citations, and answers that ignore who's allowed to see a document. The challenge is retrieval that stays fresh, cites its sources, respects permissions, and is actually grounded rather than guessing.",
    approach: [
      {
        title: "Retrieval that stays fresh",
        desc: "Ingestion and indexing tied to your live sources, so the assistant answers from the current document, not last quarter's copy.",
      },
      {
        title: "Citations and grounding checks",
        desc: "Every answer carries source links, and grounding evals catch the cases where the model would otherwise wander off-document.",
      },
      {
        title: "Permission-aware access",
        desc: "Retrieval respects your access controls, so an answer never leaks content the asker isn't entitled to see.",
      },
      {
        title: "Evaluation against real questions",
        desc: "Eval sets built from the questions your people actually ask, run on every change so quality is measured, not assumed.",
      },
    ],
    outcome:
      "People get a cited, current answer in seconds instead of a search expedition — grounded in the right documents, scoped to what each person is allowed to see.",
    relatedCapabilities: [
      { label: "Applied Builds", href: "/capabilities/applied-builds" },
      { label: "Data & Platform Engineering", href: "/capabilities/data-and-platform-engineering" },
      { label: "AI consulting for technology & software", href: "/ai-consulting/technology-and-software" },
    ],
  },

  {
    slug: "content-generation",
    name: "Content generation",
    h1: "AI consulting for content generation",
    title: "AI Consulting for Content Generation",
    metaDescription:
      "Applied-AI consulting for content generation: pipelines for product copy, imagery, and localization that stay on-brand and on-fact, with review built in.",
    lede: "Content pipelines that clear the backlog without going off-brand or off-fact — generation with the guardrails enterprises need.",
    problem:
      "Catalogs, campaigns, and localization create a content backlog that never empties, and the cost of fresh copy grows with every SKU and market. Raw generation is fast but risky: off-brand voice, invented claims, and inconsistent localization create more cleanup than they save. The challenge is generating at volume while staying on-brand, factually grounded, and compliant enough to publish without a human rewriting every line.",
    approach: [
      {
        title: "Brand-grounded generation",
        desc: "Pipelines tuned to your voice, style, and source-of-truth product data, so output reads like you and cites real facts.",
      },
      {
        title: "Localization at scale",
        desc: "Translation and adaptation that keep tone and claims consistent across markets, not literal strings that miss the nuance.",
      },
      {
        title: "Compliance and claim checks",
        desc: "Automated checks for prohibited claims, regulated language, and brand rules before anything reaches a publish queue.",
      },
      {
        title: "Human review where it counts",
        desc: "Editors approve and refine instead of writing from scratch — review effort focused on the high-stakes content, not every line.",
      },
    ],
    outcome:
      "The content backlog clears several times faster, with copy that stays on-brand and on-fact and an editor approving rather than rewriting.",
    relatedCapabilities: [
      { label: "Applied Builds", href: "/capabilities/applied-builds" },
      { label: "Evaluation & Safety", href: "/capabilities/evaluation-and-safety" },
      { label: "AI consulting for consumer & retail", href: "/ai-consulting/consumer-and-retail" },
    ],
  },

  {
    slug: "contract-and-policy-review",
    name: "Contract & policy review",
    h1: "AI consulting for contract and policy review",
    title: "AI Consulting for Contract & Policy Review",
    metaDescription:
      "Applied-AI consulting for contract and policy review: extract clauses, flag deviations from your playbook, and surface risk with citations — review faster, miss less.",
    lede: "Review AI that reads contracts against your playbook — surfacing the risky clauses and deviations a reviewer would otherwise hunt for.",
    problem:
      "Contract and policy review is high-volume, high-stakes, and bottlenecked on a few experienced reviewers. The risk hides in non-standard clauses and quiet deviations from your playbook, and a missed term can cost far more than the review ever did. The challenge is triage that reliably surfaces what matters, cited to the contract language, so reviewers spend their time judging rather than searching.",
    approach: [
      {
        title: "Clause extraction and classification",
        desc: "Identify and tag the clauses that matter — liability, term, indemnity, data — across varied contract formats and templates.",
      },
      {
        title: "Playbook deviation flagging",
        desc: "Compare each agreement to your standard positions and fallback ladder, flagging where it strays and by how much.",
      },
      {
        title: "Risk summaries with citations",
        desc: "A reviewer-ready summary of issues, each linked to the exact contract language, so nothing rests on the model's word alone.",
      },
      {
        title: "Reviewer-in-the-loop workflow",
        desc: "Triage that routes clean agreements through and escalates the genuinely risky ones, with the reviewer always making the call.",
      },
    ],
    outcome:
      "Reviewers move faster and miss less — non-standard terms and playbook deviations surface up front, cited to the source, instead of being found after signing.",
    relatedCapabilities: [
      { label: "Applied Builds", href: "/capabilities/applied-builds" },
      { label: "Responsible AI", href: "/capabilities/responsible-ai" },
      { label: "AI consulting for the public sector", href: "/ai-consulting/public-sector" },
    ],
  },
];

export function getUseCase(slug: string): UseCase | undefined {
  return USE_CASES.find((u) => u.slug === slug);
}

/**
 * The glossary concepts most relevant to each use case — a curated cross-cluster
 * map (use-case slug → glossary term slugs) so each use-case page links into the
 * glossary for the ideas it depends on. Values must be valid glossary slugs.
 */
export const USE_CASE_CONCEPTS: Record<string, string[]> = {
  "fraud-and-aml-detection": ["evals", "guardrails", "ai-governance"],
  "document-and-data-extraction": [
    "retrieval-augmented-generation-rag",
    "embeddings",
    "multimodal-ai",
  ],
  "customer-support-copilots": [
    "ai-agents",
    "retrieval-augmented-generation-rag",
    "guardrails",
  ],
  "demand-forecasting": ["mlops", "inference", "evals"],
  "underwriting-and-credit": ["ai-governance", "evals", "hallucination"],
  "clinical-documentation": ["multimodal-ai", "guardrails", "hallucination"],
  "predictive-maintenance": ["mlops", "inference", "evals"],
  "knowledge-retrieval-rag": [
    "retrieval-augmented-generation-rag",
    "embeddings",
    "vector-database",
  ],
  "content-generation": [
    "large-language-model",
    "prompt-engineering",
    "guardrails",
  ],
  "contract-and-policy-review": [
    "retrieval-augmented-generation-rag",
    "ai-governance",
    "hallucination",
  ],
};

/** Every use-case route (hub + detail pages), for sitemap inclusion. */
export const USE_CASE_ROUTES = [
  "/ai-consulting/use-cases",
  ...USE_CASES.map((u) => `/ai-consulting/use-cases/${u.slug}`),
];
