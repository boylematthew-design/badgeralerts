import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function AdminEnquiriesPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("id, message, created_at, user_id, post_id")
    .order("created_at", { ascending: false });

  const userIds = [...new Set((enquiries ?? []).map((e) => e.user_id))];
  const postIds = [...new Set((enquiries ?? []).map((e) => e.post_id))];

  const [{ data: users }, { data: posts }] = await Promise.all([
    supabase.from("users").select("id, full_name, email").in("id", userIds),
    supabase.from("posts").select("id, title").in("id", postIds),
  ]);

  const usersMap = Object.fromEntries((users ?? []).map((u) => [u.id, u]));
  const postsMap = Object.fromEntries((posts ?? []).map((p) => [p.id, p]));

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Expert Enquiries</h1>
          <p className="text-sm text-slate-500 mt-1">{enquiries?.length ?? 0} enquiries received</p>
        </div>
      </div>

      {!enquiries || enquiries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <p className="text-4xl mb-4">📬</p>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No enquiries yet</h3>
          <p className="text-slate-400 text-sm">When users request expert help, their enquiries will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enquiries.map((enquiry) => {
            const user = usersMap[enquiry.user_id];
            const post = postsMap[enquiry.post_id];
            const date = new Date(enquiry.created_at).toLocaleDateString("en-GB", {
              day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
            });

            return (
              <div
                key={enquiry.id}
                className="bg-white rounded-2xl border border-slate-200 px-6 py-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-bold text-slate-900">{user?.full_name ?? "Unknown user"}</p>
                    <p className="text-sm text-slate-400">{user?.email}</p>
                  </div>
                  <p className="text-xs text-slate-400 whitespace-nowrap">{date}</p>
                </div>
                <div className="mb-3">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {post?.title ?? "Unknown alert"}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{enquiry.message}</p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
