// Admin form fields for a tip's optional news label. Shared by the "Add a tip" and "Edit tip" pages.
export default function TipNewsFields({
  date,
  headline,
  url,
}: {
  date?: string | null;
  headline?: string | null;
  url?: string | null;
}) {
  const inputClass =
    "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white";

  return (
    <fieldset className="border border-emerald-200 bg-emerald-50/40 rounded-2xl p-5 space-y-4">
      <legend className="px-2 text-sm font-bold text-slate-700">
        News label <span className="text-slate-400 font-normal">(optional)</span>
      </legend>
      <p className="text-xs text-slate-500 -mt-1">
        Shows a dated news headline above the tip, e.g. &ldquo;9 June 2026: Reddit announces verified
        profiles for businesses&rdquo;, linking to the source. Leave the headline blank for no label.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4">
        <div>
          <label htmlFor="news_date" className="block text-sm font-bold text-slate-700 mb-2">Date</label>
          <input id="news_date" type="date" name="news_date" defaultValue={date ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="news_headline" className="block text-sm font-bold text-slate-700 mb-2">Headline</label>
          <input
            id="news_headline"
            name="news_headline"
            maxLength={200}
            defaultValue={headline ?? ""}
            placeholder="e.g. Reddit announces verified profiles for businesses"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="news_url" className="block text-sm font-bold text-slate-700 mb-2">Source link</label>
        <input
          id="news_url"
          type="url"
          name="news_url"
          pattern="https?://.+"
          defaultValue={url ?? ""}
          placeholder="https://redditinc.com/news/..."
          className={inputClass}
        />
        <p className="text-xs text-slate-400 mt-1.5">Must start with https:// (or http://). Opens in a new tab.</p>
      </div>
    </fieldset>
  );
}
