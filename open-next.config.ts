import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Prerendered portfolio. Static assets hold the build-time cache, so no R2 bucket is required.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
