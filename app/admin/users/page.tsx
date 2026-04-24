import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AdminUsersPage() {
  const { data: users } = await supabaseAdmin
    .from("users")
    .select("id, full_name, email, website, created_at")
    .eq("email_confirmed", true)
    .eq("is_admin", false)
    .eq("email_unsubscribed", false)
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">Users</h1>
        <p className="text-sm text-slate-500 mt-1">{users?.length ?? 0} confirmed users</p>
      </div>

      {!users || users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <p className="text-4xl mb-4">👥</p>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No confirmed users yet</h3>
          <p className="text-slate-400 text-sm">Users will appear here once they verify their email.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Link
              key={user.id}
              href={`/admin/users/${user.id}`}
              className="bg-white rounded-2xl border border-slate-200 px-6 py-5 flex items-center justify-between gap-4 shadow-sm hover:-translate-y-px hover:shadow-md transition-all"
            >
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold text-slate-900">{user.full_name}</p>
                <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
                {user.website && (
                  <p className="text-xs text-emerald-600 mt-0.5 truncate">{user.website}</p>
                )}
              </div>
              <div className="text-slate-400 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
