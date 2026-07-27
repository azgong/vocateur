import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/assessment", "/pricing", "/science", "/contact", "/privacy", "/terms"],
      disallow: ["/api/", "/auth/", "/results/", "/roadmap/", "/upgrade/"],
    },
    sitemap: "https://vocateur.app/sitemap.xml",
  };
}
