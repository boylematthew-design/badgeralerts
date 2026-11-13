// Rules for tip images, shared by the admin upload field (TipImagesField), the server action that
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

export interface TipImage {
  url: string;
  alt: string;
  caption: string;
}

export const MAX_TIP_IMAGES = 10;
export const MAX_IMAGE_ALT_LENGTH = 250;
export const MAX_IMAGE_CAPTION_LENGTH = 300;

// True if the URL is a file in our own bucket (not an image hosted somewhere else).
export function isOwnTipImageUrl(url: string): boolean {
  const prefix = tipImageUrlPrefix();
  return url.startsWith(prefix) && /^[A-Za-z0-9._-]+$/.test(url.slice(prefix.length));
}

// The admin form sends the images as JSON in a hidden "images" field, in display order. Returns the
// cleaned list, or null if what was submitted isn't valid. Never trust the browser: someone could
// post the form directly, so everything is re-checked here before saving.
export function parseTipImages(formData: FormData): TipImage[] | null {
  const raw = (formData.get("images") as string) ?? "";
  if (!raw.trim()) return [];

  let input: unknown;
  try {
    input = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(input) || input.length > MAX_TIP_IMAGES) return null;

  const images: TipImage[] = [];
  for (const item of input) {
    if (typeof item !== "object" || item === null) return null;
    const { url, alt, caption } = item as { url?: unknown; alt?: unknown; caption?: unknown };
    if (typeof url !== "string" || typeof alt !== "string" || typeof caption !== "string") return null;
    const cleanUrl = url.trim();
    const cleanAlt = alt.trim();
    const cleanCaption = caption.trim();
    if (!isOwnTipImageUrl(cleanUrl)) return null;
    if (cleanAlt.length > MAX_IMAGE_ALT_LENGTH || cleanCaption.length > MAX_IMAGE_CAPTION_LENGTH) return null;
    images.push({ url: cleanUrl, alt: cleanAlt, caption: cleanCaption });
  }
  return images;
}

// A tip's images for display. Falls back to the old single-image columns for any tip saved before
// the carousel existed (migration 013 copies them across, this is just a safety net).
export function tipImagesOf(tip: {
  images?: TipImage[] | null;
  image_url?: string | null;
  image_alt?: string | null;
  image_caption?: string | null;
}): TipImage[] {
  if (tip.images && tip.images.length > 0) return tip.images;
  if (tip.image_url) return [{ url: tip.image_url, alt: tip.image_alt ?? "", caption: tip.image_caption ?? "" }];
  return [];
}
