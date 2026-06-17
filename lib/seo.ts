/**
 * SEO helpers — the single source of truth for the site's URL list and
 * structured-data (JSON-LD) nodes. Kept as pure functions so they're testable
 * and reused by app/sitemap.ts, app/robots.ts, and the root layout.
 */

import { INDUSTRY_LEAVES, CAPABILITY_LEAVES, CONTACT_EMAIL } from "./ia";
import { WORK_CASES } from "./content/work";
import { INSIGHTS } from "./content/insights";
import { PROGRAMMATIC_ROUTES } from "./content/programmatic";
import { USE_CASE_ROUTES } from "./content/usecases";
import { GLOSSARY_ROUTES } from "./content/glossary";
import { COMPARISON_ROUTES } from "./content/comparisons";

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
    ...USE_CASE_ROUTES,
    ...GLOSSARY_ROUTES,
    ...COMPARISON_ROUTES,
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
      images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: ["/og.png"],
    },
  };
}

/**
 * BreadcrumbList node — the structured-data trail for a deep page, used for
 * breadcrumb rich results in search. `items` is the visible trail (root → …
 * → current page); URLs should be absolute (use `absoluteUrl`). Positions are
 * 1-indexed per schema.org.
 */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

const MONTHS: Record<string, string> = {
  January: "01",
  February: "02",
  March: "03",
  April: "04",
  May: "05",
  June: "06",
  July: "07",
  August: "08",
  September: "09",
  October: "10",
  November: "11",
  December: "12",
};

/** Best-effort "Month YYYY" → ISO date (first of that month). Undefined if the
 *  display string isn't in that shape, so callers can omit datePublished. */
export function displayDateToISO(date: string): string | undefined {
  const m = date.trim().match(/^([A-Za-z]+)\s+(\d{4})$/);
  const mm = m ? MONTHS[m[1]] : undefined;
  return m && mm ? `${m[2]}-${mm}-01` : undefined;
}

/**
 * BlogPosting (Article) node for an insights piece — makes the article eligible
 * for article rich results. `url` should be absolute. `image` may be a site-
 * relative path (resolved against BASE_URL) or an absolute URL.
 */
export function articleSchema({
  title,
  description,
  author,
  date,
  url,
  image = "/og.png",
}: {
  title: string;
  description: string;
  author: string;
  date: string;
  url: string;
  image?: string;
}) {
  const iso = displayDateToISO(date);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    ...(iso ? { datePublished: iso } : {}),
    author: { "@type": "Organization", name: author },
    publisher: { "@type": "Organization", name: "Preecursor", url: BASE_URL },
    image: image.startsWith("http") ? image : `${BASE_URL}${image}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
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
