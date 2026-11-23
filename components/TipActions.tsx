"use client";

import { useEffect, useState, type ReactNode } from "react";

// Wraps a tip's body with a "Mark as done" action at the bottom. It folds the tip down to its title,
// remembered in this reader's browser only (localStorage), so no account is needed. The tip's full
// text stays in the page's HTML for search engines and AI tools; it's only hidden on screen.

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
  children,
}: {
  tipId: string;
  tipTitle: string;
  children: ReactNode;
}) {
  const [done, setDone] = useState(false);

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
      </div>
    </>
  );
}
