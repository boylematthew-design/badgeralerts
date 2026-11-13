"use client";

import { useState } from "react";

const MAX = 5;
const MAX_NOTE = 300;

// Admin form fields for a tip's optional "Case study" box. Shared by the "Add a tip" and "Edit tip"
// pages, styled like the News, Stats and Tools boxes. The dropdown only lists case studies that
// already exist in lib/case-studies.ts (passed in as `options`). The chosen ids are sent with the
// form as JSON in a hidden "case_studies" field and re-checked on the server.
export default function TipCaseStudyFields({
  options,
  initial,
  initialNotes,
}: {
  options: { id: string; client: string }[];
  initial?: string[] | null;
  initialNotes?: Record<string, string> | null;
}) {
  const [chosen, setChosen] = useState<string[]>((initial ?? []).filter((id) => options.some((o) => o.id === id)));
  const [notes, setNotes] = useState<Record<string, string>>(initialNotes ?? {});

  const unused = options.filter((o) => !chosen.includes(o.id));

  const inputClass =
    "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white";

  return (
    <fieldset className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-5 space-y-4">
      <legend className="px-2 text-sm font-bold text-slate-700">
        Case study <span className="text-slate-400 font-normal">(optional)</span>
      </legend>
      <p className="text-xs text-slate-500 -mt-1">
        Shows a Case study box under the tip, linking to the client&rsquo;s case study on the services page.
        Only case studies already on the site can be chosen.
      </p>

      <input type="hidden" name="case_studies" value={JSON.stringify(chosen)} />
      <input type="hidden" name="case_study_notes" value={JSON.stringify(notes)} />

      {chosen.map((id, i) => (
        <div key={id} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">Case study {i + 1}</span>
            <button
              type="button"
              onClick={() => setChosen((c) => c.filter((x) => x !== id))}
              className="text-xs font-bold text-red-500 hover:text-red-600"
            >
              Remove case study
            </button>
          </div>
          <select
            value={id}
            onChange={(e) => {
              const next = e.target.value;
              setChosen((c) => c.map((x) => (x === id ? next : x)));
              setNotes((n) => {
                const { [id]: note, ...rest } = n;
                return note ? { ...rest, [next]: note } : rest;
              });
            }}
            aria-label={`Case study ${i + 1}`}
            className={inputClass}
          >
            {options
              .filter((o) => o.id === id || !chosen.includes(o.id))
              .map((o) => (
                <option key={o.id} value={o.id}>{o.client}</option>
              ))}
          </select>
          <div>
            <label htmlFor={`case-study-note-${i}`} className="block text-xs font-bold text-slate-700 mb-1">
              Context <span className="text-slate-400 font-normal">(optional, how this case study relates to the tip)</span>
            </label>
            <textarea
              id={`case-study-note-${i}`}
              rows={2}
              maxLength={MAX_NOTE}
              value={notes[id] ?? ""}
              onChange={(e) => setNotes((n) => ({ ...n, [id]: e.target.value }))}
              placeholder="e.g. How we set up a simple routine for Gallows Pole to ask every customer for a review."
              className={inputClass}
            />
            <p className="text-xs text-slate-400 mt-1">Left blank, the case study&rsquo;s own summary is shown instead.</p>
          </div>
        </div>
      ))}

      {options.length === 0 ? (
        <p className="text-xs text-slate-400">No case studies on the site yet.</p>
      ) : unused.length > 0 && chosen.length < MAX ? (
        <button
          type="button"
          onClick={() => setChosen((c) => [...c, unused[0].id])}
          className="text-sm font-bold text-emerald-600 hover:text-emerald-700"
        >
          + Add case study
        </button>
      ) : null}
    </fieldset>
  );
}
