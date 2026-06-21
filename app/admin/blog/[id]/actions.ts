"use server";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function getAdminSupabase() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("users").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function deleteGuide(formData: FormData) {
  const guideId = formData.get("guide_id") as string;
  if (!guideId) return;

  const admin = await getAdminSupabase();
  if (!admin) return;

  const { data: guide } = await admin.from("guides").select("slug").eq("id", guideId).single();

  // Tips are removed automatically via ON DELETE CASCADE
  await admin.from("guides").delete().eq("id", guideId);

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  if (guide?.slug) revalidatePath(`/blog/${guide.slug}`);

  redirect("/admin/blog");
}

export async function deleteTip(formData: FormData) {
  const tipId = formData.get("tip_id") as string;
  const guideId = formData.get("guide_id") as string;
  if (!tipId || !guideId) return;

  const admin = await getAdminSupabase();
  if (!admin) return;

  const { data: guide } = await admin.from("guides").select("slug").eq("id", guideId).single();

  await admin.from("tips").delete().eq("id", tipId);

  await admin.from("guides").update({ updated_at: new Date().toISOString() }).eq("id", guideId);

  revalidatePath(`/admin/blog/${guideId}`);
  revalidatePath("/blog");
  if (guide?.slug) revalidatePath(`/blog/${guide.slug}`);
}

export async function createSection(formData: FormData) {
  const guideId = formData.get("guide_id") as string;
  const title = (formData.get("title") as string)?.trim();
  if (!guideId || !title) return;

  const admin = await getAdminSupabase();
  if (!admin) return;

  const { data: maxSection } = await admin
    .from("tip_sections")
    .select("sort_order")
    .eq("guide_id", guideId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (maxSection?.sort_order ?? 0) + 1;

  const description = (formData.get("description") as string)?.trim() || null;

  await admin.from("tip_sections").insert({
    guide_id: guideId,
    title,
    description,
    sort_order: nextOrder,
  });

  const { data: guide } = await admin.from("guides").select("slug").eq("id", guideId).single();

  revalidatePath(`/admin/blog/${guideId}`);
  revalidatePath("/blog");
  if (guide?.slug) revalidatePath(`/blog/${guide.slug}`);
}

export async function updateSection(formData: FormData) {
  const sectionId = formData.get("section_id") as string;
  const guideId = formData.get("guide_id") as string;
  const title = (formData.get("title") as string)?.trim();
  if (!sectionId || !guideId || !title) return;

  const admin = await getAdminSupabase();
  if (!admin) return;

  const description = (formData.get("description") as string)?.trim() || null;

  await admin.from("tip_sections").update({ title, description }).eq("id", sectionId);

  const { data: guide } = await admin.from("guides").select("slug").eq("id", guideId).single();

  revalidatePath(`/admin/blog/${guideId}`);
  revalidatePath("/blog");
  if (guide?.slug) revalidatePath(`/blog/${guide.slug}`);
}

export async function deleteSection(formData: FormData) {
  const sectionId = formData.get("section_id") as string;
  const guideId = formData.get("guide_id") as string;
  if (!sectionId || !guideId) return;

  const admin = await getAdminSupabase();
  if (!admin) return;

  // Tips in this section become unsectioned (ON DELETE SET NULL), not deleted
  await admin.from("tip_sections").delete().eq("id", sectionId);

  const { data: guide } = await admin.from("guides").select("slug").eq("id", guideId).single();

  revalidatePath(`/admin/blog/${guideId}`);
  revalidatePath("/blog");
  if (guide?.slug) revalidatePath(`/blog/${guide.slug}`);
}

export async function reorderTips(
  guideId: string,
  orderedItems: Array<{ tipId: string; sectionId: string | null; sortOrder: number }>
) {
  const admin = await getAdminSupabase();
  if (!admin) return { error: "Unauthorized" };

  // Validate all tips belong to this guide
  const { data: guideTips } = await admin
    .from("tips")
    .select("id")
    .eq("guide_id", guideId);

  const validTipIds = new Set(guideTips?.map((t) => t.id) ?? []);
  const allValid = orderedItems.every((item) => validTipIds.has(item.tipId));
  if (!allValid) return { error: "Invalid tip IDs" };

  for (const item of orderedItems) {
    await admin
      .from("tips")
      .update({ section_id: item.sectionId, sort_order: item.sortOrder })
      .eq("id", item.tipId);
  }

  await admin.from("guides").update({ updated_at: new Date().toISOString() }).eq("id", guideId);

  const { data: guide } = await admin.from("guides").select("slug").eq("id", guideId).single();

  revalidatePath(`/admin/blog/${guideId}`);
  revalidatePath("/blog");
  if (guide?.slug) revalidatePath(`/blog/${guide.slug}`);

  return { success: true };
}

export async function reorderSections(
  guideId: string,
  orderedSections: Array<{ sectionId: string; sortOrder: number }>
) {
  const admin = await getAdminSupabase();
  if (!admin) return { error: "Unauthorized" };

  // Validate all sections belong to this guide
  const { data: guideSections } = await admin
    .from("tip_sections")
    .select("id")
    .eq("guide_id", guideId);

  const validSectionIds = new Set(guideSections?.map((s) => s.id) ?? []);
  const allValid = orderedSections.every((item) => validSectionIds.has(item.sectionId));
  if (!allValid) return { error: "Invalid section IDs" };

  for (const item of orderedSections) {
    await admin
      .from("tip_sections")
      .update({ sort_order: item.sortOrder })
      .eq("id", item.sectionId);
  }

  const { data: guide } = await admin.from("guides").select("slug").eq("id", guideId).single();

  revalidatePath(`/admin/blog/${guideId}`);
  revalidatePath("/blog");
  if (guide?.slug) revalidatePath(`/blog/${guide.slug}`);

  return { success: true };
}
