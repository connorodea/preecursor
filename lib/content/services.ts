/**
 * lib/content/services.ts — first-draft, on-brand content for the two
 * "Our Services" pillars: Industries and Capabilities.
 *
 * Each leaf in INDUSTRY_LEAVES / CAPABILITY_LEAVES (lib/ia.ts) has an entry
 * here, keyed by slug. The detail templates (app/industries/[slug],
 * app/capabilities/[slug]) read this via getIndustry / getCapability, which
 * fall back to an on-brand generated default for any slug not authored — so a
 * new menu leaf never breaks the static build.
 *
 * Tone: boutique applied-AI studio — a sharper, smaller BCG. Specific,
 * outcome-led, engineering-credible. Stats are illustrative first-draft figures.
 */

import { INDUSTRY_LEAVES, CAPABILITY_LEAVES, type Leaf } from "@/lib/ia";

export type Stat = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type ServiceContent = {
  slug: string;
  title: string;
  lede: string;
  /** 2–3 sentence overview. */
  overview: string;
  /** 3–4 "what we do" rows. */
  approach: { title: string; desc: string }[];
  /** Exactly 3 headline figures. */
  stats: Stat[];
  /** 2–3 cross-links to related pages. */
  related: { label: string; href: string }[];
};

/* ------------------------------------------------------------------ helpers */

const byLabel = (leaves: Leaf[], label: string): { label: string; href: string } => {
  const l = leaves.find((x) => x.label === label);
  return { label, href: l?.href ?? "/contact" };
};

const ind = (label: string) => byLabel(INDUSTRY_LEAVES, label);
const cap = (label: string) => byLabel(CAPABILITY_LEAVES, label);

/* =================================================================== INDUSTRIES */

export const industryContent: Record<string, ServiceContent> = {
  "financial-institutions": {
    slug: "financial-institutions",
    title: "AI for financial institutions",
    lede: "Underwriting copilots, fraud and AML detection, and document automation — built to pass model risk review and move regulated numbers.",
    overview:
      "Banks and lenders sit on the richest decision data in the economy, but most of it is locked in PDFs, memos, and queues. We build retrieval-grounded copilots and detection systems that compress the work behind credit, fraud, and compliance — then prove them out against the controls your second line will actually sign off on.",
    approach: [
      {
        title: "Underwriting & credit copilots",
        desc: "Agents that draft credit memos, spread financials, and surface covenant and policy exceptions — with every figure cited back to source documents.",
      },
      {
        title: "Fraud & AML detection",
        desc: "Models and case-triage workflows that lift true-positive rates on transaction monitoring while cutting the alert backlog analysts grind through.",
      },
      {
        title: "Document & KYC automation",
        desc: "Extraction and reconciliation across statements, filings, and onboarding packets, with human-in-the-loop review where the regulator expects it.",
      },
      {
        title: "Model risk & governance",
        desc: "Eval harnesses, documentation, and monitoring built to SR 11-7 expectations so models survive validation and stay in production.",
      },
    ],
    stats: [
      { value: 63, prefix: "−", suffix: "%", label: "Credit-memo cycle time" },
      { value: 2.4, decimals: 1, prefix: "+", suffix: "×", label: "AML alert precision" },
      { value: 11, prefix: "$", suffix: "M", label: "Annual ops cost removed" },
    ],
    related: [
      cap("Applied Builds"),
      cap("Responsible AI"),
      cap("Evaluation & Safety"),
    ],
  },

  insurance: {
    slug: "insurance",
    title: "AI for insurance",
    lede: "Faster, fairer claims and underwriting — from first notice of loss to bound policy — without surrendering control of the loss ratio.",
    overview:
      "Insurance runs on judgment applied at scale, and that is exactly where applied AI pays. We build systems that read submissions, triage claims, and price risk consistently — keeping adjusters and underwriters in the loop while taking the manual reading and re-keying off their desks.",
    approach: [
      {
        title: "Claims triage & automation",
        desc: "Intake agents that classify FNOL, route by severity and fraud signal, and pre-fill adjuster files from photos, estimates, and policy terms.",
      },
      {
        title: "Underwriting intelligence",
        desc: "Submission ingestion and risk scoring that gives underwriters a clean, cited view of exposure instead of a stack of broker emails.",
      },
      {
        title: "Fraud & leakage detection",
        desc: "Pattern detection across claims history and provider networks to flag leakage before payment, not in a year-end audit.",
      },
    ],
    stats: [
      { value: 41, prefix: "−", suffix: "%", label: "Claims handling time" },
      { value: 3.1, decimals: 1, prefix: "+", suffix: "pts", label: "Loss-ratio improvement" },
      { value: 90, suffix: "%", label: "Submissions auto-triaged" },
    ],
    related: [ind("Financial Institutions"), cap("Applied Builds"), cap("Responsible AI")],
  },

  "healthcare-and-life-sciences": {
    slug: "healthcare-and-life-sciences",
    title: "AI for healthcare & life sciences",
    lede: "Clinical documentation, prior authorization, and trial matching — engineered for the accuracy and audit trail care and compliance demand.",
    overview:
      "In healthcare the cost of a wrong answer is unacceptably high, so generic AI rarely makes it past pilot. We build grounded, evaluated systems for documentation, access, and research that clinicians and quality teams trust — with provenance on every claim and guardrails that hold under audit.",
    approach: [
      {
        title: "Clinical documentation",
        desc: "Ambient and structured note generation that returns time to clinicians while keeping coding, terminology, and the chart accurate.",
      },
      {
        title: "Prior authorization",
        desc: "Agents that assemble and check auth packets against payer policy, cutting turnaround and denials without removing the clinician sign-off.",
      },
      {
        title: "Trial & cohort matching",
        desc: "Retrieval over protocols and records to surface eligible patients and accelerate recruitment for sponsors and sites.",
      },
      {
        title: "Evidence & safety review",
        desc: "Eval harnesses and red-teaming tuned to clinical risk, so models are measured against the outcomes that actually matter.",
      },
    ],
    stats: [
      { value: 2, suffix: " hrs", label: "Clinician time returned per day" },
      { value: 58, prefix: "−", suffix: "%", label: "Prior-auth turnaround" },
      { value: 99.2, decimals: 1, suffix: "%", label: "Citation accuracy in eval" },
    ],
    related: [cap("Evaluation & Safety"), cap("Responsible AI"), cap("Applied Builds")],
  },

  "industrial-goods": {
    slug: "industrial-goods",
    title: "AI for industrial goods",
    lede: "Predictive maintenance, quality inspection, and engineering knowledge at hand — putting AI on the factory floor and the service truck.",
    overview:
      "Industrial operators hold decades of engineering know-how in manuals, tickets, and the heads of senior techs. We turn that into systems — predictive maintenance, visual inspection, and grounded knowledge assistants — that lift throughput and yield while making every technician perform like your best one.",
    approach: [
      {
        title: "Predictive maintenance",
        desc: "Sensor and history models that flag failures before they cost a line, with maintenance actions ranked by downtime risk.",
      },
      {
        title: "Visual quality inspection",
        desc: "Vision systems that catch defects earlier and more consistently than manual sampling, feeding root-cause back to the line.",
      },
      {
        title: "Engineering knowledge assistants",
        desc: "Retrieval over manuals, schematics, and service history so field and plant teams get a cited answer instead of a phone tree.",
      },
    ],
    stats: [
      { value: 27, prefix: "−", suffix: "%", label: "Unplanned downtime" },
      { value: 1.8, decimals: 1, prefix: "+", suffix: "pts", label: "First-pass yield" },
      { value: 4, suffix: "×", label: "Faster fault diagnosis" },
    ],
    related: [ind("Energy & Utilities"), cap("Data & Platform Engineering"), cap("Applied Builds")],
  },

  "energy-and-utilities": {
    slug: "energy-and-utilities",
    title: "AI for energy & utilities",
    lede: "Grid optimization, asset inspection, and outage response — applied AI for infrastructure where reliability is the product.",
    overview:
      "Energy and utility operators balance aging assets, volatile demand, and zero tolerance for failure. We build forecasting, inspection, and operations systems that squeeze more reliability and margin from the same network — and put a grounded answer in front of operators when minutes matter.",
    approach: [
      {
        title: "Demand & grid forecasting",
        desc: "Load and generation models that tighten dispatch and trading decisions against weather, price, and asset state.",
      },
      {
        title: "Asset inspection at scale",
        desc: "Vision over drone, satellite, and field imagery to find vegetation, corrosion, and damage before it becomes an outage.",
      },
      {
        title: "Outage & field operations",
        desc: "Agents that triage events, draft restoration plans, and equip crews with the right cited procedure on site.",
      },
    ],
    stats: [
      { value: 18, prefix: "−", suffix: "%", label: "Forecast error (MAPE)" },
      { value: 35, prefix: "−", suffix: "%", label: "Inspection cost per mile" },
      { value: 22, prefix: "−", suffix: "min", label: "Mean time to restore" },
    ],
    related: [ind("Industrial Goods"), cap("Data & Platform Engineering"), cap("MLOps & Scale")],
  },

  "consumer-and-retail": {
    slug: "consumer-and-retail",
    title: "AI for consumer & retail",
    lede: "Merchandising, demand planning, and customer experience that compound — applied AI tuned to margin, not vanity metrics.",
    overview:
      "Retail and consumer brands live and die on assortment, price, and service at scale. We build forecasting, content, and conversational systems that move the unit economics — sharper demand plans, faster content, and support that resolves instead of deflects.",
    approach: [
      {
        title: "Demand & assortment planning",
        desc: "Forecasting and allocation models that cut markdowns and stock-outs across SKUs, stores, and channels.",
      },
      {
        title: "Content & merchandising automation",
        desc: "Generation pipelines for product copy, imagery, and localization that keep catalogs fresh without a content backlog.",
      },
      {
        title: "Conversational customer experience",
        desc: "Grounded support and shopping agents that resolve on first contact and hand off cleanly when they should.",
      },
    ],
    stats: [
      { value: 24, prefix: "−", suffix: "%", label: "Markdown rate" },
      { value: 6, suffix: "×", label: "Faster catalog content" },
      { value: 38, prefix: "+", suffix: "%", label: "Self-serve resolution" },
    ],
    related: [ind("Technology & Software"), cap("Applied Builds"), cap("Agentic Systems")],
  },

  "technology-and-software": {
    slug: "technology-and-software",
    title: "AI for technology & software",
    lede: "Ship AI features that survive real users — copilots, agents, and eval-backed quality from prototype to scale.",
    overview:
      "Software companies do not need to be told AI matters; they need it shipped well. We embed with product and engineering teams to take AI features from demo to durable — copilots and agents that hold up under load, behind eval harnesses and cost controls that keep them shippable.",
    approach: [
      {
        title: "Product copilots & agents",
        desc: "In-product AI that does real work for users, scoped and built so it ships behind your roadmap, not around it.",
      },
      {
        title: "Eval & quality engineering",
        desc: "Offline and online evals, regression suites, and guardrails that let you change models and prompts without breaking trust.",
      },
      {
        title: "Inference cost & scale",
        desc: "Routing, caching, and model selection that hold latency and unit cost in line as usage grows.",
      },
    ],
    stats: [
      { value: 3, suffix: "×", label: "Faster feature-to-prod" },
      { value: 52, prefix: "−", suffix: "%", label: "Inference cost per request" },
      { value: 4.8, decimals: 1, suffix: "/5", label: "Feature satisfaction" },
    ],
    related: [cap("Applied Builds"), cap("Agentic Systems"), cap("Evaluation & Safety")],
  },

  "private-equity": {
    slug: "private-equity",
    title: "AI for private equity",
    lede: "Diligence at deal speed and value creation across the portfolio — applied AI as an edge in sourcing, underwriting, and the hold.",
    overview:
      "For sponsors, AI is both a diligence lens and a value-creation lever. We accelerate the read on a target and then operationalize AI inside portfolio companies — turning a thesis slide into shipped systems that show up in the next set of numbers.",
    approach: [
      {
        title: "AI-accelerated diligence",
        desc: "Rapid synthesis of data rooms, market signals, and technology posture so deal teams reach conviction faster and with receipts.",
      },
      {
        title: "Portfolio value creation",
        desc: "100-day AI playbooks that prioritize the builds with the clearest path to EBITDA across the portfolio.",
      },
      {
        title: "AI readiness & risk review",
        desc: "Independent assessment of a target's data, models, and AI risk so what you buy is what you think you bought.",
      },
    ],
    stats: [
      { value: 70, prefix: "−", suffix: "%", label: "Diligence reading time" },
      { value: 100, suffix: "-day", label: "Value-creation playbook" },
      { value: 5, prefix: "+", suffix: " pts", label: "Margin lever identified" },
    ],
    related: [ind("Financial Institutions"), cap("AI Strategy & Diagnostics"), cap("Applied Builds")],
  },

  "public-sector": {
    slug: "public-sector",
    title: "AI for the public sector",
    lede: "Constituent services, casework, and document automation built for transparency, accountability, and public trust.",
    overview:
      "Public agencies carry enormous caseloads under intense scrutiny — which makes grounded, auditable AI exactly the right tool and the wrong place for hype. We build constituent-facing and back-office systems that cut backlogs while keeping a clear, defensible record of how every answer was reached.",
    approach: [
      {
        title: "Constituent services",
        desc: "Grounded assistants that answer in plain language across programs and channels, with escalation paths that respect due process.",
      },
      {
        title: "Casework & document automation",
        desc: "Extraction, summarization, and drafting that move benefits and permitting queues without sacrificing the audit trail.",
      },
      {
        title: "Transparency & accountability",
        desc: "Provenance, logging, and bias review designed for FOIA, oversight, and public confidence from day one.",
      },
    ],
    stats: [
      { value: 47, prefix: "−", suffix: "%", label: "Case backlog" },
      { value: 100, suffix: "%", label: "Answers traced to source" },
      { value: 3.5, decimals: 1, suffix: "×", label: "Throughput per caseworker" },
    ],
    related: [cap("Responsible AI"), cap("Evaluation & Safety"), cap("Applied Builds")],
  },

  telecommunications: {
    slug: "telecommunications",
    title: "AI for telecommunications",
    lede: "Network operations, customer care, and revenue assurance — applied AI for businesses that run at carrier scale.",
    overview:
      "Telcos generate oceans of network and customer data and feel every point of churn and downtime. We build operations and care systems that turn that data into fewer truck rolls, shorter handle times, and revenue that stops leaking.",
    approach: [
      {
        title: "Network operations & assurance",
        desc: "Anomaly detection and root-cause agents that catch degradation early and cut the noise in the NOC.",
      },
      {
        title: "Customer care automation",
        desc: "Grounded care agents that resolve common issues end-to-end and brief human agents on the rest.",
      },
      {
        title: "Revenue & churn intelligence",
        desc: "Models that find leakage and at-risk accounts in time to act, not in the post-mortem.",
      },
    ],
    stats: [
      { value: 31, prefix: "−", suffix: "%", label: "Truck rolls" },
      { value: 26, prefix: "−", suffix: "%", label: "Average handle time" },
      { value: 2.2, decimals: 1, prefix: "+", suffix: "pts", label: "Churn-save rate" },
    ],
    related: [ind("Technology & Software"), cap("Agentic Systems"), cap("MLOps & Scale")],
  },

  "transportation-and-logistics": {
    slug: "transportation-and-logistics",
    title: "AI for transportation & logistics",
    lede: "Routing, demand forecasting, and exception handling — applied AI that turns network complexity into margin.",
    overview:
      "Logistics is an optimization problem under constant disruption, and that is where AI earns its keep. We build forecasting, planning, and exception-handling systems that tighten networks, automate the back-and-forth of disruptions, and put the right answer in the dispatcher's hands.",
    approach: [
      {
        title: "Demand & capacity forecasting",
        desc: "Volume and capacity models that plan fleets, labor, and space against real demand instead of last year's average.",
      },
      {
        title: "Routing & network optimization",
        desc: "Optimization that cuts empty miles and dwell time across lanes, hubs, and last mile.",
      },
      {
        title: "Exception & document automation",
        desc: "Agents that handle delays, claims, and customs paperwork end-to-end, escalating only the genuine edge cases.",
      },
    ],
    stats: [
      { value: 14, prefix: "−", suffix: "%", label: "Cost per shipment" },
      { value: 19, prefix: "−", suffix: "%", label: "Empty miles" },
      { value: 80, suffix: "%", label: "Exceptions auto-resolved" },
    ],
    related: [ind("Industrial Goods"), cap("Data & Platform Engineering"), cap("Agentic Systems")],
  },

  "travel-and-hospitality": {
    slug: "travel-and-hospitality",
    title: "AI for travel & hospitality",
    lede: "Personalization, dynamic pricing, and service automation that lift revenue per guest without losing the human touch.",
    overview:
      "Travel and hospitality brands compete on experience and yield at the same time. We build personalization, pricing, and service systems that raise revenue per guest and resolve requests instantly — while keeping the experience unmistakably yours.",
    approach: [
      {
        title: "Guest personalization",
        desc: "Recommendation and offer systems that tailor the journey across booking, stay, and re-engagement.",
      },
      {
        title: "Dynamic pricing & revenue",
        desc: "Demand-aware pricing across rooms, seats, and ancillaries to lift yield without eroding loyalty.",
      },
      {
        title: "Service automation",
        desc: "Grounded concierge and support agents that resolve guest requests in seconds and hand off gracefully.",
      },
    ],
    stats: [
      { value: 9, prefix: "+", suffix: "%", label: "Revenue per guest" },
      { value: 33, prefix: "+", suffix: "%", label: "Direct-booking conversion" },
      { value: 60, suffix: "%", label: "Requests auto-resolved" },
    ],
    related: [ind("Consumer & Retail"), cap("Applied Builds"), cap("Agentic Systems")],
  },
};

/* ================================================================ CAPABILITIES */

export const capabilityContent: Record<string, ServiceContent> = {
  "ai-strategy-and-diagnostics": {
    slug: "ai-strategy-and-diagnostics",
    title: "AI strategy & diagnostics",
    lede: "Opportunity portfolios, value modeling, and feasibility — the diagnostic that tells you what to build, what to skip, and what it's worth.",
    overview:
      "Most AI roadmaps are wish lists, not plans. We run a sharp diagnostic across your data, workflows, and economics to produce a ranked portfolio of opportunities — each one value-modeled and feasibility-tested — so the first build is the one with the clearest payback.",
    approach: [
      {
        title: "Opportunity portfolio",
        desc: "A ranked map of AI use cases across the business, scored on value, feasibility, and time-to-impact.",
      },
      {
        title: "Value modeling",
        desc: "Bottom-up economics on each opportunity, tied to the operational metric and the P&L line it moves.",
      },
      {
        title: "Feasibility & readiness",
        desc: "A clear read on data, tooling, and risk — what is buildable now versus what needs groundwork first.",
      },
      {
        title: "Sequenced roadmap",
        desc: "A delivery plan that lands an early win and builds the platform the later bets depend on.",
      },
    ],
    stats: [
      { value: 6, suffix: " wks", label: "From kickoff to roadmap" },
      { value: 30, prefix: "+", label: "Use cases assessed" },
      { value: 3, suffix: "×", label: "ROI on first build target" },
    ],
    related: [cap("Applied Builds"), ind("Private Equity"), cap("Change & Enablement")],
  },

  "applied-builds": {
    slug: "applied-builds",
    title: "Applied builds",
    lede: "Agents, retrieval, and eval harnesses — production AI systems shipped by engineers who own the outcome, not a slide.",
    overview:
      "This is the core of the studio: we build the system, not the deck. Our engineers ship retrieval pipelines, agents, and the eval harnesses that keep them honest — production-grade from the first sprint, instrumented so you can see exactly what it is doing and what it is worth.",
    approach: [
      {
        title: "Retrieval & grounding",
        desc: "RAG pipelines that put your own data behind every answer, with citations and freshness you can trust.",
      },
      {
        title: "Agents & workflows",
        desc: "Tool-using agents that complete real multi-step work, scoped to fail safely and escalate when unsure.",
      },
      {
        title: "Eval harnesses",
        desc: "Task-level evals and regression suites so quality is measured, not asserted — and stays measured as models change.",
      },
      {
        title: "Production hardening",
        desc: "Latency, cost, observability, and rollback built in from the start, so the prototype is already the foundation.",
      },
    ],
    stats: [
      { value: 8, suffix: " wks", label: "Prototype to production" },
      { value: 95, suffix: "%", label: "Eval pass before launch" },
      { value: 99.9, decimals: 1, suffix: "%", label: "Production uptime target" },
    ],
    related: [cap("Agentic Systems"), cap("Evaluation & Safety"), cap("MLOps & Scale")],
  },

  "agentic-systems": {
    slug: "agentic-systems",
    title: "Agentic systems",
    lede: "Multi-step, tool-using agents that do real work — designed to be reliable, observable, and safe to put in front of a customer.",
    overview:
      "Agents are where most AI projects either break through or fall over. We design agentic systems that complete genuine multi-step work — with the orchestration, guardrails, and observability that make them dependable enough to trust in production rather than impressive only in a demo.",
    approach: [
      {
        title: "Orchestration & planning",
        desc: "Agent and tool architectures that decompose work reliably and recover when a step fails.",
      },
      {
        title: "Tooling & integration",
        desc: "Clean, permissioned tool surfaces so agents act on your systems within tight, auditable boundaries.",
      },
      {
        title: "Reliability & observability",
        desc: "Tracing, replay, and guardrails that turn opaque agent runs into systems you can debug and govern.",
      },
    ],
    stats: [
      { value: 85, suffix: "%", label: "Tasks completed end-to-end" },
      { value: 5, suffix: "×", label: "Throughput per operator" },
      { value: 100, suffix: "%", label: "Agent actions traced" },
    ],
    related: [cap("Applied Builds"), cap("Evaluation & Safety"), cap("MLOps & Scale")],
  },

  "data-and-platform-engineering": {
    slug: "data-and-platform-engineering",
    title: "Data & platform engineering",
    lede: "The pipelines, retrieval, and infrastructure AI actually runs on — built once, properly, so every model after it goes faster.",
    overview:
      "AI is only as good as the data and platform beneath it. We build the pipelines, vector and feature stores, and serving infrastructure that turn scattered data into a reliable substrate — so the first system ships sooner and every system after it ships faster.",
    approach: [
      {
        title: "Data pipelines & quality",
        desc: "Ingestion, transformation, and quality checks that make your data trustworthy enough to build on.",
      },
      {
        title: "Retrieval infrastructure",
        desc: "Vector, search, and feature stores designed for grounded, low-latency retrieval at production scale.",
      },
      {
        title: "Serving & integration",
        desc: "Model serving, gateways, and APIs that slot AI into your existing systems without a rebuild.",
      },
    ],
    stats: [
      { value: 50, prefix: "−", suffix: "%", label: "Time-to-first-model" },
      { value: 10, suffix: "×", label: "Retrieval scale headroom" },
      { value: 40, prefix: "−", suffix: "%", label: "Data-prep effort per project" },
    ],
    related: [cap("MLOps & Scale"), cap("Applied Builds"), ind("Technology & Software")],
  },

  "evaluation-and-safety": {
    slug: "evaluation-and-safety",
    title: "Evaluation & safety",
    lede: "Eval harnesses, red-teaming, and guardrails — the discipline that lets you ship AI you can actually stand behind.",
    overview:
      "You cannot improve or trust what you do not measure. We build the eval harnesses, red-team suites, and guardrails that turn AI quality from a gut feel into a number you can track — and catch the failure modes before your users do.",
    approach: [
      {
        title: "Eval harness design",
        desc: "Task-level and end-to-end evals that score the behaviors that matter, run in CI on every change.",
      },
      {
        title: "Red-teaming & adversarial testing",
        desc: "Structured probing for jailbreaks, hallucination, and edge cases, mapped to real-world risk.",
      },
      {
        title: "Guardrails & monitoring",
        desc: "Input/output guards and live monitoring that keep production behavior inside the lines you set.",
      },
    ],
    stats: [
      { value: 100, prefix: "+", label: "Eval cases per system" },
      { value: 70, prefix: "−", suffix: "%", label: "Hallucination rate" },
      { value: 24, suffix: "/7", label: "Behavioral monitoring" },
    ],
    related: [cap("Responsible AI"), cap("Applied Builds"), cap("Agentic Systems")],
  },

  "mlops-and-scale": {
    slug: "mlops-and-scale",
    title: "MLOps & scale",
    lede: "Deployment, monitoring, and cost control that keep AI fast and affordable as usage grows — operations, not heroics.",
    overview:
      "Getting an AI system live is the easy half; keeping it fast, cheap, and reliable under real load is where teams burn out. We put the deployment pipelines, monitoring, and cost controls in place so your AI scales as operations, not as a series of late-night saves.",
    approach: [
      {
        title: "Deployment & CI/CD",
        desc: "Repeatable pipelines for models, prompts, and configs so changes ship safely and roll back cleanly.",
      },
      {
        title: "Monitoring & observability",
        desc: "Quality, latency, drift, and cost dashboards that tell you something is wrong before a customer does.",
      },
      {
        title: "Cost & performance",
        desc: "Routing, caching, and model selection that hold unit economics steady as volume climbs.",
      },
    ],
    stats: [
      { value: 55, prefix: "−", suffix: "%", label: "Inference cost at scale" },
      { value: 99.9, decimals: 1, suffix: "%", label: "Uptime sustained" },
      { value: 10, suffix: "×", label: "Volume headroom" },
    ],
    related: [cap("Data & Platform Engineering"), cap("Applied Builds"), cap("Evaluation & Safety")],
  },

  "change-and-enablement": {
    slug: "change-and-enablement",
    title: "Change & enablement",
    lede: "Adoption, workflow redesign, and capability building — because a shipped system only pays if people actually use it.",
    overview:
      "The hardest part of AI is rarely the model; it is getting an organization to work differently. We redesign the workflows around the system and build the skills and trust so adoption sticks — turning a launched tool into measurable change on the ground.",
    approach: [
      {
        title: "Workflow redesign",
        desc: "Reworking the process around the AI so the gains are real, not absorbed by old habits and workarounds.",
      },
      {
        title: "Adoption & change management",
        desc: "Rollout, incentives, and feedback loops that move teams from skeptical to dependent on the new way.",
      },
      {
        title: "Capability building",
        desc: "Hands-on enablement so your people can run, extend, and trust the systems after we hand them over.",
      },
    ],
    stats: [
      { value: 85, suffix: "%", label: "Active adoption at 90 days" },
      { value: 3, suffix: "×", label: "Realized vs. projected value" },
      { value: 40, prefix: "+", label: "Practitioners enabled" },
    ],
    related: [cap("AI Strategy & Diagnostics"), cap("Responsible AI"), cap("Applied Builds")],
  },

  "responsible-ai": {
    slug: "responsible-ai",
    title: "Responsible AI",
    lede: "Governance, fairness, and risk controls built into the system from day one — not bolted on after the audit.",
    overview:
      "Responsible AI is not a compliance afterthought; it is what lets you deploy at all in a regulated, scrutinized world. We build governance, fairness testing, and risk controls directly into how systems are designed and run — so trust and accountability are engineered in, not retrofitted.",
    approach: [
      {
        title: "Governance & policy",
        desc: "Practical frameworks, model documentation, and approval workflows that satisfy oversight without stalling delivery.",
      },
      {
        title: "Fairness & bias testing",
        desc: "Measurement and mitigation across protected groups, baked into the eval suite rather than a one-off review.",
      },
      {
        title: "Risk & compliance controls",
        desc: "Provenance, audit trails, and controls mapped to your regulatory obligations and the EU AI Act risk tiers.",
      },
    ],
    stats: [
      { value: 100, suffix: "%", label: "Decisions auditable" },
      { value: 0, label: "Material findings target" },
      { value: 4, prefix: "<", suffix: " wks", label: "To audit-ready" },
    ],
    related: [cap("Evaluation & Safety"), ind("Financial Institutions"), ind("Public Sector")],
  },
};

/* ====================================================================== getters */

/** On-brand default so any unauthored slug still renders a real page. */
function fallback(slug: string, kind: "Industry" | "Capability"): ServiceContent {
  const leaves = kind === "Industry" ? INDUSTRY_LEAVES : CAPABILITY_LEAVES;
  const label = leaves.find((l) => l.slug === slug)?.label ??
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  if (kind === "Industry") {
    return {
      slug,
      title: `AI for ${label.toLowerCase()}`,
      lede: `Applied AI for ${label.toLowerCase()} — built where it changes the numbers, by engineers who ship and own the outcome.`,
      overview: `We pair sector judgment with production engineering to put AI to work in ${label.toLowerCase()} where it moves a metric leadership already tracks. Every engagement starts from your data and workflows and ends in a system in production — measured, governed, and owned by your team.`,
      approach: [
        { title: "Diagnose the opportunity", desc: `A ranked read on where AI earns its place in ${label.toLowerCase()}, scored on value and feasibility.` },
        { title: "Build the system", desc: "Production-grade retrieval, agents, and evals shipped in weeks, not quarters." },
        { title: "Prove and scale", desc: "Measured against the numbers you agreed to move, then hardened for everyday operations." },
      ],
      stats: [
        { value: 3, suffix: "×", label: "Faster from idea to production" },
        { value: 40, prefix: "−", suffix: "%", label: "Manual effort removed" },
        { value: 90, suffix: "%", label: "Decisions traced to source" },
      ],
      related: [cap("AI Strategy & Diagnostics"), cap("Applied Builds"), cap("Responsible AI")],
    };
  }

  return {
    slug,
    title: label,
    lede: `${label} — a core discipline we bring to every engagement, from first diagnostic to production scale.`,
    overview: `${label} is part of how we take AI from idea to dependable system. We bring it to bear with the same standard as the rest of the studio: production-grade, measured, and owned by your team when we hand it over.`,
    approach: [
      { title: "Scope it sharply", desc: `We define ${label.toLowerCase()} against the outcome it needs to support, not a generic checklist.` },
      { title: "Build it to last", desc: "Production-grade from the first sprint, instrumented so you can see what it does and what it is worth." },
      { title: "Hand it over", desc: "Documented and enabled so your team can run and extend it without us." },
    ],
    stats: [
      { value: 8, suffix: " wks", label: "Typical time to production" },
      { value: 95, suffix: "%", label: "Eval pass before launch" },
      { value: 3, suffix: "×", label: "Realized value vs. baseline" },
    ],
    related: [cap("Applied Builds"), cap("Evaluation & Safety"), cap("AI Strategy & Diagnostics")],
  };
}

export function getIndustry(slug: string): ServiceContent {
  return industryContent[slug] ?? fallback(slug, "Industry");
}

export function getCapability(slug: string): ServiceContent {
  return capabilityContent[slug] ?? fallback(slug, "Capability");
}

/** Short blurb for hub-page cards — first sentence of the overview, trimmed. */
export function cardBlurb(c: ServiceContent): string {
  const first = c.overview.split(/(?<=[.!?])\s/)[0] ?? c.overview;
  return first.length > 140 ? `${first.slice(0, 137).trimEnd()}…` : first;
}
