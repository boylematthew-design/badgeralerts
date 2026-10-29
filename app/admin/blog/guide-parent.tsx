import type { SupabaseClient } from "@supabase/supabase-js";

// Parent guide ("category") picker for the admin "Create new guide" and "Edit guide" forms, plus
// the server-side check behind it. Guides only go one level deep: a parent can't itself have a
// parent, and a guide that already has children can't be moved under another guide.

type ParentOption = { id: string; title: string; site: string };

export async function fetchParentOptions(admin: SupabaseClient, excludeId?: string): Promise<ParentOption[]> {
  let query = admin
    .from("guides")
    .select("id, title, site")
    .is("parent_id", null)
    .order("title", { ascending: true });
  if (excludeId) query = query.neq("id", excludeId);
  const { data } = await query;
  return data ?? [];
}

// Returns the parent id to save (null = top level), or undefined if the choice isn't allowed.
// Never trust the dropdown alone: someone could post the form directly, so everything is re-checked.
export async function validateParent(
  admin: SupabaseClient,
  { formData, site, guideId }: { formData: FormData; site: string; guideId?: string }
): Promise<string | null | undefined> {
  const parentId = ((formData.get("parent_id") as string) || "").trim();
  if (!parentId) return null;
  if (parentId === guideId) return undefined;

  const { data: parent } = await admin.from("guides").select("id, site, parent_id").eq("id", parentId).maybeSingle();
  if (!parent || parent.site !== site || parent.parent_id) return undefined;

  if (guideId) {
    const { count } = await admin.from("guides").select("id", { count: "exact", head: true }).eq("parent_id", guideId);
    if (count) return undefined;
  }

  return parent.id;
}

export function ParentGuideSelect({
  options,
  defaultValue,
  disabledReason,
}: {
  options: ParentOption[];
  defaultValue?: string | null;
  disabledReason?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        Parent guide <span className="text-slate-400 font-normal">(category, optional)</span>
      </label>
      <select
        name="parent_id"
        defaultValue={defaultValue ?? ""}
        disabled={!!disabledReason}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white disabled:bg-slate-50 disabled:text-slate-400"
      >
        <option value="">None — this is a top-level guide</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.title}</option>
        ))}
      </select>
      <p className="text-xs text-slate-400 mt-1.5">
        {disabledReason ??
          "Put this guide under another one, e.g. Google Maps marketing under Local SEO. Its address becomes /blog/parent-slug/this-slug, and the old address redirects automatically."}
      </p>
    </div>
  );
}
