import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteGuideButton from "./DeleteGuideButton";
import SectionManager from "./SectionManager";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminGuidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [{ data: guide }, { data: tips }, { data: sections }] = await Promise.all([
    supabaseAdmin.from("guides").select("*").eq("id", id).single(),
    supabaseAdmin.from("tips").select("*").eq("guide_id", id).order("sort_order", { ascending: true }),
    supabaseAdmin.from("tip_sections").select("*").eq("guide_id", id).order("sort_order", { ascending: true }),
  ]);

  if (!guide) redirect("/admin/blog");

  return (
    <>
      <div className="mb-8">
        <Link href="/admin/blog" className="text-sm text-slate-400 hover:text-slate-600 transition">
          ← Back to guides
        </Link>
        <div className="flex items-start justify-between gap-4 mt-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-slate-900">{guide.title}</h1>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  guide.published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {guide.published ? "Published" : "Draft"}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              /blog/{guide.slug} · Topic: {guide.topic_name}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Link
              href={`/admin/blog/${guide.id}/edit`}
              className="text-sm font-semibold text-slate-500 hover:text-slate-700 px-3 py-2 rounded-xl hover:bg-slate-50 transition"
            >
              Edit guide
            </Link>
            <DeleteGuideButton guideId={guide.id} />
          </div>
        </div>
      </div>

      <SectionManager
        guide={{ id: guide.id, slug: guide.slug, title: guide.title, topic_name: guide.topic_name }}
        sections={sections ?? []}
        tips={tips ?? []}
      />

      <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 mt-6 text-sm">
        <p className="font-bold text-slate-700 mb-1">About the consultant CTA</p>
        <p className="text-slate-500">
          A &ldquo;hire me&rdquo; section is automatically added to the bottom of this guide on the public page,
          using the topic name (&ldquo;{guide.topic_name}&rdquo;) and your LinkedIn link. You don&apos;t need to add it as a tip.
        </p>
      </div>
    </>
  );
}
