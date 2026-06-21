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

interface TipData {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  image_alt: string | null;
  image_caption: string | null;
  section_id: string | null;
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
      <h2 className="font-serif text-[22px] md:text-[26px] text-ink font-normal mb-3">
        {tip.title}
      </h2>
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

  const [{ data: tips }, { data: sections }] = await Promise.all([
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
