// A tip's optional stats (tips.stats column), shown in a "Stats" box under the tip with numbered
// [1] source links. Server-side validation for the admin "Add a tip" and "Edit tip" forms lives
// here too. Never trust the browser's own checks: someone could post the form directly, so
// everything is re-checked here before saving.

export interface StatSource {
  label: string;
  url: string;
}

export interface TipStat {
  text: string;
  sources: StatSource[];
}

export const MAX_STATS = 10;
export const MAX_SOURCES_PER_STAT = 5;
export const MAX_STAT_TEXT_LENGTH = 600;
export const MAX_SOURCE_LABEL_LENGTH = 200;

function isHttpUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

// The admin form sends the stats as JSON in a hidden "stats" field. Returns the cleaned list
// (rows left completely blank are dropped), or null if what was submitted isn't valid.
export function parseTipStats(formData: FormData): TipStat[] | null {
  const raw = (formData.get("stats") as string) ?? "";
  if (!raw.trim()) return [];

  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(input)) return null;

  const stats: TipStat[] = [];
  for (const item of input) {
    if (typeof item !== "object" || item === null) return null;
    const { text, sources } = item as { text?: unknown; sources?: unknown };
    if (typeof text !== "string" || !Array.isArray(sources)) return null;

    const cleanSources: StatSource[] = [];
    for (const source of sources) {
      if (typeof source !== "object" || source === null) return null;
      const { label, url } = source as { label?: unknown; url?: unknown };
      if (typeof label !== "string" || typeof url !== "string") return null;
      const cleanLabel = label.trim();
      const cleanUrl = url.trim();
      if (!cleanLabel && !cleanUrl) continue;
      // Only real web links — blocks javascript:, data: and other schemes that could run code.
      if (!cleanLabel || cleanLabel.length > MAX_SOURCE_LABEL_LENGTH || !isHttpUrl(cleanUrl)) return null;
      cleanSources.push({ label: cleanLabel, url: cleanUrl });
    }

    const cleanText = text.trim();
    if (!cleanText && cleanSources.length === 0) continue;
    if (!cleanText || cleanText.length > MAX_STAT_TEXT_LENGTH) return null;
    if (cleanSources.length > MAX_SOURCES_PER_STAT) return null;
    stats.push({ text: cleanText, sources: cleanSources });
  }

  if (stats.length > MAX_STATS) return null;
  return stats;
}
