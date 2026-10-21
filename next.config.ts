import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// Wrangler bindings are only for `next dev`. Vercel runs `next build` and must not boot Miniflare.
if (process.argv.includes("dev")) {
  initOpenNextCloudflareForDev();
}
