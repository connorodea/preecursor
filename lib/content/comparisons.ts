/**
 * Comparison pSEO cluster — bottom-funnel "X vs Y" pages that match the
 * boutique-vs-big-firm positioning.
 *
 * FRAMING (legal/quality): these are honest *category* comparisons. They
 * describe Preecursor's model versus a generic alternative model (e.g. "the
 * large-generalist-firm model", "buying off-the-shelf"), and they openly
 * acknowledge when the other option is the right call. They do NOT name or
 * make unverifiable claims about specific competitor firms. Every page carries
 * a real comparison table and a balanced verdict, so none is thin.
 *
 *   /compare            — hub of all comparisons
 *   /compare/[slug]     — one comparison, with table + verdict
 */

export type ComparisonOption = {
  /** Short label used in the table column header and prose. */
  name: string;
  /** One-line characterization of the option (category-level, not a firm). */
  summary: string;
};

export type ComparisonRow = {
  /** The dimension being compared (table row label). */
  dimension: string;
  /** How option A handles this dimension. */
  a: string;
  /** How option B handles this dimension. */
  b: string;
};

export type Comparison = {
  slug: string;
  title: string; // <title>
  h1: string;
  metaDescription: string;
  optionA: ComparisonOption;
  optionB: ComparisonOption;
  /** Intro paragraph framing the choice honestly. */
  intro: string;
  /** 5–7 comparison-table rows. */
  rows: ComparisonRow[];
  /** Honest "when each wins" verdict (multi-sentence prose). */
  verdict: string;
  /** Related cross-links rendered as cards. */
  related: { label: string; href: string }[];
};

export const COMPARISONS: Comparison[] = [
  {
    slug: "boutique-vs-big-firm-ai-consulting",
    title: "Boutique vs Big-Firm AI Consulting — How to Choose",
    h1: "Boutique vs big-firm AI consulting",
    metaDescription:
      "An honest comparison of boutique applied-AI studios and large generalist consulting firms: team seniority, speed to production, cost model, and when each is the right call.",
    optionA: {
      name: "Boutique AI studio",
      summary:
        "A small, senior team that pairs strategy with the engineers who ship the system — Preecursor's model.",
    },
    optionB: {
      name: "Large generalist firm",
      summary:
        "A broad consultancy with deep benches, established procurement, and wide service lines across many practices.",
    },
    intro:
      "\"Boutique\" and \"big firm\" aren't good or bad — they're different shapes of risk. Large generalist firms bring scale, brand assurance, and the ability to staff a hundred-person program across geographies; that's genuinely valuable for some mandates. A boutique applied-AI studio trades breadth for depth: a small senior team, strategy and engineering in one room, and a shorter path from idea to a system in production. This page lays out the real trade-offs so you can match the shape to the work in front of you.",
    rows: [
      {
        dimension: "Who does the work",
        a: "The senior people you met in the pitch are the ones building. No junior bench between you and the work.",
        b: "Partners scope and oversee; delivery often runs through larger, more junior teams. Quality is managed through process.",
      },
      {
        dimension: "Strategy-to-build handoff",
        a: "One continuous engagement — the strategists are the engineers, so nothing is lost in translation.",
        b: "Strategy and implementation are frequently separate workstreams or vendors, with a deliberate handoff between them.",
      },
      {
        dimension: "Speed to a live system",
        a: "Optimized for shipping; a first production deployment is often measured in weeks.",
        b: "Longer ramp by design — broader stakeholder alignment, formal stage gates, and larger teams to coordinate.",
      },
      {
        dimension: "Breadth of coverage",
        a: "Narrow and deep: applied AI and the data/platform work around it. Out-of-scope work is referred out.",
        b: "Very broad: change management, large-scale systems integration, and global rollout under one roof.",
      },
      {
        dimension: "Cost structure",
        a: "Lean team, less overhead; you pay for builders, not a pyramid. Smaller total contract size.",
        b: "Higher day rates and program overhead, justified for large, multi-stream transformations.",
      },
      {
        dimension: "Best-fit mandate",
        a: "A focused, high-leverage AI capability you need shipped and proven against a metric.",
        b: "An enterprise-wide transformation needing scale, global staffing, and board-level brand assurance.",
      },
    ],
    verdict:
      "Choose a large generalist firm when the mandate is genuinely enterprise-wide — when you need hundreds of people across regions, heavy change management, and the procurement and brand assurance a big name provides. Choose a boutique applied-AI studio when you have a specific, high-value AI capability that needs to ship and prove itself fast, and you'd rather work directly with the people building it. Many organizations use both: a big firm for the broad program, a boutique for the AI system at its core. The honest test is whether your problem needs breadth or depth right now.",
    related: [
      { label: "Strategy deck vs shipped system", href: "/compare/strategy-deck-vs-shipped-system" },
      { label: "AI consulting vs traditional IT consulting", href: "/compare/ai-consulting-vs-traditional-it-consulting" },
    ],
  },

  {
    slug: "build-vs-buy-ai",
    title: "Build vs Buy AI — A Practical Decision Framework",
    h1: "Build vs buy for AI capabilities",
    metaDescription:
      "When should you build a custom AI system versus buy an off-the-shelf product? An honest comparison of control, speed, cost, and defensibility — and when buying is the smarter move.",
    optionA: {
      name: "Build custom",
      summary:
        "A system built around your data, workflows, and accuracy bar — owned and improved by your team.",
    },
    optionB: {
      name: "Buy off-the-shelf",
      summary:
        "A vendor product or API you configure and adopt, with the roadmap and model owned by the vendor.",
    },
    intro:
      "Build-vs-buy is rarely all-or-nothing, and \"buy\" is often the right answer. If a mature product already solves your problem at the accuracy you need, building from scratch wastes time and money. Building earns its keep only when the capability is close to your core advantage, your data or workflow is genuinely distinctive, or no product fits your accuracy and compliance bar. This page frames the trade-off honestly — and most real architectures end up a blend: buy the commodity layers, build the part that differentiates you.",
    rows: [
      {
        dimension: "Time to first value",
        a: "Slower to start — you're creating the system — but the build is sequenced to a usable slice early.",
        b: "Fast: a configured product can be live in days for well-trodden use cases.",
      },
      {
        dimension: "Fit to your workflow",
        a: "Shaped exactly to your data, edge cases, and accuracy bar.",
        b: "Fits the vendor's model of the problem; you adapt your process to the product's assumptions.",
      },
      {
        dimension: "Ongoing cost shape",
        a: "Higher upfront engineering; lower marginal cost and no per-seat lock-in at scale.",
        b: "Low upfront; recurring license/usage fees that can grow with seats or volume.",
      },
      {
        dimension: "Control & data",
        a: "You own the code, the data path, and the model choices — important for regulated or sensitive data.",
        b: "Data and roadmap are governed by the vendor's terms, security posture, and release cadence.",
      },
      {
        dimension: "Defensibility",
        a: "Can become a durable advantage when it's built on data only you have.",
        b: "Available to competitors too — parity, not edge, on the commodity capability.",
      },
      {
        dimension: "Best-fit situation",
        a: "Core to your advantage, distinctive data/workflow, or no product meets your bar.",
        b: "A solved, commodity problem where a mature product already clears your accuracy bar.",
      },
    ],
    verdict:
      "Buy when the capability is a solved commodity and a mature product already meets your accuracy and compliance bar — building it yourself would be reinventing the wheel. Build when the capability is close to your core advantage, your data or workflow is distinctive, or nothing on the market clears your bar. The strongest answer is usually hybrid: buy the undifferentiated layers (models, vector stores, observability) and build the thin slice that's actually yours. Preecursor's bias is to help you avoid building what you can buy — and to build well the part that earns it.",
    related: [
      { label: "In-house team vs AI consultancy", href: "/compare/in-house-team-vs-ai-consultancy" },
      { label: "Generalist vs specialist AI consulting", href: "/compare/generalist-vs-specialist-ai-consulting" },
    ],
  },

  {
    slug: "in-house-team-vs-ai-consultancy",
    title: "In-House AI Team vs AI Consultancy — Which First?",
    h1: "In-house AI team vs an AI consultancy",
    metaDescription:
      "Hire and build an in-house AI team, or engage an AI consultancy? An honest comparison of speed, hiring risk, cost, and capability transfer — and why it's usually a sequence, not a choice.",
    optionA: {
      name: "In-house team",
      summary:
        "Full-time AI engineers and data scientists you hire, who own the roadmap and accrue institutional knowledge.",
    },
    optionB: {
      name: "AI consultancy",
      summary:
        "An external team you engage to diagnose, build, and ship — with capability transfer as the goal.",
    },
    intro:
      "This is usually a question of sequence, not a permanent either/or. A strong in-house team is the right long-term home for AI that's core to your business — they live in the domain and compound knowledge over years. But building that team takes 6–12 months of hiring in a competitive market, and they need something real to work on from day one. A consultancy can ship the first systems and de-risk the roadmap while you hire — and the best engagements are explicitly designed to hand the work to your people.",
    rows: [
      {
        dimension: "Time to start delivering",
        a: "Months — sourcing, interviewing, and onboarding senior AI talent before the first line of production code.",
        b: "Days to weeks — a senior team that's shipped before starts on the actual problem immediately.",
      },
      {
        dimension: "Hiring & ramp risk",
        a: "High in a competitive market; a wrong senior hire is costly and slow to unwind.",
        b: "Low — you engage a proven team and can scale the engagement up or down.",
      },
      {
        dimension: "Long-term ownership",
        a: "Strong — the team lives in your domain and compounds institutional knowledge over years.",
        b: "By design temporary; the goal is to transfer the capability, not to become a dependency.",
      },
      {
        dimension: "Cost over time",
        a: "Fixed salaries, benefits, and tooling regardless of project load; cheaper per-hour at steady state.",
        b: "Higher rate but only for the engagement window; no long-term fixed cost.",
      },
      {
        dimension: "Breadth of patterns seen",
        a: "Deep in your domain, but exposed to fewer architectures and failure modes.",
        b: "Has shipped many AI systems across contexts, so brings hard-won patterns and avoids known traps.",
      },
      {
        dimension: "Best-fit situation",
        a: "AI is core, durable, and you can hire ahead of the work.",
        b: "You need results now, are de-risking the roadmap, or are building the in-house team in parallel.",
      },
    ],
    verdict:
      "An in-house team is the right long-term home when AI is core to your business and you can afford the months it takes to hire well — nothing beats people who live in your domain. A consultancy wins when you need results before a team exists, want to de-risk the roadmap before committing headcount, or want the first systems shipped while you hire. The most common winning play is both in sequence: bring in a consultancy to ship the early systems and prove the roadmap, with capability transfer written into the engagement, then hand the running systems to the in-house team you built in parallel. The wrong move is engaging a partner who's incentivized to make you dependent.",
    related: [
      { label: "Boutique vs big-firm AI consulting", href: "/compare/boutique-vs-big-firm-ai-consulting" },
      { label: "Build vs buy for AI", href: "/compare/build-vs-buy-ai" },
    ],
  },

  {
    slug: "ai-consulting-vs-traditional-it-consulting",
    title: "AI Consulting vs Traditional IT Consulting — The Difference",
    h1: "AI consulting vs traditional IT consulting",
    metaDescription:
      "How applied-AI consulting differs from traditional IT consulting and staff augmentation: the unit of work, how success is measured, the team shape, and when each model fits.",
    optionA: {
      name: "Applied-AI consulting",
      summary:
        "Senior teams that build and ship AI systems measured against a business metric they agreed to move.",
    },
    optionB: {
      name: "Traditional IT consulting",
      summary:
        "Established practices for systems integration, ERP, and staff augmentation built around stable requirements.",
    },
    intro:
      "Traditional IT consulting is mature for good reason — for stable, well-specified systems (an ERP rollout, a migration, a defined integration) its requirements-then-deliver model and staff-augmentation muscle work well. Applied-AI work is a different animal: outcomes are probabilistic, the right approach is found by experiment, and success is a moved metric rather than a completed checklist. This compares the two models honestly so you don't apply a fixed-scope playbook to a problem that needs an experimental one — or vice versa.",
    rows: [
      {
        dimension: "Nature of the problem",
        a: "Probabilistic — accuracy, evaluation, and edge cases matter; the answer is found by experiment.",
        b: "Deterministic — well-specified requirements with a known correct implementation.",
      },
      {
        dimension: "Unit of work",
        a: "A working AI capability instrumented to prove value in production.",
        b: "A defined deliverable against a fixed spec — a migration, integration, or staffed role.",
      },
      {
        dimension: "How success is measured",
        a: "A business metric agreed up front actually moves.",
        b: "On-time, on-budget delivery against the agreed requirements.",
      },
      {
        dimension: "Team shape",
        a: "Small senior team spanning strategy, ML/AI engineering, and data — same people throughout.",
        b: "Larger blended teams; project managers, analysts, and engineers in defined roles.",
      },
      {
        dimension: "Evaluation & iteration",
        a: "Evaluation harnesses and monitoring are first-class; systems improve after launch.",
        b: "Testing against the spec; less emphasis on continuous post-launch model iteration.",
      },
      {
        dimension: "Best-fit situation",
        a: "Putting AI into production where outcomes are uncertain and need to be proven.",
        b: "Stable, well-understood systems work with clear, fixed requirements.",
      },
    ],
    verdict:
      "Traditional IT consulting is the right tool when requirements are stable and the implementation is known — ERP rollouts, migrations, and integrations reward its disciplined, fixed-scope approach, and there's no reason to overcomplicate it. Applied-AI consulting fits when outcomes are probabilistic and the path is found by experiment, where what matters is whether a metric moves rather than whether a checklist is complete. Trouble comes from a mismatch: running an experimental AI build under a rigid fixed-bid spec, or treating a routine integration as an open-ended research project. Pick the model that matches the nature of the problem.",
    related: [
      { label: "Strategy deck vs shipped system", href: "/compare/strategy-deck-vs-shipped-system" },
      { label: "Boutique vs big-firm AI consulting", href: "/compare/boutique-vs-big-firm-ai-consulting" },
    ],
  },

  {
    slug: "generalist-vs-specialist-ai-consulting",
    title: "Generalist vs Specialist AI Consulting — Which Fits",
    h1: "Generalist vs specialist AI consulting",
    metaDescription:
      "Should you hire a generalist consultancy or an AI specialist? An honest comparison of depth, range, risk, and cost — and when a broad partner is genuinely the better choice.",
    optionA: {
      name: "AI specialist",
      summary:
        "A focused team whose whole practice is applied AI — depth in models, evaluation, and production patterns.",
    },
    optionB: {
      name: "Generalist consultancy",
      summary:
        "A broad firm covering many disciplines, with AI as one practice among strategy, operations, and IT.",
    },
    intro:
      "Generalists and specialists each win in different situations. A generalist consultancy is the right partner when AI is one thread in a larger program — when you need it woven into operating-model change, org design, and a dozen other workstreams a broad firm coordinates well. A specialist earns its keep when the AI itself is the hard part: where model choice, evaluation rigor, and production reliability decide success or failure. This page compares the two honestly so you can tell which kind of hard your problem actually is.",
    rows: [
      {
        dimension: "Depth in AI",
        a: "Deep — current on models, evaluation methods, and the failure modes of production AI.",
        b: "Competent and broad; AI is one of many practices rather than the entire focus.",
      },
      {
        dimension: "Range across disciplines",
        a: "Narrow by design; refers out work beyond applied AI and its data/platform foundation.",
        b: "Wide — strategy, operations, org design, and change management under one engagement.",
      },
      {
        dimension: "Currency with the field",
        a: "Tracks a fast-moving field closely; tooling and patterns stay current.",
        b: "Broad currency across many fields; may lag the AI frontier specifically.",
      },
      {
        dimension: "Risk on hard AI problems",
        a: "Lower — has hit and solved the thorny evaluation and reliability problems before.",
        b: "Higher on the genuinely hard AI parts; stronger on the surrounding program.",
      },
      {
        dimension: "Coordinating a large program",
        a: "Not the strength; best as the AI core within a program someone else orchestrates.",
        b: "A real strength — staffing and coordinating many workstreams at scale.",
      },
      {
        dimension: "Best-fit situation",
        a: "The AI itself is the hard, make-or-break part of the initiative.",
        b: "AI is one thread inside a broad transformation that needs orchestration.",
      },
    ],
    verdict:
      "A generalist consultancy is the better choice when AI is one strand of a wider transformation — when the hard part is coordinating many workstreams, change management, and org design, and the AI component is relatively well-understood. A specialist wins when the AI is the make-or-break element: where evaluation rigor, model selection, and production reliability decide the outcome and a shallow approach quietly fails. A frequent pattern pairs the two — a generalist orchestrates the broad program while a specialist owns the AI core. Diagnose which kind of hard your problem is before choosing.",
    related: [
      { label: "Boutique vs big-firm AI consulting", href: "/compare/boutique-vs-big-firm-ai-consulting" },
      { label: "Build vs buy for AI", href: "/compare/build-vs-buy-ai" },
    ],
  },

  {
    slug: "strategy-deck-vs-shipped-system",
    title: "Strategy Deck vs Shipped System — What You Actually Get",
    h1: "Strategy deck vs a shipped system",
    metaDescription:
      "A strategy deck or a working system in production? An honest comparison of what each delivers, where each adds value, and why a deck without a path to build often stalls.",
    optionA: {
      name: "Shipped system",
      summary:
        "A working AI capability in production, instrumented to prove it moved a business metric.",
    },
    optionB: {
      name: "Strategy deck",
      summary:
        "A well-researched plan and roadmap — the recommendation, framing, and business case, without the build.",
    },
    intro:
      "A strategy deck is not the enemy — a clear, well-researched plan has real value, especially early when the question is which bets to make and why. The risk is stopping there: a deck that recommends a system, hands it to a separate team to build, and quietly loses fidelity in the handoff. The honest comparison is about what each artifact actually delivers and where the value leaks. The best work uses a deck to align on the bet, then ships the system itself — strategy and build as one engagement, not a relay race.",
    rows: [
      {
        dimension: "What you hold at the end",
        a: "A running system your users and metrics actually touch.",
        b: "A document: analysis, recommendations, and a roadmap to be executed by someone else.",
      },
      {
        dimension: "Where the value is",
        a: "Realized in production — the metric moves or it doesn't, and you can see it.",
        b: "Potential — the value depends entirely on faithful execution after the deck lands.",
      },
      {
        dimension: "Risk profile",
        a: "Front-loads execution risk and resolves it; assumptions get tested against reality early.",
        b: "Defers execution risk; assumptions stay untested until a separate build begins.",
      },
      {
        dimension: "Handoff loss",
        a: "None — the strategists are the builders, so intent survives into the code.",
        b: "High when build is handed to a different team; nuance and context degrade in translation.",
      },
      {
        dimension: "Time to learn if it works",
        a: "Weeks — a live slice produces real signal you can act on.",
        b: "Often months, after a separate build cycle that may reinterpret the plan.",
      },
      {
        dimension: "Best-fit situation",
        a: "You've chosen a direction and need it built, proven, and improving.",
        b: "Early framing — deciding which bets to make before committing to build.",
      },
    ],
    verdict:
      "A strategy deck is genuinely the right deliverable early, when the real question is which bets to place and why — paying to build before you've aligned on direction is premature. But a deck is a means, not the end: its value only materializes when someone executes it faithfully, and that's exactly where handoffs leak. A shipped system is what you're ultimately paying for, and the surest way to get the deck's intent into production intact is to have the people who wrote the strategy build the system. Use the deck to decide; insist on a path to shipped so the plan doesn't die in a drawer.",
    related: [
      { label: "AI consulting vs traditional IT consulting", href: "/compare/ai-consulting-vs-traditional-it-consulting" },
      { label: "Boutique vs big-firm AI consulting", href: "/compare/boutique-vs-big-firm-ai-consulting" },
    ],
  },
];

export function getComparison(slug: string): Comparison | undefined {
  return COMPARISONS.find((c) => c.slug === slug);
}

/** Every route in the comparison cluster, for sitemap inclusion. */
export const COMPARISON_ROUTES = [
  "/compare",
  ...COMPARISONS.map((c) => `/compare/${c.slug}`),
];
