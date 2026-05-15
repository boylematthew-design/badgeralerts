"use client";

import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

const navItems = [
  {
    label: "Overview",
    href: "/dashboard",
    category: null,
    icon: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    label: "SEO",
    href: "/dashboard?category=seo",
    category: "seo",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="m20 20-3.5-3.5" />
      </>
    ),
  },
  {
    label: "Social media",
    href: "/dashboard?category=social",
    category: "social",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 11v2l14 6V5L3 11zm14-6v14M21 9v6" />
    ),
  },
  {
    label: "Content",
    href: "/dashboard?category=content",
    category: "content",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 19 6.5 22l1.5-6 11-11 4 4-11 11-4-2z" />
    ),
  },
  {
    label: "Competitors",
    href: "/dashboard?category=competitors",
    category: "competitors",
    icon: (
      <>
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      </>
    ),
  },
  {
    label: "Paid media",
    href: "/dashboard?category=paid",
    category: "paid",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 5a4 4 0 0 0-7 3v3H6m0 0h9M6 11v4a3 3 0 0 1-2 3h13" />
    ),
  },
  {
    label: "Technical",
    href: "/dashboard?category=technical",
    category: "technical",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6.2-1.4.8 1.9-1.5 1.5-1.9-.8a5 5 0 0 1-1.1.5l-.3 2h-2.4l-.3-2a5 5 0 0 1-1.1-.5l-1.9.8-1.5-1.5.8-1.9a5 5 0 0 1-.5-1.1L6 12.1V9.9l2-.3a5 5 0 0 1 .5-1.1l-.8-1.9 1.5-1.5 1.9.8a5 5 0 0 1 1.1-.5l.3-2h2.4l.3 2a5 5 0 0 1 1.1.5l1.9-.8 1.5 1.5-.8 1.9a5 5 0 0 1 .5 1.1l2 .3v2.4l-2 .3a5 5 0 0 1-.5 1.1Z" />
    ),
  },
];

const configNav = [
  {
    label: "Settings",
    href: "/dashboard/settings",
    category: "__settings__",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm6.2-1.4.8 1.9-1.5 1.5-1.9-.8a5 5 0 0 1-1.1.5l-.3 2h-2.4l-.3-2a5 5 0 0 1-1.1-.5l-1.9.8-1.5-1.5.8-1.9a5 5 0 0 1-.5-1.1L6 12.1V9.9l2-.3a5 5 0 0 1 .5-1.1l-.8-1.9 1.5-1.5 1.9.8a5 5 0 0 1 1.1-.5l.3-2h2.4l.3 2a5 5 0 0 1 1.1.5l1.9-.8 1.5 1.5-.8 1.9a5 5 0 0 1 .5 1.1l2 .3v2.4l-2 .3a5 5 0 0 1-.5 1.1Z" />
    ),
  },
];

const mobileNav = [
  navItems[0],
  navItems[1],
  navItems[2],
  navItems[3],
  configNav[0],
];

interface SidebarProps {
  website?: string;
}

function LogoMark() {
  return (
    <div className="w-7 h-7 flex-shrink-0" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="28" height="28">
        <defs>
          <clipPath id="ba-sidebar-clip">
            <rect width="32" height="32" rx="9" />
          </clipPath>
        </defs>
        <g clipPath="url(#ba-sidebar-clip)">
          <rect width="32" height="32" rx="9" fill="#111110" />
          <g fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.85">
            <path d="M7 25 A 8 8 0 0 1 15 17" />
            <path d="M7 25 A 13 13 0 0 1 20 12" opacity="0.55" />
            <path d="M7 25 A 18 18 0 0 1 25 7" opacity="0.3" />
          </g>
          <circle cx="7" cy="25" r="2.4" fill="#1DB973" />
        </g>
      </svg>
    </div>
  );
}

export default function Sidebar({ website }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCategory = searchParams.get("category");

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const isActive = (item: { href: string; category: string | null }) => {
    if (item.category === "__settings__") return pathname === item.href;
    if (item.category === null) return pathname === "/dashboard" && !activeCategory;
    return activeCategory === item.category;
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[240px] min-h-screen bg-white border-r border-border flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-5 pt-6 pb-5 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-[14px] font-medium tracking-[-0.025em] text-ink">
              badger<span className="text-accent">alerts</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-[13.5px] font-medium transition-all ${
                  active
                    ? "bg-accent-light text-accent-dark"
                    : "text-mid hover:text-ink hover:bg-surface"
                }`}
              >
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  {item.icon}
                </svg>
                {item.label}
              </Link>
            );
          })}

          <div className="border-t border-border mt-2 pt-2 flex flex-col gap-0.5">
            {configNav.map((item) => {
              const active = isActive(item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-[13.5px] font-medium transition-all ${
                    active
                      ? "bg-accent-light text-accent-dark"
                      : "text-mid hover:text-ink hover:bg-surface"
                  }`}
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    {item.icon}
                  </svg>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Site card + sign out */}
        <div className="px-3 pb-5 flex flex-col gap-1.5">
          {website && (
            <div className="bg-surface border border-border rounded-[10px] px-3 py-3 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-ink truncate">{website}</p>
                <p className="text-[11px] text-muted">Watching</p>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-[13px] text-muted hover:text-ink transition-colors rounded-[8px] hover:bg-surface w-full text-left"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-border flex items-center gap-1 px-3 py-2 overflow-x-auto scrollbar-none">
        <Link href="/dashboard" className="flex items-center gap-2 mr-3 flex-shrink-0">
          <LogoMark />
        </Link>
        {mobileNav.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                active
                  ? "bg-accent-light text-accent-dark"
                  : "text-mid hover:text-ink"
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" aria-hidden="true">
                {item.icon}
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
