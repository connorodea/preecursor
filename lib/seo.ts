/**
 * SEO helpers — the single source of truth for the site's URL list and
 * structured-data (JSON-LD) nodes. Kept as pure functions so they're testable
 * and reused by app/sitemap.ts, app/robots.ts, and the root layout.
 */

import { INDUSTRY_LEAVES, CAPABILITY_LEAVES, CONTACT_EMAIL } from "./ia";
import { WORK_CASES } from "./content/work";
import { INSIGHTS } from "./content/insights";
import { PROGRAMMATIC_ROUTES } from "./content/programmatic";

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
    ...PROGRAMMATIC_ROUTES,
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

/**
 * Per-page metadata block (canonical + OpenGraph + Twitter), spread into a
 * page's `metadata` / `generateMetadata` so every page shares consistent,
 * unique social cards.
 */
export function socialMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const url = absoluteUrl(path);
  return {
    alternates: { canonical: url },
    openGraph: {
      type: "website" as const,
      siteName: "Preecursor",
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
  };
}

/** ProfessionalService node for a programmatic service/landing page. */
export function serviceSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name,
    description,
    ...(url ? { url } : {}),
    serviceType: "Applied AI consulting",
    areaServed: "Worldwide",
    provider: {
      "@type": "Organization",
      name: "Preecursor",
      url: BASE_URL,
    },
  };
}
