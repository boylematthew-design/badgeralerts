"use client";

import { useRef, useState } from "react";
import MarkdownContent from "@/components/MarkdownContent";
import { CODE_TEMPLATE, normalizeTipContent, TABLE_TEMPLATE } from "@/lib/tip-content";

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

  // Puts `text` at the cursor as its own block, with blank lines around it so markdown treats it
  // as a list or table rather than part of the paragraph next to it.
  function insertBlock(text: string) {
    const el = ref.current;
    if (!el) return;
    const { value, selectionStart, selectionEnd } = el;
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);
    const lead = before === "" || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
    const trail = after === "" || after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";
    el.focus();
    el.setRangeText(lead + text + trail, selectionStart, selectionEnd, "end");
  }

  // Wraps the selected lines in a ``` code block (or inserts an empty one), shown on the page as a
  // copyable code box.
  function insertCode() {
    const el = ref.current;
    if (!el) return;
    const selected = el.value.slice(el.selectionStart, el.selectionEnd).replace(/^\n+|\n+$/g, "");
    if (!selected) {
      insertBlock(CODE_TEMPLATE);
      // Put the cursor on the empty line inside the block, ready to paste.
      const inside = el.value.lastIndexOf("```html\n", el.selectionStart) + "```html\n".length;
      el.setSelectionRange(inside, inside);
      return;
    }
    insertBlock("```html\n" + selected + "\n```");
  }

  // Tables copied from Claude, ChatGPT, Docs, Word, Excel or a web page paste as tab-separated text,
  // pasted lists can bring "•" bullets, and pasted code loses its ``` fence. Convert them as they're
  // pasted so they look right straight away (the same tidy-up runs again on save).
  function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const text = e.clipboardData.getData("text/plain");
    const tidied = normalizeTipContent(text);
    const codeFound = tidied.includes("```") && !text.includes("```");
    if (!(text.includes("\t") || codeFound) || tidied === text.trim()) return;
    e.preventDefault();
    insertBlock(tidied);
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
          <button type="button" onClick={() => insertBlock(TABLE_TEMPLATE)} disabled={preview !== null} className={buttonClass}>
            ▦ Table
          </button>
          <button type="button" onClick={insertCode} disabled={preview !== null} className={buttonClass}>
            &lt;/&gt; Code
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
        onPaste={handlePaste}
        placeholder="Write the tip here. You can use markdown for formatting..."
        className={`w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono ${preview !== null ? "hidden" : ""}`}
      />
      {preview !== null && (
        <div className="border border-slate-200 rounded-xl px-5 py-4 bg-white min-h-[120px]">
          {preview ? <MarkdownContent content={preview} baseLevel={4} /> : <p className="text-sm text-slate-400">Nothing to preview yet.</p>}
        </div>
      )}
      <p className="text-xs text-slate-400 mt-1.5">
        Select some lines and press a list button, or start lines with &quot;- &quot; or &quot;1. &quot;. Tables and lists
        pasted from Claude, ChatGPT, Google Docs, Word or Excel are turned into proper tables and lists. Pasted
        HTML becomes a copyable code box, or select code and press Code. Use Preview to check.
      </p>
    </div>
  );
}
