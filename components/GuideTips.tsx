import MarkdownContent from "@/components/MarkdownContent";
import FaviconImage from "@/components/FaviconImage";
import Eli5Robots from "@/components/tools/eli5-robots/Eli5Robots";

const ELI5_ROBOTS_PATH = "/tools/eli5-robots";

export interface TipLink {
  id: string;
  url: string;
  context: string | null;
  preview_title: string | null;
  preview_description: string | null;
  preview_favicon: string | null;
  sort_order: number;
}

export interface TipData {
  id: string;
  title: string;
  content: string | null;
  image_url: string | null;
  image_alt: string | null;
  image_caption: string | null;
  section_id: string | null;
  tip_links: TipLink[];
}

export interface SectionData {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export function TipCard({ tip, tipNumber }: {
  tip: TipData;
  tipNumber: number;
}) {
  return (
    <div id={`tip-${tipNumber}`} className="py-8 first:pt-0 last:pb-0 scroll-mt-[96px]">
      <div className="text-[11px] font-medium tracking-[0.08em] text-accent-dark uppercase mb-2">
        Tip {tipNumber}
      </div>
      <h3 className="font-serif text-[22px] md:text-[26px] text-ink font-normal mb-3">
        {tip.title}
      </h3>
      {tip.content && <MarkdownContent content={tip.content} />}
      {/* Any tip that links to the robots.txt tool gets the tool's input form right under it. Results open on the full tool page. */}
      {tip.content?.includes(ELI5_ROBOTS_PATH) && <Eli5Robots handoffTo={ELI5_ROBOTS_PATH} />}
      {tip.image_url && (
        <div className="mt-5 max-w-[320px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={tip.image_url}
            alt={tip.image_alt || tip.title}
            className="w-full rounded-[14px] border border-border"
          />
          {tip.image_caption && (
            <p className="text-[13px] text-muted italic mt-2">{tip.image_caption}</p>
          )}
        </div>
      )}
      {tip.tip_links && tip.tip_links.length > 0 && (
        <div className="mt-6">
          <p className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-3">
            Relevant links
          </p>
          <div className="space-y-2">
            {[...tip.tip_links]
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 border border-border rounded-[12px] px-4 py-3 hover:border-accent-dark transition-colors group no-underline"
                >
                  <div className="shrink-0 mt-0.5 w-4 h-4">
                    {link.preview_favicon && (
                      <FaviconImage src={link.preview_favicon} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-ink group-hover:text-accent-dark transition-colors leading-snug truncate">
                      {link.preview_title || link.url}
                    </p>
                    {link.context && (
                      <p className="text-[12px] text-mid mt-0.5 leading-snug">{link.context}</p>
                    )}
                    <p className="text-[11px] text-muted mt-1">{getDomain(link.url)}</p>
                  </div>
                  <span className="text-muted group-hover:text-accent-dark transition-colors shrink-0 mt-0.5 text-[13px]">
                    ↗
                  </span>
                </a>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function TipList({ tips, sections }: {
  tips: TipData[];
  sections: SectionData[];
}) {
  const hasSections = sections.length > 0;

  if (!hasSections) {
    return (
      <div className="divide-y divide-border">
        {tips.map((tip, index) => (
          <TipCard
            key={tip.id}
            tip={tip}
            tipNumber={index + 1}
          />
        ))}
      </div>
    );
  }

  const unsectionedTips = tips.filter((t) => !t.section_id);
  const sectionGroups = sections.map((section) => ({
    ...section,
    tips: tips.filter((t) => t.section_id === section.id),
  })).filter((group) => group.tips.length > 0);

  let globalIndex = 0;

  return (
    <div>
      {unsectionedTips.length > 0 && (
        <div className="divide-y divide-border">
          {unsectionedTips.map((tip) => {
            globalIndex++;
            return (
              <TipCard
                key={tip.id}
                tip={tip}
                tipNumber={globalIndex}
              />
            );
          })}
        </div>
      )}

      {sectionGroups.map((group) => (
        <div key={group.id} className="mt-12 first:mt-0">
          <div id={`section-${group.id}`} className="mb-6 scroll-mt-[96px]">
            <div className="text-[11px] font-medium tracking-[0.08em] text-muted uppercase mb-1">
              Section
            </div>
            <h2 className="font-serif text-[24px] md:text-[30px] text-ink font-normal">
              {group.title}
            </h2>
            {group.description && (
              <p className="text-[15px] md:text-[16px] text-mid font-light leading-[1.6] mt-2 max-w-[560px]">
                {group.description}
              </p>
            )}
          </div>
          <div className="divide-y divide-border">
            {group.tips.map((tip) => {
              globalIndex++;
              return (
                <TipCard
                  key={tip.id}
                  tip={tip}
                  tipNumber={globalIndex}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
