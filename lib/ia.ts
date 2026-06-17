/**
 * Information architecture — the single source of truth for navigation.
 *
 * Drives the mega-menu, the footer, and static generation of the section +
 * detail pages. Lifted from the handoff's RAW + PANELS data, then extended
 * with real routes so every menu leaf resolves to a real page.
 *
 * Routing model (scope "A"):
 *   - Industries & Capabilities leaves  -> templated detail pages  (/industries/[slug], /capabilities/[slug])
 *   - Every other leaf                  -> its hub page + in-page anchor (/labs#benchmarks, ...)
 */

export function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type Leaf = { label: string; href: string; slug: string };

export type Panel = {
  id: string;
  title: string;
  desc: string;
  /** Hub route for this section. */
  href: string;
  col1: Leaf[];
  col2: Leaf[];
};

export type LeftEntry =
  | { type: "header"; label: string }
  | { type: "child" | "link"; id: string; label: string; href: string };

/** Build a leaf whose href is a detail page under the section. */
const detail = (section: string) => (label: string): Leaf => {
  const slug = slugify(label);
  return { label, slug, href: `/${section}/${slug}` };
};

/** Build a leaf whose href is an anchor on the section's hub page. */
const anchor = (hub: string, override?: Record<string, string>) => (label: string): Leaf => {
  const slug = slugify(label);
  return { label, slug, href: override?.[label] ?? `${hub}#${slug}` };
};

export const PANELS: Record<string, Panel> = {
  industries: {
    id: "industries",
    title: "Industries",
    desc: "How we draw on deep sector expertise to put AI to work where it changes the numbers.",
    href: "/industries",
    col1: ["Financial Institutions", "Insurance", "Healthcare & Life Sciences", "Industrial Goods", "Energy & Utilities", "Consumer & Retail"].map(detail("industries")),
    col2: ["Technology & Software", "Private Equity", "Public Sector", "Telecommunications", "Transportation & Logistics", "Travel & Hospitality"].map(detail("industries")),
  },
  capabilities: {
    id: "capabilities",
    title: "Capabilities",
    desc: "The disciplines we bring to every engagement — from first diagnostic to production scale.",
    href: "/capabilities",
    col1: ["AI Strategy & Diagnostics", "Applied Builds", "Agentic Systems", "Data & Platform Engineering"].map(detail("capabilities")),
    col2: ["Evaluation & Safety", "MLOps & Scale", "Change & Enablement", "Responsible AI"].map(detail("capabilities")),
  },
  labs: {
    id: "labs",
    title: "Preecursor Labs",
    desc: "Our research and tooling arm — where we sharpen the methods before they reach a client.",
    href: "/labs",
    col1: ["Frontier Research", "Open Tooling", "Reference Architectures"].map(anchor("/labs")),
    col2: ["Benchmarks", "Publications", "Fellowships"].map(anchor("/labs")),
  },
  insights: {
    id: "insights",
    title: "Our Insights",
    desc: "Field notes, reports, and briefings from the front lines of applied AI.",
    href: "/insights",
    col1: ["Reports", "Field Notes", "Executive Briefings"].map(anchor("/insights")),
    col2: ["The Preecursor Newsletter", "Webinars", "Index of Work"].map(anchor("/insights")),
  },
  worldwide: {
    id: "worldwide",
    title: "Preecursor Worldwide",
    desc: "One firm, embedded close to where our clients build.",
    href: "/worldwide",
    col1: ["Denver", "Detroit"].map(anchor("/worldwide")),
    col2: ["Remote-first teams"].map(anchor("/worldwide")),
  },
  careers: {
    id: "careers",
    title: "Careers",
    desc: "We hire operators and engineers who would rather ship than advise.",
    href: "/careers",
    col1: ["Open Roles", "Engineering", "Strategy"].map(anchor("/careers")),
    col2: ["Research", "Internships", "Life at Preecursor"].map(anchor("/careers")),
  },
  about: {
    id: "about",
    title: "About Preecursor",
    desc: "An applied-AI studio built for leaders who need more than advice.",
    href: "/about",
    col1: ["Our Story", "Values", "How We Work"].map(anchor("/about")),
    col2: ["Partnerships", "Press", "Contact"].map(anchor("/about", { Contact: "/contact" })),
  },
  impact: {
    id: "impact",
    title: "The Work",
    desc: "Illustrative examples of the systems we build and the outcomes they're designed to produce.",
    href: "/work",
    col1: ["Case Studies", "Outcomes", "Methodology"].map(anchor("/work", { "Case Studies": "/work" })),
    col2: ["What to Expect", "Sectors Served"].map(anchor("/work")),
  },
  leadership: {
    id: "leadership",
    title: "Leadership",
    desc: "Partners who have led research at frontier labs and scaled platforms in production.",
    href: "/leadership",
    col1: ["Partners", "Advisors"].map(anchor("/leadership")),
    col2: ["Operators", "Researchers"].map(anchor("/leadership")),
  },
};

/** Left index column of the mega-menu (headers + child/link rows). */
export const LEFT_ENTRIES: LeftEntry[] = [
  { type: "header", label: "Our Services" },
  { type: "child", id: "industries", label: "Industries", href: "/industries" },
  { type: "child", id: "capabilities", label: "Capabilities", href: "/capabilities" },
  { type: "child", id: "labs", label: "Preecursor Labs", href: "/labs" },
  { type: "link", id: "insights", label: "Our Insights", href: "/insights" },
  { type: "link", id: "worldwide", label: "Preecursor Worldwide", href: "/worldwide" },
  { type: "link", id: "careers", label: "Careers", href: "/careers" },
  { type: "header", label: "Our Company" },
  { type: "child", id: "about", label: "About Preecursor", href: "/about" },
  { type: "child", id: "impact", label: "Client Impact", href: "/work" },
  { type: "child", id: "leadership", label: "Leadership", href: "/leadership" },
];

/** Footer columns — real routes for the chrome's footer. */
export const FOOTER = {
  firm: [
    { label: "Capabilities", href: "/capabilities" },
    { label: "Selected work", href: "/work" },
    { label: "How we work", href: "/about#how-we-work" },
    { label: "Our people", href: "/leadership" },
  ],
  industries: [
    { label: "Financial services", href: "/industries/financial-institutions" },
    { label: "Healthcare & life sciences", href: "/industries/healthcare-and-life-sciences" },
    { label: "Industrials", href: "/industries/industrial-goods" },
    { label: "Public sector", href: "/industries/public-sector" },
  ],
  contact: [
    { label: "hello@preecursor.com", href: "mailto:hello@preecursor.com" },
    { label: "Denver · Detroit · Remote-first", href: "/worldwide" },
  ],
} as const;

/** Slugs for static generation of the two templated detail families. */
export const INDUSTRY_LEAVES: Leaf[] = [...PANELS.industries.col1, ...PANELS.industries.col2];
export const CAPABILITY_LEAVES: Leaf[] = [...PANELS.capabilities.col1, ...PANELS.capabilities.col2];

export const CONTACT_EMAIL = "hello@preecursor.com";
export const LOCATIONS = ["Denver", "Detroit"] as const;
