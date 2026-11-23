import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero, { heroLinkClass } from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import GuideFaqs from "@/components/GuideFaqs";
import type { Faq } from "@/lib/guide-faqs";
import { getTool } from "@/lib/tools";
import { BASE_URL, FOUNDER_ID, ORGANIZATION_ID } from "@/lib/business-schema";

// Shared landing page for every free tool: dark intro, the tool itself, how to use it, FAQs
// with FAQPage schema, and a closing call to action. Each tool page only supplies its own copy.
// (Guides link to tools through the "Free tool" cards under tips, see lib/tool-tips.ts.)
export default function ToolLayout({
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
    creator: { "@id": FOUNDER_ID },
    publisher: { "@id": ORGANIZATION_ID },
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
