"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_LINK_CONTEXT_LENGTH, MAX_TIP_LINKS, isHttpUrl, type TipLinkInput } from "@/lib/tip-links";

interface LinkPreview {
  title: string | null;
  description: string | null;
  favicon: string | null;
  domain: string;
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

const inputClass =
  "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white";

// Admin form fields for a tip's optional "Relevant links". Shared by the "Add a tip" and "Edit tip"
// pages, styled like the News, Stats and Tools boxes. Paste a URL and its title and icon are fetched
// automatically. The list is sent with the form as JSON in a hidden "links" field and saved together
// with the tip (see lib/tip-links.ts), so nothing is saved until you click the form's save button.
export default function TipLinksFields({ initial }: { initial?: TipLinkInput[] | null }) {
  const [links, setLinks] = useState<TipLinkInput[]>(initial ?? []);
  const [url, setUrl] = useState("");
  const [context, setContext] = useState("");
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const urlRef = useRef<HTMLInputElement>(null);

  const full = links.length >= MAX_TIP_LINKS;

  // A URL typed in but never added would be silently lost on save, so block the form until it's
  // added or cleared.
  useEffect(() => {
    urlRef.current?.setCustomValidity(url.trim() ? "Click \"Add link\" to add this link, or clear the box." : "");
  }, [url]);

  async function loadPreview(rawUrl: string) {
    const trimmed = rawUrl.trim();
    if (!isHttpUrl(trimmed)) {
      setPreview(null);
      setFetchError(null);
      return;
    }
    setFetching(true);
    setFetchError(null);
    setPreview(null);
    try {
      const res = await fetch(`/api/link-preview?url=${encodeURIComponent(trimmed)}`);
      if (!res.ok) throw new Error();
      setPreview(await res.json());
    } catch {
      setFetchError("Couldn't load a preview. You can still add the link; it'll show the web address instead of a title.");
    } finally {
      setFetching(false);
    }
  }

  function handleUrlChange(value: string) {
    setUrl(value);
    setPreview(null);
    setFetchError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadPreview(value), 700);
  }

  function addLink() {
    const trimmed = url.trim();
    if (!isHttpUrl(trimmed)) {
      setFetchError("Enter a full web address starting with https://");
      return;
    }
    setLinks((current) => [
      ...current,
      {
        url: trimmed,
        context: context.trim() || null,
        preview_title: preview?.title || null,
        preview_description: preview?.description || null,
        preview_favicon: preview?.favicon || null,
      },
    ]);
    setUrl("");
    setContext("");
    setPreview(null);
    setFetchError(null);
  }

  function move(index: number, by: -1 | 1) {
    setLinks((current) => {
      const target = index + by;
      if (target < 0 || target >= current.length) return current;
      const copy = [...current];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  return (
    <fieldset className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-5 space-y-4">
      <legend className="px-2 text-sm font-bold text-slate-700">
        Relevant links <span className="text-slate-400 font-normal">(optional)</span>
      </legend>
      <p className="text-xs text-slate-500 -mt-1">
        Helpful links shown under the tip. Paste a URL and the title and icon are fetched automatically.
        Links are saved when you save the tip.
      </p>

      <input type="hidden" name="links" value={JSON.stringify(links)} />

      {links.map((link, i) => (
        <div key={`${link.url}-${i}`} className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-slate-700">Link {i + 1}</span>
            <div className="flex items-center gap-3 text-xs font-bold">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-slate-600 hover:text-slate-900 disabled:opacity-30">
                Move up
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === links.length - 1} className="text-slate-600 hover:text-slate-900 disabled:opacity-30">
                Move down
              </button>
              <button type="button" onClick={() => setLinks((c) => c.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-600">
                Remove link
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {link.preview_favicon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={link.preview_favicon} alt="" className="w-4 h-4 rounded-sm shrink-0" onError={(e) => (e.currentTarget.style.display = "none")} />
            )}
            <span className="text-xs text-slate-400 truncate">{getDomain(link.url)}</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 break-words">{link.preview_title || link.url}</p>
          <input
            value={link.context ?? ""}
            maxLength={MAX_LINK_CONTEXT_LENGTH}
            onChange={(e) => setLinks((c) => c.map((l, j) => (j === i ? { ...l, context: e.target.value } : l)))}
            placeholder="Your note (optional), e.g. Official Google guide on responding to reviews"
            aria-label={`Link ${i + 1} note`}
            className={inputClass}
          />
        </div>
      ))}

      {full ? (
        <p className="text-xs text-slate-400">That&rsquo;s the maximum of {MAX_TIP_LINKS} links. Remove one to add another.</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div>
            <label htmlFor="new-link-url" className="block text-xs font-bold text-slate-700 mb-1">URL</label>
            <input
              ref={urlRef}
              id="new-link-url"
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="https://example.com/article"
              className={inputClass}
            />
          </div>

          {fetching && <p className="text-xs text-slate-400">Fetching preview…</p>}
          {fetchError && <p className="text-xs text-red-600">{fetchError}</p>}

          {preview && (
            <div className="border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 flex items-start gap-2.5">
              {preview.favicon && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview.favicon} alt="" className="w-4 h-4 rounded-sm shrink-0 mt-0.5" onError={(e) => (e.currentTarget.style.display = "none")} />
              )}
              <div className="min-w-0">
                <p className="text-xs text-slate-400 mb-0.5">{preview.domain}</p>
                <p className="text-sm font-semibold text-slate-800 leading-snug">{preview.title || url}</p>
                {preview.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{preview.description}</p>}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="new-link-note" className="block text-xs font-bold text-slate-700 mb-1">
              Your note <span className="text-slate-400 font-normal">(optional, why this link is useful)</span>
            </label>
            <input
              id="new-link-note"
              value={context}
              maxLength={MAX_LINK_CONTEXT_LENGTH}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Official Google guide on responding to reviews"
              className={inputClass}
            />
          </div>

          <button
            type="button"
            onClick={addLink}
            disabled={!url.trim() || fetching}
            className="text-sm font-bold text-emerald-600 hover:text-emerald-700 disabled:opacity-40"
          >
            + Add link
          </button>
        </div>
      )}
    </fieldset>
  );
}
