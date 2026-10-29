import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { TEAM } from "@/lib/team";
import { getServiceForGuide } from "@/lib/services";
import { TOOLS } from "@/lib/tools";
import { guidePath } from "@/lib/blog-guides";

const BASE_URL = "https://www.badgeralerts.live";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/consulting`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/cookies`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const { data: guides } = await supabase
    .from("guides")
    .select("id, slug, parent_id, title, topic_name, updated_at")
    .eq("site", "badgeralerts")
    .eq("published", true);

  const blogPages: MetadataRoute.Sitemap = (guides ?? []).map((guide) => ({
    url: `${BASE_URL}${guidePath(guide, guides ?? [])}`,
    lastModified: new Date(guide.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const servicePages: MetadataRoute.Sitemap = (guides ?? []).map((guide) => ({
    url: `${BASE_URL}/services/${getServiceForGuide(guide).slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const authorPages: MetadataRoute.Sitemap = TEAM.map((person) => ({
    url: `${BASE_URL}/author/${person.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...servicePages, ...toolPages, ...authorPages];
}
