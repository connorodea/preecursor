/**
 * Programmatic-SEO content: a topic cluster targeting "ai consulting" /
 * "ai consultant" (and a pillar nod to "technology consulting").
 *
 * Pillars target the head terms; spokes target winnable long-tail:
 *   /ai-consulting/[industry]  — "AI consulting for {Industry}"
 *   /ai-consultant/[city]      — "AI consultant in {City}" (real presence only)
 *
 * Spoke content is composed from our real industry content (lib/content/
 * services.ts) so pages carry genuine, differentiated value — not swapped
 * variables. Cities are limited to our offices + hubs we credibly serve
 * remote-first; we never claim an office we don't have.
 */

import { INDUSTRY_LEAVES, slugify } from "@/lib/ia";
import { getIndustry, type ServiceContent } from "@/lib/content/services";

/* ----------------------------------------------------------------- Pillars */

export type Pillar = {
  slug: string;
  /** Primary head term the page targets. */
  keyword: string;
  title: string; // <title>
  h1: string;
  eyebrow: string;
  metaDescription: string;
  lede: string;
  /** Long-form pillar sections (unique prose). */
  sections: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
};

const SERVICE_SECTIONS = (term: string): { heading: string; body: string }[] => [
  {
    heading: `What ${term} should actually deliver`,
    body: `Most ${term} stalls between the strategy deck and the production system. Preecursor closes that gap: senior strategists work alongside engineers who have shipped at scale, so the path from ambition to a running, measurable capability is one continuous engagement — not a handoff between three vendors. You get a clear-eyed portfolio of bets sequenced by value and feasibility, the systems built to your security and reliability bar, and the operating model to keep them improving.`,
  },
  {
    heading: "Strategy and build, under one roof",
    body: "We diagnose where AI creates durable advantage (and where it doesn't), model the economics before a line of code is written, then build the agents, retrieval, evaluation harnesses, and infrastructure to back them. Every engagement is measured against a number you agreed to move — the work isn't done when the slides are pretty, it's done when the metric moves.",
  },
  {
    heading: "Boutique focus, frontier experience",
    body: "Our partners have led research at frontier labs, scaled platforms at the companies you use every day, and run the kind of P&L our clients answer to. You work directly with the people doing the work — no procurement maze, no junior bench. We optimize for the day we leave: documentation, training, and clean architecture mean your teams own and improve what we build.",
  },
];

export const PILLARS: Record<string, Pillar> = {
  "ai-consulting": {
    slug: "ai-consulting",
    keyword: "AI consulting",
    title: "AI Consulting — Strategy to Production",
    h1: "AI consulting that ships, not just advises",
    eyebrow: "AI consulting",
    metaDescription:
      "Preecursor is an applied-AI consulting studio: senior strategists paired with engineers who ship production AI systems — from diagnostic to live deployment in weeks.",
    lede: "An applied-AI consulting studio for leaders who need more than advice. We pair strategy with engineers who put AI into production — and prove it moved the number.",
    sections: SERVICE_SECTIONS("AI consulting"),
    faqs: [
      {
        q: "What does an AI consulting engagement with Preecursor look like?",
        a: "A continuous arc: a diagnostic that maps where AI creates value, an applied build of the highest-leverage system into production, then scale, monitoring, and enablement so your team runs it. Median time to a first live deployment is six weeks.",
      },
      {
        q: "How is this different from a big-firm AI consultancy?",
        a: "Big firms hand you a strategy deck and a separate vendor to build it. We do both — the strategists and the engineers are the same small senior team — so nothing is lost in translation and the metric actually moves.",
      },
      {
        q: "Which industries do you serve?",
        a: "Financial services, healthcare and life sciences, industrials, technology, public sector, and more — see our industry pages for sector-specific AI consulting.",
      },
    ],
  },
  "ai-consultant": {
    slug: "ai-consultant",
    keyword: "AI consultant",
    title: "Hire an AI Consultant — Applied, Senior, Hands-On",
    h1: "AI consultants who build the systems other firms only present",
    eyebrow: "AI consultant",
    metaDescription:
      "Work with senior AI consultants who diagnose, build, and ship production AI — not slideware. Remote-first, embedded in your teams, with offices in Denver and Detroit.",
    lede: "Senior, hands-on AI consultants who embed in your teams, build production systems, and transfer the capability — so the advantage compounds after we leave.",
    sections: SERVICE_SECTIONS("an AI consultant"),
    faqs: [
      {
        q: "What does a Preecursor AI consultant actually do?",
        a: "They sit inside your teams — in your tools and your standups — to diagnose the opportunity, build the agents/retrieval/evaluation systems, and instrument them to prove value. Decisions happen in the room, not three weeks later in a readout.",
      },
      {
        q: "Do you work remotely?",
        a: "Yes — we're a remote-first firm with practitioners across every major time zone, plus two home offices in Denver and Detroit. See our city pages for how we serve your market.",
      },
    ],
  },
  "technology-consulting": {
    slug: "technology-consulting",
    keyword: "technology consulting",
    title: "Technology Consulting for the AI Era",
    h1: "Technology consulting, rebuilt for applied AI",
    eyebrow: "Technology consulting",
    metaDescription:
      "Technology consulting that ships: AI strategy, data and platform engineering, agentic systems, and the operating model to run them — one senior team, end to end.",
    lede: "Technology consulting for leaders who need the strategy and the system. We bring data and platform engineering, agentic systems, and the discipline to run AI in production.",
    sections: SERVICE_SECTIONS("technology consulting"),
    faqs: [
      {
        q: "Is this traditional IT consulting?",
        a: "No — we focus specifically on putting AI and modern data platforms into production, with senior engineers, not staff augmentation. Strategy and build are one engagement.",
      },
    ],
  },
};

export const PILLAR_ROUTES = Object.keys(PILLARS).map((s) => `/${s}`);

export function getPillar(slug: string): Pillar | undefined {
  return PILLARS[slug];
}

/* ------------------------------------------------------- Industry spokes */

export type IndustrySpoke = {
  slug: string;
  label: string;
  title: string;
  h1: string;
  metaDescription: string;
  content: ServiceContent;
};

/** "AI consulting for {Industry}" — composed from real industry content. */
export function industrySpoke(slug: string): IndustrySpoke {
  const content = getIndustry(slug);
  const label = INDUSTRY_LEAVES.find((l) => l.slug === slug)?.label ?? content.title;
  return {
    slug,
    label,
    title: `AI Consulting for ${label}`,
    h1: `AI consulting for ${label.toLowerCase()}`,
    metaDescription: `Applied-AI consulting for ${label.toLowerCase()}: ${content.lede}`,
    content,
  };
}

export const INDUSTRY_SPOKE_ROUTES = INDUSTRY_LEAVES.map(
  (l) => `/ai-consulting/${l.slug}`
);

/* --------------------------------------------------------- Location spokes */

export type CityPage = {
  slug: string;
  city: string;
  region: string;
  /** True only for our two real offices (Denver, Detroit). */
  office: boolean;
  /** City-specific positioning — honest about presence. */
  intro: string;
  /** Sectors prominent in that market (differentiates each page). */
  sectors: string[];
  nearestOffice: string;
};

const CITY_DATA: Omit<CityPage, "slug">[] = [
  {
    city: "Denver",
    region: "United States",
    office: true,
    intro:
      "Denver is one of our two home offices, and where much of the team is based. From here we work with technology, energy, and industrial companies across the Mountain West and the Pacific time zone — strategists and engineers in the same room, shipping AI into production.",
    sectors: ["Technology & Software", "Energy & Utilities", "Industrial Goods"],
    nearestOffice: "Denver",
  },
  {
    city: "Detroit",
    region: "United States",
    office: true,
    intro:
      "Detroit is one of our two home offices, anchoring our work across the Midwest and the eastern half of the country. The team here partners with industrial, logistics, and financial-services companies, building applied AI from a first diagnostic through to a running, measured system.",
    sectors: ["Industrial Goods", "Transportation & Logistics", "Financial Institutions"],
    nearestOffice: "Detroit",
  },
  {
    city: "New York",
    region: "United States",
    office: false,
    intro:
      "We work remote-first with New York financial institutions, insurers, and media companies — the sectors where AI moves regulated, high-stakes numbers fastest — embedded in your tools and your time zone.",
    sectors: ["Financial Institutions", "Insurance", "Consumer & Retail"],
    nearestOffice: "Detroit",
  },
  {
    city: "London",
    region: "United Kingdom",
    office: false,
    intro:
      "We partner remote-first with UK and EU banks, insurers, and public-sector bodies, building AI to a security and compliance bar regulators sign off on — working in your hours and your governance context.",
    sectors: ["Financial Institutions", "Public Sector", "Insurance"],
    nearestOffice: "Detroit",
  },
  {
    city: "Singapore",
    region: "Singapore",
    office: false,
    intro:
      "We serve financial services, logistics, and technology firms across APAC remote-first, embedding with teams in-region and in their time zone — without claiming an office we don't have on the ground.",
    sectors: ["Financial Institutions", "Transportation & Logistics", "Technology & Software"],
    nearestOffice: "Detroit",
  },
  {
    city: "San Francisco",
    region: "United States",
    office: false,
    intro:
      "We work remote-first with San Francisco and Bay Area technology companies — pairing frontier-lab experience with teams shipping AI products to real users.",
    sectors: ["Technology & Software", "Financial Institutions", "Consumer & Retail"],
    nearestOffice: "Denver",
  },
  {
    city: "Boston",
    region: "United States",
    office: false,
    intro:
      "For Boston-area healthcare, life-sciences, and enterprise teams, we build applied AI remote-first — clinical documentation, trial matching, and the evaluation rigor those domains demand.",
    sectors: ["Healthcare & Life Sciences", "Financial Institutions", "Technology & Software"],
    nearestOffice: "Detroit",
  },
  {
    city: "Austin",
    region: "United States",
    office: false,
    intro:
      "We serve Austin's technology, industrial, and enterprise companies remote-first, putting agents and retrieval systems into production in your time zone.",
    sectors: ["Technology & Software", "Industrial Goods", "Energy & Utilities"],
    nearestOffice: "Denver",
  },
  {
    city: "Chicago",
    region: "United States",
    office: false,
    intro:
      "For Chicago's industrials, logistics, and financial firms, we build predictive operations and document-automation AI remote-first, instrumented to prove ROI.",
    sectors: ["Industrial Goods", "Transportation & Logistics", "Financial Institutions"],
    nearestOffice: "Detroit",
  },
  {
    city: "Seattle",
    region: "United States",
    office: false,
    intro:
      "We partner remote-first with Seattle technology, cloud, and retail companies — building production AI on the platforms your engineers already run.",
    sectors: ["Technology & Software", "Consumer & Retail", "Transportation & Logistics"],
    nearestOffice: "Denver",
  },
  {
    city: "Toronto",
    region: "Canada",
    office: false,
    intro:
      "For Toronto's financial-services and AI-research-rich market, we embed remote-first to take models from notebook to regulated production.",
    sectors: ["Financial Institutions", "Technology & Software", "Insurance"],
    nearestOffice: "Detroit",
  },
  {
    city: "Los Angeles",
    region: "United States",
    office: false,
    intro:
      "We work remote-first with Los Angeles media, entertainment, and consumer companies, building AI for content, personalization, and operations at scale.",
    sectors: ["Consumer & Retail", "Technology & Software", "Travel & Hospitality"],
    nearestOffice: "Denver",
  },
];

export const CITIES: CityPage[] = CITY_DATA.map((c) => ({
  ...c,
  slug: slugify(c.city),
}));

export const CITY_SPOKE_ROUTES = CITIES.map((c) => `/ai-consultant/${c.slug}`);

export function getCity(slug: string): CityPage | undefined {
  return CITIES.find((c) => c.slug === slug);
}

/** Every programmatic route, for sitemap inclusion. */
export const PROGRAMMATIC_ROUTES = [
  ...PILLAR_ROUTES,
  ...INDUSTRY_SPOKE_ROUTES,
  ...CITY_SPOKE_ROUTES,
];
