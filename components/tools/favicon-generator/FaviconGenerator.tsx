"use client";

import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import DropZone from "../DropZone";
import { ACCEPTED_IMAGES, MAX_IMAGE_BYTES, buildIco, canvasToBlob, drawFitted, loadImage, makeCanvas } from "../image-utils";
import { CodeOutput, downloadBlob } from "../shared";
import { btn, card, errorBox, h2, hint, input, label, tabBtn } from "../ui";

// Favicon generator: turns a logo into every favicon file browsers and phones ask for, plus the
// web manifest and the HTML tags, zipped. Drawn on a canvas in the browser.

interface Options { bg: string; transparent: boolean; padding: number; rounded: boolean; appName: string }

const FILES = [
  { name: "favicon-16x16.png", size: 16, solid: false },
  { name: "favicon-32x32.png", size: 32, solid: false },
  { name: "favicon-48x48.png", size: 48, solid: false },
  { name: "apple-touch-icon.png", size: 180, solid: true },
  { name: "android-chrome-192x192.png", size: 192, solid: false },
  { name: "android-chrome-512x512.png", size: 512, solid: false },
];

function render(img: HTMLImageElement, size: number, o: Options, forceSolid: boolean) {
  const { canvas, ctx } = makeCanvas(size, size);
  const solid = forceSolid || !o.transparent;
  if (solid) {
    ctx.fillStyle = o.bg;
    if (o.rounded && !forceSolid) {
      const r = size * 0.2;
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, r);
      ctx.fill();
    } else ctx.fillRect(0, 0, size, size);
  }
  // Tiny sizes get less padding so the logo stays readable.
  const pad = Math.round(size * (size <= 32 ? Math.min(o.padding, 6) : o.padding) / 100);
  drawFitted(ctx, img, size, size, "contain", pad);
  return canvas;
}

export default function FaviconGenerator() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [o, setO] = useState<Options>({ bg: "#FFFFFF", transparent: true, padding: 8, rounded: false, appName: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const set = (patch: Partial<Options>) => setO((x) => ({ ...x, ...patch }));

  useEffect(() => {
    if (!img || !previewRef.current) return;
    const nodes = [16, 32, 180, 512].map((s) => {
      const c = render(img, s, o, s === 180);
      c.style.width = `${s === 512 ? 96 : s === 180 ? 64 : Math.max(s, 16) * 2}px`;
      c.style.height = c.style.width;
      c.style.imageRendering = s <= 32 ? "pixelated" : "auto";
      c.className = "rounded border border-border bg-surface";
      c.setAttribute("role", "img");
      c.setAttribute("aria-label", `${s} pixel preview`);
      return c;
    });
    previewRef.current.replaceChildren(...nodes);
  }, [img, o]);

  const open = async (files: File[]) => {
    setError("");
    if (files[0].size > MAX_IMAGE_BYTES) return setError("That file is over 40 MB.");
    try { setImg(await loadImage(files[0])); } catch { setError("That file couldn't be opened as an image."); }
  };

  const manifest = JSON.stringify({
    name: o.appName || "My website",
    short_name: o.appName || "My website",
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: o.bg,
    background_color: o.bg,
    display: "standalone",
  }, null, 2);

  const tags = `<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

  const download = async () => {
    if (!img) return;
    setBusy(true);
    const zip = new JSZip();
    const blobs: Record<number, Blob> = {};
    for (const f of FILES) {
      const blob = await canvasToBlob(render(img, f.size, o, f.solid), "image/png");
      blobs[f.size] = blob;
      zip.file(f.name, blob);
    }
    zip.file("favicon.ico", await buildIco([16, 32, 48].map((size) => ({ size, blob: blobs[size] }))));
    zip.file("site.webmanifest", manifest);
    zip.file("add-to-your-head.html", tags + "\n");
    downloadBlob("favicons.zip", await zip.generateAsync({ type: "blob" }));
    setBusy(false);
  };

  if (!img) {
    return (
      <div className="space-y-4">
        <DropZone accept={ACCEPTED_IMAGES} onFiles={open} title="Drop in your logo" hint="A square PNG or SVG works best, at least 512 × 512px." />
        {error && <p className={errorBox}>{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className={card} aria-labelledby="fg-prev">
        <h2 id="fg-prev" className={h2}>Preview</h2>
        <div ref={previewRef} className="flex flex-wrap items-end gap-5 mt-4" />
        <p className={hint}>16px and 32px shown enlarged so you can check they&apos;re readable. If the logo is too detailed at 16px, try just the icon or first letter.</p>
      </section>
      <section className={`${card} grid sm:grid-cols-2 gap-4`} aria-labelledby="fg-opts">
        <h2 id="fg-opts" className={`${h2} sm:col-span-2`}>Options</h2>
        <div>
          <span className={label}>Background</span>
          <div className="flex flex-wrap gap-2 items-center">
            <button type="button" className={tabBtn(o.transparent)} aria-pressed={o.transparent} onClick={() => set({ transparent: true })}>Transparent</button>
            <button type="button" className={tabBtn(!o.transparent)} aria-pressed={!o.transparent} onClick={() => set({ transparent: false })}>Colour</button>
            <input aria-label="Background colour" type="color" value={o.bg} onChange={(e) => set({ bg: e.target.value })} className="h-9 w-14 rounded border border-border-strong" />
          </div>
          <p className={hint}>The Apple icon always gets the colour, as iPhones fill transparency with black.</p>
        </div>
        <div>
          <label className={label} htmlFor="fg-pad">Padding: {o.padding}%</label>
          <input id="fg-pad" type="range" min={0} max={25} value={o.padding} onChange={(e) => set({ padding: Number(e.target.value) })} className="w-full accent-[var(--color-accent)]" />
          {!o.transparent && (
            <label className="flex items-center gap-2 text-[13px] text-mid mt-2">
              <input type="checkbox" checked={o.rounded} onChange={(e) => set({ rounded: e.target.checked })} /> Rounded corners
            </label>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className={label} htmlFor="fg-name">Website name (for the web manifest)</label>
          <input id="fg-name" className={input} value={o.appName} onChange={(e) => set({ appName: e.target.value })} placeholder="e.g. Leeds Plumbing Co" />
        </div>
        <div className="sm:col-span-2 flex flex-wrap gap-3 items-center">
          <button type="button" className={btn} onClick={download} disabled={busy}>{busy ? "Working…" : "Download favicon files (zip)"}</button>
          <button type="button" className="text-[13px] text-muted hover:text-ink" onClick={() => setImg(null)}>Use a different logo</button>
        </div>
      </section>
      <section className={card}>
        <h2 className={h2}>Then add this to your site</h2>
        <p className="text-[14px] text-mid mt-2">Upload the files to the top folder of your website, then paste these tags into the &lt;head&gt;. On WordPress, Wix, Squarespace or Shopify, upload the 512px file in the site settings instead.</p>
        <CodeOutput title="HTML tags" code={tags} />
      </section>
    </div>
  );
}
