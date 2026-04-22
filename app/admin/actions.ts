"use server";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
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

export async function deletePost(formData: FormData) {
  const postId = formData.get("post_id") as string;
  if (!postId) return;

  const admin = await getAdminSupabase();
  if (!admin) return;

  // Remove all assignments first, then delete the post
  await admin.from("user_posts").delete().eq("post_id", postId);
  await admin.from("posts").delete().eq("id", postId);

  revalidatePath("/admin");
}

export async function removeAssignment(formData: FormData) {
  const assignmentId = formData.get("assignment_id") as string;
  const userId = formData.get("user_id") as string;
  if (!assignmentId) return;

  const admin = await getAdminSupabase();
  if (!admin) return;

  await admin.from("user_posts").delete().eq("id", assignmentId);

  revalidatePath(`/admin/users/${userId}`);
}
