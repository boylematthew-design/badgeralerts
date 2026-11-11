"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase";
import { TIP_IMAGE_BUCKET, TIP_IMAGE_MAX_BYTES, TIP_IMAGE_TYPES } from "@/lib/tip-image";
import { createTipImageUpload } from "./image-upload-action";

// Tip image picker, shared by "Add a tip" and "Edit tip". The file uploads to Supabase Storage as
// soon as it's picked (see lib/tip-image.ts for why), and only the resulting URL goes in the form
// as "image_url". While an upload is running, or if it failed, the form won't submit.
export default function TipImageField({ initialUrl = null }: { initialUrl?: string | null }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState<string | null>(initialUrl);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [message, setMessage] = useState("");

  function block(msg: string) {
    fileRef.current?.setCustomValidity(msg);
  }

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const fail = (msg: string) => {
      setStatus("error");
      setMessage(msg);
      block(msg);
    };

    if (!TIP_IMAGE_TYPES[file.type]) return fail("Use a JPG, PNG, WebP or GIF.");
    if (file.size > TIP_IMAGE_MAX_BYTES) return fail("That file is too big. The limit is 25MB.");

    setStatus("uploading");
    setMessage(`Uploading ${file.name}…`);
    block("Wait for the image to finish uploading.");

    const ticket = await createTipImageUpload(file.type, file.size);
    if (!ticket.ok) return fail(ticket.error);

    const { error } = await createClient()
      .storage.from(TIP_IMAGE_BUCKET)
      .uploadToSignedUrl(ticket.path, ticket.token, file, { contentType: file.type });
    if (error) return fail("Upload failed. Check your connection and try again.");

    setUrl(ticket.publicUrl);
    setStatus("idle");
    setMessage("");
    block("");
  }

  function remove() {
    setUrl(null);
    setStatus("idle");
    setMessage("");
    block("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div>
      <label htmlFor="tip-image" className="block text-sm font-bold text-slate-700 mb-2">
        Image <span className="text-slate-400 font-normal">(optional)</span>
      </label>
      {url && (
        <div className="mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Current image" className="w-full rounded-xl border border-slate-200" />
          <button type="button" onClick={remove} className="mt-2 text-xs font-bold text-red-600 hover:underline">
            Remove image
          </button>
        </div>
      )}
      <input type="hidden" name="image_url" value={url ?? ""} />
      {/* No name attribute, so the file itself is never sent with the form. */}
      <input
        ref={fileRef}
        id="tip-image"
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.gif,image/jpeg,image/png,image/webp,image/gif"
        onChange={handleChange}
        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100 transition"
      />
      {message ? (
        <p role="status" className={`text-xs mt-1.5 ${status === "error" ? "text-red-600" : "text-slate-500"}`}>
          {message}
        </p>
      ) : (
        <p className="text-xs text-slate-400 mt-1.5">
          JPG, PNG, WebP or GIF, up to 25MB. {url ? "Pick a new file to replace the current image." : ""}
        </p>
      )}
    </div>
  );
}
