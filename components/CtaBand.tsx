import type { ReactNode } from "react";
import Link from "next/link";

// Full-width dark (Ink) call-to-action band used near the bottom of pages.
// Accent words in the title go in <em> and render in Lime.
export default function CtaBand({
  title,
  body,
  href,
  label,
}: {
  title: ReactNode;
  body: ReactNode;
  href: string;
  label: string;
}) {
  return (
    <section className="bg-ink text-paper">
      <div className="max-w-[1120px] mx-auto px-7 md:px-12 py-16 md:py-24 text-center">
        <h2 className="font-heading font-extrabold text-[28px] md:text-[44px] leading-[1.08] tracking-[-0.04em] text-paper mb-4 [&_em]:not-italic [&_em]:text-lime">
          {title}
        </h2>
        <p className="text-[15px] md:text-[16px] text-muted-dark mb-9 max-w-lg mx-auto">{body}</p>
        <Link
          href={href}
          className="btn-dark inline-flex items-center gap-2 px-6 py-3 text-[14px]"
        >
          {label}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
