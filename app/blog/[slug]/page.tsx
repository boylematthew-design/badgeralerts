import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarkdownContent from "@/components/MarkdownContent";
import ConsultantCTA from "@/components/ConsultantCTA";
import BlogSignupCTA from "@/components/BlogSignupCTA";
import AuthorByline from "@/components/AuthorByline";

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
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!guide) return { title: "Guide not found | BadgerAlerts" };

  return {
    title: `${guide.title} | BadgerAlerts`,
    description: guide.description || undefined,
  };
}

interface TipLink {
  id: string;
  url: string;
  context: string | null;
  preview_title: string | null;
  preview_description: string | null;
  preview_favicon: string | null;
  sort_order: number;
}

interface TipData {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  image_alt: string | null;
  image_caption: string | null;
  section_id: string | null;
  tip_links: TipLink[];
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

interface SectionData {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
}

function TipCard({ tip, tipNumber, showCTA, topicName }: {
  tip: TipData;
  tipNumber: number;
  showCTA: boolean;
  topicName: string;
}) {
  return (
    <div className="py-8 first:pt-0 last:pb-0">
      <div className="text-[11px] font-medium tracking-[0.08em] text-accent-dark uppercase mb-2">
        Tip {tipNumber}
      </div>
      <h3 className="font-serif text-[22px] md:text-[26px] text-ink font-normal mb-3">
        {tip.title}
      </h3>
      {tip.content && <MarkdownContent content={tip.content} />}
      {tip.image_url && (
        <div className="mt-5 max-w-[320px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tip.image_url}
            alt={tip.image_alt || tip.title}
            className="w-full rounded-[14px] border border-border"
          />
          {tip.image_caption && (
            <p className="text-[13px] text-muted italic mt-2">{tip.image_caption}</p>
          )}
        </div>
      )}
      {tip.tip_links && tip.tip_links.length > 0 && (
        <div className="mt-6">
          <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-3">
            Relevant links
          </p>
          <div className="space-y-2">
            {[...tip.tip_links]
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 border border-border rounded-[12px] px-4 py-3 hover:border-accent-dark transition-colors group no-underline"
                >
                  <div className="shrink-0 mt-0.5 w-4 h-4">
                    {link.preview_favicon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={link.preview_favicon}
                        alt=""
                        className="w-4 h-4 rounded-sm"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-ink group-hover:text-accent-dark transition-colors leading-snug truncate">
                      {link.preview_title || link.url}
                    </p>
                    {link.context && (
                      <p className="text-[12px] text-mid mt-0.5 leading-snug">{link.context}</p>
                    )}
                    <p className="text-[11px] text-muted mt-1">{getDomain(link.url)}</p>
                  </div>
                  <span className="text-muted group-hover:text-accent-dark transition-colors shrink-0 mt-0.5 text-[13px]">
                    ↗
                  </span>
                </a>
              ))}
          </div>
        </div>
      )}
      {showCTA && (
        <div className="mt-8">
          <BlogSignupCTA topicName={topicName} />
        </div>
      )}
    </div>
  );
}

function TipList({ tips, sections, topicName }: {
  tips: TipData[];
  sections: SectionData[];
  topicName: string;
}) {
  const hasSections = sections.length > 0;

  if (!hasSections) {
    return (
      <div className="divide-y divide-border">
        {tips.map((tip, index) => (
          <TipCard
            key={tip.id}
            tip={tip}
            tipNumber={index + 1}
            showCTA={index === 1 && tips.length >= 2}
            topicName={topicName}
          />
        ))}
      </div>
    );
  }

  const unsectionedTips = tips.filter((t) => !t.section_id);
  const sectionGroups = sections.map((section) => ({
    ...section,
    tips: tips.filter((t) => t.section_id === section.id),
  })).filter((group) => group.tips.length > 0);

  let globalIndex = 0;

  return (
    <div>
      {unsectionedTips.length > 0 && (
        <div className="divide-y divide-border">
          {unsectionedTips.map((tip) => {
            globalIndex++;
            return (
              <TipCard
                key={tip.id}
                tip={tip}
                tipNumber={globalIndex}
                showCTA={globalIndex === 2 && tips.length >= 2}
                topicName={topicName}
              />
            );
          })}
        </div>
      )}

      {sectionGroups.map((group) => (
        <div key={group.id} className="mt-12 first:mt-0">
          <div className="mb-6">
            <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-1">
              Section
            </div>
            <h2 className="font-serif text-[24px] md:text-[30px] text-ink font-normal">
              {group.title}
            </h2>
            {group.description && (
              <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] mt-2 max-w-[560px]">
                {group.description}
              </p>
            )}
          </div>
          <div className="divide-y divide-border">
            {group.tips.map((tip) => {
              globalIndex++;
              return (
                <TipCard
                  key={tip.id}
                  tip={tip}
                  tipNumber={globalIndex}
                  showCTA={globalIndex === 2 && tips.length >= 2}
                  topicName={topicName}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: guide } = await supabase
    .from("guides")
    .select("id, title, description, topic_name, updated_at")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!guide) notFound();

  const lastUpdated = new Date(guide.updated_at).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [{ data: tipsRaw }, { data: sections }] = await Promise.all([
    supabase
      .from("tips")
      .select("id, title, content, image_url, image_alt, image_caption, section_id")
      .eq("guide_id", guide.id)
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("tip_sections")
      .select("id, title, description, sort_order")
      .eq("guide_id", guide.id)
      .order("sort_order", { ascending: true }),
  ]);

  const tipIds = (tipsRaw ?? []).map((t) => t.id);
  const { data: allTipLinks } =
    tipIds.length > 0
      ? await supabase
          .from("tip_links")
          .select("id, tip_id, url, context, preview_title, preview_description, preview_favicon, sort_order")
          .in("tip_id", tipIds)
          .order("sort_order", { ascending: true })
      : { data: [] };

  const tips: TipData[] = (tipsRaw ?? []).map((tip) => ({
    ...tip,
    tip_links: (allTipLinks ?? []).filter((l) => l.tip_id === tip.id),
  }));

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

        {!tips || tips.length === 0 ? (
          <div className="border border-border rounded-[20px] px-8 py-12 text-center mb-4">
            <p className="text-[15px] text-mid font-light">
              Tips for this guide are coming soon — check back shortly.
            </p>
          </div>
        ) : (
          <TipList tips={tips} sections={sections ?? []} topicName={guide.topic_name} />
        )}

        <ConsultantCTA />
      </main>
      <Footer />
    </div>
  );
}
