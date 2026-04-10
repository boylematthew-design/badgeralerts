"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const insightsNav = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    ),
  },
  {
    label: "SEO",
    href: "/dashboard/seo",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
    ),
  },
  {
    label: "Social media",
    href: "/dashboard/social",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
    ),
  },
  {
    label: "Competitors",
    href: "/dashboard/competitors",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    ),
  },
  {
    label: "Content strategy",
    href: "/dashboard/content",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M7 4h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" />
    ),
  },
  {
    label: "Paid media",
    href: "/dashboard/paid",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
];

const configNav = [
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] min-h-screen bg-slate-950 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-6 py-7 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white p-1 shadow-lg">
            <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path fill="currentColor" d="M12 22a2.25 2.25 0 0 0 2.2-1.8H9.8A2.25 2.25 0 0 0 12 22Z" />
              <path fill="currentColor" d="M20 18.2H4c.9-1 2.2-2.1 2.2-5.2V10.3A5.8 5.8 0 0 1 10.7 4.7V3.6c0-.7.6-1.3 1.3-1.3s1.3.6 1.3 1.3v1.1a5.8 5.8 0 0 1 4.5 5.6V13c0 3.1 1.3 4.2 2.2 5.2Z" />
              <circle cx="18.2" cy="6.2" r="2.2" fill="#10b981" />
            </svg>
          </div>
          <div className="text-[15px] font-extrabold tracking-tighter text-white uppercase">
            BADGER<span className="text-emerald-500">ALERTS</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-6">
        {/* Insights section */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 px-3 mb-2">
            Insights
          </p>
          <ul className="space-y-0.5">
            {insightsNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {item.icon}
                    </svg>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Configuration section */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 px-3 mb-2">
            Configuration
          </p>
          <ul className="space-y-0.5">
            {configNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {item.icon}
                    </svg>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
