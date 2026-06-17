import type { MetadataRoute } from "next";
import { siteRoutes, absoluteUrl, displayDateToISO } from "@/lib/seo";
import { INSIGHTS } from "@/lib/content/insights";

// Static export: emit a static sitemap.xml at build.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // The static site is rebuilt + redeployed on every merge, so the build time
  // is an honest "last modified" for templated pages. Insights carry their own
  // published date, which is more accurate, so prefer it where we have it.
  const built = new Date();
  const insightDate = new Map<string, Date>();
  for (const a of INSIGHTS) {
    const iso = displayDateToISO(a.date);
    if (iso) insightDate.set(`/insights/${a.slug}`, new Date(iso));
  }

  return siteRoutes().map((path) => {
    const depth = path === "/" ? 0 : path.split("/").filter(Boolean).length;
    return {
      url: absoluteUrl(path),
      lastModified: insightDate.get(path) ?? built,
      changeFrequency: depth === 0 ? "weekly" : "monthly",
      priority: depth === 0 ? 1 : depth === 1 ? 0.8 : 0.6,
    };
  });
}
