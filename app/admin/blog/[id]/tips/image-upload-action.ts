"use server";

import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { TIP_IMAGE_BUCKET, TIP_IMAGE_MAX_BYTES, TIP_IMAGE_TYPES } from "@/lib/tip-image";

type Result =
  | { ok: true; path: string; token: string; publicUrl: string }
  | { ok: false; error: string };

// Gives an admin a one-time link to upload a single tip image straight to Supabase Storage.
// Security: only a signed-in admin gets a link; type and size are checked here on the server;
// the file name is generated here (random), so the browser can't choose where it writes.
export async function createTipImageUpload(contentType: string, size: number): Promise<Result> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You're signed out. Sign in again and retry." };

  const { data: profile } = await supabase.from("users").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return { ok: false, error: "Only admins can upload images." };

  const ext = TIP_IMAGE_TYPES[contentType];
  if (!ext) return { ok: false, error: "Use a JPG, PNG, WebP or GIF." };
  if (!Number.isFinite(size) || size <= 0 || size > TIP_IMAGE_MAX_BYTES) {
    return { ok: false, error: "That file is too big. The limit is 25MB." };
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const path = `${Date.now()}-${randomUUID()}.${ext}`;
  const { data, error } = await admin.storage.from(TIP_IMAGE_BUCKET).createSignedUploadUrl(path);
  if (error || !data) return { ok: false, error: "Couldn't start the upload. Try again." };

  const { data: urlData } = admin.storage.from(TIP_IMAGE_BUCKET).getPublicUrl(path);
  return { ok: true, path, token: data.token, publicUrl: urlData.publicUrl };
}
