"use client";

// Eli5Robots.tsx
// "ELI5 my robots.txt" – drop-in React component. No dependencies beyond React.
// Everything runs in the visitor's browser; the file is never uploaded anywhere.
//
// Converted from Eli5Robots.jsx to TypeScript + a Client Component (this app uses
// Next.js App Router, where components using hooks must opt in via "use client").
// JSX structure, class names, copy and the CSS below are unchanged from the original.
import { useCallback, useRef, useState } from "react";
import { analyzeRobots, EXAMPLE_ROBOTS, type AnalyzeResult, type BotStatus } from "./robotsAnalyzer";

const STATUS: Record<BotStatus, { label: string; cls: string }> = {
  allowed: { label: "Welcome", cls: "ok" },
  partial: { label: "Some areas off-limits", cls: "part" },
  blocked: { label: "Asked to stay out", cls: "out" },
};

export default function Eli5Robots() {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [dragging, setDragging] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const run = useCallback((content: string) => {
    setError("");
    setOpen(false);
    setResult(analyzeRobots(content));
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 50);
  }, []);

  const readFile = (file: File | null | undefined) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("That file is over 2 MB, which is much bigger than a typical robots.txt. Is it the right file?");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = String(e.target?.result || "");
      setText(content);
      setFileName(file.name);
      run(content);
    };
    reader.onerror = () => setError("Sorry, that file couldn’t be read. Try pasting the contents instead.");
    reader.readAsText(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    readFile(e.dataTransfer.files?.[0]);
  };

  const loadExample = () => {
    setText(EXAMPLE_ROBOTS);
    setFileName("");
    run(EXAMPLE_ROBOTS);
  };

  const reset = () => {
    setText(""); setFileName(""); setResult(null); setError(""); setOpen(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const lookCount = result ? result.notes.filter((n) => n.kind !== "info").length : 0;

  return (
    <section className="eli5r" aria-labelledby="eli5r-title">
      <style>{CSS}</style>

      <p className="eli5r-eyebrow">Free tool</p>
      <h3 id="eli5r-title" className="eli5r-title">ELI5 my robots.txt</h3>
      <p className="eli5r-intro">
        Upload or paste your robots.txt and get a plain-English explanation of what it&rsquo;s telling search
        engines and AI bots. It all happens in your browser.
      </p>

      {!result && (<>
      <div
        className={`eli5r-drop${dragging ? " is-drag" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".txt,text/plain"
          id="eli5r-file"
          className="eli5r-file"
          onChange={(e) => readFile(e.target.files?.[0])}
        />
        <label htmlFor="eli5r-file" className="eli5r-drop-label">
          <span className="eli5r-drop-main">{fileName ? `Loaded: ${fileName}` : "Drop your robots.txt here"}</span>
          <span className="eli5r-drop-sub">or <u>choose a file</u></span>
        </label>
      </div>

      <label htmlFor="eli5r-text" className="eli5r-or">Or paste it in</label>
      <textarea
        id="eli5r-text"
        className="eli5r-textarea"
        rows={4}
        spellCheck={false}
        placeholder={"User-agent: *\nDisallow: /admin/\nSitemap: https://yoursite.com/sitemap.xml"}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="eli5r-actions">
        <button type="button" className="eli5r-btn" onClick={() => run(text)} disabled={!text.trim()}>
          Explain my robots.txt
        </button>
        <button type="button" className="eli5r-link" onClick={loadExample}>Try an example</button>
      </div>
      </>)}

      {error && <p className="eli5r-error" role="alert">{error}</p>}

      {result && (
        <div className="eli5r-results" ref={resultsRef} aria-live="polite">
          <div className="eli5r-summary">
            <p className="eli5r-summary-label">The short version</p>
            <p className="eli5r-summary-text">{result.headline}</p>
            <div className="eli5r-summary-actions">
              <button
                type="button"
                className="eli5r-toggle"
                aria-expanded={open}
                aria-controls="eli5r-detail"
                onClick={() => setOpen((o) => !o)}
              >
                {open ? "Hide the full explanation" : "Show the full explanation"}
                <span className={`eli5r-chev${open ? " is-open" : ""}`} aria-hidden="true">&#9662;</span>
              </button>
              <button type="button" className="eli5r-link eli5r-small" onClick={reset}>Check another file</button>
            </div>
          </div>

          <div id="eli5r-detail" className={`eli5r-detail${open ? " is-open" : ""}`} hidden={!open}>

          {result.lines.length > 0 && (
            <>
              <h4 className="eli5r-h">Line by line</h4>
              <ol className="eli5r-lines">
                {result.lines.map((l) => (
                  <li key={l.lineNo} className={`eli5r-line${l.tone === "note" ? " is-note" : ""}${l.kind === "comment" ? " is-comment" : ""}`}>
                    <div className="eli5r-code">
                      <span className="eli5r-ln">{l.lineNo}</span>
                      <code>{l.text}</code>
                    </div>
                    <p className="eli5r-explain">
                      {l.tone === "note" && <span className="eli5r-tag">Worth a look</span>}
                      {l.explanation}
                    </p>
                  </li>
                ))}
              </ol>
            </>
          )}

          {result.notes.length > 0 && (
            <>
              <h4 className="eli5r-h">{lookCount ? "A few things to consider" : "Good to know"}</h4>
              <div className="eli5r-notes">
                {result.notes.map((n, i) => (
                  <div key={i} className={`eli5r-note${n.kind === "info" ? " is-info" : ""}`}>
                    <p className="eli5r-note-title">{n.title}</p>
                    <p className="eli5r-note-body">{n.body}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {result.aiBots.length > 0 && (
            <>
              <h4 className="eli5r-h">What about AI bots?</h4>
              <p className="eli5r-muted">
                There&rsquo;s no right or wrong answer here. It depends on whether you&rsquo;re happy for AI tools to
                learn from or quote your content. Here&rsquo;s what your file currently says to the main ones.
              </p>
              <div className="eli5r-table-wrap">
                <table className="eli5r-table">
                  <thead>
                    <tr><th>Bot</th><th>Who it is</th><th>Your file says</th></tr>
                  </thead>
                  <tbody>
                    {result.aiBots.map((b) => (
                      <tr key={b.key}>
                        <td><code>{b.name}</code></td>
                        <td>{b.desc}</td>
                        <td>
                          <span className={`eli5r-pill ${STATUS[b.status].cls}`}>{STATUS[b.status].label}</span>
                          <span className="eli5r-src">
                            {b.source === "own" ? "its own section" : b.source === "general" ? "via the general (*) rules" : "no rules apply"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <p className="eli5r-footnote">
            This is a plain-English guide, not a verdict. Every site is different, and something that looks unusual
            here may be exactly what you intended. To test specific URLs against your live file, use the robots.txt
            report in Google Search Console.
          </p>
          </div>
        </div>
      )}
    </section>
  );
}

const CSS = `
.eli5r{--g:#1b7a4c;--g-soft:#e8f3ec;--ink:#1d1d1b;--body:#555;--line:#e3e3df;--amber:#9a6a00;--amber-soft:#fbf3df;--red:#a23b2c;--red-soft:#f8e9e6;
  margin:40px 0;padding:24px 26px;border:1px solid var(--line);border-radius:14px;background:#fff;color:var(--body);font:inherit;line-height:1.6}
.eli5r *{box-sizing:border-box}
.eli5r-eyebrow{margin:0 0 6px;color:var(--g);font-size:.8rem;letter-spacing:.14em;text-transform:uppercase}
.eli5r-title{margin:0 0 6px;color:var(--ink);font-family:inherit;font-size:1.6rem;line-height:1.15}
.eli5r-intro{margin:0 0 16px;font-size:.95rem}
.eli5r-drop{position:relative;border:1.5px dashed #c9cfc9;border-radius:10px;background:#fafaf8;transition:.15s}
.eli5r-drop.is-drag,.eli5r-drop:hover{border-color:var(--g);background:var(--g-soft)}
.eli5r-file{position:absolute;width:1px;height:1px;opacity:0}
.eli5r-file:focus-visible + .eli5r-drop-label{outline:2px solid var(--g);outline-offset:2px;border-radius:10px}
.eli5r-drop-label{display:flex;flex-direction:column;align-items:center;gap:2px;padding:16px;cursor:pointer;text-align:center}
.eli5r-drop-main{color:var(--ink);font-weight:600}
.eli5r-drop-sub{font-size:.9rem}
.eli5r-or{display:block;margin:12px 0 6px;font-size:.9rem;color:var(--ink);font-weight:600}
.eli5r-textarea{width:100%;padding:12px 14px;border:1px solid var(--line);border-radius:10px;font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--ink);background:#fff;resize:vertical}
.eli5r-textarea:focus{outline:2px solid var(--g);outline-offset:1px;border-color:transparent}
.eli5r-actions{display:flex;flex-wrap:wrap;align-items:center;gap:14px;margin-top:14px}
.eli5r-btn{padding:12px 20px;border:0;border-radius:999px;background:var(--g);color:#fff;font:inherit;font-weight:600;cursor:pointer}
.eli5r-btn:hover{filter:brightness(1.08)}
.eli5r-btn:disabled{opacity:.45;cursor:not-allowed}
.eli5r-link{padding:0;border:0;background:none;color:var(--g);font:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer}
.eli5r-error{margin:12px 0 0;color:var(--red)}
.eli5r-results{scroll-margin-top:24px}
.eli5r-summary{padding:18px 20px;border-radius:10px;background:var(--g-soft)}
.eli5r-summary-label{margin:0 0 4px;color:var(--g);font-size:.78rem;letter-spacing:.12em;text-transform:uppercase}
.eli5r-summary-text{margin:0;color:var(--ink);font-size:1.05rem}
.eli5r-summary-actions{display:flex;flex-wrap:wrap;align-items:center;gap:16px;margin-top:14px}
.eli5r-toggle{display:inline-flex;align-items:center;gap:8px;padding:9px 16px;border:1px solid var(--g);border-radius:999px;background:#fff;color:var(--g);font:inherit;font-size:.92rem;font-weight:600;cursor:pointer}
.eli5r-toggle:hover{background:var(--g);color:#fff}
.eli5r-toggle:focus-visible{outline:2px solid var(--g);outline-offset:2px}
.eli5r-chev{display:inline-block;transition:transform .2s}
.eli5r-chev.is-open{transform:rotate(180deg)}
.eli5r-small{font-size:.9rem}
.eli5r-detail.is-open{animation:eli5r-in .25s ease}
@keyframes eli5r-in{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.eli5r-detail.is-open{animation:none}.eli5r-chev{transition:none}}
.eli5r-h{margin:24px 0 10px;color:var(--ink);font-size:1.2rem}
.eli5r-lines{list-style:none;margin:0;padding:0;border:1px solid var(--line);border-radius:10px;overflow:hidden}
.eli5r-line{padding:14px 16px;border-top:1px solid var(--line);border-left:3px solid transparent}
.eli5r-line:first-child{border-top:0}
.eli5r-line.is-note{border-left-color:#d9a72b;background:#fffcf3}
.eli5r-line.is-comment{opacity:.7}
.eli5r-code{display:flex;gap:12px;align-items:baseline;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--ink);overflow-wrap:anywhere}
.eli5r-ln{min-width:1.6em;color:#9a9a94;text-align:right;user-select:none}
.eli5r-explain{margin:6px 0 0 calc(1.6em + 12px);font-size:.95rem}
.eli5r-tag{display:inline-block;margin-right:8px;padding:1px 8px;border-radius:999px;background:var(--amber-soft);color:var(--amber);font-size:.75rem;font-weight:600;vertical-align:1px}
.eli5r-notes{display:grid;gap:12px}
.eli5r-note{padding:14px 16px;border-radius:10px;background:var(--amber-soft)}
.eli5r-note.is-info{background:#f3f4f1}
.eli5r-note-title{margin:0 0 4px;color:var(--ink);font-weight:600}
.eli5r-note-body{margin:0;font-size:.95rem}
.eli5r-muted{margin:0 0 12px;font-size:.95rem}
.eli5r-table-wrap{overflow-x:auto;border:1px solid var(--line);border-radius:10px}
.eli5r-table{width:100%;border-collapse:collapse;font-size:.9rem}
.eli5r-table th{padding:10px 14px;text-align:left;color:var(--ink);background:#fafaf8;font-weight:600;border-bottom:1px solid var(--line)}
.eli5r-table td{padding:10px 14px;border-top:1px solid var(--line);vertical-align:top}
.eli5r-table code{color:var(--ink);font-size:.85rem;white-space:nowrap}
.eli5r-pill{display:inline-block;padding:2px 10px;border-radius:999px;font-size:.78rem;font-weight:600;white-space:nowrap}
.eli5r-pill.ok{background:var(--g-soft);color:var(--g)}
.eli5r-pill.part{background:#eaf1f7;color:#2f5f86}
.eli5r-pill.out{background:#eef0f4;color:#4a5568}
.eli5r-src{display:block;margin-top:3px;font-size:.78rem;color:#8a8a84}
.eli5r-footnote{margin:26px 0 0;font-size:.85rem;color:#8a8a84}
@media (max-width:600px){
  .eli5r{padding:20px 16px;margin:32px 0}
  .eli5r-title{font-size:1.5rem}
  .eli5r-explain{margin-left:0}
  .eli5r-table th:nth-child(2),.eli5r-table td:nth-child(2){display:none}
}
`;
