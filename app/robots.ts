import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/portfolio/*/admin", "/api/"],
      },
    ],
    sitemap: "https://ledger.example.com/sitemap.xml",
  };
}
