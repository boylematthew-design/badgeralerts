import MarkdownContent from "@/components/MarkdownContent";
import FaviconImage from "@/components/FaviconImage";
import Eli5Robots from "@/components/tools/eli5-robots/Eli5Robots";
import type { TipStat } from "@/lib/tip-stats";

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
  news_date: string | null;
  news_headline: string | null;
  news_url: string | null;
  stats: TipStat[] | null;
  tip_links: TipLink[];
}

// "9 June 2026" — British date order. The date is stored as a plain calendar day, so it's
// formatted in UTC to stop it slipping a day either side depending on the server's time zone.
function formatNewsDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Optional dated news headline shown under a tip's text and image, linking to the source. All real text
// (date in a <time> tag, headline as link text) so search engines and AI tools can read it.
function TipNewsLabel({ date, headline, url }: { date: string | null; headline: string; url: string | null }) {
  const text = (
    <>
      {date && (
        <time dateTime={date} className="font-medium text-ink">
          {formatNewsDate(date)}:{" "}
        </time>
      )}
      <span>{headline}</span>
    </>
  );

  return (
    <div className="flex items-start gap-2.5 rounded-[12px] bg-accent-light border border-accent/20 px-3.5 py-2.5 mt-5 max-w-[620px]">
      <span className="mt-[1px] flex-shrink-0 rounded-full bg-accent text-white text-[10px] font-medium tracking-[0.08em] uppercase px-2 py-0.5">
        News
      </span>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group text-[13px] md:text-[14px] text-mid leading-[1.5] hover:text-accent-dark transition-colors"
        >
          {text}
          <svg
            aria-hidden="true"
            className="inline-block w-3.5 h-3.5 ml-1.5 -mt-0.5 text-accent-dark"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span className="sr-only"> (source, opens in a new tab)</span>
        </a>
      ) : (
        <p className="text-[13px] md:text-[14px] text-mid leading-[1.5]">{text}</p>
      )}
    </div>
  );
}

// Stats box under a tip: each stat is followed by numbered [1] links to its sources, and the
// sources are listed by name underneath. All real text and links, so crawlers can read and follow them.
function TipStatsBox({ stats }: { stats: TipStat[] }) {
  let n = 0;
  const numbered = stats.map((stat) => ({
    text: stat.text,
    sources: stat.sources.map((source) => ({ ...source, number: ++n })),
  }));
  const allSources = numbered.flatMap((stat) => stat.sources);

  return (
    <div className="flex items-start gap-2.5 rounded-[12px] bg-accent-light border border-accent/20 px-3.5 py-3 mt-5 max-w-[620px]">
      <span className="mt-[1px] flex-shrink-0 rounded-full bg-ink text-white text-[10px] font-medium tracking-[0.08em] uppercase px-2 py-0.5">
        Stats
      </span>
      <div className="min-w-0">
        <div className="space-y-2">
          {numbered.map((stat) => (
            <p key={stat.text} className="text-[13px] md:text-[14px] text-mid leading-[1.5]">
              {stat.text}
              {stat.sources.map((source) => (
                <a
                  key={source.number}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Source ${source.number}: ${source.label} (opens in a new tab)`}
                  className="inline-flex items-center justify-center ml-1 min-w-[22px] rounded-[5px] border border-accent/30 bg-white px-1 text-[11px] font-medium leading-[18px] text-accent-dark hover:bg-accent hover:text-white transition-colors"
                >
                  [{source.number}]
                </a>
              ))}
            </p>
          ))}
        </div>
        <ol className="mt-2.5 pt-2 border-t border-accent/20 space-y-1 text-[12px] text-muted leading-[1.45]">
          {allSources.map((source) => (
            <li key={source.number}>
              [{source.number}]{" "}
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-accent-dark"
              >
                {source.label}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
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

// Heading levels follow the page outline: the guide page's H2 sits above the tips, so a tip
// on its own is an H3, and a tip inside a section (itself an H3) is an H4.
export function TipCard({ tip, tipNumber, level = 3 }: {
  tip: TipData;
  tipNumber: number;
  level?: 3 | 4;
}) {
  const Heading = level === 4 ? "h4" : "h3";
  const stats = tip.stats ?? [];
  return (
    <div id={`tip-${tipNumber}`} className="py-8 first:pt-0 last:pb-0 scroll-mt-[96px]">
      <div className="text-[11px] font-medium tracking-[0.08em] text-accent-dark uppercase mb-2">
        Tip {tipNumber}
      </div>
      <Heading className="font-heading font-bold tracking-[-0.03em] text-[22px] md:text-[26px] text-ink mb-3">
        {tip.title}
      </Heading>
      {tip.content && <MarkdownContent content={tip.content} baseLevel={level + 1} />}
      {/* Any tip that links to the robots.txt tool gets the tool's input form right under it. Results open on the full tool page. */}
      {tip.content?.includes(ELI5_ROBOTS_PATH) && <Eli5Robots handoffTo={ELI5_ROBOTS_PATH} headingLevel={level + 1} />}
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
      {tip.news_headline && <TipNewsLabel date={tip.news_date} headline={tip.news_headline} url={tip.news_url} />}
      {stats.length > 0 && <TipStatsBox stats={stats} />}
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
            <h3 className="font-heading font-extrabold tracking-[-0.04em] text-[24px] md:text-[30px] text-ink">
              {group.title}
            </h3>
            {group.description && (
              <p className="text-[15px] md:text-[16px] text-mid leading-[1.6] mt-2 max-w-[560px]">
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
                  level={4}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
