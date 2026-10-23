import type { Faq, FaqBlock } from "@/lib/guide-faqs";

// FAQ accordions built on the native <details>/<summary> elements: the answers are in the
// page HTML even while closed, so search engines and AI tools can read every one, and they
// open and close without any JavaScript. FAQPage structured data is added for the same reason.

function blockToText(block: FaqBlock) {
  return block.type === "p" ? block.text : `${block.heading} ${block.items.join("; ")}.`;
}

export default function GuideFaqs({ heading, faqs }: { heading: string; faqs: Faq[] }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer.map(blockToText).join(" ") },
    })),
  };

  return (
    <section className="mt-14" aria-labelledby="faqs">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
      <h2 id="faqs" className="font-serif text-[24px] md:text-[30px] text-ink font-normal mb-6">
        {heading}
      </h2>
      <div className="border-y border-border divide-y divide-border">
        {faqs.map((faq) => (
          <details key={faq.question} className="group">
            <summary className="flex items-start justify-between gap-4 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <h3 className="text-[16px] md:text-[17px] font-medium text-ink leading-[1.4] group-hover:text-accent-dark transition-colors">
                {faq.question}
              </h3>
              <span
                aria-hidden="true"
                className="text-accent-dark text-[22px] leading-none mt-0.5 flex-shrink-0 transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="pb-6 pr-8 space-y-3 text-[15px] text-mid font-light leading-[1.7]">
              {faq.answer.map((block, i) =>
                block.type === "p" ? (
                  <p key={i}>{block.text}</p>
                ) : (
                  <div key={i}>
                    <p className="font-medium text-ink mb-1.5">{block.heading}</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {block.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
