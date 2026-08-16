import type { MetadataRoute } from "next";
import { portfolios } from "@/lib/mock-data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://devgallery.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1.0 },
  ];

  const portfolioRoutes: MetadataRoute.Sitemap = portfolios
    .filter((p) => p.status === "LIVE")
    .map((p) => ({
      url: `${BASE_URL}/portfolio/${p.slug}`,
      lastModified: p.createdAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  return [...staticRoutes, ...portfolioRoutes];
}
