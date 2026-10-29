import type { ReactNode } from "react";

// Dark (Ink) intro band at the top of inner pages. Pass the title with any accent words in
// <em> — they render in Lime, upright. `before` sits above the eyebrow (e.g. a back link),
// `after` sits under the intro.
export default function PageHero({
  eyebrow,
  title,
  intro,
  before,
  after,
  width = "max-w-[760px]",
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  before?: ReactNode;
  after?: ReactNode;
  width?: string;
}) {
  return (
    <section className="bg-ink text-paper">
      <div className={`${width} mx-auto px-7 md:px-12 py-14 md:py-20`}>
        {before && <div className="mb-6">{before}</div>}
        <div className="text-[11px] font-semibold tracking-[0.08em] text-muted-dark uppercase mb-4">
          {eyebrow}
        </div>
        <h1 className="font-heading font-extrabold text-[32px] md:text-[48px] leading-[1.06] tracking-[-0.04em] text-paper [&_em]:not-italic [&_em]:text-lime">
          {title}
        </h1>
        {intro && (
          <div className="text-[15px] md:text-[17px] text-muted-dark leading-[1.6] mt-5 max-w-[580px]">
            {intro}
          </div>
        )}
        {after}
      </div>
    </section>
  );
}

// Link style for back links / breadcrumbs inside the dark hero.
export const heroLinkClass = "text-[13px] text-muted-dark hover:text-lime transition-colors";
