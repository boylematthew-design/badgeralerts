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
import { getGuideHeadings } from "@/lib/guide-headings";
import { getServiceForGuide } from "@/lib/services";

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
    .select("id, slug, title, description, topic_name, updated_at")
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
  const topicName = guide.topic_name || guide.title;
  const headings = getGuideHeadings(slug, topicName);
  const service = getServiceForGuide(guide);

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
          <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] mb-6 max-w-[560px]">
            {guide.description}
          </p>
        )}

        <p className="bg-accent-light rounded-[14px] px-5 md:px-6 py-4 text-[14px] md:text-[15px] text-mid font-light leading-[1.6] mb-12">
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

        <h2 className="font-serif text-[22px] md:text-[26px] text-ink font-normal mb-5">
          {headings.guide}
        </h2>

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
