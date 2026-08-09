import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Services | Matthew Boyle",
  description:
    "Digital marketing services from Matthew Boyle — SEO, paid media, content strategy, and competitor monitoring.",
};

const services = [
  {
    heading: "SEO & technical audits",
    body: "Search visibility improvements grounded in nearly 20 years of hands-on SEO — technical fixes, content gaps, and the changes that actually move rankings.",
    icon: (
      <>
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="m20 20-3.5-3.5" />
      </>
    ),
  },
  {
    heading: "Paid media",
    body: "Campaign strategy and management across Google, Meta, and Reddit Ads — built around what your budget can actually afford to test.",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M16 5a4 4 0 0 0-7 3v3H6m0 0h9M6 11v4a3 3 0 0 1-2 3h13" />
    ),
  },
  {
    heading: "Content strategy",
    body: "Content plans based on what your customers are actually searching for, not guesswork — including AI/GEO optimisation for how people search today.",
    icon: (
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 19 6.5 22l1.5-6 11-11 4 4-11 11-4-2z" />
    ),
  },
  {
    heading: "Social & competitor monitoring",
    body: "Keep an eye on what's working for competitors and what's trending in your niche, so your next move is an informed one.",
    icon: (
      <>
        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      </>
    ),
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-white text-ink">
      <Navbar />
      <main className="max-w-[1120px] mx-auto px-7 md:px-12 py-14 md:py-20">
        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4">
          Services
        </div>
        <h1 className="font-serif font-normal text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] text-ink mb-4">
          Digital marketing,{" "}
          <em className="italic text-accent-dark">done properly</em>
        </h1>
        <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] mb-12 max-w-[560px]">
          Nearly 20 years of hands-on experience across SEO, paid media, and content strategy —
          applied directly to your business. Here&apos;s where I can help.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16 md:mb-20">
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
              <h2 className="text-[15px] font-medium text-ink tracking-[-0.01em] mb-2">
                {item.heading}
              </h2>
              <p className="text-[13.5px] text-mid font-light leading-[1.6]">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="bg-ink rounded-[20px] px-8 md:px-16 py-12 md:py-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,rgba(29,185,115,0.10),transparent_50%)]" />
          <div className="relative">
            <h2 className="font-serif font-normal text-[24px] md:text-[32px] leading-[1.1] tracking-[-0.02em] text-white mb-3">
              Not sure which service you need?
            </h2>
            <p className="text-[14px] text-white/55 font-light mb-7 max-w-md mx-auto">
              Tell me a bit about your business and I&apos;ll point you in the right direction.
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
      </main>
      <Footer />
    </div>
  );
}
