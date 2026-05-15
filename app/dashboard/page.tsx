import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Suspense } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import DashboardFooter from "@/components/DashboardFooter";
import WaitingRoom from "@/components/WaitingRoom";
import { replacePlaceholders } from "@/lib/placeholders";

// Category config — icon, colors, label
const categoryConfig: Record<
  string,
  { label: string; iconBg: string; iconColor: string; tagBg: string; tagColor: string; icon: React.ReactNode }
> = {
  seo: {
    label: "SEO",
    iconBg: "#EBF3FE", iconColor: "#185FA5",
    tagBg: "#EBF3FE", tagColor: "#185FA5",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="m20 20-3.5-3.5" />
      </>
    ),
  },
  social: {
    label: "Social",
    iconBg: "#F3EEFF", iconColor: "#6B3FA0",
    tagBg: "#F3EEFF", tagColor: "#6B3FA0",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 11v2l14 6V5L3 11zm14-6v14M21 9v6" />
    ),
  },
  content: {
    label: "Content",
    iconBg: "#FEF3E2", iconColor: "#854F0B",
    tagBg: "#FEF3E2", tagColor: "#854F0B",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 19 6.5 22l1.5-6 11-11 4 4-11 11-4-2z" />
    ),
  },
  competitors: {
    label: "Competitors",
    iconBg: "#E8F9F1", iconColor: "#0F7A49",
    tagBg: "#E8F9F1", tagColor: "#0F7A49",
    icon: (
      <>
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      </>
    ),
  },
  paid: {
    label: "Paid media",
    iconBg: "#FEECEC", iconColor: "#A32D2D",
    tagBg: "#FEECEC", tagColor: "#A32D2D",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 5a4 4 0 0 0-7 3v3H6m0 0h9M6 11v4a3 3 0 0 1-2 3h13" />
    ),
  },
  technical: {
    label: "Technical",
    iconBg: "#F5F5F4", iconColor: "#555551",
    tagBg: "#F5F5F4", tagColor: "#555551",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    ),
  },
};

const defaultConfig = {
  label: "Alert",
  iconBg: "#E8F9F1", iconColor: "#0F7A49",
  tagBg: "#E8F9F1", tagColor: "#0F7A49",
  icon: (
    <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  ),
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("users").select("full_name, website").eq("id", user.id).single()
    : { data: null };
  return { user, supabase, profile };
}

const filterTabs = [
  { label: "All", category: null },
  { label: "SEO", category: "seo" },
  { label: "Social", category: "social" },
  { label: "Content", category: "content" },
  { label: "Competitors", category: "competitors" },
  { label: "Paid", category: "paid" },
  { label: "Technical", category: "technical" },
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { user, supabase, profile } = await getUser();
  if (!user) redirect("/login");

  const { category } = await searchParams;

  // Has this user ever had any posts assigned?
  const { count: totalAssigned } = await supabase
    .from("user_posts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Fetch all live posts (for counting per category)
  const { data: rawAll } = await supabase
    .from("user_posts")
    .select(`id, scheduled_for, posts (id, title, subtitle, category)`)
    .eq("user_id", user.id)
    .lte("scheduled_for", new Date().toISOString())
    .order("scheduled_for", { ascending: false });

  // Filter for selected category
  const alerts = category
    ? rawAll?.filter((a) => {
        const post = Array.isArray(a.posts) ? a.posts[0] : a.posts;
        return (post as { category?: string })?.category === category;
      })
    : rawAll;

  // Category counts for filter chips
  const categoryCounts = filterTabs.slice(1).reduce<Record<string, number>>((acc, tab) => {
    acc[tab.category!] = rawAll?.filter((a) => {
      const post = Array.isArray(a.posts) ? a.posts[0] : a.posts;
      return (post as { category?: string })?.category === tab.category;
    }).length ?? 0;
    return acc;
  }, {});

  const firstName = profile?.full_name?.split(" ")[0];
  const greeting = getGreeting();

  return (
    <div className="min-h-screen flex bg-surface">
      <Suspense fallback={null}>
        <Sidebar website={profile?.website ?? undefined} />
      </Suspense>

      <div className="flex-1 flex flex-col min-w-0 pt-[52px] md:pt-0">
        {/* Header */}
        <header className="px-6 md:px-10 pt-8 pb-6 md:pt-10 md:pb-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-1.5">
                Dashboard
              </p>
              <h1 className="font-serif font-normal text-[26px] md:text-[34px] leading-[1.1] tracking-[-0.02em] text-ink">
                {greeting},{" "}
                <em className="italic text-accent-dark">
                  {firstName ?? "there"}
                </em>
              </h1>
            </div>
            {profile?.website && (
              <a
                href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[13px] text-mid border border-border bg-white rounded-[8px] px-3.5 py-2 hover:text-ink hover:border-border-strong transition-all flex-shrink-0 mt-1"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                </svg>
                View site
              </a>
            )}
          </div>
        </header>

        {/* Main content */}
        {!totalAssigned || totalAssigned === 0 ? (
          <WaitingRoom name={profile?.full_name ?? undefined} />
        ) : (
          <section className="px-6 md:px-10 pb-10 flex-1">
            {/* Filter chips */}
            <div className="flex items-center gap-2 flex-wrap mb-6">
              {filterTabs.map((tab) => {
                const isActive = tab.category === null ? !category : category === tab.category;
                const count = tab.category ? categoryCounts[tab.category] : rawAll?.length ?? 0;
                return (
                  <Link
                    key={tab.label}
                    href={tab.category ? `/dashboard?category=${tab.category}` : "/dashboard"}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all ${
                      isActive
                        ? "bg-ink text-white"
                        : "bg-white border border-border text-mid hover:text-ink hover:border-border-strong"
                    }`}
                  >
                    {tab.label}
                    {count > 0 && (
                      <span className={`text-[11px] rounded-full px-1.5 py-0.5 leading-none ${
                        isActive ? "bg-white/20 text-white" : "bg-surface text-muted"
                      }`}>
                        {count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Alert list */}
            {alerts && alerts.length > 0 ? (
              <div className="flex flex-col gap-3">
                {alerts.map((alert, i) => {
                  const post = (Array.isArray(alert.posts) ? alert.posts[0] : alert.posts) as {
                    id: string; title: string; subtitle?: string; category?: string;
                  } | null;
                  if (!post) return null;

                  const cfg = categoryConfig[post.category ?? ""] ?? defaultConfig;
                  const title = replacePlaceholders(post.title, profile ?? {});
                  const subtitle = post.subtitle ? replacePlaceholders(post.subtitle, profile ?? {}) : null;

                  // Mark first 3 unread as "New" — simple heuristic
                  const isNew = i < 3;

                  return (
                    <Link
                      key={alert.id}
                      href={`/dashboard/post/${post.id}`}
                      className="flex items-start gap-3.5 bg-white border border-border rounded-[14px] px-5 py-4 hover:border-border-strong hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all group"
                    >
                      {/* Icon tile */}
                      <div
                        className="w-10 h-10 rounded-[10px] flex-shrink-0 flex items-center justify-center mt-0.5"
                        style={{ background: cfg.iconBg, color: cfg.iconColor }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                          {cfg.icon}
                        </svg>
                      </div>

                      {/* Body */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span
                            className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full"
                            style={{ background: cfg.tagBg, color: cfg.tagColor }}
                          >
                            {cfg.label}
                          </span>
                          {isNew && (
                            <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent-light text-accent-dark">
                              New
                            </span>
                          )}
                        </div>
                        <div className="text-[14px] font-medium text-ink leading-[1.35] mb-0.5">
                          {title}
                        </div>
                        {subtitle && (
                          <div className="text-[13px] text-muted leading-[1.5]">
                            {subtitle}
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="text-muted group-hover:text-ink transition-colors mt-0.5 flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 12h14M13 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted" aria-hidden="true">
                    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <h3 className="text-[16px] font-medium text-ink mb-1.5">All caught up</h3>
                <p className="text-[14px] text-muted max-w-xs leading-[1.6]">
                  No alerts in this category yet. We&apos;ll email you when we find something.
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
