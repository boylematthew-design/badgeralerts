import type { SupabaseClient } from "@supabase/supabase-js";
import { tipIdsForTool } from "@/lib/tool-tips";
import { TIP_TOOL_LINKS } from "@/lib/tool-tips";
import { fetchPublishedGuides, guidePath } from "@/lib/blog-guides";

export interface RelatedTip {
  id: string;
  title: string;
  note: string;
  guideTitle: string;
  href: string; // guide address plus #tip-N, so the link lands on the tip itself
}

// The published tips a tool helps with, each linking straight to its spot in the guide.
// Tip numbers aren't stored: they come from the tip's position on the guide page, so this
// works them out the same way the guide page does (tips outside a section first, then each
// section in order), which keeps the #tip-N links right after tips are reordered.
export async function fetchRelatedTips(supabase: SupabaseClient, toolSlug: string): Promise<RelatedTip[]> {
  const ids = tipIdsForTool(toolSlug);
  if (ids.length === 0) return [];

  const [guides, { data: tips }] = await Promise.all([
    fetchPublishedGuides(supabase),
    supabase.from("tips").select("id, title, guide_id").in("id", ids).eq("published", true),
  ]);
  if (!tips || tips.length === 0) return [];

  const guideIds = [...new Set(tips.map((t) => t.guide_id))].filter((id) => guides.some((g) => g.id === id));
  if (guideIds.length === 0) return [];

  const [{ data: allTips }, { data: sections }] = await Promise.all([
    supabase
      .from("tips")
      .select("id, guide_id, section_id, sort_order")
      .in("guide_id", guideIds)
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("tip_sections")
      .select("id, guide_id, sort_order")
      .in("guide_id", guideIds)
      .order("sort_order", { ascending: true }),
  ]);

  const numberOf = new Map<string, number>();
  for (const guideId of guideIds) {
    const guideTips = (allTips ?? []).filter((t) => t.guide_id === guideId);
    const guideSections = (sections ?? []).filter((s) => s.guide_id === guideId);
    const ordered = guideSections.length === 0
      ? guideTips
      : [
          ...guideTips.filter((t) => !t.section_id),
          ...guideSections.flatMap((s) => guideTips.filter((t) => t.section_id === s.id)),
        ];
    ordered.forEach((t, i) => numberOf.set(t.id, i + 1));
  }

  return tips
    .filter((t) => numberOf.has(t.id))
    .map((t) => {
      const guide = guides.find((g) => g.id === t.guide_id)!;
      return {
        id: t.id,
        title: t.title,
        note: TIP_TOOL_LINKS[t.id]?.note ?? "",
        guideTitle: guide.title,
        href: `${guidePath(guide, guides)}#tip-${numberOf.get(t.id)}`,
      };
    })
    .sort((a, b) => a.guideTitle.localeCompare(b.guideTitle) || a.title.localeCompare(b.title));
}
