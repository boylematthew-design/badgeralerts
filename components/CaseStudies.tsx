import Image from "next/image";
import type { CaseStudy } from "@/lib/case-studies";

// Case study accordions on the services pages. Like GuideFaqs they use native <details>/<summary>,
// so the full write-up and image alt text are in the page HTML while closed, for search engines
// and AI tools to read, and they open without any JavaScript.
export default function CaseStudies({ studies }: { studies: CaseStudy[] }) {
  if (studies.length === 0) return null;

  return (
    <section className="mb-12" aria-labelledby="case-studies">
      <h2 id="case-studies" className="font-heading font-bold tracking-[-0.03em] text-[22px] md:text-[26px] text-ink mb-5">
        {studies.length === 1 ? "Case study" : "Case studies"}
      </h2>
      <div className="space-y-4">
        {studies.map((study) => (
          <details key={study.id} id={`case-study-${study.id}`} className="group border border-border rounded-[20px] bg-white">
            <summary className="flex items-start justify-between gap-4 px-6 md:px-8 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <div>
                <h3 className="text-[17px] md:text-[18px] font-medium text-ink leading-[1.4] group-hover:text-accent-dark transition-colors">
                  {study.client}
                </h3>
                <p className="text-[14px] text-muted mt-1 leading-[1.5]">{study.summary}</p>
              </div>
              <span
                aria-hidden="true"
                className="text-accent-dark text-[22px] leading-none mt-0.5 flex-shrink-0 transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="px-6 md:px-8 pb-8 text-[15px] text-mid leading-[1.7]">
              <div className="space-y-3">
                {study.intro.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {study.sections.map((section) => (
                <div key={section.heading} className="mt-8">
                  <h4 className="font-heading font-bold tracking-[-0.02em] text-[17px] md:text-[18px] text-ink mb-2">
                    {section.heading}
                  </h4>
                  <div className="space-y-3">
                    {section.paragraphs.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  {section.image && (
                    <figure className="mt-5">
                      {/* Screenshots are hard to read at phone width, so each opens full size. */}
                      <a href={section.image.src} target="_blank" rel="noopener" className="block">
                        <Image
                          src={section.image.src}
                          alt={section.image.alt}
                          width={section.image.width}
                          height={section.image.height}
                          sizes="(min-width: 768px) 660px, 100vw"
                          className="w-full h-auto rounded-[12px] border border-border"
                        />
                      </a>
                      <figcaption className="text-[13px] text-muted mt-2">
                        {section.image.caption} <span className="whitespace-nowrap">(Select to enlarge.)</span>
                      </figcaption>
                    </figure>
                  )}
                </div>
              ))}
              <p className="mt-8">
                <a
                  href={study.website}
                  target="_blank"
                  rel="noopener"
                  className="text-accent-dark font-medium underline underline-offset-2 hover:text-accent"
                >
                  Visit {study.shortName} ↗
                </a>
              </p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
