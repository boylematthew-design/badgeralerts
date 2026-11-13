"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import {
  MAX_IMAGE_ALT_LENGTH,
  MAX_IMAGE_CAPTION_LENGTH,
  MAX_TIP_IMAGES,
  TIP_IMAGE_BUCKET,
  TIP_IMAGE_MAX_BYTES,
  TIP_IMAGE_TYPES,
  type TipImage,
} from "@/lib/tip-image";
import { createTipImageUpload } from "./image-upload-action";

const SHARP_MIN_WIDTH = 1440;

// Reads an image file's pixel width in the browser (null if it can't be read).
function imageWidth(file: File): Promise<number | null> {
  return new Promise((resolve) => {
    const src = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { resolve(img.naturalWidth); URL.revokeObjectURL(src); };
    img.onerror = () => { resolve(null); URL.revokeObjectURL(src); };
    img.src = src;
  });
}

const inputClass =
  "w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white";

// Tip images picker, shared by "Add a tip" and "Edit tip". Several images can be picked at once;
// with more than one, the guide page shows them as a swipeable carousel in this order. Each file
// uploads to Supabase Storage as soon as it's picked (see lib/tip-image.ts for why), and only the
// list of URLs + alt text + captions goes in the form, as JSON in a hidden "images" field.
// While uploads are running the form won't submit.
export default function TipImagesField({ initial }: { initial?: TipImage[] | null }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<TipImage[]>(initial ?? []);
  const [uploading, setUploading] = useState(0);
  const [messages, setMessages] = useState<{ text: string; error: boolean }[]>([]);

  const full = images.length >= MAX_TIP_IMAGES;

  // Blocks the form from submitting while any upload is still running.
  useEffect(() => {
    fileRef.current?.setCustomValidity(uploading > 0 ? "Wait for the images to finish uploading." : "");
  }, [uploading]);

  function update(index: number, next: Partial<TipImage>) {
    setImages((current) => current.map((img, i) => (i === index ? { ...img, ...next } : img)));
  }

  function move(index: number, by: -1 | 1) {
    setImages((current) => {
      const target = index + by;
      if (target < 0 || target >= current.length) return current;
      const copy = [...current];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }

  async function uploadOne(file: File): Promise<{ image?: TipImage; message?: { text: string; error: boolean } }> {
    if (!TIP_IMAGE_TYPES[file.type]) return { message: { text: `${file.name}: use a JPG, PNG, WebP or GIF.`, error: true } };
    if (file.size > TIP_IMAGE_MAX_BYTES) return { message: { text: `${file.name}: too big. The limit is 25MB.`, error: true } };

    const ticket = await createTipImageUpload(file.type, file.size);
    if (!ticket.ok) return { message: { text: `${file.name}: ${ticket.error}`, error: true } };

    const { error } = await createClient()
      .storage.from(TIP_IMAGE_BUCKET)
      .uploadToSignedUrl(ticket.path, ticket.token, file, { contentType: file.type });
    if (error) return { message: { text: `${file.name}: upload failed. Check your connection and try again.`, error: true } };

    // Warn (don't block) when the image is too small to look sharp. Tip images show up to 720px
    // wide, and phones/retina screens need double that in real pixels to look crisp.
    const width = await imageWidth(file);
    const message =
      width && width < SHARP_MIN_WIDTH
        ? { text: `${file.name} is only ${width}px wide so it may look small or soft. For a sharp result, use the original (at least ${SHARP_MIN_WIDTH}px wide).`, error: false }
        : undefined;
    return { image: { url: ticket.publicUrl, alt: "", caption: "" }, message };
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (picked.length === 0) return;

    const room = MAX_TIP_IMAGES - images.length;
    const files = picked.slice(0, room);
    const notes: { text: string; error: boolean }[] = [];
    if (picked.length > room) {
      notes.push({ text: `Only ${MAX_TIP_IMAGES} images per tip, so ${picked.length - room} weren't added.`, error: true });
    }

    setUploading((n) => n + files.length);
    setMessages([{ text: `Uploading ${files.length} image${files.length === 1 ? "" : "s"}…`, error: false }]);

    // Upload in parallel, then add them in the order they were picked.
    const results = await Promise.all(files.map(uploadOne));
    const added = results.flatMap((r) => (r.image ? [r.image] : []));
    for (const r of results) if (r.message) notes.push(r.message);

    setImages((current) => [...current, ...added].slice(0, MAX_TIP_IMAGES));
    setUploading((n) => n - files.length);
    setMessages(notes);
  }

  return (
    <fieldset className="border border-slate-200 rounded-2xl p-5 space-y-4">
      <legend className="px-2 text-sm font-bold text-slate-700">
        Images <span className="text-slate-400 font-normal">(optional, up to {MAX_TIP_IMAGES})</span>
      </legend>
      <p className="text-xs text-slate-500 -mt-1">
        One image shows on its own. Two or more show as a swipeable carousel, in the order below.
      </p>

      <input type="hidden" name="images" value={JSON.stringify(images)} />

      {images.map((img, i) => (
        <div key={img.url} className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-slate-700">Image {i + 1}</span>
            <div className="flex items-center gap-3 text-xs font-bold">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-slate-600 hover:text-slate-900 disabled:opacity-30">
                Move up
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === images.length - 1} className="text-slate-600 hover:text-slate-900 disabled:opacity-30">
                Move down
              </button>
              <button type="button" onClick={() => setImages((c) => c.filter((_, j) => j !== i))} className="text-red-600 hover:underline">
                Remove
              </button>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.url} alt={`Image ${i + 1} preview`} className="w-full max-h-64 object-contain rounded-xl border border-slate-200 bg-slate-50" />
          <div>
            <label htmlFor={`image-alt-${i}`} className="block text-xs font-bold text-slate-700 mb-1">
              Alt text <span className="text-slate-400 font-normal">(for accessibility &amp; SEO)</span>
            </label>
            <input
              id={`image-alt-${i}`}
              value={img.alt}
              maxLength={MAX_IMAGE_ALT_LENGTH}
              onChange={(e) => update(i, { alt: e.target.value })}
              placeholder="e.g. Screenshot of a Google Business Profile review reply"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor={`image-caption-${i}`} className="block text-xs font-bold text-slate-700 mb-1">
              Caption <span className="text-slate-400 font-normal">(optional, shown in italics below the image)</span>
            </label>
            <input
              id={`image-caption-${i}`}
              value={img.caption}
              maxLength={MAX_IMAGE_CAPTION_LENGTH}
              onChange={(e) => update(i, { caption: e.target.value })}
              placeholder="e.g. A Google review reply on a busy café's profile"
              className={inputClass}
            />
          </div>
        </div>
      ))}

      {/* No name attribute, so the files themselves are never sent with the form. */}
      <input
        ref={fileRef}
        id="tip-images"
        type="file"
        multiple
        disabled={full && uploading === 0}
        aria-label="Add images"
        accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
        onChange={handleChange}
        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100 transition disabled:opacity-50"
      />
      {messages.length > 0 ? (
        <div role="status" className="space-y-1">
          {messages.map((m, i) => (
            <p key={i} className={`text-xs ${m.error ? "text-red-600" : "text-slate-500"}`}>{m.text}</p>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-400">
          {full
            ? `That's the maximum of ${MAX_TIP_IMAGES} images. Remove one to add another.`
            : "JPG, PNG, WebP or GIF, up to 25MB each. You can pick several at once. Use full-size screenshots (at least 1,440px wide) so they look sharp."}
        </p>
      )}
    </fieldset>
  );
}
