import { AUDIT_STEP_COUNT, STEP_TITLES, type ServiceProcess } from "@/lib/service-process";

// "What we do" and "How we work" sections on each services page. Copy lives in lib/service-process.ts.

const headingClass = "font-heading font-bold tracking-[-0.03em] text-[22px] md:text-[26px] text-ink mb-5";

export function WhatWeDo({ process }: { process: ServiceProcess }) {
  return (
    <section className="mb-12" aria-labelledby="what-we-do">
      <h2 id="what-we-do" className={headingClass}>
        {process.heading ?? "What we do"}
      </h2>
      <div className="border border-border rounded-[20px] px-6 md:px-10 py-7 md:py-9 bg-white">
        <p className="text-[15px] md:text-[16px] text-mid leading-[1.7] mb-5">{process.whatWeDo}</p>
        <ul className={`grid sm:grid-cols-2 gap-x-6 ${process.covers.some((c) => typeof c !== "string") ? "gap-y-4" : "gap-y-2.5"}`}>
          {process.covers.map((item) => {
            const label = typeof item === "string" ? item : item.label;
            return (
              <li key={label} className="flex items-start gap-2.5 text-[14.5px] text-ink leading-[1.5]">
                <svg width="16" height="16" viewBox="0 0 24 24" className="text-accent-dark flex-shrink-0 mt-[3px]" aria-hidden="true">
                  <path fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {typeof item === "string" ? (
                  label
                ) : (
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-[14px] text-muted leading-[1.55] mt-0.5">{item.detail}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function HowWeWork({ process }: { process: ServiceProcess }) {
  return (
    <section className="mb-12" aria-labelledby="how-we-work">
      <h2 id="how-we-work" className={headingClass}>
        How we work
      </h2>
      <ol className="space-y-5">
        {process.steps.map((text, i) => (
          <li key={STEP_TITLES[i]} className="flex gap-4">
            <span
              aria-hidden="true"
              className="w-8 h-8 rounded-full bg-accent-light text-accent-dark text-[14px] font-bold flex items-center justify-center flex-shrink-0"
            >
              {i + 1}
            </span>
            <div>
              <h3 className="text-[16px] md:text-[17px] font-medium text-ink leading-[1.4] mb-1">{STEP_TITLES[i]}</h3>
              <p className="text-[15px] text-mid leading-[1.7]">{text}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-[14px] text-muted leading-[1.6] border-l-2 border-accent pl-4">
        Choosing the one-off audit? It covers steps 1 to {AUDIT_STEP_COUNT}, finished with a prioritised action plan you
        can work through yourself or with us.
      </p>
    </section>
  );
}
