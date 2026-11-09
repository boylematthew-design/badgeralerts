"use client";

import { useState } from "react";
import { MAX_HELP_TEXT_LENGTH, helpQuestion } from "@/lib/tip-help";

// Admin form fields for a tip's optional "Help" box. Shared by the "Add a tip" and "Edit tip" pages.
// Turn it on for tips a small business owner might struggle to do alone. Saved by lib/tip-help.ts.
export default function TipHelpFields({ enabled = false, text = "" }: { enabled?: boolean; text?: string | null }) {
  const [on, setOn] = useState(enabled);
  const [phrase, setPhrase] = useState(text ?? "");

  return (
    <fieldset className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-5 space-y-4">
      <legend className="px-2 text-sm font-bold text-slate-700">
        Help box <span className="text-slate-400 font-normal">(optional)</span>
      </legend>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="help_enabled"
          checked={on}
          onChange={(e) => setOn(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-emerald-600"
        />
        <span className="text-sm text-slate-700">
          <span className="font-bold">Show a Help box under this tip</span>
          <span className="block text-xs text-slate-500 mt-0.5">
            For tips a small business owner might struggle with. Links to the contact form, pre-filled with
            this tip and guide so you know what the enquiry is about.
          </span>
        </span>
      </label>

      {on && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
          <label htmlFor="help_text" className="block text-sm font-bold text-slate-700">
            Need help with… <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="help_text"
            name="help_text"
            maxLength={MAX_HELP_TEXT_LENGTH}
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="e.g. getting AI agents to find your website"
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
          <p className="text-xs text-slate-500">
            Shows as: <span className="font-semibold">{helpQuestion("Your tip title", phrase.trim() || null)}</span>{" "}
            Leave blank to use the tip&apos;s title.
          </p>
        </div>
      )}
      {/* Keep the phrase when the box is switched off, so turning it back on doesn't lose it. */}
      {!on && phrase && <input type="hidden" name="help_text" value={phrase} />}
    </fieldset>
  );
}
