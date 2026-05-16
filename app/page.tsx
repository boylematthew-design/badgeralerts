import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroForm from "@/components/HeroForm";
import SampleAlertsCarousel from "@/components/SampleAlertsCarousel";

// ── Sample alerts shown in the hero feed ─────────────────────────
const heroAlerts = [
  {
    iconBg: "#FEECEC",
    iconColor: "#A32D2D",
    tagBg: "#FEECEC",
    tagColor: "#A32D2D",
    tag: "Page speed",
    title: "Your homepage is loading slowly",
    desc: "Visitors are waiting 3.2s to see your page. Here's how to fix it in 10 minutes.",
    meta: "2 hours ago",
    fade: false,
    icon: (
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"
      />
    ),
  },
  {
    iconBg: "#E8F9F1",
    iconColor: "#0F7A49",
    tagBg: "#EBF3FE",
    tagColor: "#185FA5",
    tag: "SEO",
    title: "You're ranking #2 for a big keyword",
    desc: "High conversion potential detected. One small tweak could move you to #1.",
    meta: "Yesterday",
    fade: false,
    icon: (
      <>
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          d="m20 20-3.5-3.5"
        />
      </>
    ),
  },
  {
    iconBg: "#FEF3E2",
    iconColor: "#854F0B",
    tagBg: "#FEF3E2",
    tagColor: "#854F0B",
    tag: "Content",
    title: "49 topics your customers are searching for",
    desc: "We found content gaps that could bring hundreds of new visitors per month.",
    meta: "2 days ago",
    fade: false,
    icon: (
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 19 6.5 22l1.5-6 11-11 4 4-11 11-4-2z"
      />
    ),
  },
  {
    iconBg: "#EBF3FE",
    iconColor: "#185FA5",
    tagBg: "#FEF3E2",
    tagColor: "#854F0B",
    tag: "Social",
    title: "A competitor's post just went viral",
    desc: "49k views in 7 days. We'll show you how to respond.",
    meta: "3 days ago",
    fade: true,
    icon: (
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 11v2l14 6V5L3 11zm14-6v14M21 9v6"
      />
    ),
  },
];

// ── How it works steps ────────────────────────────────────────────
const steps = [
  {
    n: 1,
    heading: "Enter your website",
    body: "Type in your web address. That's it. No plugins, no tracking codes, no developer needed.",
  },
  {
    n: 2,
    heading: "We scan everything",
    body: "BadgerAlerts checks your site speed, search rankings, content gaps, and what competitors are doing.",
  },
  {
    n: 3,
    heading: "You get emailed alerts",
    body: "We email you clear, jargon-free suggestions — ranked by what'll make the biggest difference first.",
  },
];

// ── What we monitor cards ─────────────────────────────────────────
const monitorItems = [
  {
    heading: "Search rankings",
    body: "We track how you appear on Google and alert you to opportunities before your competitors notice them.",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="m20 20-3.5-3.5" />
      </>
    ),
  },
  {
    heading: "Site speed",
    body: "A slow website costs you customers. We'll tell you exactly what's slowing you down and how to fix it.",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
    ),
  },
  {
    heading: "Content ideas",
    body: "Discover the questions your customers are searching for — and turn them into pages that bring people in.",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 19 6.5 22l1.5-6 11-11 4 4-11 11-4-2z" />
    ),
  },
  {
    heading: "Competitor activity",
    body: "See when competitors post something that's gaining traction, so you can respond while it's still fresh.",
    icon: (
      <>
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      </>
    ),
  },
  {
    heading: "Social signals",
    body: "Stay on top of trends and viral moments in your niche — without spending hours scrolling social media.",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 11v2l14 6V5L3 11zm14-6v14M21 9v6" />
    ),
  },
  {
    heading: "Ad opportunities",
    body: "When market conditions favour your ads, we'll let you know — so your budget goes further.",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 5a4 4 0 0 0-7 3v3H6m0 0h9M6 11v4a3 3 0 0 1-2 3h13" />
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  return (
    <div className="bg-white text-ink">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section>
        <div className="max-w-[1120px] mx-auto px-7 md:px-12 pt-16 md:pt-[100px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
            {/* Left: copy + form */}
            <div className="pt-2">
              <h1 className="font-serif font-normal text-[32px] sm:text-[44px] lg:text-[54px] leading-[1.06] tracking-[-0.025em] text-ink mb-5">
                Your digital marketing{" "}
                <em className="italic text-accent-dark">AI consultant</em>
              </h1>
              <p className="text-[16px] md:text-[18px] text-mid font-light leading-[1.6] mb-9 max-w-[460px]">
                An AI tool that scans your site, flags what&apos;s broken, and
                suggests ways to grow. We&apos;ll email you an alert when we find
                something.
              </p>
              <HeroForm />
            </div>

            {/* Right: live alert feed */}
            <div className="pb-4">
              <div className="flex items-center gap-2 text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-3.5">
                <span className="live-dot" />
                Example live alerts &middot; last 7 days
              </div>
              <div className="anim-stack flex flex-col gap-[10px]">
                {heroAlerts.map((alert, i) => (
                  <div
                    key={i}
                    className={`bg-white border border-border rounded-[14px] p-4 flex items-start gap-3.5 transition-all hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:border-border-strong ${
                      alert.fade ? "opacity-50" : ""
                    }`}
                  >
                    {/* Icon tile */}
                    <div
                      className="w-9 h-9 rounded-[9px] flex-shrink-0 flex items-center justify-center"
                      style={{ background: alert.iconBg, color: alert.iconColor }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                        {alert.icon}
                      </svg>
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                      <span
                        className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mb-1.5"
                        style={{ background: alert.tagBg, color: alert.tagColor }}
                      >
                        {alert.tag}
                      </span>
                      <div className="text-[13.5px] font-medium text-ink leading-[1.3] mb-0.5">
                        {alert.title}
                      </div>
                      <div className="text-[12.5px] text-muted leading-[1.45]">
                        {alert.desc}
                      </div>
                      <div className="text-[11px] text-muted mt-1.5">{alert.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION DIVIDER ──────────────────────────────────────── */}
      <div className="max-w-[1120px] mx-auto px-7 md:px-12 mt-16 md:mt-20">
        <div className="border-t border-border" />
      </div>

      {/* ── SAMPLE ALERTS CAROUSEL ───────────────────────────────── */}
      <SampleAlertsCarousel />

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="max-w-[1120px] mx-auto px-7 md:px-12 my-16 md:my-20">
        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-3">
          How it works
        </div>
        <h2 className="font-serif font-normal text-[32px] md:text-[40px] leading-[1.1] tracking-[-0.02em] mb-3.5">
          Up and running in{" "}
          <em className="italic text-accent-dark">under a minute</em>
        </h2>
        <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] max-w-[520px] mb-14">
          No technical knowledge needed. If you have a website, you&apos;re ready to
          go.
        </p>

        {/* Steps — 3-col on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
          {steps.map((step, i) => (
            <div
              key={step.n}
              className={`bg-surface px-7 py-8 ${
                i === 0
                  ? "rounded-t-[14px] md:rounded-tr-none md:rounded-l-[14px]"
                  : i === steps.length - 1
                  ? "rounded-b-[14px] md:rounded-bl-none md:rounded-r-[14px]"
                  : ""
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-ink text-white text-[12px] font-medium flex items-center justify-center mb-5">
                {step.n}
              </div>
              <h3 className="text-[16px] font-medium text-ink tracking-[-0.01em] mb-2">
                {step.heading}
              </h3>
              <p className="text-[14px] text-mid font-light leading-[1.6]">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT WE MONITOR ──────────────────────────────────────── */}
      <section className="max-w-[1120px] mx-auto px-7 md:px-12 my-16 md:my-20">
        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-3">
          What we monitor
        </div>
        <h2 className="font-serif font-normal text-[32px] md:text-[40px] leading-[1.1] tracking-[-0.02em] mb-3.5">
          Everything that matters{" "}
          <em className="italic text-accent-dark">in one place</em>
        </h2>
        <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] max-w-[520px] mb-12">
          We keep an eye on the things that bring customers to your website —
          without you having to lift a finger.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {monitorItems.map((item) => (
            <div
              key={item.heading}
              className="bg-white border border-border rounded-[14px] px-6 py-7 hover:border-accent hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all"
            >
              <div className="w-9 h-9 rounded-[9px] bg-accent-light text-accent-dark flex items-center justify-center mb-4">
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  {item.icon}
                </svg>
              </div>
              <h3 className="text-[15px] font-medium text-ink tracking-[-0.01em] mb-2">
                {item.heading}
              </h3>
              <p className="text-[13.5px] text-mid font-light leading-[1.6]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BOX ──────────────────────────────────────────────── */}
      <section className="max-w-[1120px] mx-auto px-7 md:px-12 mb-16 md:mb-24">
        <div className="bg-ink rounded-[20px] px-8 md:px-20 py-14 md:py-[72px] text-center relative overflow-hidden">
          {/* Subtle ambient glow */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,rgba(29,185,115,0.10),transparent_50%)]" />

          <div className="relative">
            <h2 className="font-serif font-normal text-[28px] md:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mb-4">
              Start getting smarter{" "}
              <em className="italic text-accent">alerts today</em>
            </h2>
            <p className="text-[15px] md:text-[16px] text-white/55 font-light mb-9 max-w-lg mx-auto">
              Enter your website and we&apos;ll have your first alert ready within
              the hour.
            </p>
            <div className="max-w-[560px] mx-auto">
              <HeroForm variant="dark" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
