// Server-side validation for a tip's optional news label (news_date, news_headline, news_url).
// Used by the admin "Add a tip" and "Edit tip" forms. Never trust the browser's own checks:
// someone could post the form directly, so everything is re-checked here before saving.

const MAX_HEADLINE_LENGTH = 200;

export interface TipNewsFields {
  news_date: string | null;
  news_headline: string | null;
  news_url: string | null;
}

// Returns the cleaned fields, or null if what was submitted isn't valid.
export function parseTipNews(formData: FormData): TipNewsFields | null {
  const headline = ((formData.get("news_headline") as string) ?? "").trim();
  const date = ((formData.get("news_date") as string) ?? "").trim();
  const url = ((formData.get("news_url") as string) ?? "").trim();

  // No headline = no news label. Clear all three so a half-filled label never shows.
  if (!headline) return { news_date: null, news_headline: null, news_url: null };

  if (headline.length > MAX_HEADLINE_LENGTH) return null;

  // Date must be a real calendar date in YYYY-MM-DD form (what <input type="date"> sends).
  if (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
    const parsed = new Date(`${date}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return null;
  }

  // Only real web links — blocks javascript:, data: and other schemes that could run code.
  if (url) {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    } catch {
      return null;
    }
  }

  return { news_date: date || null, news_headline: headline, news_url: url || null };
}
