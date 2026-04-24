import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Link from "next/link";
import { getInitials } from "@/lib/initials";
import Sidebar from "@/components/Sidebar";
import DashboardFooter from "@/components/DashboardFooter";
import UserMenu from "@/components/UserMenu";
import WaitingRoom from "@/components/WaitingRoom";
import { replacePlaceholders } from "@/lib/placeholders";

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

  const { data: profile } = user
    ? await supabase.from("users").select("full_name, website").eq("id", user.id).single()
    : { data: null };

  return { user, supabase, profile };
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { user, supabase, profile } = await getUser();

  if (!user) {
    redirect("/login");
  }

  const { category } = await searchParams;

  // Check if this user has ever had any posts assigned (regardless of date)
  const { count: totalAssigned } = await supabase
    .from("user_posts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Build query — filter by category if one is selected
  let query = supabase
    .from("user_posts")
    .select(`
      id,
      scheduled_for,
      posts (
        id,
        title,
        subtitle,
        category
      )
    `)
    .eq("user_id", user.id)
    .lte("scheduled_for", new Date().toISOString())
    .order("scheduled_for", { ascending: false });

  const { data: rawAlerts } = await query;

  // Filter by category on the JS side since Supabase doesn't support filtering on joined columns
  const alerts = category
    ? rawAlerts?.filter((a) => {
        const post = Array.isArray(a.posts) ? a.posts[0] : a.posts;
        return (post as { category?: string })?.category === category;
      })
    : rawAlerts;

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
              Notifications 🔔
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-0.5 md:mt-1">
              All alerts and opportunities across your account 📈
            </p>
          </div>
          <UserMenu initials={initials} />
        </header>

        {/* New user with no posts assigned yet → show waiting room; otherwise show alerts */}
        {!totalAssigned || totalAssigned === 0 ? (
          <WaitingRoom name={profile?.full_name ?? undefined} />
        ) : (
          <section className="px-4 md:px-10 py-6 md:py-8 flex-1 pb-24 md:pb-8">
            {alerts && alerts.length > 0 ? (
              <div className="space-y-5">
                {alerts.map((alert) => {
                  const post = (Array.isArray(alert.posts) ? alert.posts[0] : alert.posts) as { id: string; title: string; subtitle?: string } | null;
                  if (!post) return null;
                  const title = replacePlaceholders(post.title, profile ?? {});
                  const subtitle = post.subtitle ? replacePlaceholders(post.subtitle, profile ?? {}) : null;
                  return (
                    <Link
                      key={alert.id}
                      href={`/dashboard/post/${post.id}`}
                      className="flex items-center gap-[18px] w-full border border-[#dbe4f0] bg-white rounded-[22px] px-6 py-[22px] shadow-[0_10px_25px_rgba(15,23,42,0.04)] transition hover:-translate-y-px hover:shadow-[0_16px_30px_rgba(15,23,42,0.07)] hover:border-[#cfdbea]"
                    >
                      <div className="w-14 h-14 bg-emerald-500 shadow-emerald-200 rounded-2xl flex-shrink-0 flex items-center justify-center text-white shadow-lg">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-[20px] font-extrabold text-slate-900 leading-tight">
                          {title}
                        </h3>
                        {subtitle && (
                          <p className="text-[15px] text-slate-500 leading-relaxed mt-1">
                            {subtitle}
                          </p>
                        )}
                      </div>
                      <div className="text-slate-400">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-4xl mb-4">🚀</p>
                <h3 className="text-xl font-extrabold text-slate-800 mb-2">You are all caught up!</h3>
                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                  There are currently no new notifications. We will alert you when this changes. 🔔
                </p>
              </div>
            )}
          </section>
        )}
        <DashboardFooter />
      </div>
    </div>
  );
}
