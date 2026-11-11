// Rules for tip images, shared by the admin upload field (TipImageField), the server action that
// hands out upload links (app/admin/blog/[id]/tips/image-upload-action.ts) and the save actions.
//
// Why uploads go browser → Supabase directly: Vercel rejects any request body over 4.5MB before
// our code even runs, so a big GIF sent through a Server Action fails with "This page couldn't
// load". Instead the server (after checking you're an admin) creates a one-time signed upload
// link, the browser uploads straight to Supabase Storage, and the form only submits the URL.

export const TIP_IMAGE_BUCKET = "blog-images";

// Extension is chosen from the MIME type, never from the uploaded file name.
export const TIP_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const TIP_IMAGE_MAX_BYTES = 25 * 1024 * 1024; // 25MB, big enough for a screen-recording GIF

// Public URL prefix for files in the bucket. Anything saved as a tip image must start with this,
// so a tampered form can't make a tip point at an image hosted somewhere else.
export function tipImageUrlPrefix(): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${TIP_IMAGE_BUCKET}/`;
}

// Reads the "image_url" field from the tip form. Returns the URL if it's one of ours, else null.
export function parseTipImageUrl(formData: FormData): string | null {
  const url = ((formData.get("image_url") as string) ?? "").trim();
  if (!url) return null;
  const prefix = tipImageUrlPrefix();
  if (!url.startsWith(prefix)) return null;
  if (!/^[A-Za-z0-9._-]+$/.test(url.slice(prefix.length))) return null;
  return url;
}
