import type { MetadataRoute } from "next";
import { metadataBase } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL("/", metadataBase).href,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
