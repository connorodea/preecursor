import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — a stray lockfile in $HOME otherwise confuses
  // Turbopack's root inference.
  turbopack: { root: import.meta.dirname },
  // Static HTML export — served by nginx on the Hetzner VPS, no Node runtime.
  output: "export",
  // The export target cannot run the on-demand image optimizer.
  images: { unoptimized: true },
  // Emit /about/index.html etc. so nginx serves clean URLs without rewrites.
  trailingSlash: true,
};

export default nextConfig;
