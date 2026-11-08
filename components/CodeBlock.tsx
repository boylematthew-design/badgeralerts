"use client";

import { useState } from "react";

// A copyable code example inside a tip, from a markdown ``` block (see components/MarkdownContent.tsx).
// The code is real <pre><code> text, so search engines and AI tools can read it and people can
// select it by hand too. It is only ever shown as text, never run on the page.

const LANGUAGE_LABELS: Record<string, string> = {
  html: "HTML",
  css: "CSS",
  js: "JavaScript",
  javascript: "JavaScript",
  json: "JSON",
  xml: "XML",
};

export default function CodeBlock({ code, language }: { code: string; language?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const label = language ? (LANGUAGE_LABELS[language] ?? language.toUpperCase()) : "Code";

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      // Clipboard access can be blocked (older browsers, some privacy settings).
      setStatus("failed");
    }
    setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <div className="bg-ink rounded-[14px] overflow-hidden mb-4 not-italic">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/10">
        <span className="font-mono text-[12.5px] font-semibold text-lime">
          &lt;/&gt; {label}
        </span>
        <button
          type="button"
          onClick={copy}
          className="text-[12.5px] font-semibold text-paper border border-white/20 rounded-[6px] px-3 py-1 hover:bg-white/10 transition-colors"
        >
          {status === "copied" ? "Copied" : status === "failed" ? "Select and copy" : "Copy code"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-[1.7] font-mono text-paper">
        <code>{code}</code>
      </pre>
      <span className="sr-only" aria-live="polite">
        {status === "copied" ? "Code copied to clipboard" : ""}
      </span>
    </div>
  );
}
