"use client";

import { useState } from "react";
import { btn, card, errorBox, h2, h3, hint, input, label } from "../ui";

// Front end for /api/tools/website-check. Results are shown as plain HTML text (no icon-only
// ticks), so every finding can be read, copied and crawled.

interface Bot { name: string; allowedByRobots: boolean; status: number; blocked: boolean; bytes: number; error?: string }
interface Result {
  url: string; status: number; redirects: { url: string; status: number }[]; timeMs: number; bytes: number; truncated: boolean; contentType: string;
  lang: string | null; title: string | null; description: string | null; canonical: string | null; robotsMeta: string | null; xRobots: string | null;
  headings: { level: number; text: string }[]; words: number; textSample: string; appShell: boolean; hasPrices: boolean; faqLike: number;
  og: { title: string | null; description: string | null; image: string | null; type: string | null; twitterCard: string | null };
  schemaTypes: string[]; schemaErrors: number; hreflang: { lang: string; href: string }[];
  images: number; missingAlt: number; links: { internal: number; external: number };
  robots: { url: string; status: number; sitemaps: string[] }; bots: Bot[]; robotsOnly: { name: string; allowedByRobots: boolean }[];
  sitemap: { url: string; status: number; urls: number } | null;
}

type Level = "good" | "warn" | "bad" | "info";
const LEVEL: Record<Level, { text: string; cls: string }> = {
  good: { text: "Good", cls: "bg-accent-light text-accent-dark" },
  warn: { text: "Check", cls: "bg-surface text-warn" },
  bad: { text: "Fix", cls: "bg-danger-soft text-danger" },
  info: { text: "Info", cls: "bg-surface text-mid" },
};

function Row({ level, title, children }: { level: Level; title: string; children?: React.ReactNode }) {
  return (
    <li className="py-3 flex gap-3">
      <span className={`flex-shrink-0 h-fit rounded-full text-[11px] font-semibold uppercase tracking-[0.06em] px-2 py-0.5 ${LEVEL[level].cls}`}>{LEVEL[level].text}</span>
      <div className="min-w-0">
        <p className="text-[14.5px] font-semibold text-ink">{title}</p>
        {children && <div className="text-[13.5px] text-mid leading-[1.55] mt-0.5 [overflow-wrap:anywhere]">{children}</div>}
      </div>
    </li>
  );
}

export default function WebsiteChecker() {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [r, setR] = useState<Result | null>(null);

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(""); setR(null);
    try {
      const res = await fetch("/api/tools/website-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Something went wrong."); else setR(data);
    } catch {
      setError("Couldn't run the check. Please try again.");
    }
    setBusy(false);
  };

  const host = r ? new URL(r.url).hostname : "";
  const path = r ? new URL(r.url).pathname : "";
  const h1s = r?.headings.filter((h) => h.level === 1) ?? [];
  const noindex = r && /noindex/i.test(`${r.robotsMeta ?? ""} ${r.xRobots ?? ""}`);

  return (
    <div className="space-y-6">
      <form onSubmit={run} className={card}>
        <label className={label} htmlFor="wc-url">Page to check</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input id="wc-url" className={input} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="yourwebsite.co.uk/services" inputMode="url" autoComplete="url" required />
          <button type="submit" className={btn} disabled={busy}>{busy ? "Checking…" : "Check page"}</button>
        </div>
        <p className={hint}>Checks one page at a time, including your robots.txt and a test visit as each crawler. Takes 5 to 20 seconds.</p>
      </form>
      {error && <p className={errorBox} role="alert">{error}</p>}

      {r && (
        <>
          <section className={card} aria-labelledby="wc-serp">
            <h2 id="wc-serp" className={h2}>How it could look in Google</h2>
            <div className="mt-4 rounded-[12px] border border-border p-4 max-w-[600px] bg-white">
              <p className="text-[12px] text-mid truncate">{host}{path !== "/" ? ` › ${path.split("/").filter(Boolean).join(" › ")}` : ""}</p>
              <p className="text-[19px] leading-[1.3] text-accent-dark mt-1 line-clamp-2">{r.title || "(no title)"}</p>
              <p className="text-[13.5px] text-mid mt-1 line-clamp-2">{r.description || r.textSample.slice(0, 155) || "(no description)"}</p>
            </div>
            <ul className="divide-y divide-border mt-3">
              <Row level={!r.title ? "bad" : r.title.length > 65 || r.title.length < 20 ? "warn" : "good"} title={`Title: ${r.title ? `${r.title.length} characters` : "missing"}`}>
                {r.title ? (r.title.length > 65 ? "Likely to be cut off in results. Put the most important words first." : r.title.length < 20 ? "Quite short. Say what the page is about and where, e.g. 'Boiler repair in Leeds | Fixed prices'." : "A good length.") : "Every page needs a unique title. It's the clickable headline in search results."}
              </Row>
              <Row level={!r.description ? "warn" : r.description.length > 160 ? "warn" : "good"} title={`Meta description: ${r.description ? `${r.description.length} characters` : "missing"}`}>
                {r.description ? (r.description.length > 160 ? "May be cut off. Keep the key message in the first 150 characters." : "A good length.") : "Without one, Google picks text from the page. Write a short summary that makes people want to click."}
              </Row>
            </ul>
          </section>

          <section className={card} aria-labelledby="wc-bots">
            <h2 id="wc-bots" className={h2}>Can search engines and AI crawlers get in?</h2>
            <ul className="divide-y divide-border mt-3">
              {r.bots.map((b) => (
                <Row key={b.name} level={!b.allowedByRobots ? "bad" : b.blocked ? "bad" : "good"} title={b.name}>
                  {!b.allowedByRobots && "Blocked by your robots.txt. "}
                  {b.error ? b.error : b.blocked ? `Our test visit was refused (status ${b.status}). A firewall or bot protection may be blocking it.` : `Test visit returned status ${b.status}.`}
                  {b.allowedByRobots && !b.blocked && " Allowed."}
                </Row>
              ))}
              {r.robotsOnly.map((b) => (
                <Row key={b.name} level="info" title={b.name}>{b.allowedByRobots ? "Allowed in robots.txt." : "Opted out in robots.txt. This doesn't affect search, only AI training."}</Row>
              ))}
            </ul>
            <p className={`${hint} mt-2`}>
              Some firewalls also check the crawler&apos;s real IP address, so a real crawler can be treated differently from our test. Robots.txt: {r.robots.status === 200 ? "found" : r.robots.status ? `returned status ${r.robots.status}` : "couldn't be fetched"}.{" "}
              <a className="text-accent-dark underline" href="/tools/eli5-robots">Explain my robots.txt in plain English</a>
            </p>
          </section>

          <section className={card} aria-labelledby="wc-content">
            <h2 id="wc-content" className={h2}>What crawlers can read without JavaScript</h2>
            <p className="text-[14px] text-mid mt-2">Most AI crawlers don&apos;t run JavaScript, so anything added by scripts after the page loads is invisible to them.</p>
            <ul className="divide-y divide-border mt-3">
              <Row level={r.appShell ? "bad" : r.words < 150 ? "warn" : "good"} title={`${r.words.toLocaleString()} words of text in the raw HTML`}>
                {r.appShell ? "The page looks like it's built with JavaScript and is almost empty without it. Ask your developer about server-side rendering." : r.words < 150 ? "Not much text. Pages that answer questions in detail are more likely to be used by AI tools." : "Good, the content is in the HTML."}
              </Row>
              <Row level={r.hasPrices ? "good" : "info"} title={r.hasPrices ? "Prices are in the HTML" : "No prices found in the HTML"}>
                {r.hasPrices ? "AI tools can read and compare them." : "If you show prices, make sure they're written as text, not only in images or loaded by a script."}
              </Row>
              <Row level={r.faqLike ? "good" : "info"} title={r.faqLike ? `${r.faqLike} question-style headings or FAQs found` : "No questions answered on the page"}>
                {r.faqLike ? "Answering questions directly helps with AI answers." : "Adding the questions customers ask, with short answers, helps you appear in AI answers."}
              </Row>
              <Row level={h1s.length === 1 ? "good" : "warn"} title={`${h1s.length} main heading${h1s.length === 1 ? "" : "s"} (H1)`}>
                {h1s.length === 0 ? "Add one H1 that says what the page is about." : h1s.length > 1 ? "Usually best to have exactly one H1." : h1s[0].text}
              </Row>
              <Row level={r.missingAlt ? "warn" : "good"} title={`${r.images} images, ${r.missingAlt} without alt text`}>
                {r.missingAlt ? "Describe each image in its alt text. It helps Google Images and screen readers. " : null}
                {r.missingAlt ? <a className="text-accent-dark underline" href="/tools/image-seo-prep">Prep images with alt text</a> : null}
              </Row>
            </ul>
            {r.headings.length > 0 && (
              <details className="mt-3">
                <summary className="cursor-pointer text-[14px] font-semibold text-accent-dark">Heading outline ({r.headings.length})</summary>
                <ul className="mt-2 text-[13px] text-ink space-y-1">
                  {r.headings.map((h, i) => <li key={i} style={{ paddingLeft: (h.level - 1) * 14 }}><span className="text-muted">H{h.level}</span> {h.text}</li>)}
                </ul>
              </details>
            )}
          </section>

          <section className={card} aria-labelledby="wc-tech">
            <h2 id="wc-tech" className={h2}>Technical checks</h2>
            <ul className="divide-y divide-border mt-3">
              <Row level={r.status === 200 ? "good" : "bad"} title={`Status ${r.status}${r.redirects.length ? ` after ${r.redirects.length} redirect${r.redirects.length > 1 ? "s" : ""}` : ""}`}>
                {r.redirects.map((x) => `${x.status} ${x.url}`).join(" → ")}{r.redirects.length ? ` → ${r.url}` : ""}
                {r.redirects.length > 1 && " Link straight to the final address to save a hop."}
              </Row>
              <Row level={noindex ? "bad" : "good"} title={noindex ? "The page is set to noindex" : "Indexable"}>
                {noindex ? `Google won't show this page (${[r.robotsMeta, r.xRobots].filter(Boolean).join(", ")}). Remove noindex if you want it found.` : "No noindex instruction found."}
              </Row>
              <Row level={!r.canonical ? "warn" : r.canonical.replace(/\/$/, "") === r.url.replace(/\/$/, "") ? "good" : "warn"} title={`Canonical: ${r.canonical ?? "missing"}`}>
                {r.canonical && r.canonical.replace(/\/$/, "") !== r.url.replace(/\/$/, "") ? "Points to a different address, so Google will likely index that one instead." : !r.canonical ? "Add a canonical tag pointing to the page's own address." : null}
              </Row>
              <Row level={r.timeMs > 2500 ? "warn" : "good"} title={`Server responded in ${(r.timeMs / 1000).toFixed(1)}s, ${Math.round(r.bytes / 1024)} KB of HTML`}>
                {r.timeMs > 2500 ? "Slow. Check your hosting and caching." : null}
              </Row>
              <Row level={/_/.test(new URL(r.url).pathname) || /[A-Z]/.test(new URL(r.url).pathname) ? "warn" : "good"} title="URL format">
                {/_/.test(new URL(r.url).pathname) ? "Uses underscores. Google treats hyphens as word separators, so use hyphens. " : ""}
                {/[A-Z]/.test(new URL(r.url).pathname) ? "Contains capital letters, which can cause duplicate addresses." : ""}
                {!/_|[A-Z]/.test(new URL(r.url).pathname) && "Lowercase with hyphens."}
              </Row>
              <Row level={r.lang ? "good" : "warn"} title={`Language: ${r.lang ?? "not set"}`}>{r.lang ? null : 'Add lang="en-GB" to the <html> tag.'}</Row>
              <Row level={r.hreflang.length ? "info" : "info"} title={`${r.hreflang.length} hreflang tag${r.hreflang.length === 1 ? "" : "s"}`}>
                {r.hreflang.length ? r.hreflang.map((h) => `${h.lang}: ${h.href}`).join(" · ") : "Only needed if you have versions of the page for other countries or languages."}
              </Row>
              <Row level={r.sitemap?.status === 200 ? "good" : "warn"} title={r.sitemap?.status === 200 ? `Sitemap found with ${r.sitemap.urls.toLocaleString()} URLs` : "No sitemap found"}>
                {r.sitemap?.url}{r.sitemap?.status !== 200 && ". Add a sitemap and list it in robots.txt so crawlers find all your pages."}
              </Row>
            </ul>
          </section>

          <section className={card} aria-labelledby="wc-share">
            <h2 id="wc-share" className={h2}>Schema and share preview</h2>
            <ul className="divide-y divide-border mt-3">
              <Row level={r.schemaTypes.length ? "good" : "warn"} title={r.schemaTypes.length ? `Schema found: ${r.schemaTypes.join(", ")}` : "No schema found"}>
                {r.schemaErrors ? `${r.schemaErrors} schema block${r.schemaErrors > 1 ? "s" : ""} couldn't be read (invalid JSON). ` : ""}
                {!r.schemaTypes.length && <>Schema tells Google and AI tools what your business is, where and what you charge. <a className="text-accent-dark underline" href="/tools/schema-generator">Generate schema</a></>}
              </Row>
              <Row level={r.og.image ? "good" : "warn"} title={r.og.image ? "Share image set" : "No share image (og:image)"}>
                {r.og.image ? null : <>Links shared on WhatsApp, Facebook and LinkedIn will show no picture. <a className="text-accent-dark underline" href="/tools/social-image-resizer">Make a 1200 × 630 image</a></>}
              </Row>
            </ul>
            <div className="mt-4 max-w-[480px] rounded-[12px] border border-border overflow-hidden bg-white">
              {r.og.image && /^https:/.test(r.og.image) && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.og.image} alt="" className="w-full aspect-[1.91/1] object-cover bg-surface" referrerPolicy="no-referrer" />
              )}
              <div className="p-3 bg-surface">
                <p className="text-[12px] text-muted uppercase">{host}</p>
                <p className="text-[15px] font-semibold text-ink line-clamp-2">{r.og.title || r.title || "(no title)"}</p>
                <p className="text-[13px] text-mid line-clamp-2">{r.og.description || r.description || ""}</p>
              </div>
            </div>
          </section>
          <p className={h3}>Want this checked across your whole site, every month? <a className="text-accent-dark underline" href="/contact">Get in touch</a>.</p>
        </>
      )}
    </div>
  );
}
