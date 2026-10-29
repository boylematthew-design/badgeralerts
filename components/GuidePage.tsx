import { createClient } from "@supabase/supabase-js";
import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultantCTA from "@/components/ConsultantCTA";
import TableOfContents from "@/components/TableOfContents";
import AuthorByline from "@/components/AuthorByline";
import PageHero, { heroLinkClass } from "@/components/PageHero";
import { TipList } from "@/components/GuideTips";
import { fetchGuideTips } from "@/lib/fetch-guide-tips";
import { getGuideHeadings } from "@/lib/guide-headings";
import { getServiceForGuide } from "@/lib/services";
import { getGuideMeta } from "@/lib/guide-meta";
import { fetchPublishedGuides, findGuideBySlug, guidePath, tipCount } from "@/lib/blog-guides";

// Shared by /blog/[slug] (top-level guides) and /blog/[slug]/[child] (guides under a parent).
// Both routes look the guide up by the last part of the address, so if a guide has been moved
// or renamed in the admin, any old address permanently redirects (308) to the current one.

const BASE_URL = "https://www.compoundingwins.com";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function resolveGuide(slug: string) {
  const guides = await fetchPublishedGuides(supabase);
  const guide = findGuideBySlug(guides, slug);
  if (!guide) return null;
  const parent = guide.parent_id ? guides.find((g) => g.id === guide.parent_id) : undefined;
  const children = guides.filter((g) => g.parent_id === guide.id);
  return { guide, guides, parent, children, path: guidePath(guide, guides) };
}

export async function guideMetadata(slug: string): Promise<Metadata> {
  const found = await resolveGuide(slug);
  if (!found) return { title: "Guide not found | Compounding Wins" };

  const { guide, path } = found;
  const alternates = { canonical: `${BASE_URL}${path}` };
  const meta = getGuideMeta(guide.slug);
  if (meta) return { ...meta, alternates };

  return {
    title: `${guide.title} | Compounding Wins`,
    description: guide.description || undefined,
    alternates,
  };
}

export default async function GuidePage({ slug, requestedPath }: { slug: string; requestedPath: string }) {
  const found = await resolveGuide(slug);
  if (!found) notFound();
  if (found.path !== requestedPath) permanentRedirect(found.path);

  const { guide, guides, parent, children, path } = found;

  const lastUpdated = new Date(guide.updated_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { tips, sections } = await fetchGuideTips(supabase, guide.id);
  const topicName = guide.topic_name || guide.title;
  const headings = getGuideHeadings(guide.slug, topicName);
  const service = getServiceForGuide(guide);

  // Breadcrumb structured data, so Google can show "Guides › Local SEO › Google Maps marketing".
  const crumbs = [
    { name: "Guides", url: `${BASE_URL}/blog` },
    ...(parent ? [{ name: parent.title, url: `${BASE_URL}${guidePath(parent, guides)}` }] : []),
    { name: guide.title, url: `${BASE_URL}${path}` },
  ];
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  return (
    <div className="bg-paper text-ink">
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="Guide"
        title={<>{guide.title}</>}
        before={
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] text-muted-dark">
            <Link href="/blog" className={heroLinkClass}>
              ← All guides
            </Link>
            {parent && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={guidePath(parent, guides)} className={heroLinkClass}>
                  {parent.title}
                </Link>
              </>
            )}
          </nav>
        }
        intro={guide.description || undefined}
        after={
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-6">
            <AuthorByline variant="dark" />
            <span className="text-[13px] text-muted-dark">Last updated: {lastUpdated}</span>
          </div>
        }
      />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">
        <p className="bg-accent-light rounded-[14px] px-5 md:px-6 py-4 text-[14px] md:text-[15px] text-mid leading-[1.6] mb-12">
          If you are looking for a {service.name} expert and services, we have a separate guide on
          that where you can learn more:{" "}
          <Link
            href={`/services/${service.slug}`}
            className="font-medium text-accent-dark underline underline-offset-2 hover:opacity-80"
          >
            {service.name} expert services
          </Link>
          .
        </p>

        {children.length > 0 && (
          <section className="mb-12">
            <h2 className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-3">
              More {topicName} guides
            </h2>
            <div className="space-y-3">
              {children.map((child) => {
                const count = tipCount(child);
                return (
                  <Link
                    key={child.id}
                    href={guidePath(child, guides)}
                    className="group flex items-center justify-between gap-4 border border-border rounded-[14px] px-5 py-4 hover:border-accent-dark/40 transition-colors"
                  >
                    <span className="font-heading font-bold tracking-[-0.03em] text-[17px] md:text-[19px] text-ink group-hover:text-accent-dark transition-colors">
                      {child.title}
                    </span>
                    <span className="text-[12px] text-muted flex-shrink-0">
                      {count} tip{count !== 1 ? "s" : ""}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <h2 className="font-heading font-bold tracking-[-0.03em] text-[22px] md:text-[26px] text-ink mb-5">
          {headings.guide}
        </h2>

        {!tips || tips.length === 0 ? (
          <div className="border border-border rounded-[20px] px-8 py-12 text-center mb-4">
            <p className="text-[15px] text-mid">
              Tips for this guide are coming soon — check back shortly.
            </p>
          </div>
        ) : (
          <>
            {tips.length > 1 && (
              <TableOfContents tips={tips} sections={sections} />
            )}
            <TipList tips={tips} sections={sections} />
          </>
        )}

        <ConsultantCTA />
      </main>
      <Footer />
    </div>
  );
}
