import { NextRequest, NextResponse } from "next/server";
import { rateLimited, safeFetch } from "@/lib/safe-fetch";

function getMeta(html: string, property: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']${property}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']*)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+name=["']${property}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

function getTitle(html: string): string | null {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m?.[1]?.trim() || null;
}

function getFavicon(html: string, origin: string): string {
  const m =
    html.match(/<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']*)["']/i) ||
    html.match(/<link[^>]+href=["']([^"']*)["'][^>]+rel=["'][^"']*icon[^"']*["']/i);

  if (m?.[1]) {
    const href = m[1];
    if (href.startsWith("http")) return href;
    if (href.startsWith("//")) return `https:${href}`;
    if (href.startsWith("/")) return `${origin}${href}`;
    return `${origin}/${href}`;
  }

  return `${origin}/favicon.ico`;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "Missing url" }, { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // safeFetch blocks private and internal addresses (SSRF protection), since this route will
  // fetch whatever URL it's given.
  if (rateLimited(req, "link-preview", 60, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  try {
    const res = await safeFetch(url, {
      userAgent: "Mozilla/5.0 (compatible; CompoundingWins/1.0; +https://www.compoundingwins.com)",
      timeoutMs: 8000,
      maxBytes: 1_500_000,
    });

    if (res.status < 200 || res.status >= 300) throw new Error(`HTTP ${res.status}`);

    const html = res.body;
    const origin = parsed.origin;

    return NextResponse.json({
      title: getMeta(html, "og:title") || getTitle(html),
      description: getMeta(html, "og:description") || getMeta(html, "description"),
      image: getMeta(html, "og:image"),
      favicon: getFavicon(html, origin),
      domain: parsed.hostname.replace("www.", ""),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
