import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConsultantCTA from "@/components/ConsultantCTA";
import TableOfContents from "@/components/TableOfContents";
import AuthorByline from "@/components/AuthorByline";
import { TipList } from "@/components/GuideTips";
import { fetchGuideTips } from "@/lib/fetch-guide-tips";
import Eli5Robots from "@/components/tools/eli5-robots/Eli5Robots";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: guide } = await supabase
    .from("guides")
    .select("title, description")
    .eq("site", "badgeralerts")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!guide) return { title: "Guide not found | Matthew Boyle" };

  return {
    title: `${guide.title} | Matthew Boyle`,
    description: guide.description || undefined,
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: guide } = await supabase
    .from("guides")
    .select("id, title, description, updated_at")
    .eq("site", "badgeralerts")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!guide) notFound();

  const lastUpdated = new Date(guide.updated_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { tips, sections } = await fetchGuideTips(supabase, guide.id);

  return (
    <div className="bg-white text-ink">
      <Navbar />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">
        <Link href="/blog" className="text-[13px] text-muted hover:text-accent-dark transition-colors">
          ← All guides
        </Link>

        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4 mt-6">Guide</div>
        <h1 className="font-serif font-normal text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] text-ink mb-4">
          {guide.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-5">
          <AuthorByline />
          <span className="text-[13px] text-muted">Last updated: {lastUpdated}</span>
        </div>
        {guide.description && (
          <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] mb-12 max-w-[560px]">
            {guide.description}
          </p>
        )}

        {/* The technical SEO guide gets the robots.txt tool's input form. Results open on the full tool page. */}
        {slug === "technical-seo" && <Eli5Robots handoffTo="/tools/eli5-robots" />}

        {!tips || tips.length === 0 ? (
          <div className="border border-border rounded-[20px] px-8 py-12 text-center mb-4">
            <p className="text-[15px] text-mid font-light">
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
