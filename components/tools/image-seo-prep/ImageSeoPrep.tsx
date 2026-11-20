"use client";

import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import DropZone from "../DropZone";
import { ACCEPTED_IMAGES, MAX_IMAGE_BYTES, canvasToBlob, formatBytes, loadImage, makeCanvas, sizeOf, slugify } from "../image-utils";
import { downloadBlob, toCsv } from "../shared";
import { btn, card, errorBox, h2, hint, input, label } from "../ui";

// Image SEO prep: renames photos to descriptive file names, resizes and compresses them,
// checks they're big enough for zoom, and collects alt text, all in the browser.

interface Item {
  id: string;
  file: File;
  preview: string;
  w: number;
  h: number;
  name: string; // file name without extension
  alt: string;
}

const FORMATS = { "image/jpeg": "jpg", "image/webp": "webp" } as const;
type Format = keyof typeof FORMATS;

export default function ImageSeoPrep() {
  const [items, setItems] = useState<Item[]>([]);
  const [base, setBase] = useState("");
  const [maxWidth, setMaxWidth] = useState(1600);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<Format>("image/jpeg");
  const [zoom, setZoom] = useState(false);
  const [zoomMin, setZoomMin] = useState(1000);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [estimates, setEstimates] = useState<Record<string, number>>({});

  // Free the preview images when the tool is closed (removed ones are freed as they go).
  const itemsRef = useRef(items);
  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => () => itemsRef.current.forEach((i) => URL.revokeObjectURL(i.preview)), []);

  const addFiles = async (files: File[]) => {
    setError("");
    const added: Item[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_IMAGE_BYTES) { setError(`${file.name} is over 40 MB, so it was skipped.`); continue; }
      try {
        const img = await loadImage(file);
        const { w, h } = sizeOf(img);
        added.push({ id: Math.random().toString(36).slice(2), file, preview: img.src, w, h, name: slugify(file.name.replace(/\.[^.]+$/, "")), alt: "" });
      } catch {
        setError(`${file.name} couldn't be opened as an image.`);
      }
    }
    setItems((prev) => [...prev, ...added]);
  };

  const applyBase = () => {
    const slug = slugify(base);
    if (!slug) return;
    setItems((prev) => prev.map((it, i) => ({ ...it, name: prev.length === 1 ? slug : `${slug}-${i + 1}` })));
  };

  const render = async (it: Item, width: number | null, q: number) => {
    const img = await loadImage(it.file);
    const scale = width && it.w > width ? width / it.w : 1;
    const { canvas, ctx } = makeCanvas(it.w * scale, it.h * scale);
    if (format === "image/jpeg") { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(img.src);
    return canvasToBlob(canvas, format, q / 100);
  };

  const estimate = async () => {
    setBusy(true);
    const out: Record<string, number> = {};
    for (const it of items) out[it.id] = (await render(it, maxWidth, quality)).size;
    setEstimates(out);
    setBusy(false);
  };

  const download = async () => {
    setBusy(true);
    setError("");
    try {
      const zip = new JSZip();
      const ext = FORMATS[format];
      const used = new Set<string>();
      const rows: string[][] = [["File name", "Alt text", "Width", "Height"]];
      for (const it of items) {
        let name = it.name || "image";
        let n = 2;
        while (used.has(name)) name = `${it.name}-${n++}`;
        used.add(name);
        zip.file(`${name}.${ext}`, await render(it, maxWidth, quality));
        if (zoom) zip.file(`zoom/${name}-zoom.${ext}`, await render(it, null, 92));
        const scale = it.w > maxWidth ? maxWidth / it.w : 1;
        rows.push([`${name}.${ext}`, it.alt, String(Math.round(it.w * scale)), String(Math.round(it.h * scale))]);
      }
      zip.file("alt-text.csv", toCsv(rows));
      downloadBlob("seo-images.zip", await zip.generateAsync({ type: "blob" }));
    } catch {
      setError("Something went wrong making the zip. Try fewer images at once.");
    }
    setBusy(false);
  };

  const missingAlt = items.filter((i) => !i.alt.trim()).length;

  return (
    <div className="space-y-6">
      <DropZone accept={ACCEPTED_IMAGES} multiple onFiles={addFiles} title="Drop your photos here" hint="JPG, PNG, WebP. As many as you like." />
      {error && <p className={errorBox}>{error}</p>}

      {items.length > 0 && (
        <>
          <section className={card} aria-labelledby="isp-settings">
            <h2 id="isp-settings" className={h2}>Settings</h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="sm:col-span-2">
                <label className={label} htmlFor="isp-base">Name them all (what&apos;s in the photo + where)</label>
                <div className="flex gap-2">
                  <input id="isp-base" className={input} value={base} onChange={(e) => setBase(e.target.value)} placeholder="e.g. boiler repair leeds" />
                  <button type="button" className={btn} onClick={applyBase} disabled={!slugify(base)}>Apply</button>
                </div>
                <p className={hint}>Becomes boiler-repair-leeds-1, boiler-repair-leeds-2 and so on. You can still edit each one below.</p>
              </div>
              <div>
                <label className={label} htmlFor="isp-width">Maximum width: {maxWidth}px</label>
                <input id="isp-width" type="range" min={600} max={3000} step={100} value={maxWidth} onChange={(e) => setMaxWidth(Number(e.target.value))} className="w-full accent-[var(--color-accent)]" />
                <p className={hint}>1,600px suits most websites. Smaller photos aren&apos;t enlarged.</p>
              </div>
              <div>
                <label className={label} htmlFor="isp-q">Quality: {quality}%</label>
                <input id="isp-q" type="range" min={40} max={95} step={5} value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-[var(--color-accent)]" />
                <p className={hint}>75 to 85% looks the same to most people at a fraction of the size.</p>
              </div>
              <div>
                <label className={label} htmlFor="isp-format">Format</label>
                <select id="isp-format" className={input} value={format} onChange={(e) => setFormat(e.target.value as Format)}>
                  <option value="image/jpeg">JPG (works everywhere)</option>
                  <option value="image/webp">WebP (smaller, for websites)</option>
                </select>
              </div>
              <div>
                <label className={label} htmlFor="isp-zoom">Zoom check</label>
                <select id="isp-zoom" className={input} value={zoomMin} onChange={(e) => setZoomMin(Number(e.target.value))}>
                  <option value={1000}>1,000px+ longest side (Amazon zoom)</option>
                  <option value={2000}>2,000px+ (close-up zoom, e.g. jewellery)</option>
                </select>
                <label className="flex items-center gap-2 text-[13px] text-mid mt-2">
                  <input type="checkbox" checked={zoom} onChange={(e) => setZoom(e.target.checked)} /> Also export full-size zoom versions
                </label>
              </div>
            </div>
          </section>

          <ul className="space-y-3">
            {items.map((it, i) => {
              const longest = Math.max(it.w, it.h);
              const zoomOk = longest >= zoomMin;
              return (
                <li key={it.id} className={`${card} flex flex-col sm:flex-row gap-4`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.preview} alt="" className="w-full sm:w-32 h-40 sm:h-32 object-cover rounded-[10px] border border-border flex-shrink-0" />
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-[12.5px] text-muted">
                      <span>{it.file.name}</span>
                      <span>{it.w} × {it.h}px</span>
                      <span>{formatBytes(it.file.size)}{estimates[it.id] ? ` → about ${formatBytes(estimates[it.id])}` : ""}</span>
                      <span className={zoomOk ? "text-accent-dark font-semibold" : "text-warn font-semibold"}>
                        {zoomOk ? "Big enough for zoom" : `Too small for zoom (${longest}px, needs ${zoomMin.toLocaleString()}px)`}
                      </span>
                    </div>
                    <div>
                      <label className={label} htmlFor={`isp-n${i}`}>File name</label>
                      <div className="flex items-center gap-1">
                        <input id={`isp-n${i}`} className={input} value={it.name} onChange={(e) => setItems((p) => p.map((x) => (x.id === it.id ? { ...x, name: slugify(e.target.value) || e.target.value } : x)))} />
                        <span className="text-[13px] text-muted">.{FORMATS[format]}</span>
                      </div>
                    </div>
                    <div>
                      <label className={label} htmlFor={`isp-a${i}`}>Alt text</label>
                      <input id={`isp-a${i}`} className={input} value={it.alt} placeholder="Describe the photo, e.g. New combi boiler fitted in a kitchen in Headingley, Leeds" onChange={(e) => setItems((p) => p.map((x) => (x.id === it.id ? { ...x, alt: e.target.value } : x)))} />
                    </div>
                    <button type="button" className="text-[13px] text-muted hover:text-danger" onClick={() => { URL.revokeObjectURL(it.preview); setItems((p) => p.filter((x) => x.id !== it.id)); }}>Remove</button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className={btn} onClick={download} disabled={busy}>{busy ? "Working…" : `Download ${items.length} image${items.length === 1 ? "" : "s"} (zip)`}</button>
            <button type="button" className="text-[14px] font-semibold text-accent-dark underline" onClick={estimate} disabled={busy}>Show new file sizes</button>
            {missingAlt > 0 && <span className="text-[13px] text-warn">{missingAlt} without alt text</span>}
          </div>
          <p className={hint}>The zip includes alt-text.csv, a list of every file name with its alt text to paste in when you upload.</p>
        </>
      )}
    </div>
  );
}
