import { redirect } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Sidebar from "@/components/Sidebar";
import DashboardFooter from "@/components/DashboardFooter";

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
  return user;
}

const alerts = [
  {
    id: 1,
    category: "SEO",
    type: "urgent",
    title: "Page speed is below 70",
    description: "Your LCP is currently at 3.2s. Optimization needed.",
    color: "bg-amber-500 shadow-amber-200",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
  },
  {
    id: 2,
    category: "Social media alert",
    type: "opportunity",
    title: "Competitor TikTok went viral",
    description: "Gained 49k views. Plan your short-form response.",
    color: "bg-pink-500 shadow-pink-200",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 6h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />,
  },
  {
    id: 3,
    category: "Content strategy",
    type: "opportunity",
    title: "49 content gaps found",
    description: "Missing thousands of searches. View blog list.",
    color: "bg-emerald-500 shadow-emerald-200",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M7 4h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" />,
  },
  {
    id: 4,
    category: "Paid marketing",
    type: "opportunity",
    title: "Ad spend opportunity",
    description: "Conversion costs on Meta are down by 22%.",
    color: "bg-indigo-500 shadow-indigo-200",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  },
  {
    id: 5,
    category: "SEO",
    type: "success",
    title: "SEO milestone hit",
    description: "Ranking #2 for your most profitable keyword.",
    color: "bg-blue-500 shadow-blue-200",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />,
  },
  {
    id: 6,
    category: "Technical issue",
    type: "urgent",
    title: "Top service page lost heading structure",
    description: "The page now has missing H1/H2 hierarchy after the latest edit.",
    color: "bg-rose-500 shadow-rose-200",
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z" />,
  },
];

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const initials = user.email?.slice(0, 2).toUpperCase() ?? "BA";

  return (
    <div className="min-h-screen flex" style={{ background: "#eff4fb" }}>
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-[88px] bg-white border-b border-slate-200 px-10 flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight text-slate-800">
              Notifications
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              All alerts and opportunities across your account.
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-200">
            {initials}
          </div>
        </header>

        {/* Alerts */}
        <section className="px-10 py-8 flex-1">
          <div className="space-y-5">
            {alerts.map((alert) => (
              <button
                key={alert.id}
                className="flex items-center gap-[18px] w-full border border-[#dbe4f0] bg-white rounded-[22px] px-6 py-[22px] shadow-[0_10px_25px_rgba(15,23,42,0.04)] transition hover:-translate-y-px hover:shadow-[0_16px_30px_rgba(15,23,42,0.07)] hover:border-[#cfdbea] text-left"
              >
                <div className={`w-14 h-14 ${alert.color} rounded-2xl flex-shrink-0 flex items-center justify-center text-white shadow-lg`}>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {alert.icon}
                  </svg>
                </div>
                <div className="flex-grow">
                  <div className="mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      {alert.category}
                    </span>
                  </div>
                  <h3 className="text-[20px] font-extrabold text-slate-900 leading-tight">
                    {alert.title}
                  </h3>
                  <p className="text-[15px] text-slate-500 leading-relaxed mt-1">
                    {alert.description}
                  </p>
                </div>
                <div className="text-slate-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </section>
        <DashboardFooter />
      </div>
    </div>
  );
}
