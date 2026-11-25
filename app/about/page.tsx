import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import { GUIDE_PRICES } from "@/lib/guide-pricing";

export const metadata = {
  title: "About Matthew Boyle and Compounding Wins",
  description:
    "Compounding Wins is a London digital marketing agency run by Matthew Boyle, with over 20 years' experience in SEO, local SEO, AI search and paid media.",
};

const specialisms = [
  "Local SEO and Google Maps marketing",
  "Technical SEO and ecommerce SEO",
  "AI search (AIO and GEO), so ChatGPT, Gemini and Google's AI Overviews recommend you",
  "Reddit, YouTube, TikTok, Instagram and X",
  "Amazon and Airbnb listing optimisation",
  "Paid media across Google, Meta and Reddit Ads",
];

const cardClass = "border border-border rounded-[20px] px-8 md:px-10 py-8 mb-4";
const headingClass = "font-heading font-bold tracking-[-0.03em] text-[20px] md:text-[24px] leading-[1.15] text-ink mb-4";
const linkClass = "font-medium text-accent-dark underline underline-offset-2 hover:opacity-80";

export default function AboutPage() {
  return (
    <div className="bg-paper text-ink">
      <Navbar />
      <PageHero
        eyebrow="About"
        title={<>Small wins that <em>compound</em></>}
        intro={<>Compounding Wins is a London digital marketing agency run by Matthew Boyle. I help businesses get found online and turn that visibility into leads and sales.</>}
      />
      <main className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">

        {/* Founder story */}
        <div className={cardClass}>
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/matthew-boyle.png"
              alt="Photo of Matthew Boyle"
              width={96}
              height={96}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <p className="text-[14px] font-medium text-ink">Matthew Boyle</p>
              <p className="text-[13px] text-muted">Founder, Compounding Wins — London, UK</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 text-[14px] text-mid leading-[1.75]">
            <p>I&apos;ve spent over 20 years working in digital marketing: running campaigns, auditing websites and helping businesses improve their online presence. Over that time, you develop a sharp eye. I can look at a website and quickly spot what&apos;s holding it back, whether that&apos;s a technical SEO issue, a content gap or a competitor quietly picking up ground.</p>
            <p>I started Compounding Wins to give small and growing businesses the kind of expertise that usually only comes with a big agency budget. When you work with Compounding Wins, you work with me directly, and you get straight answers about what will actually make a difference.</p>
            <p>The name comes from how good marketing really works. It&apos;s rarely one big break. It&apos;s a better Google profile, a few more reviews, a page that finally ranks and a listing that gets recommended by AI, each building on the last until the results add up.</p>
          </div>
        </div>

        {/* What I do */}
        <div className={cardClass}>
          <h2 className={headingClass}>How I can help</h2>
          <div className="flex flex-col gap-4 text-[14px] text-mid leading-[1.75]">
            <p>Every service comes in two fixed-price options, so you know the cost up front:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-medium text-ink">A one-off audit for {GUIDE_PRICES.audit}.</span> I review where you are now and give you a clear document of recommendations that you or your team can put into action.
              </li>
              <li>
                <span className="font-medium text-ink">Monthly support for {GUIDE_PRICES.monthly} a month.</span> I&apos;m hands-on with the day-to-day work, and we have regular check-ins to review progress.
              </li>
            </ul>
            <p>I also offer <Link href="/consulting" className={linkClass}>one-to-one consulting</Link> if you&apos;d rather talk a problem through. My specialisms include:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              {specialisms.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p>
              See all <Link href="/services" className={linkClass}>services</Link>.
            </p>
          </div>
        </div>

        {/* Free resources */}
        <div className={`${cardClass} mb-10`}>
          <h2 className={headingClass}>Free guides and tools</h2>
          <div className="flex flex-col gap-4 text-[14px] text-mid leading-[1.75] mb-6">
            <p>Not ready to hire anyone? Everything I know goes into the free guides and tools on this site, so you can do a lot of it yourself. The guides are practical, plain-English tips written from hands-on work, and the tools handle the fiddly jobs for you.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Free guides", desc: "Tips on SEO, Google Maps, social platforms and AI search", href: "/blog", icon: (
                <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />
              )},
              { label: "Free tools", desc: "From a schema generator to a website checker", href: "/tools", icon: (
                <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              )},
              { label: "Consulting", desc: "One-to-one advice when you want a second opinion", href: "/consulting", icon: (
                <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              )},
            ].map((item) => (
              <Link key={item.label} href={item.href} className="bg-surface rounded-[12px] p-4 text-center hover:bg-accent-light transition-colors">
                <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" className="text-accent-dark" aria-hidden="true">{item.icon}</svg>
                </div>
                <p className="text-[13px] font-medium text-ink mb-1">{item.label}</p>
                <p className="text-[12px] text-muted leading-[1.5]">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>

      </main>
      <CtaBand
        title={<>Let&apos;s talk about your business</>}
        body={<>Book a free 30-minute call or send a message, and I&apos;ll reply within 1 business day.</>}
        href="/contact"
        label="Work with me"
      />
      <Footer />
    </div>
  );
}
