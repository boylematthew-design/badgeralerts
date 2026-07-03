"use client";

import { useState, useRef } from "react";

interface TipLink {
  id: string;
  url: string;
  context: string | null;
  preview_title: string | null;
  preview_description: string | null;
  preview_favicon: string | null;
}

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

export default function TipLinksManager({
  tipId,
  initialLinks,
}: {
  tipId: string;
  initialLinks: TipLink[];
}) {
  const [links, setLinks] = useState<TipLink[]>(initialLinks);
  const [url, setUrl] = useState("");
  const [context, setContext] = useState("");
  const [preview, setPreview] = useState<LinkPreview | null>(null);
  const [fetching, setFetching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function loadPreview(rawUrl: string) {
    const trimmed = rawUrl.trim();
    if (!trimmed || !trimmed.startsWith("http")) {
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
      const data = await res.json();
      setPreview(data);
    } catch {
      setFetchError("Couldn't load a preview — check the URL is a public page.");
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

  async function addLink() {
    const trimmed = url.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      const res = await fetch("/api/tip-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tip_id: tipId,
          url: trimmed,
          context: context.trim() || null,
          preview_title: preview?.title || null,
          preview_description: preview?.description || null,
          preview_favicon: preview?.favicon || null,
        }),
      });
      if (!res.ok) throw new Error();
      const newLink = await res.json();
      setLinks((prev) => [...prev, newLink]);
      setUrl("");
      setContext("");
      setPreview(null);
    } catch {
      alert("Failed to save link. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteLink(id: string) {
    if (!confirm("Remove this link?")) return;
    const res = await fetch(`/api/tip-links/${id}`, { method: "DELETE" });
    if (res.ok) {
      setLinks((prev) => prev.filter((l) => l.id !== id));
    }
  }

  return (
    <div className="mt-10 border-t border-slate-200 pt-8">
      <h2 className="text-base font-bold text-slate-900 mb-1">Relevant links</h2>
      <p className="text-sm text-slate-500 mb-5">
        Add helpful links shown below this tip on the public guide page. Paste a URL and the title and icon are fetched automatically.
      </p>

      {links.length > 0 && (
        <div className="space-y-2 mb-6">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {link.preview_favicon && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={link.preview_favicon}
                      alt=""
                      className="w-4 h-4 rounded-sm shrink-0"
                      onError={(e) => (e.currentTarget.style.display = "none")}
                    />
                  )}
                  <span className="text-xs text-slate-400 truncate">{getDomain(link.url)}</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {link.preview_title || link.url}
                </p>
                {link.context && (
                  <p className="text-xs text-slate-500 mt-0.5 italic">"{link.context}"</p>
                )}
              </div>
              <button
                onClick={() => deleteLink(link.id)}
                className="text-xs text-red-400 hover:text-red-600 shrink-0 mt-0.5 transition"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/article"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {fetching && (
          <p className="text-xs text-slate-400">Fetching preview…</p>
        )}

        {fetchError && (
          <p className="text-xs text-red-500">{fetchError}</p>
        )}

        {preview && (
          <div className="border border-slate-200 rounded-lg px-4 py-3 bg-slate-50 flex items-start gap-2.5">
            {preview.favicon && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview.favicon}
                alt=""
                className="w-4 h-4 rounded-sm shrink-0 mt-0.5"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
            <div className="min-w-0">
              <p className="text-xs text-slate-400 mb-0.5">{preview.domain}</p>
              <p className="text-sm font-semibold text-slate-800 leading-snug">
                {preview.title || url}
              </p>
              {preview.description && (
                <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                  {preview.description}
                </p>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1.5">
            Your note <span className="text-slate-400 font-normal">(optional — why this link is useful)</span>
          </label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. Official Google guide on responding to reviews"
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          type="button"
          onClick={addLink}
          disabled={saving || !url.trim()}
          className="w-full py-2.5 text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition disabled:opacity-50"
        >
          {saving ? "Saving…" : "Add link"}
        </button>
      </div>
    </div>
  );
}
