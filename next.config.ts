import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

// Local Next.js dev can read wrangler bindings. The helper no-ops outside `next dev`.
initOpenNextCloudflareForDev();
