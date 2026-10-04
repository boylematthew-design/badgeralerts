import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { SITES, siteLabel } from "@/lib/sites";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ site?: string }>;
}) {
  const { site: siteFilter } = await searchParams;

  let query = supabaseAdmin
    .from("guides")
    .select("id, title, slug, topic_name, published, site, created_at, tips(count)")
    .order("created_at", { ascending: false });

  if (siteFilter) {
    query = query.eq("site", siteFilter);
  }

  const { data: guides } = await query;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Blog Guides</h1>
          <p className="text-sm text-slate-500 mt-1">{guides?.length ?? 0} guides{siteFilter ? ` · ${siteLabel(siteFilter)}` : ""}</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition"
        >
          + New guide
        </Link>
      </div>

      {/* Site filter */}
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/admin/blog"
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
            !siteFilter ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          All sites
        </Link>
        {SITES.map((s) => (
          <Link
            key={s.value}
            href={`/admin/blog?site=${s.value}`}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
              siteFilter === s.value ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>

      {!guides || guides.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <p className="text-4xl mb-4">📝</p>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No guides yet</h3>
          <p className="text-slate-400 text-sm">Create your first guide to start adding tips.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {guides.map((guide) => {
            const tipCount = (guide.tips as unknown as { count: number }[])?.[0]?.count ?? 0;
            return (
              <div
                key={guide.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-[15px] font-bold text-slate-900 truncate">{guide.title}</h2>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {siteLabel(guide.site)}
                    </span>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        guide.published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {guide.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    /blog/{guide.slug} · {tipCount} tip{tipCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/admin/blog/${guide.id}`}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition"
                  >
                    Manage tips
                  </Link>
                  <Link
                    href={`/admin/blog/${guide.id}/edit`}
                    className="text-sm font-semibold text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
