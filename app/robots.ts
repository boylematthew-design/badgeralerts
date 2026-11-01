import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/dashboard/", "/unsubscribe"],
    },
    sitemap: "https://www.compoundingwins.com/sitemap.xml",
  };
}
