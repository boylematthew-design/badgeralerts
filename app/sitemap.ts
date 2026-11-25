import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { TEAM } from "@/lib/team";
import { getServiceForGuide } from "@/lib/services";
import { TOOLS } from "@/lib/tools";
import { guidePath } from "@/lib/blog-guides";

const BASE_URL = "https://www.compoundingwins.com";

// Every URL gets a lastmod (lastModified) that is the date its content really changed. Google only
// trusts lastmod when it's consistently accurate, so never use new Date() here: that claims every
// page changed on every crawl, and Google then ignores lastmod for the whole site.
//
// Pages built from code (not the database) keep their date by hand below, in lib/tools.ts and in
// lib/team.ts. Bump the date when you make a real change to that page's content (not for
// behind-the-scenes code tweaks). Pages that list guides or tools also move forward automatically
// when a newer guide or tool is published.
const PAGE_UPDATED = {
  home: "2026-11-25",
  about: "2026-11-25",
  contact: "2026-11-25",
  services: "2026-11-25",
  tools: "2026-10-30",
  consulting: "2026-11-25",
  faq: "2026-11-25",
  blog: "2026-11-25",
  // Shared copy on every /services/[slug] page: what I do, how I work, pricing, FAQs, who I am.
  servicePageTemplate: "2026-11-25",
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// The most recent of several dates (ignores missing or invalid ones).
function latest(...dates: (string | Date | null | undefined)[]): Date {
  const times = dates
    .map((d) => (d ? new Date(d).getTime() : NaN))
    .filter((t) => !Number.isNaN(t));
  return new Date(Math.max(...times));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data } = await supabase
    .from("guides")
    .select("id, slug, parent_id, title, topic_name, updated_at")
    .eq("site", "badgeralerts")
    .eq("published", true);
  const guides = data ?? [];

  const newestGuide = latest(...guides.map((g) => g.updated_at));
  const newestTool = latest(...TOOLS.map((t) => t.updated));

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: latest(PAGE_UPDATED.home, newestGuide, newestTool), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: latest(PAGE_UPDATED.about), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: latest(PAGE_UPDATED.contact), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/services`, lastModified: latest(PAGE_UPDATED.services, newestGuide), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools`, lastModified: latest(PAGE_UPDATED.tools, newestTool), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/consulting`, lastModified: latest(PAGE_UPDATED.consulting), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/faq`, lastModified: latest(PAGE_UPDATED.faq), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: latest(PAGE_UPDATED.blog, newestGuide), changeFrequency: "weekly", priority: 0.9 },
  ];

  const blogPages: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: `${BASE_URL}${guidePath(guide, guides)}`,
    lastModified: new Date(guide.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // A services page is built from its guide's data plus the shared template copy, so it changed
  // whenever either did. Keyed by URL so a service is only listed once even if two guides share it.
  const services = new Map<string, Date>();
  for (const guide of guides) {
    const url = `${BASE_URL}/services/${getServiceForGuide(guide).slug}`;
    services.set(url, latest(services.get(url), guide.updated_at, PAGE_UPDATED.servicePageTemplate));
  }
  const servicePages: MetadataRoute.Sitemap = [...services].map(([url, lastModified]) => ({
    url,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const toolPages: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: latest(tool.updated),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const authorPages: MetadataRoute.Sitemap = TEAM.map((person) => ({
    url: `${BASE_URL}/author/${person.slug}`,
    lastModified: latest(person.updated),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages, ...servicePages, ...toolPages, ...authorPages];
}
