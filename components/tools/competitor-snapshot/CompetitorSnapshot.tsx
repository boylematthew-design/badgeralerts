"use client";

import { useMemo, useState } from "react";
import { downloadText, toCsv, useSavedState } from "../shared";
import { btn, btnGhost, btnSmall, card, errorBox, h2, h3, hint, input, label, textarea } from "../ui";

// Competitor snapshot: lists each competitor's pages from their public sitemap, grouped by
// section, shows pages they have that you don't, links out to their ads and reviews, and
// compares Google Business Profile services lists.

interface Site { name: string; domain: string }
interface Pages { origin: string; pages: string[]; note?: string; error?: string; capped?: boolean }
interface Saved { you: Site; rivals: Site[] }

const EMPTY: Saved = { you: { name: "", domain: "" }, rivals: [{ name: "", domain: "" }, { name: "", domain: "" }] };

const pathOf = (u: string) => { try { return new URL(u).pathname.replace(/\/+$/, "") || "/"; } catch { return u; } };
const sectionOf = (u: string) => { const seg = pathOf(u).split("/").filter(Boolean); return seg.length > 1 ? `/${seg[0]}/` : seg.length === 1 ? "Top-level pages" : "Homepage"; };
const slugOf = (u: string) => pathOf(u).split("/").filter(Boolean).pop()?.replace(/\.(html?|php|aspx?)$/, "").toLowerCase() ?? "";
const words = (s: string) => new Set(s.split(/[-_]+/).filter((w) => w.length > 2 && !/^\d+$/.test(w)));

function launchers(s: Site) {
  const name = s.name.trim() || s.domain.trim();
  const domain = s.domain.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  return [
    { label: "Google ads", href: `https://adstransparency.google.com/?region=GB&domain=${encodeURIComponent(domain)}` },
    { label: "Facebook & Instagram ads", href: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=GB&q=${encodeURIComponent(name)}&search_type=keyword_unordered` },
    { label: "Google Maps & reviews", href: `https://www.google.com/maps/search/${encodeURIComponent(name)}` },
    { label: "Checkatrade", href: `https://www.google.com/search?q=${encodeURIComponent(`site:checkatrade.com "${name}"`)}` },
    { label: "Reddit mentions", href: `https://www.reddit.com/search/?q=${encodeURIComponent(`"${name}"`)}` },
  ];
}

function ServicesCompare() {
  const [mine, setMine] = useState("");
  const [theirs, setTheirs] = useState("");
  const norm = (t: string) => [...new Set(t.split(/\n|,|•/).map((x) => x.trim()).filter(Boolean))];
  const a = norm(mine), b = norm(theirs);
  const lower = (l: string[]) => new Set(l.map((x) => x.toLowerCase()));
  const onlyTheirs = b.filter((x) => !lower(a).has(x.toLowerCase()));
  const onlyMine = a.filter((x) => !lower(b).has(x.toLowerCase()));
  const both = a.filter((x) => lower(b).has(x.toLowerCase()));
  return (
    <section className={card} aria-labelledby="cs-services">
      <h2 id="cs-services" className={h2}>Compare Google Business Profile services</h2>
      <p className="text-[14px] text-mid mt-2">Copy the services list from your Business Profile and a competitor&apos;s (on Google Maps, open their profile and look under Services). One per line.</p>
      <div className="grid sm:grid-cols-2 gap-3 mt-4">
        <div><label className={label} htmlFor="cs-mine">Your services</label><textarea id="cs-mine" className={textarea} value={mine} onChange={(e) => setMine(e.target.value)} /></div>
        <div><label className={label} htmlFor="cs-theirs">Their services</label><textarea id="cs-theirs" className={textarea} value={theirs} onChange={(e) => setTheirs(e.target.value)} /></div>
      </div>
      {(a.length > 0 || b.length > 0) && (
        <div className="grid sm:grid-cols-3 gap-3 mt-4 text-[14px]">
          <div className="rounded-[12px] bg-danger-soft p-3"><p className="font-semibold text-danger">Only they list ({onlyTheirs.length})</p><ul className="mt-1 text-ink space-y-0.5">{onlyTheirs.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div className="rounded-[12px] bg-accent-light p-3"><p className="font-semibold text-accent-dark">Only you list ({onlyMine.length})</p><ul className="mt-1 text-ink space-y-0.5">{onlyMine.map((x) => <li key={x}>{x}</li>)}</ul></div>
          <div className="rounded-[12px] bg-surface p-3"><p className="font-semibold text-ink">Both ({both.length})</p><ul className="mt-1 text-mid space-y-0.5">{both.map((x) => <li key={x}>{x}</li>)}</ul></div>
        </div>
      )}
    </section>
  );
}

export default function CompetitorSnapshot() {
  const [s, setS] = useSavedState<Saved>("cw-competitors-v1", EMPTY);
  const [results, setResults] = useState<Record<string, Pages>>({});
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const sites = [s.you, ...s.rivals].filter((x) => x.domain.trim());
  const keyOf = (x: Site) => x.domain.trim().toLowerCase();

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const out: Record<string, Pages> = {};
    await Promise.all(sites.map(async (site) => {
      try {
        const res = await fetch("/api/tools/sitemap-pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domain: site.domain }) });
        out[keyOf(site)] = await res.json();
      } catch {
        out[keyOf(site)] = { origin: "", pages: [], error: "Couldn't reach our server." };
      }
    }));
    setResults(out);
    setBusy(false);
  };

  const mine = results[keyOf(s.you)];
  const mySlugWords = useMemo(() => (mine?.pages ?? []).map((u) => words(slugOf(u))), [mine]);
  // A competitor page is "missing" if none of your page slugs shares most of its words.
  const missing = (u: string) => {
    const w = words(slugOf(u));
    if (w.size === 0) return false;
    return !mySlugWords.some((m) => { let n = 0; w.forEach((x) => m.has(x) && n++); return n / w.size >= 0.6; });
  };

  const setRival = (i: number, p: Partial<Site>) => setS((x) => ({ ...x, rivals: x.rivals.map((r, j) => (j === i ? { ...r, ...p } : r)) }));
  const sectionsFor = (pages: string[]) => {
    const m = new Map<string, number>();
    for (const u of pages) m.set(sectionOf(u), (m.get(sectionOf(u)) ?? 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={run} className={card}>
        <h2 className={h2}>Who are you up against?</h2>
        <div className="grid sm:grid-cols-2 gap-3 mt-4">
          <div><label className={label} htmlFor="cs-yn">Your business name</label><input id="cs-yn" className={input} value={s.you.name} onChange={(e) => setS((x) => ({ ...x, you: { ...x.you, name: e.target.value } }))} /></div>
          <div><label className={label} htmlFor="cs-yd">Your website</label><input id="cs-yd" className={input} value={s.you.domain} placeholder="yoursite.co.uk" onChange={(e) => setS((x) => ({ ...x, you: { ...x.you, domain: e.target.value } }))} /></div>
          {s.rivals.map((r, i) => (
            <div key={i} className="contents">
              <div><label className={label} htmlFor={`cs-rn${i}`}>Competitor {i + 1} name</label><input id={`cs-rn${i}`} className={input} value={r.name} onChange={(e) => setRival(i, { name: e.target.value })} /></div>
              <div><label className={label} htmlFor={`cs-rd${i}`}>Competitor {i + 1} website</label><input id={`cs-rd${i}`} className={input} value={r.domain} placeholder="competitor.co.uk" onChange={(e) => setRival(i, { domain: e.target.value })} /></div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button type="submit" className={btn} disabled={busy || sites.length === 0}>{busy ? "Reading sitemaps…" : "Compare websites"}</button>
          {s.rivals.length < 5 && <button type="button" className={btnGhost} onClick={() => setS((x) => ({ ...x, rivals: [...x.rivals, { name: "", domain: "" }] }))}>Add a competitor</button>}
        </div>
        <p className={hint}>Reads each site&apos;s public sitemap, the list of pages it asks Google to index. Up to 5,000 pages per site.</p>
      </form>

      {Object.keys(results).length > 0 && (
        <section className={card} aria-labelledby="cs-pages">
          <h2 id="cs-pages" className={h2}>Pages by section</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-[14px] min-w-[420px]">
              <thead><tr className="text-left text-[12px] text-muted uppercase tracking-[0.06em]"><th className="py-2">Site</th><th className="py-2 text-right">Pages</th><th className="py-2 pl-4">Biggest sections</th></tr></thead>
              <tbody className="divide-y divide-border">
                {sites.map((site) => {
                  const r = results[keyOf(site)];
                  return (
                    <tr key={keyOf(site)}>
                      <td className="py-2.5 font-semibold text-ink">{site.name || site.domain}{site === s.you && <span className="text-muted font-normal"> (you)</span>}</td>
                      <td className="py-2.5 text-right tabular-nums">{r?.error ? "–" : `${r?.pages.length.toLocaleString() ?? 0}${r?.capped ? "+" : ""}`}</td>
                      <td className="py-2.5 pl-4 text-mid">{r?.error ?? r?.note ?? sectionsFor(r?.pages ?? []).slice(0, 4).map(([k, n]) => `${k} ${n}`).join(" · ")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {s.rivals.filter((r) => r.domain.trim() || r.name.trim()).map((r) => {
        const res = results[keyOf(r)];
        const gaps = res && mine && mine.pages.length ? res.pages.filter(missing) : [];
        const k = keyOf(r) || r.name;
        return (
          <section key={k} className={card} aria-label={r.name || r.domain}>
            <h2 className={h2}>{r.name || r.domain}</h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {launchers(r).map((l) => <a key={l.label} className={btnSmall} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}<span className="sr-only"> (opens in a new tab)</span></a>)}
            </div>
            {res && res.pages.length > 0 && (
              <>
                {mine && mine.pages.length > 0 && (
                  <>
                    <h3 className={`${h3} mt-5`}>Pages they have that you might not ({gaps.length})</h3>
                    <p className={hint}>Matched on the words in each page address, so check before acting. Look for services, locations and guides you could cover better.</p>
                    <ul className="mt-2 max-h-[300px] overflow-y-auto border-y border-border divide-y divide-border text-[13px]">
                      {gaps.slice(0, 500).map((u) => <li key={u} className="py-1.5"><a href={u} target="_blank" rel="noopener noreferrer nofollow" className="text-ink hover:text-accent-dark break-all">{pathOf(u)}</a></li>)}
                    </ul>
                  </>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button type="button" className={btnGhost} onClick={() => setOpen(open === k ? null : k)}>{open === k ? "Hide" : "Show"} all {res.pages.length.toLocaleString()} pages</button>
                  <button type="button" className={btnGhost} onClick={() => downloadText(`${(r.name || r.domain).replace(/\W+/g, "-")}-pages.csv`, toCsv([["URL", "Section", "Not on your site"], ...res.pages.map((u) => [u, sectionOf(u), gaps.includes(u) ? "Yes" : ""])]), "text/csv")}>Export CSV</button>
                </div>
                {open === k && (
                  <ul className="mt-3 max-h-[400px] overflow-y-auto border-y border-border divide-y divide-border text-[13px]">
                    {res.pages.map((u) => <li key={u} className="py-1.5 break-all text-mid">{pathOf(u)}</li>)}
                  </ul>
                )}
              </>
            )}
          </section>
        );
      })}

      <ServicesCompare />
    </div>
  );
}
