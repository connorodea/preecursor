import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

// Static export: emit a static robots.txt at build.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
