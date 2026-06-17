/**
 * SEO helpers — the single source of truth for the site's URL list and
 * structured-data (JSON-LD) nodes. Kept as pure functions so they're testable
 * and reused by app/sitemap.ts, app/robots.ts, and the root layout.
 */

import { INDUSTRY_LEAVES, CAPABILITY_LEAVES, CONTACT_EMAIL } from "./ia";
import { WORK_CASES } from "./content/work";
import { INSIGHTS } from "./content/insights";

export const BASE_URL = "https://preecursor.com";

const HUB_ROUTES = [
  "/",
  "/industries",
  "/capabilities",
  "/labs",
  "/insights",
  "/work",
  "/about",
  "/careers",
  "/worldwide",
  "/leadership",
  "/contact",
];

/** Every public route on the site (hubs + templated detail pages). */
export function siteRoutes(): string[] {
  return [
    ...HUB_ROUTES,
    ...INDUSTRY_LEAVES.map((l) => `/industries/${l.slug}`),
    ...CAPABILITY_LEAVES.map((l) => `/capabilities/${l.slug}`),
    ...WORK_CASES.map((c) => `/work/${c.slug}`),
    ...INSIGHTS.map((a) => `/insights/${a.slug}`),
  ];
}

/** Absolute, trailing-slashed URL for a route (matches trailingSlash export). */
export function absoluteUrl(path: string): string {
  if (path === "/") return `${BASE_URL}/`;
  return `${BASE_URL}${path}/`;
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Preecursor",
    url: BASE_URL,
    email: CONTACT_EMAIL,
    description:
      "An applied-AI studio for leaders who need more than advice — strategy and production engineering in one continuous engagement.",
    areaServed: "Worldwide",
    sameAs: [] as string[],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Preecursor",
    url: BASE_URL,
  };
}
