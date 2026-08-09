import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Consulting | Matthew Boyle",
  description:
    "One-to-one digital marketing consulting with Matthew Boyle — strategy sessions and ongoing support for ambitious business owners.",
};

export default function ConsultingPage() {
  return (
    <div className="bg-white text-ink">
      <Navbar />
      <main className="max-w-[820px] mx-auto px-7 md:px-12 py-14 md:py-20">
        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4">
          Consulting
        </div>
        <h1 className="font-serif font-normal text-[32px] md:text-[44px] leading-[1.1] tracking-[-0.02em] text-ink mb-4">
          Straight-talking advice,{" "}
          <em className="italic text-accent-dark">one-to-one</em>
        </h1>
        <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] mb-10 max-w-[560px]">
          Sometimes you don&apos;t need an agency — you need someone to sit down with you, look at
          what you&apos;ve got, and tell you honestly what to do next. That&apos;s what consulting
          with me looks like.
        </p>

        <div className="border border-border rounded-[20px] px-8 md:px-10 py-8 mb-16 md:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/matthew-boyle.png"
              alt="Matthew Boyle"
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <p className="text-[14px] font-medium text-ink">Matthew Boyle</p>
              <p className="text-[13px] text-muted">Digital Marketing Consultant &middot; ~20 years experience</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 text-[14px] text-mid leading-[1.75]">
            <p>
              Whether it&apos;s a one-off strategy session to unblock a specific problem, or
              ongoing monthly support as an extra pair of expert eyes on your marketing — I tailor
              consulting around what you actually need, not a fixed package.
            </p>
            <p>
              Get in touch with a bit of background on your business and what you&apos;re trying
              to achieve, and I&apos;ll come back to you with how I can help.
            </p>
          </div>
        </div>

        <div className="bg-ink rounded-[20px] px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,rgba(29,185,115,0.10),transparent_50%)]" />
          <div className="relative">
            <h2 className="font-serif font-normal text-[22px] md:text-[28px] leading-[1.1] tracking-[-0.02em] text-white mb-2">
              Let&apos;s talk about your business
            </h2>
            <p className="text-[14px] text-white/55 font-light mb-6">
              Book a consultation and get clear, practical advice.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium px-6 py-2.5 rounded-[8px] text-[14px] transition-colors"
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
