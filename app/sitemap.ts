import type { MetadataRoute } from "next";
import { BRAND, ORDER_BUMPS } from "@/config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BRAND.siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    ...Object.values(ORDER_BUMPS).map((b) => ({ url: `${BRAND.siteUrl}/extras/${b.slug}/`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
