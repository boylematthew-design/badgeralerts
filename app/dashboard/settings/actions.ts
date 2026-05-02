"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function updateFullName(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const fullName = (formData.get("full_name") as string)?.trim();
  if (!fullName) redirect("/dashboard/settings");

  await supabase.from("users").update({ full_name: fullName }).eq("id", user.id);
  redirect("/dashboard/settings?saved=1");
}
