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
