"use client";

import { useMemo, useState } from "react";
import DropZone from "../DropZone";
import { downloadText, toCsv } from "../shared";
import { btnGhost, btnSmall, card, errorBox, h2, hint, input, label } from "../ui";

// Crawl log analyser: reads Apache/Nginx access logs (combined format, plain or .gz) in the
// browser, line by line so big files don't freeze the tab, and shows what Googlebot and the AI
// crawlers visit, how often, and where they hit errors and redirects.

const BOTS: { name: string; group: "Search" | "AI" | "SEO tools"; re: RegExp }[] = [
  { name: "Googlebot", group: "Search", re: /Googlebot(?!-Image|-Video|-News)|Google-InspectionTool/i },
  { name: "Googlebot Image", group: "Search", re: /Googlebot-Image/i },
  { name: "Bingbot", group: "Search", re: /bingbot/i },
  { name: "Applebot", group: "Search", re: /Applebot(?!-Extended)/i },
  { name: "DuckDuckBot", group: "Search", re: /DuckDuckBot/i },
  { name: "YandexBot", group: "Search", re: /YandexBot/i },
  { name: "GPTBot (OpenAI training)", group: "AI", re: /GPTBot/i },
  { name: "OAI-SearchBot (ChatGPT search)", group: "AI", re: /OAI-SearchBot/i },
  { name: "ChatGPT-User (ChatGPT browsing)", group: "AI", re: /ChatGPT-User/i },
  { name: "ClaudeBot", group: "AI", re: /ClaudeBot/i },
  { name: "Claude-User / Claude-SearchBot", group: "AI", re: /Claude-(User|SearchBot)/i },
  { name: "PerplexityBot", group: "AI", re: /PerplexityBot/i },
  { name: "Perplexity-User", group: "AI", re: /Perplexity-User/i },
  { name: "Google-CloudVertexBot", group: "AI", re: /Google-CloudVertexBot/i },
  { name: "Meta AI", group: "AI", re: /meta-externalagent|meta-externalfetcher/i },
  { name: "Amazonbot", group: "AI", re: /Amazonbot/i },
  { name: "Bytespider (TikTok)", group: "AI", re: /Bytespider/i },
  { name: "CCBot (Common Crawl)", group: "AI", re: /CCBot/i },
  { name: "MistralAI-User", group: "AI", re: /MistralAI-User/i },
  { name: "AhrefsBot", group: "SEO tools", re: /AhrefsBot/i },
  { name: "SemrushBot", group: "SEO tools", re: /SemrushBot/i },
];

// 1.2.3.4 - - [10/Oct/2026:13:55:36 +0000] "GET /path HTTP/1.1" 200 2326 "referer" "user agent"
const LINE = /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) (\S+)[^"]*" (\d{3}) (\S+)(?: "([^"]*)" "([^"]*)")?/;
const MONTHS: Record<string, string> = { Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06", Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12" };

interface BotStats { hits: number; status: Record<string, number>; pages: Map<string, number>; days: Map<string, number>; problems: Map<string, { status: string; count: number }>; last: string }
interface Result { lines: number; parsed: number; bots: Map<string, BotStats> }

function newStats(): BotStats {
  return { hits: 0, status: {}, pages: new Map(), days: new Map(), problems: new Map(), last: "" };
}

function analyseLine(line: string, r: Result) {
  r.lines++;
  const m = LINE.exec(line);
  if (!m) return;
  r.parsed++;
  const ua = m[8] ?? "";
  const bot = BOTS.find((b) => b.re.test(ua));
  if (!bot) return;
  const s = r.bots.get(bot.name) ?? newStats();
  r.bots.set(bot.name, s);
  s.hits++;
  const status = m[5];
  const cls = `${status[0]}xx`;
  s.status[cls] = (s.status[cls] ?? 0) + 1;
  const path = m[4].length > 300 ? m[4].slice(0, 300) : m[4];
  s.pages.set(path, (s.pages.get(path) ?? 0) + 1);
  const d = /^(\d{2})\/(\w{3})\/(\d{4})/.exec(m[2]);
  const day = d ? `${d[3]}-${MONTHS[d[2]] ?? "01"}-${d[1]}` : "";
  if (day) {
    s.days.set(day, (s.days.get(day) ?? 0) + 1);
    if (day > s.last) s.last = day;
  }
  if (cls !== "2xx") {
    const key = `${status} ${path}`;
    const prob = s.problems.get(key) ?? { status, count: 0 };
    prob.count++;
    s.problems.set(key, prob);
  }
}

async function analyseFile(file: File, onProgress: (pct: number) => void): Promise<Result> {
  const r: Result = { lines: 0, parsed: 0, bots: new Map() };
  let stream: ReadableStream<Uint8Array> = file.stream();
  if (/\.gz$/i.test(file.name)) stream = stream.pipeThrough(new DecompressionStream("gzip"));
  const reader = stream.pipeThrough(new TextDecoderStream()).getReader();
  let buf = "";
  let read = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += value;
    read += value.length;
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const l of lines) analyseLine(l, r);
    onProgress(Math.min(99, Math.round((read / Math.max(file.size, 1)) * 100)));
  }
  if (buf) analyseLine(buf, r);
  return r;
}

const EXAMPLE = [
  '66.249.66.1 - - [10/Nov/2026:06:01:12 +0000] "GET / HTTP/1.1" 200 5120 "-" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"',
  '66.249.66.1 - - [10/Nov/2026:06:03:40 +0000] "GET /services/boiler-repair HTTP/1.1" 200 4210 "-" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"',
  '66.249.66.1 - - [11/Nov/2026:07:13:02 +0000] "GET /old-page HTTP/1.1" 404 210 "-" "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"',
  '20.171.207.1 - - [11/Nov/2026:09:22:10 +0000] "GET /blog/how-much-does-a-boiler-cost HTTP/1.1" 200 8120 "-" "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot"',
  '20.171.207.2 - - [12/Nov/2026:10:02:44 +0000] "GET /prices HTTP/1.1" 301 0 "-" "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot"',
  '3.84.1.1 - - [12/Nov/2026:11:40:00 +0000] "GET /blog/how-much-does-a-boiler-cost HTTP/1.1" 200 8120 "-" "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ClaudeBot/1.0; +claudebot@anthropic.com)"',
  '44.1.1.1 - - [13/Nov/2026:12:00:00 +0000] "GET /contact HTTP/1.1" 500 0 "-" "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)"',
  '157.55.39.1 - - [13/Nov/2026:13:00:00 +0000] "GET /services/boiler-repair HTTP/1.1" 200 4210 "-" "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)"',
].join("\n");

export default function CrawlLogAnalyser() {
  const [result, setResult] = useState<Result | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState("");
  const [filter, setFilter] = useState("");

  const run = async (files: File[]) => {
    setError("");
    setResult(null);
    setProgress(0);
    try {
      const combined: Result = { lines: 0, parsed: 0, bots: new Map() };
      for (const f of files) {
        const r = await analyseFile(f, setProgress);
        combined.lines += r.lines;
        combined.parsed += r.parsed;
        for (const [k, v] of r.bots) {
          const s = combined.bots.get(k);
          if (!s) { combined.bots.set(k, v); continue; }
          s.hits += v.hits;
          for (const [c, n] of Object.entries(v.status)) s.status[c] = (s.status[c] ?? 0) + n;
          for (const [p, n] of v.pages) s.pages.set(p, (s.pages.get(p) ?? 0) + n);
          for (const [d, n] of v.days) s.days.set(d, (s.days.get(d) ?? 0) + n);
          for (const [p, x] of v.problems) { const y = s.problems.get(p); s.problems.set(p, y ? { ...y, count: y.count + x.count } : x); }
          if (v.last > s.last) s.last = v.last;
        }
      }
      if (combined.parsed === 0) setError("No lines matched the standard access log format (Apache or Nginx 'combined'). Check it's an access log, not an error log.");
      setResult(combined);
      setSelected([...combined.bots.entries()].sort((a, b) => b[1].hits - a[1].hits)[0]?.[0] ?? "");
    } catch {
      setError("That file couldn't be read. If it's compressed, it needs to be .gz (not .zip).");
    }
    setProgress(null);
  };

  const bots = useMemo(() => (result ? [...result.bots.entries()].sort((a, b) => b[1].hits - a[1].hits) : []), [result]);
  const s = result?.bots.get(selected);
  const days = s ? [...s.days.entries()].sort() : [];
  const maxDay = Math.max(1, ...days.map((d) => d[1]));
  const pages = s ? [...s.pages.entries()].filter(([p]) => !filter || p.includes(filter)).sort((a, b) => b[1] - a[1]) : [];
  const problems = s ? [...s.problems.entries()].sort((a, b) => b[1].count - a[1].count) : [];
  const missingAi = result ? BOTS.filter((b) => b.group === "AI" && ["GPTBot (OpenAI training)", "OAI-SearchBot (ChatGPT search)", "ClaudeBot", "PerplexityBot"].includes(b.name) && !result.bots.has(b.name)) : [];

  return (
    <div className="space-y-6">
      {!result && progress === null && (
        <>
          <DropZone accept=".log,.txt,.gz,text/plain,application/gzip" multiple onFiles={run} title="Drop in your access log" hint="access.log, access.log.1, access.log.gz. Several files at once is fine." />
          <button type="button" className={btnGhost} onClick={() => run([new File([EXAMPLE], "example.log")])}>Try it with an example log</button>
        </>
      )}
      {progress !== null && <p className="text-[15px] text-ink" role="status">Reading… {progress}%</p>}
      {error && <p className={errorBox}>{error}</p>}

      {result && result.parsed > 0 && (
        <>
          <div className="flex flex-wrap items-center gap-3 justify-between">
            <p className="text-[14px] text-mid">Read {result.lines.toLocaleString()} lines. {bots.reduce((n, [, b]) => n + b.hits, 0).toLocaleString()} were from known crawlers.</p>
            <button type="button" className={btnSmall} onClick={() => setResult(null)}>Analyse another log</button>
          </div>

          <section className={card} aria-labelledby="cla-bots">
            <h2 id="cla-bots" className={h2}>Crawlers that visited</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-[14px] min-w-[480px]">
                <thead><tr className="text-left text-[12px] text-muted uppercase tracking-[0.06em]"><th className="py-2">Crawler</th><th className="py-2 text-right">Visits</th><th className="py-2 text-right">OK</th><th className="py-2 text-right">Redirects</th><th className="py-2 text-right">Errors</th><th className="py-2 pl-3">Last seen</th></tr></thead>
                <tbody className="divide-y divide-border">
                  {bots.map(([name, b]) => (
                    <tr key={name} className={selected === name ? "bg-accent-light" : ""}>
                      <td className="py-2"><button type="button" className="font-semibold text-ink underline decoration-border-strong underline-offset-2 hover:text-accent-dark text-left" onClick={() => setSelected(name)}>{name}</button><span className="block text-[11px] text-muted">{BOTS.find((x) => x.name === name)?.group}</span></td>
                      <td className="py-2 text-right tabular-nums">{b.hits.toLocaleString()}</td>
                      <td className="py-2 text-right tabular-nums">{(b.status["2xx"] ?? 0).toLocaleString()}</td>
                      <td className="py-2 text-right tabular-nums">{(b.status["3xx"] ?? 0).toLocaleString()}</td>
                      <td className={`py-2 text-right tabular-nums ${(b.status["4xx"] ?? 0) + (b.status["5xx"] ?? 0) ? "text-danger font-semibold" : ""}`}>{((b.status["4xx"] ?? 0) + (b.status["5xx"] ?? 0)).toLocaleString()}</td>
                      <td className="py-2 pl-3 text-mid">{b.last}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {missingAi.length > 0 && <p className={`${hint} mt-3`}>No visits from {missingAi.map((b) => b.name).join(", ")}. If that&apos;s unexpected, check your robots.txt and any firewall or bot protection (Cloudflare, Wordfence) isn&apos;t blocking them.</p>}
            <p className={`${hint} mt-2`}>Crawlers are identified by their user agent, which anyone can fake. To confirm a visit really is Googlebot, check the IP with a reverse DNS lookup.</p>
          </section>

          {s && (
            <section className={card} aria-labelledby="cla-detail">
              <h2 id="cla-detail" className={h2}>{selected}</h2>
              {days.length > 1 && (
                <>
                  <h3 className="text-[13px] font-semibold text-ink mt-4">Visits per day</h3>
                  <div className="flex items-end gap-[2px] h-24 mt-2" role="img" aria-label={`Visits per day from ${days[0][0]} to ${days[days.length - 1][0]}`}>
                    {days.map(([d, n]) => <div key={d} title={`${d}: ${n}`} className="flex-1 bg-accent rounded-t-[2px] min-w-[2px]" style={{ height: `${(n / maxDay) * 100}%` }} />)}
                  </div>
                  <div className="flex justify-between text-[11px] text-muted mt-1"><span>{days[0][0]}</span><span>{days[days.length - 1][0]}</span></div>
                </>
              )}

              {problems.length > 0 && (
                <>
                  <h3 className="text-[15px] font-semibold text-ink mt-6">Errors and redirects ({problems.length})</h3>
                  <p className={hint}>Fix 404s that should exist, point redirects straight at the final page, and look into any 5xx errors: crawlers slow down on sites that error.</p>
                  <ul className="mt-2 max-h-[280px] overflow-y-auto border-y border-border divide-y divide-border text-[13px]">
                    {problems.slice(0, 300).map(([k, p]) => (
                      <li key={k} className="py-1.5 flex gap-3"><span className={`font-semibold tabular-nums ${p.status[0] === "3" ? "text-warn" : "text-danger"}`}>{p.status}</span><span className="flex-1 break-all text-ink">{k.slice(4)}</span><span className="text-muted tabular-nums">{p.count}×</span></li>
                    ))}
                  </ul>
                </>
              )}

              <h3 className="text-[15px] font-semibold text-ink mt-6">Most visited pages</h3>
              <div className="mt-2 max-w-[320px]">
                <label className={label} htmlFor="cla-filter">Filter pages</label>
                <input id="cla-filter" className={input} value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="/blog/" />
              </div>
              <ul className="mt-2 max-h-[320px] overflow-y-auto border-y border-border divide-y divide-border text-[13px]">
                {pages.slice(0, 300).map(([p, n]) => <li key={p} className="py-1.5 flex gap-3"><span className="flex-1 break-all text-ink">{p}</span><span className="text-muted tabular-nums">{n}×</span></li>)}
              </ul>
              <div className="flex flex-wrap gap-2 mt-4">
                <button type="button" className={btnGhost} onClick={() => downloadText(`${selected.split(" ")[0]}-pages.csv`, toCsv([["Page", "Visits"], ...pages]), "text/csv")}>Export pages CSV</button>
                <button type="button" className={btnGhost} onClick={() => downloadText(`${selected.split(" ")[0]}-errors.csv`, toCsv([["Status", "Page", "Count"], ...problems.map(([k, p]) => [p.status, k.slice(4), p.count])]), "text/csv")}>Export errors CSV</button>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
