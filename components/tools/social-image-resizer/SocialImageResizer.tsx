"use client";

import { useEffect, useRef, useState } from "react";
import JSZip from "jszip";
import DropZone from "../DropZone";
import { ACCEPTED_IMAGES, MAX_IMAGE_BYTES, canvasToBlob, drawFitted, loadImage, makeCanvas, slugify, wrapText } from "../image-utils";
import { downloadBlob } from "../shared";
import { btn, btnGhost, card, errorBox, h2, hint, input, label, tabBtn } from "../ui";

// Social image resizer: one photo in, every platform's size out, with optional padding (so small
// products aren't cropped), a bold text overlay and a corner logo. All drawn on a canvas in the
// browser.

const PRESETS = [
  { id: "og", name: "Link preview (Open Graph)", w: 1200, h: 630, fit: "contain" as const },
  { id: "pinterest", name: "Pinterest pin", w: 1000, h: 1500, fit: "cover" as const },
  { id: "instagram", name: "Instagram portrait", w: 1080, h: 1350, fit: "cover" as const },
  { id: "square", name: "Square post", w: 1080, h: 1080, fit: "cover" as const },
  { id: "tiktok", name: "TikTok / Shorts / Reels cover", w: 1080, h: 1920, fit: "cover" as const },
  { id: "youtube", name: "YouTube thumbnail", w: 1280, h: 720, fit: "cover" as const },
];
type Preset = (typeof PRESETS)[number];

interface Options {
  fit: "cover" | "contain";
  bg: string;
  text: string;
  textPos: "top" | "bottom";
  textSize: number; // % of image width
  textStyle: "band" | "outline";
  logoCorner: "none" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

async function draw(preset: Preset, img: HTMLImageElement, logo: HTMLImageElement | null, o: Options) {
  const { canvas, ctx } = makeCanvas(preset.w, preset.h);
  ctx.fillStyle = o.bg;
  ctx.fillRect(0, 0, preset.w, preset.h);
  drawFitted(ctx, img, preset.w, preset.h, o.fit, o.fit === "contain" ? Math.round(preset.w * 0.04) : 0);

  if (o.text.trim()) {
    const size = Math.round((preset.w * o.textSize) / 100);
    ctx.font = `800 ${size}px Sora, Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const pad = Math.round(preset.w * 0.06);
    const lines = wrapText(ctx, o.text.trim(), preset.w - pad * 2).slice(0, 4);
    const lineH = size * 1.15;
    const blockH = lines.length * lineH + pad * 0.8;
    const top = o.textPos === "top" ? pad * 0.6 : preset.h - blockH - pad * 0.6;
    if (o.textStyle === "band") {
      ctx.fillStyle = "rgba(14,26,20,0.82)";
      ctx.fillRect(0, top, preset.w, blockH);
      ctx.fillStyle = "#FFFFFF";
      lines.forEach((l, i) => ctx.fillText(l, preset.w / 2, top + pad * 0.4 + lineH * (i + 0.5)));
    } else {
      ctx.lineWidth = Math.max(4, size / 7);
      ctx.strokeStyle = "#0E1A14";
      ctx.lineJoin = "round";
      ctx.fillStyle = "#FFFFFF";
      lines.forEach((l, i) => {
        const y = top + pad * 0.4 + lineH * (i + 0.5);
        ctx.strokeText(l, preset.w / 2, y);
        ctx.fillText(l, preset.w / 2, y);
      });
    }
  }

  if (logo && o.logoCorner !== "none") {
    const lw = preset.w * 0.16;
    const lh = (logo.naturalHeight / logo.naturalWidth) * lw || lw;
    const m = preset.w * 0.035;
    const x = o.logoCorner.endsWith("left") ? m : preset.w - lw - m;
    const y = o.logoCorner.startsWith("top") ? m : preset.h - lh - m;
    ctx.globalAlpha = 0.9;
    ctx.drawImage(logo, x, y, lw, lh);
    ctx.globalAlpha = 1;
  }
  return canvas;
}

export default function SocialImageResizer() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState("image");
  const [presetId, setPresetId] = useState<Preset["id"]>("og");
  const [o, setO] = useState<Options>({ fit: "contain", bg: "#FFFFFF", text: "", textPos: "bottom", textSize: 7, textStyle: "band", logoCorner: "none" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const preset = PRESETS.find((p) => p.id === presetId)!;

  const set = (patch: Partial<Options>) => setO((x) => ({ ...x, ...patch }));

  useEffect(() => {
    if (!img) return;
    let live = true;
    draw(preset, img, logo, o).then((canvas) => {
      if (!live || !previewRef.current) return;
      canvas.className = "w-full h-auto rounded-[10px] border border-border";
      canvas.setAttribute("role", "img");
      canvas.setAttribute("aria-label", `Preview of the ${preset.name} image`);
      previewRef.current.replaceChildren(canvas);
    });
    return () => { live = false; };
  }, [img, logo, o, preset]);

  const open = async (files: File[], which: "img" | "logo") => {
    setError("");
    const f = files[0];
    if (f.size > MAX_IMAGE_BYTES) return setError("That file is over 40 MB.");
    try {
      const loaded = await loadImage(f);
      if (which === "img") { setImg(loaded); setName(slugify(f.name.replace(/\.[^.]+$/, "")) || "image"); }
      else { setLogo(loaded); if (o.logoCorner === "none") set({ logoCorner: "bottom-right" }); }
    } catch {
      setError("That file couldn't be opened as an image.");
    }
  };

  const one = async (p: Preset) => canvasToBlob(await draw(p, img!, logo, p.id === presetId ? o : { ...o, fit: p.fit }), p.id === "og" || p.id === "youtube" ? "image/jpeg" : "image/png", 0.9);
  const ext = (p: Preset) => (p.id === "og" || p.id === "youtube" ? "jpg" : "png");

  const downloadAll = async () => {
    setBusy(true);
    const zip = new JSZip();
    for (const p of PRESETS) zip.file(`${name}-${p.id}-${p.w}x${p.h}.${ext(p)}`, await one(p));
    downloadBlob(`${name}-social-sizes.zip`, await zip.generateAsync({ type: "blob" }));
    setBusy(false);
  };

  if (!img) {
    return (
      <div className="space-y-4">
        <DropZone accept={ACCEPTED_IMAGES} onFiles={(f) => open(f, "img")} title="Drop in a photo" hint="A product shot, job photo or video still." />
        {error && <p className={errorBox}>{error}</p>}
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
      <div className="space-y-3 lg:sticky lg:top-24">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Size">
          {PRESETS.map((p) => (
            <button key={p.id} type="button" className={tabBtn(presetId === p.id)} aria-pressed={presetId === p.id} onClick={() => { setPresetId(p.id); set({ fit: p.fit }); }}>
              {p.name}
            </button>
          ))}
        </div>
        <p className="text-[13px] text-muted">{preset.w} × {preset.h}px</p>
        <div ref={previewRef} className="max-w-full" style={{ maxWidth: preset.h > preset.w ? 380 : undefined }} />
      </div>

      <section className={`${card} space-y-4`} aria-labelledby="sir-opts">
        <h2 id="sir-opts" className={h2}>Options</h2>
        <div>
          <span className={label}>Fit</span>
          <div className="flex gap-2">
            <button type="button" className={tabBtn(o.fit === "cover")} aria-pressed={o.fit === "cover"} onClick={() => set({ fit: "cover" })}>Fill and crop</button>
            <button type="button" className={tabBtn(o.fit === "contain")} aria-pressed={o.fit === "contain"} onClick={() => set({ fit: "contain" })}>Fit with padding</button>
          </div>
          <p className={hint}>Use padding for small products so nothing important is cut off.</p>
        </div>
        <div>
          <label className={label} htmlFor="sir-bg">Background colour</label>
          <input id="sir-bg" type="color" value={o.bg} onChange={(e) => set({ bg: e.target.value })} className="h-10 w-20 rounded border border-border-strong" />
        </div>
        <div>
          <label className={label} htmlFor="sir-text">Text overlay</label>
          <textarea id="sir-text" className={`${input} min-h-[70px]`} value={o.text} onChange={(e) => set({ text: e.target.value })} placeholder="e.g. 5 ways to style gold hoops" />
          <p className={hint}>Short and big. Most people see it on a phone, at thumbnail size.</p>
        </div>
        {o.text && (
          <>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={tabBtn(o.textPos === "top")} onClick={() => set({ textPos: "top" })}>Top</button>
              <button type="button" className={tabBtn(o.textPos === "bottom")} onClick={() => set({ textPos: "bottom" })}>Bottom</button>
              <button type="button" className={tabBtn(o.textStyle === "band")} onClick={() => set({ textStyle: "band" })}>Dark band</button>
              <button type="button" className={tabBtn(o.textStyle === "outline")} onClick={() => set({ textStyle: "outline" })}>Outlined</button>
            </div>
            <div>
              <label className={label} htmlFor="sir-size">Text size</label>
              <input id="sir-size" type="range" min={4} max={14} value={o.textSize} onChange={(e) => set({ textSize: Number(e.target.value) })} className="w-full accent-[var(--color-accent)]" />
            </div>
          </>
        )}
        <div>
          <span className={label}>Logo (optional)</span>
          {logo ? (
            <select aria-label="Logo position" className={input} value={o.logoCorner} onChange={(e) => set({ logoCorner: e.target.value as Options["logoCorner"] })}>
              <option value="none">Hide logo</option>
              <option value="top-left">Top left</option>
              <option value="top-right">Top right</option>
              <option value="bottom-left">Bottom left</option>
              <option value="bottom-right">Bottom right</option>
            </select>
          ) : (
            <label className={`${btnGhost} cursor-pointer`}>
              Add a logo
              <input type="file" accept={ACCEPTED_IMAGES} className="sr-only" onChange={(e) => e.target.files?.[0] && open([e.target.files[0]], "logo")} />
            </label>
          )}
        </div>
        {error && <p className={errorBox}>{error}</p>}
        <div className="flex flex-col gap-2 pt-2">
          <button type="button" className={btn} onClick={async () => downloadBlob(`${name}-${preset.id}-${preset.w}x${preset.h}.${ext(preset)}`, await one(preset))}>Download this size</button>
          <button type="button" className={btnGhost} onClick={downloadAll} disabled={busy}>{busy ? "Working…" : "Download every size (zip)"}</button>
          <button type="button" className="text-[13px] text-muted hover:text-ink mt-1" onClick={() => { setImg(null); setLogo(null); }}>Use a different photo</button>
        </div>
      </section>
    </div>
  );
}
