/**
 * lib/content/world.ts — first-draft, on-brand copy for the Worldwide and Labs
 * hub pages.
 *
 * Tone: boutique applied-AI studio — a sharper, smaller BCG. Specific,
 * credible, engineering-led, no hype. Offices, figures, and publications are
 * illustrative first-draft content meant to read as plausible and editable.
 */

/* --------------------------------------------------------------- Worldwide -- */

export type Office = {
  /** Display city name — also drives the in-page anchor via slugify(city). */
  city: string;
  /** Eyebrow label — the region the office anchors. */
  region: string;
  /** Body copy for the office's ContentSplit. */
  blurb: string | string[];
  /** A short, non-mappable address hint (neighborhood / district). */
  addressHint: string;
  /** PlaceholderImage seed — stable artwork per office. */
  seed: string;
};

export const OFFICES: Office[] = [
  {
    city: "Denver",
    region: "Mountain West & Pacific",
    addressHint: "LoDo, Downtown Denver",
    seed: "office-den",
    blurb: [
      "Denver is one of our two home offices and where much of the team is based. It is our centre of gravity for the Mountain West and the Pacific time zone — technology companies, energy and utilities, and industrial operators that want strategists and engineers in the same room.",
      "Work starts here the way it ships: partners and engineers together, from a first diagnostic through to a running, measured system. No grand claims about the building — just the place a lot of the firm's people sit and the work gets built.",
    ],
  },
  {
    city: "Detroit",
    region: "Midwest & East",
    addressHint: "Downtown Detroit",
    seed: "office-det",
    blurb: [
      "Detroit is our second home office, anchoring engagements across the Midwest and the eastern half of the country. The team here works closely with industrial, logistics, and financial-services companies — sectors where AI has to move a regulated, defensible number, not a demo.",
      "Like Denver, it is an office in the honest sense: a base where the team gathers and the work gets built end to end. We staff each engagement from the best-fit people regardless of city, then embed them with your team.",
    ],
  },
];

export const REMOTE = {
  blurb: [
    "Two offices, one remote-first firm. Beyond our Denver and Detroit studios, we run remote-first — practitioners distributed across every major time zone so the right senior person is reachable during your working day, wherever your teams sit.",
    "Remote-first is a staffing model, not a fallback. We assemble each engagement from the best-fit people regardless of city, then embed them with your team — on-site when the work calls for it, in the same repository and standups when it doesn't.",
  ] as string[],
};

/* -------------------------------------------------------------------- Labs -- */

export type LabArea = { title: string; desc: string };
export type Publication = { title: string; venue: string; year: number };

export const LABS = {
  /** PageHero lede. */
  hero: {
    lede: "Preecursor Labs is our research and tooling arm. It exists for one reason: to sharpen the methods, harden the tooling, and earn the evidence before any of it touches a client's production system.",
  },

  /** Intro statement under the hero. */
  intro:
    "Consulting firms publish thought leadership. We publish working code, reproducible benchmarks, and reference architectures we run ourselves. Labs is where the firm's point of view gets built and tested — not just written down.",

  /** The six Labs leaves, in nav order. Anchor ids derive from slugify(title). */
  areas: [
    {
      title: "Frontier Research",
      desc: "A small standing team that tracks the moving edge of capability — new model families, agentic methods, long-context and tool-use behaviour — and translates it into what changes for the engagements we run. Research here is judged by whether it changes a recommendation, not by citation count.",
    },
    {
      title: "Open Tooling",
      desc: "The evaluation harnesses, data pipelines, and agent scaffolding we build for ourselves, released as open source where we can. Clients inherit battle-tested tools instead of bespoke one-offs, and the wider community gets to inspect — and improve — how we work.",
    },
    {
      title: "Reference Architectures",
      desc: "Opinionated, production-grade blueprints for the systems we build most: retrieval over governed data, multi-step agents with human checkpoints, eval-gated deployment. Each is something we have run in production, documented down to the failure modes — not a diagram.",
    },
    {
      title: "Benchmarks",
      desc: "Task-specific, domain-grounded benchmarks that measure what an executive actually cares about — accuracy on their documents, cost per resolved case, latency under real load — rather than leaderboard scores that rarely survive contact with a client's data.",
    },
    {
      title: "Publications",
      desc: "Field-tested write-ups: methods papers, post-mortems, and practitioner guides drawn from real engagements (anonymised, with permission). We publish what worked, what didn't, and the evidence — so the claims we make to clients are ones we have shown our work on.",
    },
    {
      title: "Fellowships",
      desc: "A funded residency for exceptional researchers and engineers to work alongside our partners on a hard, real problem for a fixed term. Fellows ship into Labs and, where it fits, into client work — with their name on what they build.",
    },
  ] as LabArea[],

  /** Selected publications — illustrative first-draft list. */
  publications: [
    {
      title: "Eval-Gated Deployment: Shipping Agents You Can Defend to a Risk Committee",
      venue: "Preecursor Labs · Methods",
      year: 2026,
    },
    {
      title: "Retrieval Over Governed Data: A Reference Architecture for Regulated Industries",
      venue: "Preecursor Labs · Reference Architectures",
      year: 2025,
    },
    {
      title: "What the Leaderboards Miss: Building Domain Benchmarks That Survive Production",
      venue: "Applied ML in Practice (Workshop)",
      year: 2025,
    },
    {
      title: "Human Checkpoints in Multi-Step Agents: A Field Post-Mortem",
      venue: "Preecursor Labs · Field Notes",
      year: 2025,
    },
    {
      title: "Provenance by Default: Tracing Model Outputs Back to Their Sources",
      venue: "Responsible AI Engineering Symposium",
      year: 2024,
    },
  ] as Publication[],

  /** Fellowship CTA copy. */
  fellowship: {
    title: "The Preecursor Labs Fellowship",
    body: [
      "Each year we fund a small cohort of researchers and engineers to spend six months inside Labs, working shoulder-to-shoulder with our partners on a problem that matters to a real client. It is not an internship and it is not academic tourism — fellows own a piece of work end to end and ship it.",
      "If you would rather build the methods than read about them, we would like to hear from you.",
    ] as string[],
  },
};
