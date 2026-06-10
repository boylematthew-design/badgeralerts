import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteGuideButton from "./DeleteGuideButton";
import DeleteTipButton from "./DeleteTipButton";

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

  const [{ data: guide }, { data: tips }] = await Promise.all([
    supabaseAdmin.from("guides").select("*").eq("id", id).single(),
    supabaseAdmin.from("tips").select("*").eq("guide_id", id).order("sort_order", { ascending: true }),
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

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-extrabold text-slate-900">
          Tips <span className="text-slate-400 font-medium">({tips?.length ?? 0})</span>
        </h2>
        <Link
          href={`/admin/blog/${guide.id}/tips/new`}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition"
        >
          + Add tip
        </Link>
      </div>

      {!tips || tips.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <p className="text-4xl mb-4">💡</p>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No tips yet</h3>
          <p className="text-slate-400 text-sm">Add your first tip to start building this guide.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tips.map((tip, index) => (
            <div
              key={tip.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-400">Tip {index + 1}</span>
                  <h3 className="text-[15px] font-bold text-slate-900 truncate">{tip.title}</h3>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      tip.published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {tip.published ? "Published" : "Draft"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 truncate">
                  {tip.content?.slice(0, 100) || "No content yet"}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/blog/${guide.id}/tips/${tip.id}/edit`}
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition"
                >
                  Edit
                </Link>
                <DeleteTipButton tipId={tip.id} guideId={guide.id} />
              </div>
            </div>
          ))}
        </div>
      )}

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
