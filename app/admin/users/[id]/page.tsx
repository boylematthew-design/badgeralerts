import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";
import PostAssigner from "./PostAssigner";

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

  const [{ data: user }, { data: posts }, { data: assignments }] = await Promise.all([
    supabaseAdmin.from("users").select("id, full_name, email, website").eq("id", id).single(),
    supabaseAdmin.from("posts").select("id, title, category").order("category").order("title"),
    supabaseAdmin.from("user_posts").select("post_id").eq("user_id", id),
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
    </>
  );
}
