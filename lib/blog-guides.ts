import type { SupabaseClient } from "@supabase/supabase-js";

// Guides can sit under a parent guide (guides.parent_id, see migration 010). A top-level guide
// lives at /blog/{slug}; a child lives at /blog/{parent-slug}/{child-slug}. Every page that links
// to a guide builds the address with guidePath(), so moving a guide in the admin updates every
// link on the site at once, and the old address redirects to the new one.

export interface GuideRef {
  id: string;
  slug: string;
  parent_id: string | null;
}

export function guidePath(guide: GuideRef, allGuides: GuideRef[]): string {
  const parent = guide.parent_id ? allGuides.find((g) => g.id === guide.parent_id) : undefined;
  // A child of an unpublished parent isn't in the public list, so it falls back to /blog/{slug}
  // until the parent goes live.
  return parent ? `/blog/${parent.slug}/${guide.slug}` : `/blog/${guide.slug}`;
}

// Matches a guide by its current slug first, then by any slug it used to have.
export function findGuideBySlug<T extends GuideRef & { previous_slugs?: string[] | null }>(
  guides: T[],
  slug: string
): T | undefined {
  return guides.find((g) => g.slug === slug) ?? guides.find((g) => g.previous_slugs?.includes(slug));
}

// Published badgeralerts guides, parents first, then children grouped under them.
export async function fetchPublishedGuides(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("guides")
    .select("id, slug, title, description, topic_name, parent_id, previous_slugs, updated_at, tips(count)")
    .eq("site", "badgeralerts")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}

// Groups a flat list of guides into parents, each with its children. Children whose parent
// isn't in the list (e.g. an unpublished parent) are shown as top-level.
export function groupGuides<T extends GuideRef>(guides: T[]): (T & { children: T[] })[] {
  const ids = new Set(guides.map((g) => g.id));
  return guides
    .filter((g) => !g.parent_id || !ids.has(g.parent_id))
    .map((parent) => ({ ...parent, children: guides.filter((g) => g.parent_id === parent.id) }));
}

export function tipCount(guide: { tips?: unknown }): number {
  return (guide.tips as { count: number }[] | undefined)?.[0]?.count ?? 0;
}
