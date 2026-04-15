import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardFooter from "@/components/DashboardFooter";
import UserMenu from "@/components/UserMenu";
import DeleteAccountButton from "@/components/DeleteAccountButton";
import { getInitials } from "@/lib/initials";

async function getUser() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { user: null, profile: null };

  const { data: profile } = await supabase
    .from("users")
    .select("full_name, email, website")
    .eq("id", user.id)
    .single();

  return { user, profile };
}

export default async function SettingsPage() {
  const { user, profile } = await getUser();

  if (!user) redirect("/login");

  const initials = getInitials(profile?.full_name, user.email);

  return (
    <div className="min-h-screen flex" style={{ background: "#eff4fb" }}>
      <Suspense fallback={null}>
        <Sidebar name={profile?.full_name ?? undefined} website={profile?.website ?? undefined} />
      </Suspense>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-10 py-4 md:py-0 md:h-[88px] flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-[28px] font-extrabold tracking-tight text-slate-800">
              Settings
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5 md:mt-1">
              Manage your account details.
            </p>
          </div>
          <UserMenu initials={initials} />
        </header>

        {/* Content */}
        <section className="px-4 md:px-10 py-8 flex-1 pb-24 md:pb-8">
          <div className="max-w-xl space-y-6">

            {/* Account details */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
              <h2 className="text-lg font-extrabold text-slate-900 mb-6">Account details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Full name</p>
                  <p className="text-slate-800 font-semibold">{profile?.full_name ?? "—"}</p>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email address</p>
                  <p className="text-slate-800 font-semibold">{profile?.email ?? user.email}</p>
                </div>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Website</p>
                  <p className="text-slate-800 font-semibold">{profile?.website ?? "—"}</p>
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
              <h2 className="text-lg font-extrabold text-slate-900 mb-2">Danger zone</h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <DeleteAccountButton />
            </div>

          </div>
        </section>

        <DashboardFooter />
      </div>
    </div>
  );
}
