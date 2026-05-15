import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="bg-white text-ink">
      <Navbar />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">

        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4">About</div>
        <h1 className="font-serif font-normal text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] text-ink mb-4">
          Built by someone who&apos;s{" "}
          <em className="italic text-accent-dark">been in your shoes</em>
        </h1>
        <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] mb-12 max-w-[560px]">
          Built by a digital marketing specialist with nearly 20 years of experience — to give every website owner the kind of insight that usually only comes from hiring a consultant.
        </p>

        {/* Founder story */}
        <div className="border border-border rounded-[20px] px-8 md:px-10 py-8 mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-ink flex items-center justify-center text-white text-[14px] font-medium flex-shrink-0">
              M
            </div>
            <div>
              <p className="text-[14px] font-medium text-ink">Matthew Boyle</p>
              <p className="text-[13px] text-muted">Founder, BadgerAlerts — England, UK</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 text-[14px] text-mid leading-[1.75]">
            <p>I&apos;ve spent nearly two decades working in digital marketing — running campaigns, auditing websites, and helping businesses improve their online presence. Over that time, you develop a sharp eye. I can look at a website and quickly spot what&apos;s holding it back: a technical SEO issue here, a content gap there, a competitor quietly picking up ground.</p>
            <p>The problem is that kind of expertise doesn&apos;t scale. Most business owners are running their company — they don&apos;t have time to stay on top of everything that&apos;s happening online. And hiring someone to do it full-time isn&apos;t always an option.</p>
            <p>At the start of 2026, I started building AI tools to do what I do — automatically. Tools that can scan a website, analyse what&apos;s going on in the wider landscape, and surface the issues and opportunities that matter. That intelligence is the foundation of BadgerAlerts.</p>
          </div>
        </div>

        {/* Mission */}
        <div className="border border-border rounded-[20px] px-8 md:px-10 py-8 mb-4">
          <h2 className="font-serif font-normal text-[20px] md:text-[24px] leading-[1.15] tracking-[-0.015em] text-ink mb-4">
            More than just alerts
          </h2>
          <div className="flex flex-col gap-4 text-[14px] text-mid leading-[1.75]">
            <p>BadgerAlerts isn&apos;t just about flagging problems. The goal is education. Every alert comes with a full explanation — what&apos;s happening, why it matters, and what you can do about it. Over time, you build a real understanding of your website and how digital marketing actually works.</p>
            <p>I want BadgerAlerts to be a platform that keeps ambitious website owners at the cutting edge — people who want to understand what&apos;s going on, not just be told what to do.</p>
          </div>
        </div>

        {/* What's coming */}
        <div className="border border-border rounded-[20px] px-8 md:px-10 py-8 mb-10">
          <h2 className="font-serif font-normal text-[20px] md:text-[24px] leading-[1.15] tracking-[-0.015em] text-ink mb-4">
            What&apos;s coming
          </h2>
          <div className="flex flex-col gap-4 text-[14px] text-mid leading-[1.75] mb-6">
            <p>This is just the start. As the platform grows, I&apos;ll be releasing more AI-powered tools — each one targeting a different part of your digital presence — and building out a video library to go alongside them. Practical, no-nonsense content that explains digital marketing the way a good consultant would explain it to you in person.</p>
            <p>The ambition is a platform where the tools do the scanning, and the content gives you the knowledge to act on what you find.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "More AI tools", desc: "Expanding coverage across every corner of your digital presence", icon: (
                <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              )},
              { label: "Video library", desc: "Plain-English explainers on digital marketing topics that matter", icon: (
                <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0 1 21 8.723v6.554a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
              )},
              { label: "Deeper insights", desc: "Richer data and trend tracking as the platform matures", icon: (
                <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 16l4-4 4 4 4-4" />
              )},
            ].map((item) => (
              <div key={item.label} className="bg-surface rounded-[12px] p-4 text-center">
                <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" className="text-accent-dark" aria-hidden="true">{item.icon}</svg>
                </div>
                <p className="text-[13px] font-medium text-ink mb-1">{item.label}</p>
                <p className="text-[12px] text-muted leading-[1.5]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-ink rounded-[20px] px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,rgba(29,185,115,0.10),transparent_50%)]" />
          <div className="relative">
            <h3 className="font-serif font-normal text-[22px] md:text-[28px] leading-[1.1] tracking-[-0.02em] text-white mb-2">
              Ready to see it in action?
            </h3>
            <p className="text-[14px] text-white/55 font-light mb-6">
              Sign up free and get your first alert within days.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium px-6 py-2.5 rounded-[8px] text-[14px] transition-colors"
            >
              Get started free
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
