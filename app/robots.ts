import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/dashboard/", "/reset-password", "/unsubscribe"],
    },
    sitemap: "https://www.badgeralerts.live/sitemap.xml",
  };
}
