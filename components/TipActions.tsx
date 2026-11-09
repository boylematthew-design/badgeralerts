"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Wraps a tip's body with two small actions at the bottom:
// - "Mark as done" folds the tip down to its title, remembered in this reader's browser only
//   (localStorage), so no account is needed. The tip's full text stays in the page's HTML for
//   search engines and AI tools; it's only hidden on screen.
// - "Need help?" opens a pop-up inviting the reader to ask for help, linking to the contact form
//   pre-filled with the tip (see lib/tip-help.ts). The pop-up text is in the HTML too.

const STORAGE_KEY = "cw-done-tips";

function readDone(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
  } catch {
    return []; // storage blocked (private browsing, privacy settings): everything just shows
  }
}

function saveDone(tipId: string, done: boolean) {
  try {
    const ids = new Set(readDone());
    if (done) ids.add(tipId);
    else ids.delete(tipId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Can't remember it, but the tip still folds for this visit.
  }
}

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;
function track(name: string, tipTitle: string) {
  (window as unknown as { gtag?: Gtag }).gtag?.("event", name, { tip_title: tipTitle });
}

const actionClass =
  "inline-flex items-center gap-1.5 text-[13px] font-semibold rounded-full border px-3.5 py-1.5 transition-colors active:translate-y-px";

export default function TipActions({
  tipId,
  tipTitle,
  helpQuestion,
  helpHref,
  children,
}: {
  tipId: string;
  tipTitle: string;
  helpQuestion: string;
  helpHref: string | null;
  children: ReactNode;
}) {
  const [done, setDone] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Read after the page loads, so the server-rendered page always shows every tip in full.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (readDone().includes(tipId)) setDone(true);
  }, [tipId]);

  function toggleDone(next: boolean) {
    setDone(next);
    saveDone(tipId, next);
    if (next) track("tip_done", tipTitle);
  }

  function openHelp() {
    dialogRef.current?.showModal();
    track("tip_help_open", tipTitle);
  }

  return (
    <>
      <div hidden={done}>{children}</div>

      <div className="flex flex-wrap items-center gap-2 mt-5">
        {done ? (
          <>
            <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent-dark">
              <span aria-hidden="true">✓</span> Done
            </span>
            <button type="button" onClick={() => toggleDone(false)} className={`${actionClass} border-border text-mid hover:text-ink hover:border-border-strong`}>
              Show again
            </button>
          </>
        ) : (
          <button type="button" onClick={() => toggleDone(true)} className={`${actionClass} border-border text-mid hover:text-ink hover:border-border-strong`}>
            <span aria-hidden="true">✓</span> Mark as done
          </button>
        )}
        {helpHref && (
          <button type="button" onClick={openHelp} className={`${actionClass} border-accent/40 text-accent-dark hover:bg-accent-light`}>
            <span aria-hidden="true" className="w-4 h-4 rounded-full border border-current text-[10px] leading-none flex items-center justify-center">?</span>
            Need help?
          </button>
        )}
      </div>

      {helpHref && (
        <dialog
          ref={dialogRef}
          aria-label={helpQuestion}
          // Clicking the dimmed backdrop (outside the box) closes it.
          onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
          className="m-auto w-[calc(100%-32px)] max-w-[440px] rounded-[16px] bg-paper text-ink p-0 backdrop:bg-ink/60"
        >
          <div className="p-6 md:p-7">
            <div className="flex items-start justify-between gap-4 mb-2">
              <span className="rounded-full bg-accent-light border border-accent/40 text-accent-dark text-[10px] font-semibold tracking-[0.08em] uppercase px-2 py-0.5">
                Help
              </span>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="text-[13px] font-semibold text-mid hover:text-ink -mt-1"
              >
                Close <span aria-hidden="true">✕</span>
              </button>
            </div>
            <p className="font-heading font-bold tracking-[-0.03em] text-[20px] md:text-[22px] text-ink leading-[1.25] mb-2">
              {helpQuestion}
            </p>
            <p className="text-[14px] md:text-[15px] text-mid leading-[1.6] mb-5">
              We can do it for you, or talk you through it. Send us an enquiry and we&apos;ll reply within 1 business day.
            </p>
            <a href={helpHref} className="btn-light inline-block text-[14px] px-5 py-2.5 active:translate-y-px">
              Ask for help
            </a>
          </div>
        </dialog>
      )}
    </>
  );
}
