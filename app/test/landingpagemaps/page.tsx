import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthorByline from "@/components/AuthorByline";
import LinkedInIcon from "@/components/LinkedInIcon";
import MapsLeadForm from "@/components/MapsLeadForm";
import TableOfContents from "@/components/TableOfContents";
import { TipList } from "@/components/GuideTips";
import { fetchGuideTips } from "@/lib/fetch-guide-tips";

const LINKEDIN_URL = "https://www.linkedin.com/in/mattboyle3/";

// EXPERIMENT: test run of a dedicated "local maps marketing" landing page,
// ahead of possibly giving it its own domain. Lives at /test/landingpagemaps
// rather than replacing the real homepage. See GuideTips / fetch-guide-tips
// for the pieces shared with the real blog template.
const GUIDE_SLUG = "google-maps-marketing-guide";

const bullets = [
  "Get in contact for a free quote",
  "Over 15 years of local advertising experience",
  "Supercharge your business",
];

export const metadata = {
  title: "Local Maps Marketing Services | Google, Bing & Apple Maps",
  description:
    "A niche agency specialised in local maps marketing — Google Maps, Bing Maps and Apple Maps. 15+ years of local advertising experience. Get a free quote.",
  // Test page — keep it out of search results while we're experimenting.
  robots: { index: false, follow: false },
};

export default async function MapsLandingTestPage() {
  // This guide is unpublished on the public blog (so it's not duplicate
  // content in two places) but its content is reused here instead. Row
  // Level Security only lets public clients read *published* guides, so
  // reading it here needs the service role key — server-side only, in this
  // server component, never shipped to the browser.
  const guideAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: guide } = await guideAdmin
    .from("guides")
    .select("id, title, description, updated_at")
    .eq("site", "badgeralerts")
    .eq("slug", GUIDE_SLUG)
    .single();

  const guideContent = guide ? await fetchGuideTips(guideAdmin, guide.id) : null;

  const lastUpdated = guide
    ? new Date(guide.updated_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-white text-ink">
      <Navbar />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section className="max-w-[900px] mx-auto px-7 md:px-12 pt-16 md:pt-[100px] pb-14 md:pb-16 text-center">
        <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4">
          Local Maps Marketing
        </div>
        <h1 className="font-serif font-normal text-[30px] sm:text-[42px] lg:text-[50px] leading-[1.1] tracking-[-0.025em] text-ink mb-5">
          Local maps marketing services including{" "}
          <em className="italic text-accent-dark">Google Maps, Bing Maps &amp; Apple Maps</em>
        </h1>
        <p className="text-[16px] md:text-[18px] text-mid font-light leading-[1.6] mb-9 max-w-[620px] mx-auto">
          A unique niche agency specialised in local maps services. We are experts and consultants
          in local map advertising.
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-7 mb-10">
          {bullets.map((b) => (
            <div key={b} className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-accent-light text-accent-dark flex items-center justify-center flex-shrink-0">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span className="text-[14px] text-mid font-medium">{b}</span>
            </div>
          ))}
        </div>

        <a
          href="#get-quote"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium px-6 py-3 rounded-[8px] text-[14px] transition-colors"
        >
          Get your free quote
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </a>
      </section>

      {/* ── SOCIAL PROOF ─────────────────────────────────────────── */}
      <section className="max-w-[1120px] mx-auto px-7 md:px-12 mb-16 md:mb-20">
        <div className="border border-border rounded-[20px] p-7 md:p-9 flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-7 max-w-[680px] mx-auto text-center sm:text-left">
          <Image
            src="/matthew-boyle-linkedin.jpg"
            alt="Matthew Boyle"
            width={96}
            height={96}
            className="w-24 h-24 rounded-full object-cover border border-border flex-shrink-0"
          />
          <div>
            <p className="text-[15px] font-medium text-ink mb-1.5">Matthew Boyle</p>
            <p className="text-[14px] md:text-[15px] text-mid font-light leading-[1.6] mb-3">
              Matthew Boyle is a seasoned professional having helped multiple local businesses
              gain new leads and business. He has deep local maps marketing experience.
            </p>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] text-accent-dark font-medium hover:underline underline-offset-2"
            >
              <LinkedInIcon size={14} />
              View LinkedIn profile
            </a>
          </div>
        </div>
      </section>

      {/* ── LEAD FORM ────────────────────────────────────────────── */}
      <section id="get-quote" className="max-w-[640px] mx-auto px-7 md:px-12 mb-20 md:mb-24 scroll-mt-[90px]">
        <div className="border border-border rounded-[20px] p-7 md:p-9">
          <div className="text-center mb-7">
            <h2 className="font-serif font-normal text-[26px] md:text-[32px] text-ink mb-2">
              Get your free quote
            </h2>
            <p className="text-[14px] md:text-[15px] text-mid font-light">
              Tell us about your business and we&apos;ll get back to you within 1 business day.
            </p>
          </div>
          <MapsLeadForm />
        </div>
      </section>

      {/* ── GUIDE CONTENT (reused from the blog, warts and all) ─────── */}
      {guide && guideContent && (
        <section className="border-t border-border">
          <div className="max-w-[760px] mx-auto px-7 md:px-12 py-14 md:py-20">
            <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4">Guide</div>
            <h2 className="font-serif font-normal text-[28px] md:text-[38px] leading-[1.1] tracking-[-0.02em] text-ink mb-4">
              {guide.title}
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mb-5">
              <AuthorByline />
              {lastUpdated && <span className="text-[13px] text-muted">Last updated: {lastUpdated}</span>}
            </div>
            {guide.description && (
              <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] mb-12 max-w-[560px]">
                {guide.description}
              </p>
            )}

            {guideContent.tips.length > 1 && (
              <TableOfContents tips={guideContent.tips} sections={guideContent.sections} />
            )}
            <TipList tips={guideContent.tips} sections={guideContent.sections} />
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
