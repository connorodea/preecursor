import type { MetadataRoute } from "next";
import { siteRoutes, absoluteUrl } from "@/lib/seo";

// Static export: emit a static sitemap.xml at build.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return siteRoutes().map((path) => {
    const depth = path === "/" ? 0 : path.split("/").filter(Boolean).length;
    return {
      url: absoluteUrl(path),
      changeFrequency: depth === 0 ? "weekly" : "monthly",
      priority: depth === 0 ? 1 : depth === 1 ? 0.8 : 0.6,
    };
  });
}
