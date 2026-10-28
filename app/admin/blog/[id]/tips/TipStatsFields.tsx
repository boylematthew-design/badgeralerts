"use client";

import { useState } from "react";
import {
  MAX_SOURCES_PER_STAT,
  MAX_SOURCE_LABEL_LENGTH,
  MAX_STATS,
  MAX_STAT_TEXT_LENGTH,
  type TipStat,
} from "@/lib/tip-stats";

// Admin form fields for a tip's optional stats. Shared by the "Add a tip" and "Edit tip" pages.
// The list is sent to the server as JSON in a hidden "stats" field and re-checked there.
export default function TipStatsFields({ initial }: { initial?: TipStat[] | null }) {
  const [stats, setStats] = useState<TipStat[]>(initial ?? []);

  const inputClass =
    "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white";

  function updateStat(index: number, next: TipStat) {
    setStats((current) => current.map((stat, i) => (i === index ? next : stat)));
  }

  // Source numbers run across all the stats on the tip, matching the public page.
  let sourceNumber = 0;

  return (
    <fieldset className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-5 space-y-4">
      <legend className="px-2 text-sm font-bold text-slate-700">
        Stats <span className="text-slate-400 font-normal">(optional)</span>
      </legend>
      <p className="text-xs text-slate-500 -mt-1">
        Shows a Stats box under the tip. Each stat is followed by numbered source links like [1], and
        the source names are listed underneath.
      </p>

      <input type="hidden" name="stats" value={JSON.stringify(stats)} />

      {stats.map((stat, statIndex) => (
        <div key={statIndex} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">Stat {statIndex + 1}</span>
            <button
              type="button"
              onClick={() => setStats((current) => current.filter((_, i) => i !== statIndex))}
              className="text-xs font-bold text-red-500 hover:text-red-600"
            >
              Remove stat
            </button>
          </div>
          <textarea
            required
            rows={3}
            maxLength={MAX_STAT_TEXT_LENGTH}
            value={stat.text}
            onChange={(e) => updateStat(statIndex, { ...stat, text: e.target.value })}
            placeholder="e.g. 90% of UK adults use WhatsApp."
            aria-label={`Stat ${statIndex + 1} text`}
            className={inputClass}
          />

          {stat.sources.map((source, sourceIndex) => {
            const number = ++sourceNumber;
            const setSource = (patch: Partial<typeof source>) =>
              updateStat(statIndex, {
                ...stat,
                sources: stat.sources.map((s, i) => (i === sourceIndex ? { ...s, ...patch } : s)),
              });
            return (
              <div key={sourceIndex} className="grid grid-cols-1 sm:grid-cols-[auto_1fr_1fr_auto] gap-2 sm:items-center">
                <span className="text-xs font-bold text-emerald-700">[{number}]</span>
                <input
                  required
                  maxLength={MAX_SOURCE_LABEL_LENGTH}
                  value={source.label}
                  onChange={(e) => setSource({ label: e.target.value })}
                  placeholder="Source name, e.g. Ofcom Online Nation 2025"
                  aria-label={`Source ${number} name`}
                  className={inputClass}
                />
                <input
                  required
                  type="url"
                  pattern="https?://.+"
                  value={source.url}
                  onChange={(e) => setSource({ url: e.target.value })}
                  placeholder="https://..."
                  aria-label={`Source ${number} link`}
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() =>
                    updateStat(statIndex, { ...stat, sources: stat.sources.filter((_, i) => i !== sourceIndex) })
                  }
                  className="text-xs font-bold text-slate-400 hover:text-red-500 justify-self-start"
                >
                  Remove
                </button>
              </div>
            );
          })}

          {stat.sources.length < MAX_SOURCES_PER_STAT && (
            <button
              type="button"
              onClick={() => updateStat(statIndex, { ...stat, sources: [...stat.sources, { label: "", url: "" }] })}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              + Add source
            </button>
          )}
        </div>
      ))}

      {stats.length < MAX_STATS && (
        <button
          type="button"
          onClick={() => setStats((current) => [...current, { text: "", sources: [{ label: "", url: "" }] }])}
          className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
        >
          + Add stat
        </button>
      )}
    </fieldset>
  );
}
