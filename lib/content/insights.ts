/**
 * lib/content/insights.ts — the firm's published thinking: reports, field
 * notes, and executive briefings on applied AI.
 *
 * Each entry powers a card on the /insights index and a full article page at
 * /insights/[slug]. Categories are drawn from the insights mega-menu panel
 * (Reports · Field Notes · Executive Briefings) so the in-page anchors group
 * cleanly.
 *
 * Tone: boutique applied-AI studio — a sharper, smaller BCG. Opinionated,
 * specific, written by people who ship rather than only advise.
 */

export type InsightCategory = "Reports" | "Field Notes" | "Executive Briefings";

export type Insight = {
  slug: string;
  category: InsightCategory;
  title: string;
  /** One-line deck / standfirst. */
  dek: string;
  author: string;
  /** Display date, e.g. "May 2026". */
  date: string;
  readMins: number;
  /** 4–6 body paragraphs. */
  body: string[];
};

export const INSIGHTS: Insight[] = [
  {
    slug: "evals-are-the-product",
    category: "Reports",
    title: "Evals are the product",
    dek: "Why the teams shipping durable AI treat evaluation as core engineering — and what the laggards keep getting wrong.",
    author: "Preecursor Labs",
    date: "May 2026",
    readMins: 9,
    body: [
      "Ask a room of engineering leaders how they know their AI feature is good, and you will get one of two answers. The first is a demo and a feeling. The second is a number — a score on a suite of tasks that mirrors what users actually do, run on every change, watched like a build pipeline. In our work across forty-plus production systems, the gap between those two answers predicts almost everything about whether a feature survives contact with real users.",
      "The teams that win treat evaluation as a first-class part of the system, not a QA afterthought. They write task-level evals before they write the prompt. They capture real failures from production and fold them back into the suite. They gate releases on the score the way a mature codebase gates on tests. The result is that they can change models, rewrite prompts, and refactor agents without holding their breath — because the eval tells them, in minutes, whether they made things better or worse.",
      "The laggards, by contrast, optimize against vibes. They ship a model swap because the new one is cheaper, discover three weeks later that quality quietly regressed, and spend a sprint reconstructing what 'good' even meant. Every one of those teams could describe their architecture in detail and none of them could tell you their hallucination rate to a decimal. That is not a coincidence; it is the whole problem.",
      "Good evals are harder to build than they look, and that is precisely why they are a moat. They require you to articulate what correct behavior is, to collect representative inputs, and to score outputs in a way that correlates with user value rather than surface fluency. That work forces clarity. It is also the work most teams skip because it does not demo. We have come to see a missing eval harness as the single most reliable predictor that an AI initiative will stall in pilot.",
      "Our rule on every engagement is blunt: if we cannot measure it, we do not ship it. The eval harness is the first artifact we build, not the last. It is what lets us promise a client a number — a 63% cut in cycle time, a 99.2% citation accuracy — and then actually defend that number when the second line of defense comes asking. Treat evals as the product, and the product gets dramatically more shippable. Treat them as overhead, and you are flying blind at altitude.",
    ],
  },
  {
    slug: "agents-in-production",
    category: "Field Notes",
    title: "What we learned putting agents in production",
    dek: "The unglamorous engineering — tracing, guardrails, graceful failure — that separates a demo agent from one you can trust.",
    author: "Preecursor Labs",
    date: "April 2026",
    readMins: 7,
    body: [
      "Agents demo beautifully and break quietly. A tool-using agent that nails a scripted path on stage will, in production, encounter the input no one anticipated, take six steps when two would do, call the wrong tool with confidence, and report success regardless. The distance between that demo and a system you can put in front of a customer is almost entirely unglamorous engineering — and it is where we spend most of our time.",
      "The first lesson is that observability is not optional; it is the substrate. Every agent run we ship is fully traced and replayable: each step, each tool call, each intermediate decision is logged in a way an engineer can inspect after the fact. Without that, debugging an agent is archaeology. With it, a failure becomes a test case. We have never regretted over-investing in tracing, and we have always regretted under-investing in it.",
      "The second lesson is that agents must be scoped to fail safely. The question is never whether an agent will be wrong — it will — but what happens when it is. We design tight, permissioned tool surfaces so an agent can only act within auditable boundaries, and we build explicit escalation paths so that when confidence is low, the system hands off to a human instead of bluffing. An agent that knows when to stop is worth more than one that is occasionally brilliant and occasionally catastrophic.",
      "The third lesson is that reliability comes from decomposition. The agents that hold up in production are rarely a single heroic loop; they are a set of smaller, well-bounded steps with clear success criteria and recovery behavior at each one. This is less impressive to watch and far more dependable to run. It also makes the eval problem tractable, because you can score each step rather than only the end-to-end outcome.",
      "None of this is exotic. It is the same discipline that turns any prototype into a system: instrument it, bound it, test it, and make its failures legible. The teams that internalize that ship agents that quietly do real work for years. The teams that chase the demo ship something that wows the boardroom and gets switched off within a quarter.",
    ],
  },
  {
    slug: "build-vs-buy-applied-ai",
    category: "Executive Briefings",
    title: "Build vs. buy for applied AI, in 2026",
    dek: "A decision framework for leaders deciding where to build, where to buy, and where the honest answer is 'wait'.",
    author: "Preecursor Labs",
    date: "March 2026",
    readMins: 8,
    body: [
      "The build-versus-buy question for AI is not the same question it was for software, and treating it as such is how good companies waste a year. The underlying models are a commodity you should almost always buy. The data, the workflow, and the evaluation around them are where your advantage lives, and those you should almost always build. Most expensive mistakes come from inverting that — building a model nobody needed, or buying a workflow that buried the one thing that made the company different.",
      "Start with a sharper question than 'build or buy': what is the durable advantage here, and does it come from this capability being yours? If a vendor can sell the same thing to your competitor next week, owning the build buys you nothing but cost and maintenance. If the value comes from your proprietary data, your specific process, or a quality bar only you can define, then buying the generic version will quietly cap your ceiling. The decision is not about technology; it is about where the moat is.",
      "Our default counsel is to buy the model and the infrastructure, and build the thin, high-value layer that is yours: the retrieval over your data, the agent that runs your workflow, the eval that encodes your quality standard. That layer is usually smaller than leaders fear and more defensible than vendors admit. It is also the part that, done well, compounds — each system you build makes the next one faster.",
      "There is a third answer that good frameworks make room for: wait. For some use cases in 2026, the honest read is that the capability is six months from being a reliable build and is not yet a trustworthy buy. Naming that explicitly is a service to the client. We would rather tell a leader that the right move is to sequence a use case behind two others than to bill them for a system that will be embarrassing by the time it ships.",
      "The framework we hand clients fits on a page: separate the commodity from the advantage, buy the former, build the latter, and be willing to defer when neither is ready. It is not glamorous, but it is the difference between an AI program that shows up in next year's numbers and one that shows up only in next year's regrets.",
    ],
  },
  {
    slug: "model-risk-without-the-theater",
    category: "Reports",
    title: "Model risk without the theater",
    dek: "How to satisfy validation, audit, and the board without turning every AI deployment into a two-year compliance project.",
    author: "Preecursor Labs",
    date: "February 2026",
    readMins: 6,
    body: [
      "In regulated industries, the thing that kills AI projects is rarely the model. It is the eighteen-month gauntlet between a working prototype and a production sign-off — and the dawning realization that nobody scoped the governance work until the build was done. Done badly, model risk management is theater: a binder of documents nobody reads, produced after the fact to satisfy a checklist. Done well, it is simply good engineering written down as it happens.",
      "The mistake is treating governance as a phase that follows the build. By then the evidence is expensive to reconstruct and the validators are skeptical of a system they had no hand in shaping. We invert it: the documentation, the eval harness, and the monitoring are built alongside the system, and the second line of defense is in the room early. The artifact that proves the model is safe is the same artifact the engineers use to make it good.",
      "Concretely, that means writing model documentation as a living description of behavior rather than a retrospective essay, designing evals that map directly to the risks the validators care about, and standing up monitoring before launch rather than after the first incident. None of this slows the build down meaningfully. What it does is collapse the review cycle, because there is nothing to reconstruct — the evidence already exists, in the form the validators recognize.",
      "We have taken systems through SR 11-7 validation in weeks rather than quarters using exactly this approach, and the reason is not a clever trick. It is that we stopped treating risk and engineering as adversaries handing artifacts across a wall, and started treating them as one workflow. The validator's questions become design requirements. The audit trail becomes a debugging tool. Compliance stops being theater and starts being a byproduct.",
      "For leaders, the takeaway is to refuse the false choice between moving fast and satisfying risk. The teams that move fastest through validation are the ones that took it seriously from sprint one. The slowest are the ones that treated governance as paperwork to be back-filled — and discovered, far too late, that you cannot back-fill trust.",
    ],
  },
];

export function getArticle(slug: string): Insight | undefined {
  return INSIGHTS.find((a) => a.slug === slug);
}

/** Insights grouped by their menu category, in panel order. */
export const INSIGHT_CATEGORIES: InsightCategory[] = [
  "Reports",
  "Field Notes",
  "Executive Briefings",
];

export function articlesByCategory(category: InsightCategory): Insight[] {
  return INSIGHTS.filter((a) => a.category === category);
}
