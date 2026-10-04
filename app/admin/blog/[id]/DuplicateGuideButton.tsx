"use client";

import { useState } from "react";
import { duplicateGuideToSite } from "./actions";
import { SITES } from "@/lib/sites";

export default function DuplicateGuideButton({
  guideId,
  currentSite,
}: {
  guideId: string;
  currentSite: string;
}) {
  const otherSites = SITES.filter((s) => s.value !== currentSite);
  const [target, setTarget] = useState<string>(otherSites[0]?.value ?? "");

  // Nothing to duplicate to if this is the only site.
  if (otherSites.length === 0) return null;

  return (
    <form
      action={duplicateGuideToSite}
      onSubmit={(e) => {
        const label = otherSites.find((s) => s.value === target)?.label ?? target;
        if (
          !confirm(
            `Copy this guide — and all of its sections, tips, and links — to ${label}? It'll start as a draft there for you to review. The original is untouched.`
          )
        ) {
          e.preventDefault();
        }
      }}
      className="flex items-center gap-1.5"
    >
      <input type="hidden" name="guide_id" value={guideId} />
      <select
        name="target_site"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        className="text-sm border border-slate-200 rounded-xl px-2.5 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
      >
        {otherSites.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
      <button
        type="submit"
        className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-xl text-sm font-bold transition whitespace-nowrap"
      >
        Duplicate to site
      </button>
    </form>
  );
}
