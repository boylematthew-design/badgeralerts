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

  const { data: tips } = await supabase
    .from("tips")
    .select("id, title, content, image_url")
    .eq("guide_id", guide.id)
    .eq("published", true)
    .order("sort_order", { ascending: true });

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
          <div className="divide-y divide-border">
            {tips.map((tip, index) => (
              <div key={tip.id} className="py-8 first:pt-0 last:pb-0">
                <div className="text-[11px] font-medium tracking-[0.08em] text-accent-dark uppercase mb-2">
                  Tip {index + 1}
                </div>
                <h2 className="font-serif text-[22px] md:text-[26px] text-ink font-normal mb-3">
                  {tip.title}
                </h2>
                {tip.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={tip.image_url}
                    alt={tip.title}
                    className="w-full rounded-[14px] border border-border mb-5"
                  />
                )}
                {tip.content && <MarkdownContent content={tip.content} />}
                {index === 1 && tips.length >= 2 && (
                  <div className="mt-8">
                    <BlogSignupCTA topicName={guide.topic_name} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <ConsultantCTA />
      </main>
      <Footer />
    </div>
  );
}
