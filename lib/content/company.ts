/**
 * lib/content/company.ts — first-draft, on-brand copy for the three company
 * hub pages: About, Leadership, and Careers.
 *
 * Tone: boutique applied-AI studio — a sharper, smaller BCG. Specific,
 * outcome-led, engineering-credible, no hype. People, roles, and figures are
 * illustrative first-draft content meant to read as plausible and editable.
 */

/* ------------------------------------------------------------------ About -- */

export type Value = { title: string; desc: string };
export type Principle = { title: string; desc: string };

export const ABOUT = {
  /** PageHero copy. */
  hero: {
    title: "An applied-AI studio for leaders who need more than advice",
    lede: "We pair senior strategists with engineers who ship. One continuous engagement that goes from the boardroom question to a production system your teams actually run.",
  },

  /** Our Story — narrative paragraphs for the ContentSplit. */
  story: [
    "Preecursor was founded on a frustration our partners had lived from both sides of the table: the people who could frame the AI strategy were rarely the people who could build it, and the gap between the two was where most initiatives quietly died.",
    "So we built the firm we wished we could have hired. Small by design. Senior by default. The same people who diagnose the opportunity stay through to the production system — no handoff to a junior bench, no second statement of work to make the pilot real.",
    "Today we work with a deliberately short list of clients in the rooms where the standard gets set: global banks, Fortune 200 industrials, national health networks. We measure ourselves the way they do — against a number we agreed to move — and we leave when their people can run and improve the system without us.",
  ] as string[],

  /** What we believe — the values grid. */
  values: [
    {
      title: "Senior people, all the way down",
      desc: "The people in the first meeting are the people writing the code. No bait-and-switch to a junior bench once the contract is signed.",
    },
    {
      title: "Candor over comfort",
      desc: "If AI is the wrong lever for your problem, we will tell you on day one. The fastest way to lose a client's trust is to sell them a system they don't need.",
    },
    {
      title: "Production or it didn't happen",
      desc: "A demo is not a deliverable. We are not finished until the system is live, in front of real users, holding up under real load and real scrutiny.",
    },
    {
      title: "Earned trust, governed by design",
      desc: "Evals, provenance, and monitoring are not afterthoughts we bolt on for the risk committee. They are how we build, from the first commit.",
    },
    {
      title: "Small on purpose",
      desc: "We grow client by client, not headcount by headcount. Staying small is what lets every engagement get our most senior attention.",
    },
    {
      title: "Built to be left",
      desc: "We optimize for the day we walk away. Clean architecture, documentation, and training mean the capability stays after we do.",
    },
  ] as Value[],

  /** How we work — the three landing principles, verbatim in spirit. */
  howWeWork: [
    {
      title: "Embedded, not arm's length",
      desc: "We sit inside your teams, in your tools and your standups. Decisions happen in the room, not three weeks later in a readout.",
    },
    {
      title: "Outcomes, not decks",
      desc: "Every engagement is measured against a number you agreed to move. The work isn't done when the slides are pretty — it's done when the metric moves.",
    },
    {
      title: "Built to hand off",
      desc: "We're optimizing for the day we leave. Documentation, training, and clean architecture mean your people run it — and improve it — without us.",
    },
  ] as Principle[],

  /** Partnerships — brief blurb + a few partner categories. */
  partnerships: {
    body: "We are model- and cloud-agnostic by conviction, not by accident. We hold the relationships that let us move fast — early access, joint reference architectures, direct lines to the engineering teams behind the platforms — while staying free to recommend whatever actually serves your problem.",
    rows: [
      {
        title: "Frontier model labs",
        desc: "Early access and engineering relationships across the leading model providers, so we build on what's coming, not just what shipped last quarter.",
      },
      {
        title: "Cloud & data platforms",
        desc: "Reference architectures on the major clouds and data platforms your enterprise already runs, so what we build lands inside your estate, not beside it.",
      },
      {
        title: "Research & academia",
        desc: "Standing collaborations with university labs and our own fellows keep the methods we use ahead of the off-the-shelf playbook.",
      },
    ] as Principle[],
  },

  /** Press — brief blurb + contact note. */
  press: {
    body: "For media inquiries, speaking requests, or analyst briefings, our partners are available to talk on the record about applied AI in regulated and high-stakes industries — candidly, and without the hype cycle.",
  },
} as const;

/* ------------------------------------------------------------- Leadership -- */

export type PersonGroup = "Partner" | "Advisor" | "Operator" | "Researcher";

export type Person = {
  name: string;
  role: string;
  group: PersonGroup;
  bio: string;
  /** Stable seed for the PlaceholderImage avatar. */
  seed: string;
};

export const LEADERSHIP = {
  hero: {
    title: "Engineers and operators from the rooms where the standard gets set",
    lede: "Our partners have led research at frontier labs, scaled platforms at the companies you use every day, and run the kind of P&L our clients answer to. We have been on your side of the table.",
  },

  /** Display order of the four groups → drives the anchored sections. */
  groups: [
    { group: "Partner", label: "Partners", blurb: "The people who frame the engagement and stay through to the production system. Every partner carries both the strategy and the code." },
    { group: "Advisor", label: "Advisors", blurb: "Operators and researchers who lend judgment at the edges of what we do — sector depth, governance, and frontier method." },
    { group: "Operator", label: "Operators", blurb: "Engineers and product leaders who turn the diagnosis into a system in production, embedded inside your teams." },
    { group: "Researcher", label: "Researchers", blurb: "Our Labs bench — the people who sharpen evals, methods, and reference architectures before they reach a client." },
  ] as { group: PersonGroup; label: string; blurb: string }[],

  people: [
    {
      name: "Dr. Maya Ellison",
      role: "Founding Partner & CEO",
      group: "Partner",
      bio: "Led applied research teams at a frontier lab before founding Preecursor. Maya frames the firm's hardest engagements and keeps the work honest about what AI can and can't do.",
      seed: "person-maya-ellison",
    },
    {
      name: "Daniel Okonkwo",
      role: "Founding Partner & Head of Engineering",
      group: "Partner",
      bio: "Built and scaled ML platforms serving hundreds of millions of users. Daniel owns the bar for what ships — if it can't survive production and review, it doesn't go out the door.",
      seed: "person-daniel-okonkwo",
    },
    {
      name: "Priya Raman",
      role: "Partner, Financial Services",
      group: "Partner",
      bio: "A former model-risk lead turned builder. Priya runs our regulated-industry engagements, where the difference between a pilot and production is a validation team's signature.",
      seed: "person-priya-raman",
    },
    {
      name: "Marcus Vogel",
      role: "Senior Advisor, Strategy",
      group: "Advisor",
      bio: "Two decades advising boards on technology strategy before AI was the question on every agenda. Marcus pressure-tests where a client should build, buy, or wait.",
      seed: "person-marcus-vogel",
    },
    {
      name: "Dr. Hana Sato",
      role: "Advisor, Responsible AI",
      group: "Advisor",
      bio: "A policy researcher who has shaped governance frameworks adopted across the sector. Hana keeps our safety and evaluation practice ahead of the regulation, not behind it.",
      seed: "person-hana-sato",
    },
    {
      name: "Liam Brennan",
      role: "Principal Operator, Applied Builds",
      group: "Operator",
      bio: "Ships agentic systems that hold up under real load. Liam embeds inside client teams and leaves them running infrastructure they understand and can extend.",
      seed: "person-liam-brennan",
    },
    {
      name: "Sofia Marchetti",
      role: "Operator, Product & Enablement",
      group: "Operator",
      bio: "Turns a working system into an adopted one. Sofia runs the rollout, the training, and the handoff that decide whether a deployment sticks after we leave.",
      seed: "person-sofia-marchetti",
    },
    {
      name: "Dr. Arjun Nair",
      role: "Research Lead, Preecursor Labs",
      group: "Researcher",
      bio: "Leads our evaluation and reliability research. Arjun builds the eval harnesses and reference methods that move from Labs into every engagement we run.",
      seed: "person-arjun-nair",
    },
  ] as Person[],
} as const;

/** People filtered to a group, in declared order. */
export function peopleByGroup(group: PersonGroup): Person[] {
  return LEADERSHIP.people.filter((p) => p.group === group);
}

/* ---------------------------------------------------------------- Careers -- */

export type OpenRole = {
  title: string;
  team: "Engineering" | "Strategy" | "Research" | "Internships";
  location: string;
  type: string;
};

export type Perk = { title: string; desc: string };

export const CAREERS = {
  hero: {
    title: "Go beyond the expected",
    lede: "We hire operators and engineers who would rather ship than advise. Small teams, senior people, and the kind of problems that only show up in the rooms where the standard gets set.",
  },

  intro:
    "Preecursor is deliberately small, which means every hire shifts what the firm can take on. We look for people who can hold a boardroom conversation and a code review in the same afternoon — and who are happiest when the system is finally in front of real users.",

  openRoles: [
    {
      title: "Staff AI Engineer, Applied Builds",
      team: "Engineering",
      location: "Denver · Hybrid",
      type: "Full-time",
    },
    {
      title: "Senior Agentic Systems Engineer",
      team: "Engineering",
      location: "Remote (US / UK)",
      type: "Full-time",
    },
    {
      title: "Engagement Lead, AI Strategy",
      team: "Strategy",
      location: "Remote",
      type: "Full-time",
    },
    {
      title: "Principal, Financial Services",
      team: "Strategy",
      location: "Detroit · Hybrid",
      type: "Full-time",
    },
    {
      title: "Research Engineer, Evaluation & Safety",
      team: "Research",
      location: "Remote (Global)",
      type: "Full-time",
    },
    {
      title: "AI Engineering Intern, Preecursor Labs",
      team: "Internships",
      location: "Denver · On-site",
      type: "Internship · Summer",
    },
  ] as OpenRole[],

  /** Per-team blurbs for the anchored sections. */
  teams: [
    { team: "Engineering", label: "Engineering", blurb: "Build production AI systems inside the world's most demanding organizations — agentic systems, retrieval pipelines, and the eval harnesses that get them past review. You will own the work end to end, not a ticket inside it." },
    { team: "Strategy", label: "Strategy", blurb: "Frame the engagement, find the number worth moving, and stay through to the system that moves it. Our strategists are technical enough to be in the architecture conversation and senior enough to be in the boardroom one." },
    { team: "Research", label: "Research", blurb: "Sharpen the methods before they reach a client. Preecursor Labs works on evaluation, reliability, and reference architectures — research with a short, deliberate path into real production systems." },
    { team: "Internships", label: "Internships", blurb: "Spend a summer in Preecursor Labs working shoulder to shoulder with the partners on real engagements. We hire interns we would want to hire again — and most years, we do." },
  ] as { team: OpenRole["team"]; label: string; blurb: string }[],

  /** Life at Preecursor — narrative + perks. */
  life: {
    body: [
      "We are a small, senior, remote-first firm — with offices in Denver and Detroit for the people and the work that benefit from a room. The trade for staying small is real: fewer layers, more ownership, and your name on systems running inside organizations you have heard of.",
      "We protect deep work, we travel to clients with intent rather than by default, and we hold a high bar precisely so the team stays a group of people you want to build with.",
    ] as string[],
    perks: [
      {
        title: "Senior from day one",
        desc: "No junior bench to graduate from. You are in the room, on the architecture, and accountable for the outcome from your first engagement.",
      },
      {
        title: "Ownership that's real",
        desc: "Small teams mean your work ships under your name and runs in production — not as a slide in someone else's deck.",
      },
      {
        title: "Remote-first, office-anchored",
        desc: "Work from anywhere in our regions, gather in Denver or Detroit when the work calls for a room, and travel to clients with intent.",
      },
      {
        title: "Time to go deep",
        desc: "We protect focus. Meetings earn their place on the calendar, and Labs time is real time, not a slogan.",
      },
      {
        title: "Frontier on tap",
        desc: "Early access across the leading model labs and a research bench at your side mean you build on what's next, not last quarter's playbook.",
      },
      {
        title: "Profit that's shared",
        desc: "Staying small and senior means the upside is concentrated. Everyone who builds the firm's value shares in it.",
      },
    ] as Perk[],
  },
} as const;

/** Open roles filtered to a team, in declared order. */
export function rolesByTeam(team: OpenRole["team"]): OpenRole[] {
  return CAREERS.openRoles.filter((r) => r.team === team);
}
