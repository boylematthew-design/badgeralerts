interface TipData {
  id: string;
  title: string;
  section_id: string | null;
}

interface SectionData {
  id: string;
  title: string;
}

export default function TableOfContents({
  tips,
  sections,
}: {
  tips: TipData[];
  sections: SectionData[];
}) {
  const hasSections = sections.length > 0;

  // Mirrors TipList's numbering exactly: unsectioned tips first, then each
  // section's tips in order, so "Tip N" here always matches the page below.
  const unsectionedTips = hasSections ? tips.filter((t) => !t.section_id) : tips;
  const sectionGroups = hasSections
    ? sections
        .map((section) => ({
          ...section,
          tips: tips.filter((t) => t.section_id === section.id),
        }))
        .filter((group) => group.tips.length > 0)
    : [];

  let globalIndex = 0;

  return (
    <nav
      aria-label="Table of contents"
      className="border border-border rounded-[20px] px-6 md:px-7 py-6 mb-12"
    >
      <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-4">
        Contents
      </p>
      <ol className="space-y-2.5">
        {unsectionedTips.map((tip) => {
          globalIndex++;
          return (
            <li key={tip.id}>
              <a
                href={`#tip-${globalIndex}`}
                className="text-[14px] text-mid hover:text-accent-dark transition-colors leading-snug"
              >
                <span className="text-muted mr-1.5">{globalIndex}.</span>
                {tip.title}
              </a>
            </li>
          );
        })}

        {sectionGroups.map((group) => (
          <li key={group.id}>
            <a
              href={`#section-${group.id}`}
              className="text-[14px] font-medium text-ink hover:text-accent-dark transition-colors leading-snug"
            >
              {group.title}
            </a>
            <ol className="mt-2.5 ml-1 space-y-2.5 border-l border-border pl-4">
              {group.tips.map((tip) => {
                globalIndex++;
                return (
                  <li key={tip.id}>
                    <a
                      href={`#tip-${globalIndex}`}
                      className="text-[14px] text-mid hover:text-accent-dark transition-colors leading-snug"
                    >
                      <span className="text-muted mr-1.5">{globalIndex}.</span>
                      {tip.title}
                    </a>
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
    </nav>
  );
}
