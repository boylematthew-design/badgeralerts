import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AssignPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  // Service role client bypasses RLS — needed to fetch all users as admin
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const [{ data: post }, { data: users }, { data: existing }] = await Promise.all([
    supabase.from("posts").select("id, title, category").eq("id", id).single(),
    supabaseAdmin.from("users").select("id, full_name, email").eq("email_confirmed", true).order("full_name"),
    supabase.from("user_posts").select("user_id, scheduled_for, notified_at").eq("post_id", id),
  ]);

  if (!post) redirect("/admin");

  async function assignPost(formData: FormData) {
    "use server";

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll() } }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("users").select("is_admin").eq("id", user.id).single();
    if (!profile?.is_admin) redirect("/dashboard");

    const postId = formData.get("post_id") as string;
    const userId = formData.get("user_id") as string;
    const scheduledFor = formData.get("scheduled_for") as string;

    if (!postId || !userId || !scheduledFor) return;

    await supabase.from("user_posts").insert({
      user_id: userId,
      post_id: postId,
      scheduled_for: new Date(scheduledFor).toISOString(),
    });

    redirect(`/admin/posts/${postId}/assign`);
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <Link href="/admin" className="text-sm text-slate-400 hover:text-slate-600 transition">
          ← Back to alerts
        </Link>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-3">Assign alert</h1>
        <div className="flex items-center gap-2 mt-1">
          {post.category && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {post.category}
            </span>
          )}
          <p className="text-slate-500 text-sm">{post.title}</p>
        </div>
      </div>

      <form action={assignPost} className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-sm mb-8">
        <input type="hidden" name="post_id" value={post.id} />

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Select user</label>
          <select
            name="user_id"
            required
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Choose a user...</option>
            {users?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name} — {user.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            Schedule date &amp; time
          </label>
          <input
            name="scheduled_for"
            type="datetime-local"
            required
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-xs text-slate-400 mt-1.5">
            Enter the time you want this alert to go live. The cron job checks at 8:00 UTC daily.
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl text-sm transition"
        >
          Assign alert
        </button>
      </form>

      {existing && existing.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-700 mb-3">Already assigned to</h2>
          <div className="space-y-2">
            {existing.map((assignment) => {
              const user = users?.find((u) => u.id === assignment.user_id);
              return (
                <div
                  key={assignment.user_id}
                  className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between text-sm shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-800">{user?.full_name ?? "Unknown user"}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{new Date(assignment.scheduled_for).toLocaleString("en-GB")}</p>
                    <p className={`text-xs font-semibold mt-0.5 ${assignment.notified_at ? "text-emerald-500" : "text-slate-400"}`}>
                      {assignment.notified_at ? "Email sent" : "Pending"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
