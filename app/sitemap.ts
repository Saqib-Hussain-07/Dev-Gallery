import type { MetadataRoute } from "next";
import { portfolios } from "@/lib/mock-data";

const BASE_URL = "https://ledger.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/submit`, changeFrequency: "monthly", priority: 0.5 },
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
