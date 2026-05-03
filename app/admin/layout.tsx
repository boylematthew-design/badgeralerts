import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) redirect("/dashboard");

  return (
    <div style={{ background: "#eff4fb", minHeight: "100vh" }}>
      <header className="bg-slate-950 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-[15px] font-extrabold tracking-tighter text-white uppercase">
            BADGER<span className="text-emerald-500">ALERTS</span>
          </Link>
          <span className="text-slate-700 text-lg">|</span>
          <span className="text-slate-400 text-sm font-semibold">Admin</span>
        </div>
        <div className="flex items-center gap-1">
          <Link href="/admin" className="text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition font-medium">
            Alerts
          </Link>
          <Link href="/admin/users" className="text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition font-medium">
            Users
          </Link>
          <Link href="/admin/enquiries" className="text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition font-medium">
            Enquiries
          </Link>
          <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition font-medium">
            Dashboard
          </Link>
        </div>
      </header>
      <main className="px-4 md:px-6 py-8 max-w-4xl mx-auto">
        {children}
      </main>
    </div>
  );
}
