"use client";

import { useEffect, useState } from "react";

// State that's remembered in this browser (localStorage). It starts empty on the server and
// on first render, then loads after hydration, so the server and browser HTML always match.
export function useSavedState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setValue((v) => ({ ...v, ...loadSaved<T>(key, fallback) }));
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    if (loaded) save(key, value);
  }, [key, value, loaded]);
  return [value, setValue] as const;
}

// Async-generated value (e.g. a QR code image) for a given input. Only the async callback
// sets state, and a result for an old input is ignored.
export function useAsyncValue<T>(input: string, make: (input: string) => Promise<T>): T | null {
  const [state, setState] = useState<{ input: string; value: T } | null>(null);
  useEffect(() => {
    if (!input) return;
    let live = true;
    make(input).then((value) => live && setState({ input, value })).catch(() => {});
    return () => { live = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);
  return input && state?.input === input ? state.value : null;
}
import { btnSmall, codeBox } from "./ui";

// Small client-side helpers shared by the free tools.

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={btnSmall}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          // Clipboard blocked: the text is still on screen to select by hand.
        }
      }}
    >
      {copied ? "Copied" : label}
    </button>
  );
}

// A block of generated code with copy and download buttons.
export function CodeOutput({ title, code, filename }: { title: string; code: string; filename?: string }) {
  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <p className="text-[13px] font-semibold text-ink">{title}</p>
        <div className="flex gap-2">
          <CopyButton text={code} />
          {filename && (
            <button type="button" className={btnSmall} onClick={() => downloadText(filename, code)}>
              Download
            </button>
          )}
        </div>
      </div>
      <pre className={codeBox}>{code}</pre>
    </div>
  );
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadText(filename: string, text: string, type = "text/plain") {
  downloadBlob(filename, new Blob([text], { type: `${type};charset=utf-8` }));
}

// CSV with every cell quoted, so commas and line breaks inside values are safe. A leading
// apostrophe stops spreadsheet apps treating a cell starting with = + - @ as a formula
// (CSV formula injection), since some values come from what people type in.
export function toCsv(rows: (string | number)[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          let v = String(cell ?? "");
          if (/^[=+\-@]/.test(v)) v = `'${v}`;
          return `"${v.replace(/"/g, '""')}"`;
        })
        .join(",")
    )
    .join("\r\n");
}

// Escapes text before it goes into generated HTML snippets people paste into their own sites.
export function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// localStorage that never throws (private browsing, blocked storage).
export function loadSaved<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: the tool still works, it just won't remember.
  }
}
