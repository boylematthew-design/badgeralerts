import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LINKEDIN_URL = "https://www.linkedin.com/in/mattboyle3/";

// ── What I do — services teaser ─────────────────────────────────
const services = [
  {
    heading: "SEO & technical audits",
    body: "Technical fixes, content gaps, and the changes that actually move rankings.",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="m20 20-3.5-3.5" />
      </>
    ),
  },
  {
    heading: "Paid media",
    body: "Campaign strategy across Google, Meta, and Reddit Ads, built around your budget.",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 5a4 4 0 0 0-7 3v3H6m0 0h9M6 11v4a3 3 0 0 1-2 3h13" />
    ),
  },
  {
    heading: "Content strategy",
    body: "Content plans based on what your customers are actually searching for.",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 19 6.5 22l1.5-6 11-11 4 4-11 11-4-2z" />
    ),
  },
  {
    heading: "Website monitoring",
    body: "A free tool that scans your site and emails you alerts when something needs attention.",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
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

  const { data: guides } = await supabase
    .from("guides")
    .select("id, title, slug, description, tips(count)")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <div className="bg-white text-ink">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section>
        <div className="max-w-[1120px] mx-auto px-7 md:px-12 pt-16 md:pt-[100px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Left: copy + CTAs */}
            <div>
              <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4">
                Digital Marketing Consultant
              </div>
              <h1 className="font-serif font-normal text-[32px] sm:text-[44px] lg:text-[54px] leading-[1.06] tracking-[-0.025em] text-ink mb-5">
                Grow your business with{" "}
                <em className="italic text-accent-dark">marketing that works</em>
              </h1>
              <p className="text-[16px] md:text-[18px] text-mid font-light leading-[1.6] mb-9 max-w-[460px]">
                I&apos;m Matthew Boyle — nearly 20 years in digital marketing. SEO, paid media,
                content strategy, and consulting, plus free guides and tools to help you do it
                yourself.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="bg-ink text-white text-[14px] font-medium px-6 py-3 rounded-[8px] hover:opacity-80 active:translate-y-px transition-all"
                >
                  Work with me
                </Link>
                <Link
                  href="/blog"
                  className="text-[14px] text-mid font-medium px-6 py-3 rounded-[8px] border border-border hover:border-border-strong hover:text-ink transition-all"
                >
                  Read the free guides
                </Link>
              </div>
            </div>

            {/* Right: photo */}
            <div className="flex flex-col items-center lg:items-end">
              <div className="w-full max-w-[360px] border border-border rounded-[20px] p-3 bg-surface">
                <Image
                  src="/matthew-boyle.png"
                  alt="Matthew Boyle"
                  width={480}
                  height={480}
                  priority
                  className="w-full aspect-square object-cover rounded-[14px]"
                />
              </div>
              <div className="w-full max-w-[360px] flex items-center justify-between mt-4">
                <div>
                  <p className="text-[14px] font-medium text-ink">Matthew Boyle</p>
                  <p className="text-[12.5px] text-muted">England, UK</p>
                </div>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-accent-dark font-medium hover:underline underline-offset-2"
                >
                  View LinkedIn →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION DIVIDER ──────────────────────────────────────── */}
      <div className="max-w-[1120px] mx-auto px-7 md:px-12 mt-16 md:mt-20">
        <div className="border-t border-border" />
      </div>

      {/* ── WHAT I DO ─────────────────────────────────────────────── */}
      <section className="max-w-[1120px] mx-auto px-7 md:px-12 my-16 md:my-20">
        <div className="flex items-end justify-between gap-4 mb-3.5 flex-wrap">
          <div>
            <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-3">
              What I do
            </div>
            <h2 className="font-serif font-normal text-[32px] md:text-[40px] leading-[1.1] tracking-[-0.02em]">
              Everything that grows{" "}
              <em className="italic text-accent-dark">your business</em>
            </h2>
          </div>
          <Link
            href="/services"
            className="text-[14px] text-accent-dark font-medium hover:underline underline-offset-2 flex-shrink-0"
          >
            View all services →
          </Link>
        </div>
        <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] max-w-[520px] mb-12">
          From hands-on consulting to free tools you can use right now.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((item) => (
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

      {/* ── FREE GUIDES ───────────────────────────────────────────── */}
      {guides && guides.length > 0 && (
        <section className="max-w-[1120px] mx-auto px-7 md:px-12 my-16 md:my-20">
          <div className="flex items-end justify-between gap-4 mb-3.5 flex-wrap">
            <div>
              <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-3">
                Free guides
              </div>
              <h2 className="font-serif font-normal text-[32px] md:text-[40px] leading-[1.1] tracking-[-0.02em]">
                Practical tips,{" "}
                <em className="italic text-accent-dark">no fluff</em>
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-[14px] text-accent-dark font-medium hover:underline underline-offset-2 flex-shrink-0"
            >
              View all guides →
            </Link>
          </div>
          <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] max-w-[520px] mb-12">
            In-depth guides, each made up of practical tips added regularly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {guides.map((guide) => {
              const tipCount = (guide.tips as unknown as { count: number }[])?.[0]?.count ?? 0;
              return (
                <Link
                  key={guide.id}
                  href={`/blog/${guide.slug}`}
                  className="group block border border-border rounded-[16px] px-6 py-6 hover:border-accent-dark/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-serif text-[18px] md:text-[20px] text-ink font-normal group-hover:text-accent-dark transition-colors">
                      {guide.title}
                    </h3>
                    <span className="text-[12px] text-muted font-light flex-shrink-0">
                      {tipCount} tip{tipCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {guide.description && (
                    <p className="text-[13.5px] text-mid font-light leading-[1.6] mt-2">
                      {guide.description}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── CTA BOX ──────────────────────────────────────────────── */}
      <section className="max-w-[1120px] mx-auto px-7 md:px-12 mb-16 md:mb-24">
        <div className="bg-ink rounded-[20px] px-8 md:px-20 py-14 md:py-[72px] text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,rgba(29,185,115,0.10),transparent_50%)]" />
          <div className="relative">
            <h2 className="font-serif font-normal text-[28px] md:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mb-4">
              Let&apos;s grow{" "}
              <em className="italic text-accent">your business</em>
            </h2>
            <p className="text-[15px] md:text-[16px] text-white/55 font-light mb-9 max-w-lg mx-auto">
              Tell me about your business and what you&apos;re trying to achieve.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium px-6 py-3 rounded-[8px] text-[14px] transition-colors"
            >
              Work with me
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
