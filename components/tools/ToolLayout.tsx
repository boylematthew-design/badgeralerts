import type { ReactNode } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero, { heroLinkClass } from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import GuideFaqs from "@/components/GuideFaqs";
import type { Faq } from "@/lib/guide-faqs";
import { getTool } from "@/lib/tools";
import { fetchRelatedTips } from "@/lib/tool-related-tips";

const BASE_URL = "https://www.compoundingwins.com";

// Read-only public key: tool pages only ever read published tips and guides.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Shared landing page for every free tool: dark intro, the tool itself, how to use it, the
// guide tips it helps with (internal links both ways between tools and guides), FAQs with
// FAQPage schema, and a closing call to action. Each tool page only supplies its own copy.
export default async function ToolLayout({
  slug,
  title,
  intro,
  children,
  steps,
  faqs,
  privacyNote = "Everything runs in your browser. Nothing you enter or upload is sent to our servers.",
  wide = false,
}: {
  slug: string;
  title: ReactNode;
  intro: ReactNode;
  children: ReactNode;
  steps: { title: string; body: string }[];
  faqs: Faq[];
  privacyNote?: string | null;
  wide?: boolean;
}) {
  const tool = getTool(slug);
  const relatedTips = await fetchRelatedTips(supabase, slug);
  const width = wide ? "max-w-[1040px]" : "max-w-[760px]";

  const appSchema = tool && {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `${BASE_URL}/tools/${slug}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any (runs in your web browser)",
    offers: { "@type": "Offer", price: "0", priceCurrency: "GBP" },
    creator: { "@type": "Person", name: "Matthew Boyle", url: `${BASE_URL}/about` },
  };

  return (
    <div className="bg-paper text-ink">
      {appSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema).replace(/</g, "\\u003c") }}
        />
      )}
      <Navbar />
      <PageHero
        eyebrow="Free tool"
        title={title}
        intro={intro}
        width={width}
        before={<Link href="/tools" className={heroLinkClass}>← All free tools</Link>}
      />
      <main className={`${width} mx-auto px-4 sm:px-7 md:px-12 py-10 md:py-16`}>
        {privacyNote && (
          <p className="text-[13px] text-muted mb-6 flex items-start gap-2">
            <span className="flex-shrink-0 rounded-full bg-accent-light text-accent-dark text-[10px] font-semibold tracking-[0.08em] uppercase px-2 py-0.5 mt-[1px]">
              Private
            </span>
            {privacyNote}
          </p>
        )}

        {children}

        <section className="mt-16" aria-labelledby="how-to-use">
          <h2 id="how-to-use" className="font-heading font-extrabold tracking-[-0.04em] text-[24px] md:text-[30px] text-ink mb-6">
            How to use it
          </h2>
          <ol className="space-y-5">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-ink text-lime font-heading font-bold text-[14px] flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-heading font-bold text-[17px] text-ink">{step.title}</h3>
                  <p className="text-[15px] text-mid leading-[1.65] mt-1">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {relatedTips.length > 0 && (
          <section className="mt-16" aria-labelledby="related-tips">
            <h2 id="related-tips" className="font-heading font-extrabold tracking-[-0.04em] text-[24px] md:text-[30px] text-ink mb-2">
              Tips this tool helps with
            </h2>
            <p className="text-[15px] text-mid mb-6">From the free guides on this site.</p>
            <ul className="border-y border-border divide-y divide-border">
              {relatedTips.map((tip) => (
                <li key={tip.id} className="py-4">
                  <Link href={tip.href} className="group block">
                    <span className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase">{tip.guideTitle}</span>
                    <span className="block text-[16px] font-semibold text-ink group-hover:text-accent-dark underline underline-offset-2 decoration-border-strong group-hover:decoration-accent transition-colors mt-0.5">
                      {tip.title}
                    </span>
                    {tip.note && <span className="block text-[14px] text-mid leading-[1.55] mt-1">{tip.note}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {faqs.length > 0 && <GuideFaqs heading="Questions about this tool" faqs={faqs} />}
      </main>
      <CtaBand
        title={<>Want this done <em>for you?</em></>}
        body="I help businesses put these tips into practice and grow from search, maps and AI answers."
        href="/contact"
        label="Work with me"
      />
      <Footer />
    </div>
  );
}

// Simple answers for the FAQ list: one paragraph each.
export function faq(question: string, ...paragraphs: string[]): Faq {
  return { question, answer: paragraphs.map((text) => ({ type: "p" as const, text })) };
}
