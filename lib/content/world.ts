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
    city: "New York",
    region: "Americas",
    addressHint: "Flatiron District, Manhattan",
    seed: "office-nyc",
    blurb: [
      "Our New York studio is where most engagements with global banks, insurers, and private-equity firms begin. Partners here have sat on both sides of the model-risk table, so the work starts from how a number gets defended — not just how it gets moved.",
      "Teams embed on-site in lower and midtown Manhattan, sit in the rooms where the standard gets set, and stay through to the production system. It is our largest office and the home of the firm's financial-institutions practice.",
    ],
  },
  {
    city: "London",
    region: "Europe, Middle East & Africa",
    addressHint: "Clerkenwell, EC1",
    seed: "office-ldn",
    blurb: [
      "London anchors our work across EMEA — regulated industries first: banking, insurance, energy, and the public sector. The team is fluent in the governance regimes our clients answer to, from the FCA to the EU AI Act, and builds for them from the first commit.",
      "It is also the centre of gravity for Preecursor Labs in Europe, where our evaluation and responsible-AI methods get pressure-tested against real regulatory scrutiny before they reach a client.",
    ],
  },
  {
    city: "Singapore",
    region: "Asia-Pacific",
    addressHint: "Tanjong Pagar, CBD",
    seed: "office-sgp",
    blurb: [
      "Singapore is our hub for Asia-Pacific — a single base close to clients across financial services, logistics, and industrials from Sydney to Tokyo to Mumbai. The team works across more than a dozen markets and as many regulatory regimes.",
      "Proximity matters here more than anywhere: time zones, languages, and data-residency rules vary by the hour of flight, and we staff engagements so a senior practitioner is always within a working day of the client's floor.",
    ],
  },
];

export const REMOTE = {
  blurb: [
    "Three offices, one firm. Beyond our studios in New York, London, and Singapore, we run remote-first — practitioners distributed across every major time zone so the right senior person is reachable during your working day, wherever your teams sit.",
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
