import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignupForm from "@/components/SignupForm";

const heroAlerts = [
  {
    color: "bg-amber-500 shadow-amber-200",
    labelColor: "text-amber-600",
    label: "Performance Alert",
    title: "Your page has a speed-score of 67/100",
    body: "A slow-loading website can be frustrating. Optimization recommended.",
    time: "Today",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    ),
  },
  {
    color: "bg-pink-500 shadow-pink-200",
    labelColor: "text-pink-600",
    label: "Competitor Watch",
    title: "Your competitor's TikTok video went viral",
    body: "Gained 49,344 views in 7 days. Match their visibility now.",
    time: "Yesterday",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    ),
  },
  {
    color: "bg-emerald-500 shadow-emerald-200",
    labelColor: "text-emerald-600",
    label: "Content Strategy",
    title: "49 new content gaps found",
    body: "12 blog topics + 3 service pages recommended.",
    time: "2 days ago",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
    ),
  },
  {
    color: "bg-indigo-500 shadow-indigo-200",
    labelColor: "text-indigo-600",
    label: "Ad Intelligence",
    title: "Conversion costs on Meta are down 22%",
    body: "Market conditions favor increased budget for your Retargeting set.",
    time: "3 days ago",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    color: "bg-blue-500 shadow-blue-200",
    labelColor: "text-blue-600",
    label: "SEO Alert",
    title: "Ranking #2 for primary keyword",
    body: "High conversion potential detected. Defend this position.",
    time: "4 days ago",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    ),
  },
];

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");
  return (
    <div className="bg-slate-50 text-slate-900">
      <Navbar />

      {/* Hero */}
      <header className="hero-pattern relative px-6 pt-12 pb-24 max-w-7xl mx-auto overflow-hidden">
        <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight text-slate-900">
            Your digital marketing AI consultant
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
            Real-time suggestions for your website & brand.
          </p>
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          <div className="space-y-4">
            {heroAlerts.map((alert, i) => (
              <div
                key={i}
                className="notification-blur border border-white/50 shadow-xl rounded-2xl p-4 flex items-start gap-4 transition hover:scale-[1.02] cursor-default"
              >
                <div className={`w-10 h-10 ${alert.color} rounded-xl flex-shrink-0 flex items-center justify-center text-white shadow-lg`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {alert.icon}
                  </svg>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-extrabold ${alert.labelColor} uppercase tracking-wider`}>
                      {alert.label}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">{alert.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">{alert.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100 rounded-full blur-[120px] opacity-40 -z-0" />
      </header>

      {/* Signup Section */}
      <section id="signup" className="bg-white py-24 px-6 border-y border-slate-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Get real-time suggestions <span className="gradient-text">for free.</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10">
            BadgerAlerts scans your website & brand using AI & offers suggestions.
          </p>
          <div className="max-w-md mx-auto">
            <SignupForm />
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="bg-slate-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              Your personal dashboard
            </h2>
            <p className="text-slate-500">Everything you need to scale, in one unified view.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-200 overflow-hidden aspect-video flex">
            {/* Mini Sidebar */}
            <div className="w-64 bg-slate-900 p-6 flex-shrink-0 hidden md:flex flex-col gap-6">
              <div className="flex items-center gap-2 text-white mb-2">
                <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center p-1">
                  <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path fill="#ffffff" d="M12 22c1.2 0 2.2-.85 2.45-2H9.55C9.8 21.15 10.8 22 12 22ZM20 18.25H4c.85-.95 2.15-2 2.15-5.1V10.6c0-2.85 1.9-5.2 4.55-5.85V3.6c0-.77.63-1.4 1.4-1.4s1.4.6 1.4 1.4v1.15c2.65.65 4.55 3 4.55 5.85v2.55c0 3.1 1.3 4.15 2.15 5.1Z" />
                  </svg>
                </div>
                <span className="font-bold tracking-tight">BadgerAlerts</span>
              </div>
              <nav className="space-y-1">
                <div className="flex items-center gap-3 text-white bg-white/10 p-2 rounded-lg">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="text-sm font-medium">Overview</span>
                </div>
                <div className="pt-4 pb-1 px-2">
                  <span className="text-[11px] font-semibold text-slate-500 italic tracking-wide uppercase">Insights</span>
                </div>
                {["SEO", "Social", "Competitors", "Content Strategy"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-slate-400 p-2 hover:text-slate-200 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </nav>
            </div>

            {/* Mini Main Content */}
            <div className="flex-grow bg-slate-50/50 flex flex-col">
              <header className="h-16 border-b border-slate-200 px-8 flex items-center justify-between bg-white">
                <span className="font-bold text-slate-700">Notifications</span>
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">AB</div>
              </header>
              <main className="p-8 space-y-4 overflow-y-auto custom-scrollbar">
                {[
                  { color: "bg-amber-500", title: "Page speed is below 70", body: "Your LCP is currently at 3.2s. Optimization needed." },
                  { color: "bg-pink-500", title: "Competitor TikTok Viral", body: "Gained 49k views. Plan your short-form response." },
                  { color: "bg-emerald-500", title: "49 Content Gaps Found", body: "Missing thousands of searches. View blog list." },
                  { color: "bg-indigo-500", title: "Ad Spend Opportunity", body: "Conversion costs on Meta are down by 22%." },
                  { color: "bg-blue-500", title: "SEO Milestone Hit", body: "Ranking #2 for your most profitable keyword." },
                ].map((n, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                    <div className={`w-10 h-10 ${n.color} rounded-xl flex-shrink-0`} />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      <p className="text-[10px] text-slate-500">{n.body}</p>
                    </div>
                  </div>
                ))}
              </main>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-900 py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-16 text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
              Built for <span className="text-emerald-400">precision.</span>
            </h2>
            <p className="text-slate-400 max-w-xl text-lg">
              Sophisticated analysis engines simplified into actionable intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                iconBg: "bg-emerald-500/10",
                iconText: "text-emerald-400",
                hoverBorder: "hover:border-emerald-500",
                title: "SEO Optimizations",
                body: "Identify profitable audience sub-segments and high-intent keywords automatically before the competition notices.",
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
              },
              {
                iconBg: "bg-indigo-500/10",
                iconText: "text-indigo-400",
                hoverBorder: "hover:border-indigo-500",
                title: "Social Media Ideas",
                body: "Optimize creative assets and hook structures in real-time as cultural trends and algorithm weights shift.",
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
              },
              {
                iconBg: "bg-amber-500/10",
                iconText: "text-amber-400",
                hoverBorder: "hover:border-amber-500",
                title: "Local Map Moats",
                body: "Build a local search presence that dominates your geographic area, making it impossible for peers to compete.",
                icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></>,
              },
            ].map((f) => (
              <div key={f.title} className={`group p-8 rounded-3xl bg-slate-800/50 border border-slate-700 ${f.hoverBorder} transition-colors`}>
                <div className={`w-14 h-14 ${f.iconBg} rounded-2xl flex items-center justify-center mb-6 ${f.iconText}`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">{f.icon}</svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />
      </section>

      <Footer />
    </div>
  );
}
