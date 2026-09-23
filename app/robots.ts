import type { MetadataRoute } from "next";
import { BRAND } from "@/config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/app/", "/entrar/"] }], sitemap: `${BRAND.siteUrl}/sitemap.xml` };
}
