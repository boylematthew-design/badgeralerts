import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";
import PostAssigner from "./PostAssigner";
import { removeAssignment } from "@/app/admin/actions";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [{ data: user }, { data: posts }, { data: assignments }, { data: schedule }] = await Promise.all([
    supabaseAdmin.from("users").select("id, full_name, email, website").eq("id", id).single(),
    supabaseAdmin.from("posts").select("id, title, category").order("category").order("title"),
    supabaseAdmin.from("user_posts").select("post_id").eq("user_id", id),
    supabaseAdmin
      .from("user_posts")
      .select("id, scheduled_for, notified_at, posts ( title, category )")
      .eq("user_id", id)
      .order("scheduled_for", { ascending: true }),
  ]);

  if (!user) redirect("/admin/users");

  const assignedPostIds = assignments?.map((a) => a.post_id) ?? [];

  return (
    <>
      {/* User header */}
      <div className="mb-8">
        <Link href="/admin/users" className="text-sm text-slate-400 hover:text-slate-600 transition">
          ← Back to users
        </Link>
        <div className="bg-white rounded-2xl border border-slate-200 px-6 py-5 shadow-sm mt-4">
          <h1 className="text-xl font-extrabold text-slate-900">{user.full_name}</h1>
          <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
          {user.website && (
            <p className="text-sm text-emerald-600 mt-0.5">{user.website}</p>
          )}
          <p className="text-xs text-slate-400 mt-3">
            {assignedPostIds.length} alert{assignedPostIds.length !== 1 ? "s" : ""} already assigned
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-base font-bold text-slate-700">Select alerts to assign</h2>
        <p className="text-sm text-slate-400 mt-1">
          Greyed out alerts have already been assigned to this user. Tick the ones you want, set a date for each, then hit assign.
        </p>
      </div>

      <PostAssigner
        userId={id}
        posts={posts ?? []}
        assignedPostIds={assignedPostIds}
      />

      {/* Scheduled timeline */}
      {schedule && schedule.length > 0 && (
        <div className="mt-12 mb-24">
          <h2 className="text-base font-bold text-slate-700 mb-4">Scheduled timeline</h2>
          <div className="space-y-2">
            {schedule.map((item) => {
              const post = Array.isArray(item.posts) ? item.posts[0] : item.posts;
              const sent = !!item.notified_at;
              const date = new Date(item.scheduled_for);
              const isPast = date < new Date();

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-4 shadow-sm"
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm ${
                    sent ? "bg-emerald-100 text-emerald-600" : isPast ? "bg-red-100 text-red-500" : "bg-slate-100 text-slate-400"
                  }`}>
                    {sent ? "✓" : isPast ? "!" : "⏳"}
                  </div>
                  <div className="flex-1 min-w-0">
                    {post?.category && (
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {post.category}
                      </span>
                    )}
                    <p className="text-sm font-bold text-slate-900 mt-1 truncate">{post?.title}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-slate-500">{date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                    <p className={`text-xs font-semibold mt-0.5 ${sent ? "text-emerald-500" : isPast ? "text-red-400" : "text-slate-400"}`}>
                      {sent ? "Email sent" : isPast ? "Missed — not sent" : "Pending"}
                    </p>
                  </div>
                  {!sent && (
                    <form action={removeAssignment}>
                      <input type="hidden" name="assignment_id" value={item.id} />
                      <input type="hidden" name="user_id" value={id} />
                      <button
                        type="submit"
                        className="text-slate-300 hover:text-red-500 text-xs font-bold px-2 py-1 rounded-lg hover:bg-red-50 transition"
                      >
                        Remove
                      </button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
