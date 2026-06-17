import type { MetadataRoute } from "next";

// Static export: emit a static manifest.webmanifest at build.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Preecursor",
    short_name: "Preecursor",
    description:
      "An applied-AI studio for leaders who need more than advice — strategy and production engineering in one continuous engagement.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d1b2e",
    theme_color: "#dce8f7",
    icons: [
      { src: "/icon-192.png", type: "image/png", sizes: "192x192", purpose: "any" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512", purpose: "any" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512", purpose: "maskable" },
    ],
  };
}
