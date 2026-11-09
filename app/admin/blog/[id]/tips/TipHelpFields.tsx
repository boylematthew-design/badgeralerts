"use client";

import { useState } from "react";
import { MAX_HELP_TEXT_LENGTH, helpQuestion } from "@/lib/tip-help";

// Admin field for the wording of a tip's "Need help?" pop-up. Every tip on the public page has the
// "Need help?" button (components/TipActions.tsx); this just lets you finish the question in your own
// words. Shared by the "Add a tip" and "Edit tip" pages. Saved by lib/tip-help.ts.
export default function TipHelpFields({ text = "" }: { enabled?: boolean; text?: string | null }) {
  const [phrase, setPhrase] = useState(text ?? "");

  return (
    <fieldset className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-5 space-y-3">
      <legend className="px-2 text-sm font-bold text-slate-700">
        &ldquo;Need help?&rdquo; pop-up <span className="text-slate-400 font-normal">(optional wording)</span>
      </legend>
      <p className="text-xs text-slate-500 -mt-1">
        Every tip has a &ldquo;Need help?&rdquo; button that opens a pop-up linking to the contact form, pre-filled
        with this tip and guide. Finish the question below, or leave it blank to use the tip&apos;s title.
      </p>
      {/* Kept switched on so the setting stays meaningful if per-tip control is ever brought back. */}
      <input type="hidden" name="help_enabled" value="on" />
      <label htmlFor="help_text" className="block text-sm font-bold text-slate-700">
        Need help with…
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
        Shows as: <span className="font-semibold">{helpQuestion("Your tip title", phrase.trim() || null)}</span>
      </p>
    </fieldset>
  );
}
