import type { SupabaseClient } from "@supabase/supabase-js";
import type { TipData, SectionData } from "@/components/GuideTips";

// Shared by the public blog page and anywhere else that needs to render a
// guide's tips (e.g. an experimental landing page). Keeping this in one
// place means the query logic can't drift between the two call sites.
export async function fetchGuideTips(
  supabase: SupabaseClient,
  guideId: string,
  { onlyPublishedTips = true }: { onlyPublishedTips?: boolean } = {}
): Promise<{ tips: TipData[]; sections: SectionData[] }> {
  let tipsQuery = supabase
    .from("tips")
    .select("id, title, content, image_url, image_alt, image_caption, section_id")
    .eq("guide_id", guideId)
    .order("sort_order", { ascending: true });

  if (onlyPublishedTips) {
    tipsQuery = tipsQuery.eq("published", true);
  }

  const [{ data: tipsRaw }, { data: sections }] = await Promise.all([
    tipsQuery,
    supabase
      .from("tip_sections")
      .select("id, title, description, sort_order")
      .eq("guide_id", guideId)
      .order("sort_order", { ascending: true }),
  ]);

  const tipIds = (tipsRaw ?? []).map((t) => t.id);
  const { data: allTipLinks } =
    tipIds.length > 0
      ? await supabase
          .from("tip_links")
          .select("id, tip_id, url, context, preview_title, preview_description, preview_favicon, sort_order")
          .in("tip_id", tipIds)
          .order("sort_order", { ascending: true })
      : { data: [] };

  const tips: TipData[] = (tipsRaw ?? []).map((tip) => ({
    ...tip,
    tip_links: (allTipLinks ?? []).filter((l) => l.tip_id === tip.id),
  }));

  return { tips, sections: sections ?? [] };
}
