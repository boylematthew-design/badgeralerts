import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroForm from "@/components/HeroForm";
import SampleAlertsCarousel from "@/components/SampleAlertsCarousel";

export const metadata = {
  title: "Tools | Matthew Boyle",
  description:
    "Free website monitoring tool from Matthew Boyle — automatic alerts on SEO, site speed, content gaps, and competitor activity.",
};

export default function ToolsPage() {
  return (
    <div className="bg-white text-ink">
      <Navbar />

      <section className="max-w-[1120px] mx-auto px-7 md:px-12 pt-14 md:pt-20">
        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4">
          Tools
        </div>
        <h1 className="font-serif font-normal text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] text-ink mb-4 max-w-[640px]">
          A free tool that watches{" "}
          <em className="italic text-accent-dark">your website</em>
        </h1>
        <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] mb-9 max-w-[520px]">
          Website Monitoring is a tool I built to do part of my job automatically — it scans your
          site and emails you plain-English alerts when it spots something worth knowing about.
        </p>
        <div className="max-w-[560px]">
          <HeroForm />
        </div>
        <p className="text-[13px] text-muted font-light mt-6">
          Already using it?{" "}
          <Link href="/login" className="text-accent-dark hover:underline underline-offset-2">
            Sign in
          </Link>
        </p>
      </section>

      <div className="max-w-[1120px] mx-auto px-7 md:px-12 mt-16 md:mt-20">
        <div className="border-t border-border" />
      </div>

      <SampleAlertsCarousel />

      <section className="max-w-[1120px] mx-auto px-7 md:px-12 mb-16 md:mb-24">
        <div className="bg-ink rounded-[20px] px-8 md:px-20 py-14 md:py-[72px] text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,rgba(29,185,115,0.10),transparent_50%)]" />
          <div className="relative">
            <h2 className="font-serif font-normal text-[28px] md:text-[42px] leading-[1.1] tracking-[-0.02em] text-white mb-4">
              Want more than{" "}
              <em className="italic text-accent">automated alerts</em>?
            </h2>
            <p className="text-[15px] md:text-[16px] text-white/55 font-light mb-9 max-w-lg mx-auto">
              For hands-on strategy and execution, I also offer consulting and full-service
              digital marketing.
            </p>
            <Link
              href="/consulting"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium px-6 py-3 rounded-[8px] text-[14px] transition-colors"
            >
              See consulting
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
