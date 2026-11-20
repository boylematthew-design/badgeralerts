"use client";

import { useMemo, useState } from "react";
import { CopyButton, downloadText, toCsv } from "../shared";
import { btn, btnGhost, card, errorBox, h2, hint, input, label, tabBtn } from "../ui";

interface Item { phrase: string; from: string; type: "question" | "long" | "phrase" }

const GROUPS = [
  { id: "question", name: "Questions" },
  { id: "long", name: "Long, specific searches" },
  { id: "phrase", name: "Other searches" },
] as const;

export default function QuestionFinder() {
  const [q, setQ] = useState("");
  const [source, setSource] = useState<"google" | "youtube">("google");
  const [letters, setLetters] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [searched, setSearched] = useState("");
  const [filter, setFilter] = useState("");

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(""); setItems([]);
    try {
      const res = await fetch("/api/tools/questions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q, source, letters }) });
      const data = await res.json();
      if (!res.ok || data.error) setError(data.error ?? "Something went wrong.");
      else { setItems(data.results); setSearched(`${data.seed} (${source === "youtube" ? "YouTube" : "Google"} UK)`); }
    } catch {
      setError("Couldn't run the search. Please try again.");
    }
    setBusy(false);
  };

  const shown = useMemo(() => items.filter((i) => !filter || i.phrase.includes(filter.toLowerCase())), [items, filter]);

  return (
    <div className="space-y-6">
      <form onSubmit={run} className={card}>
        <label className={label} htmlFor="qf-q">A problem, product or service</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input id="qf-q" className={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. boiler pressure, oval engagement ring, airbnb cleaning" maxLength={80} required />
          <button type="submit" className={btn} disabled={busy}>{busy ? "Searching…" : "Find questions"}</button>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <button type="button" className={tabBtn(source === "google")} aria-pressed={source === "google"} onClick={() => setSource("google")}>Google</button>
          <button type="button" className={tabBtn(source === "youtube")} aria-pressed={source === "youtube"} onClick={() => setSource("youtube")}>YouTube</button>
          <label className="flex items-center gap-2 text-[13px] text-mid ml-1"><input type="checkbox" checked={letters} onChange={(e) => setLetters(e.target.checked)} /> Also try a to z (slower, more results)</label>
        </div>
        <p className={hint}>Uses Google&apos;s autocomplete for the UK: real searches people type, without search volumes. Check volumes in Search Console or Google Ads Keyword Planner.</p>
      </form>
      {error && <p className={errorBox} role="alert">{error}</p>}

      {items.length > 0 && (
        <>
          <div className="flex flex-wrap items-end gap-3 justify-between">
            <p className="text-[14px] text-mid"><strong className="text-ink">{items.length}</strong> searches for {searched}</p>
            <div className="flex flex-wrap gap-2 items-end">
              <div>
                <label className={label} htmlFor="qf-filter">Filter</label>
                <input id="qf-filter" className={`${input} w-44`} value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="e.g. cost" />
              </div>
              <button type="button" className={btnGhost} onClick={() => downloadText("questions.csv", toCsv([["Search", "Type", "Found from"], ...shown.map((i) => [i.phrase, GROUPS.find((g) => g.id === i.type)!.name, i.from])]), "text/csv")}>Export CSV</button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {GROUPS.map((g) => {
              const list = shown.filter((i) => i.type === g.id);
              return (
                <section key={g.id} className={card} aria-labelledby={`qf-${g.id}`}>
                  <div className="flex items-center justify-between gap-2">
                    <h2 id={`qf-${g.id}`} className={`${h2} !text-[19px]`}>{g.name} <span className="text-muted font-normal">({list.length})</span></h2>
                    {list.length > 0 && <CopyButton text={list.map((i) => i.phrase).join("\n")} />}
                  </div>
                  <ul className="mt-3 text-[14px] text-ink space-y-1.5 max-h-[520px] overflow-y-auto">
                    {list.map((i) => <li key={i.phrase}>{i.phrase}</li>)}
                  </ul>
                </section>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
