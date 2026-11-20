import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import robotsParser from "robots-parser";
import { rateLimited, safeFetch, SafeFetchError } from "@/lib/safe-fetch";

// Website checker: fetches one page the way crawlers do (no JavaScript), reports what Google
// and AI tools can read in the raw HTML, and test-fetches it as each major crawler to spot
// robots.txt rules or firewalls blocking them. Every fetch goes through safeFetch (SSRF-safe).

export const runtime = "nodejs";
export const maxDuration = 30;

const BOTS = [
  { name: "Googlebot", token: "Googlebot", ua: "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
  { name: "Bingbot (also feeds ChatGPT and Copilot)", token: "Bingbot", ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm) Chrome/131.0.0.0 Safari/537.36" },
  { name: "OAI-SearchBot (ChatGPT search)", token: "OAI-SearchBot", ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot" },
  { name: "GPTBot (OpenAI training)", token: "GPTBot", ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot" },
  { name: "ClaudeBot", token: "ClaudeBot", ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)" },
  { name: "PerplexityBot", token: "PerplexityBot", ua: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)" },
];
// Robots-only tokens: they don't crawl themselves, they control use of content for AI.
const ROBOTS_ONLY = [
  { name: "Google-Extended (Gemini training)", token: "Google-Extended" },
  { name: "Applebot-Extended (Apple AI training)", token: "Applebot-Extended" },
];
const BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function normalise(raw: string) {
  const t = raw.trim();
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

const looksBlocked = (status: number, body: string) =>
  status === 403 || status === 401 || status === 429 || status === 503 ||
  /cf-chl|challenge-platform|captcha|access denied|attention required/i.test(body.slice(0, 20000));

export async function POST(request: Request) {
  if (rateLimited(request, "website-check", 8, 5 * 60_000)) {
    return NextResponse.json({ error: "You've run a lot of checks in a short time. Please wait a few minutes and try again." }, { status: 429 });
  }
  let body: { url?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (typeof body.url !== "string" || body.url.length > 2000 || !body.url.trim()) {
    return NextResponse.json({ error: "Enter a web address to check." }, { status: 400 });
  }

  try {
    const page = await safeFetch(normalise(body.url), { userAgent: BROWSER_UA, maxBytes: 4_000_000, timeoutMs: 12_000 });
    const finalUrl = new URL(page.url);
    const $ = cheerio.load(page.body);
    const meta = (sel: string) => $(sel).attr("content")?.trim() || null;
    const abs = (href: string | undefined) => { try { return href ? new URL(href, finalUrl).toString() : null; } catch { return null; } };

    // Visible text, as a crawler without JavaScript sees it.
    const $text = cheerio.load(page.body);
    $text("script, style, noscript, template, svg").remove();
    const text = $text("body").text().replace(/\s+/g, " ").trim();
    const words = text ? text.split(" ").length : 0;

    const headings = $("h1, h2, h3, h4, h5, h6").map((_, el) => ({ level: Number(el.tagName[1]), text: $(el).text().replace(/\s+/g, " ").trim().slice(0, 160) })).get().slice(0, 80);

    const schemaTypes = new Set<string>();
    let schemaErrors = 0;
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const collect = (n: unknown): void => {
          if (Array.isArray(n)) return n.forEach(collect);
          if (n && typeof n === "object") {
            const o = n as Record<string, unknown>;
            const t = o["@type"];
            if (typeof t === "string") schemaTypes.add(t);
            if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && schemaTypes.add(x));
            if (o["@graph"]) collect(o["@graph"]);
          }
        };
        collect(JSON.parse($(el).text()));
      } catch { schemaErrors++; }
    });
    $("[itemtype]").each((_, el) => { const t = $(el).attr("itemtype")?.split("/").pop(); if (t) schemaTypes.add(t); });

    const hreflang = $('link[rel="alternate"][hreflang]').map((_, el) => ({ lang: $(el).attr("hreflang") ?? "", href: abs($(el).attr("href")) ?? "" })).get();
    const images = $("img");
    const missingAlt = images.filter((_, el) => $(el).attr("alt") === undefined).length;
    let internal = 0, external = 0;
    $("a[href]").each((_, el) => {
      const h = abs($(el).attr("href"));
      if (!h || !/^https?:/.test(h)) return;
      if (new URL(h).hostname === finalUrl.hostname) internal++; else external++;
    });

    const robotsMeta = [meta('meta[name="robots"]'), meta('meta[name="googlebot"]')].filter(Boolean).join(", ");
    const xRobots = String(page.headers["x-robots-tag"] ?? "");
    const appShell = words < 80 && $("#root, #__next, #app, [data-reactroot], #___gatsby").length > 0;

    // robots.txt
    const robotsUrl = `${finalUrl.origin}/robots.txt`;
    let robotsTxt = "";
    let robotsStatus = 0;
    try {
      const r = await safeFetch(robotsUrl, { userAgent: BROWSER_UA, maxBytes: 500_000, timeoutMs: 8000 });
      robotsStatus = r.status;
      if (r.status === 200) robotsTxt = r.body;
    } catch { robotsStatus = 0; }
    const robots = robotsParser(robotsUrl, robotsTxt);
    const sitemaps = robots.getSitemaps();

    // Test fetch as each crawler, in parallel.
    const botResults = await Promise.all(
      BOTS.map(async (b) => {
        const allowed = robots.isAllowed(page.url, b.token) !== false;
        try {
          const r = await safeFetch(page.url, { userAgent: b.ua, maxBytes: 300_000, timeoutMs: 10_000 });
          return { name: b.name, allowedByRobots: allowed, status: r.status, blocked: looksBlocked(r.status, r.body), bytes: r.bytes };
        } catch (e) {
          return { name: b.name, allowedByRobots: allowed, status: 0, blocked: true, bytes: 0, error: e instanceof SafeFetchError ? e.message : "Couldn't connect" };
        }
      })
    );
    const robotsOnly = ROBOTS_ONLY.map((b) => ({ name: b.name, allowedByRobots: robots.isAllowed(page.url, b.token) !== false }));

    let sitemapCheck: { url: string; status: number; urls: number } | null = null;
    const sitemapUrl = sitemaps[0] ?? `${finalUrl.origin}/sitemap.xml`;
    try {
      const s = await safeFetch(sitemapUrl, { userAgent: BROWSER_UA, maxBytes: 5_000_000, timeoutMs: 8000 });
      sitemapCheck = { url: sitemapUrl, status: s.status, urls: s.status === 200 ? (s.body.match(/<loc>/g) ?? []).length : 0 };
    } catch { sitemapCheck = { url: sitemapUrl, status: 0, urls: 0 }; }

    return NextResponse.json({
      url: page.url,
      status: page.status,
      redirects: page.redirects,
      timeMs: page.timeMs,
      bytes: page.bytes,
      truncated: page.truncated,
      contentType: String(page.headers["content-type"] ?? ""),
      lang: $("html").attr("lang") ?? null,
      title: $("title").first().text().trim() || null,
      description: meta('meta[name="description"]'),
      canonical: abs($('link[rel="canonical"]').attr("href")),
      robotsMeta: robotsMeta || null,
      xRobots: xRobots || null,
      headings,
      words,
      textSample: text.slice(0, 600),
      appShell,
      hasPrices: /£\s?\d|\d+(\.\d{2})?\s?(GBP|gbp)|\bfrom\s£/i.test(text),
      faqLike: $("details summary").length + headings.filter((h) => /\?$/.test(h.text)).length,
      og: {
        title: meta('meta[property="og:title"]'),
        description: meta('meta[property="og:description"]'),
        image: abs(meta('meta[property="og:image"]') ?? undefined),
        type: meta('meta[property="og:type"]'),
        twitterCard: meta('meta[name="twitter:card"]'),
      },
      schemaTypes: [...schemaTypes],
      schemaErrors,
      hreflang,
      images: images.length,
      missingAlt,
      links: { internal, external },
      robots: { url: robotsUrl, status: robotsStatus, sitemaps },
      bots: botResults,
      robotsOnly,
      sitemap: sitemapCheck,
    });
  } catch (e) {
    const message = e instanceof SafeFetchError ? e.message : "Something went wrong checking that page.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
