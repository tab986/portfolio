import type { MetadataRoute } from "next";
import { metadataBase } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", metadataBase).href,
  };
}
