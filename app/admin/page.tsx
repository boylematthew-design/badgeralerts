import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import { deletePost } from "./actions";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, description, category, created_at")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">All Alerts</h1>
          <p className="text-sm text-slate-500 mt-1">{posts?.length ?? 0} alerts created</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition"
        >
          + New alert
        </Link>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <p className="text-4xl mb-4">📭</p>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No alerts yet</h3>
          <p className="text-slate-400 text-sm">Create your first alert to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 px-6 py-5 flex items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex-1 min-w-0">
                {post.category && (
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mb-1.5">
                    {post.category}
                  </span>
                )}
                <h3 className="text-base font-bold text-slate-900 truncate">{post.title}</h3>
                <p className="text-sm text-slate-400 mt-0.5 truncate">{post.description}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <form action={deletePost} onSubmit={(e) => { if (!confirm("Delete this alert? This will also remove all assignments.")) e.preventDefault(); }}>
                  <input type="hidden" name="post_id" value={post.id} />
                  <button
                    type="submit"
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-2 rounded-xl text-sm font-bold transition"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
