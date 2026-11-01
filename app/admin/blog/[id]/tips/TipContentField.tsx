"use client";

import { useRef, useState } from "react";
import MarkdownContent from "@/components/MarkdownContent";
import { normalizeTipContent } from "@/lib/tip-content";

const MARKER = /^(\s*)(?:[-*+]|\d+\.)\s+/;

// The tip "Content" box, with buttons that turn the selected lines into a bullet or numbered list
// and a preview of how the tip will look. Lists are stored as markdown ("- item" / "1. item") so
// the public page renders them as real HTML lists. Pasted lists are tidied again on save
// (lib/tip-content.ts).
export default function TipContentField({ initial = "" }: { initial?: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function toggleList(kind: "bullet" | "numbered") {
    const el = ref.current;
    if (!el) return;
    const { value, selectionStart, selectionEnd } = el;
    // Work on whole lines, even if the selection starts or ends mid-line.
    const start = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const endBreak = value.indexOf("\n", selectionEnd > selectionStart ? selectionEnd - 1 : selectionEnd);
    const end = endBreak === -1 ? value.length : endBreak;
    const lines = value.slice(start, end).split("\n");

    const filled = lines.filter((l) => l.trim() !== "");
    const isKind = (l: string) => (kind === "bullet" ? /^\s*[-*+]\s+/ : /^\s*\d+\.\s+/).test(l);
    // Pressing the button on a list that's already that kind turns it back into plain lines.
    const removing = filled.length > 0 && filled.every(isKind);
    let n = 0;
    const updated = lines.map((line) => {
      if (line.trim() === "") return line;
      const text = line.replace(MARKER, "$1");
      if (removing) return text;
      n += 1;
      return text.replace(/^(\s*)/, kind === "bullet" ? "$1- " : `$1${n}. `);
    });

    el.focus();
    el.setRangeText(updated.join("\n"), start, end, "select");
  }

  function togglePreview() {
    setPreview((current) => (current === null ? normalizeTipContent(ref.current?.value ?? "") : null));
  }

  const buttonClass =
    "px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <label htmlFor="tip-content" className="block text-sm font-bold text-slate-700">
          Content
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={() => toggleList("bullet")} disabled={preview !== null} className={buttonClass}>
            • Bullet list
          </button>
          <button type="button" onClick={() => toggleList("numbered")} disabled={preview !== null} className={buttonClass}>
            1. Numbered list
          </button>
          <button type="button" onClick={togglePreview} className={buttonClass} aria-pressed={preview !== null}>
            {preview === null ? "Preview" : "Edit"}
          </button>
        </div>
      </div>
      {/* The textarea stays in the form while previewing, so its text is still saved. */}
      <textarea
        ref={ref}
        id="tip-content"
        name="content"
        rows={10}
        defaultValue={initial}
        placeholder="Write the tip here. You can use markdown for formatting..."
        className={`w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono ${preview !== null ? "hidden" : ""}`}
      />
      {preview !== null && (
        <div className="border border-slate-200 rounded-xl px-5 py-4 bg-white min-h-[120px]">
          {preview ? <MarkdownContent content={preview} baseLevel={4} /> : <p className="text-sm text-slate-400">Nothing to preview yet.</p>}
        </div>
      )}
      <p className="text-xs text-slate-400 mt-1.5">
        Select some lines and press a list button, or start lines with &quot;- &quot; or &quot;1. &quot;. Lists pasted from
        Google Docs, Word or Notes are turned into proper lists when you save.
      </p>
    </div>
  );
}
