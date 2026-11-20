import { NextResponse } from "next/server";
import robotsParser from "robots-parser";
import { rateLimited, safeFetch } from "@/lib/safe-fetch";

// Competitor snapshot: reads a site's public sitemap(s) and returns its page addresses, so the
// tool can group them by section and compare them with yours. All fetches are SSRF-safe and
// capped (sitemap files, child sitemaps and total URLs).

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_URLS = 5000;
const MAX_CHILD_SITEMAPS = 8;
const UA = "Mozilla/5.0 (compatible; CompoundingWinsTools/1.0; +https://www.compoundingwins.com/tools)";

const locs = (xml: string) => [...xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?\s*([^<\]\s]+)\s*(?:\]\]>)?\s*<\/loc>/gi)].map((m) => m[1].replace(/&amp;/g, "&"));

export async function POST(request: Request) {
  if (rateLimited(request, "sitemap-pages", 12, 5 * 60_000)) {
    return NextResponse.json({ error: "Too many checks in a short time. Please wait a few minutes." }, { status: 429 });
  }
  let body: { domain?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const raw = typeof body.domain === "string" ? body.domain.trim() : "";
  if (!raw || raw.length > 300) return NextResponse.json({ error: "Enter a website address." }, { status: 400 });

  let origin: string;
  try {
    origin = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).origin;
  } catch {
    return NextResponse.json({ error: "That isn't a valid web address." }, { status: 400 });
  }

  try {
    let sitemapUrls: string[] = [];
    try {
      const r = await safeFetch(`${origin}/robots.txt`, { userAgent: UA, maxBytes: 300_000, timeoutMs: 8000 });
      if (r.status === 200) sitemapUrls = robotsParser(`${origin}/robots.txt`, r.body).getSitemaps();
      origin = new URL(r.url).origin; // follow e.g. a redirect to www
    } catch { /* no robots.txt: fall back to /sitemap.xml */ }
    if (!sitemapUrls.length) sitemapUrls = [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`];

    const pages = new Set<string>();
    const queue = [...sitemapUrls];
    const seen = new Set<string>();
    let fetched = 0;
    while (queue.length && fetched < MAX_CHILD_SITEMAPS + 2 && pages.size < MAX_URLS) {
      const sm = queue.shift()!;
      if (seen.has(sm)) continue;
      seen.add(sm);
      fetched++;
      try {
        const r = await safeFetch(sm, { userAgent: UA, maxBytes: 8_000_000, timeoutMs: 10_000 });
        if (r.status !== 200 || !/<(urlset|sitemapindex)/i.test(r.body)) continue;
        if (/<sitemapindex/i.test(r.body)) {
          // Product and page sitemaps first; image/video sitemaps aren't pages.
          const children = locs(r.body).filter((u) => !/image|video/i.test(u));
          queue.push(...children);
        } else {
          for (const u of locs(r.body)) {
            if (pages.size >= MAX_URLS) break;
            pages.add(u);
          }
        }
      } catch { /* skip unreadable sitemap */ }
    }

    if (!pages.size) {
      return NextResponse.json({ origin, pages: [], note: "No sitemap could be read for this site. It may not have one, or it may block automated requests." });
    }
    return NextResponse.json({ origin, pages: [...pages], capped: pages.size >= MAX_URLS, sitemapsRead: fetched });
  } catch {
    return NextResponse.json({ error: "Couldn't read that site." }, { status: 422 });
  }
}
