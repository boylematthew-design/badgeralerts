// Image helpers for the free image tools. Everything uses the browser's own canvas, so photos
// are processed on the visitor's computer and never uploaded.

export const ACCEPTED_IMAGES = "image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif";
export const MAX_IMAGE_BYTES = 40 * 1024 * 1024; // guards against freezing the tab on huge files

export function loadImage(file: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("That file couldn't be opened as an image."));
    };
    img.src = url;
  });
}

export function makeCanvas(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(w));
  canvas.height = Math.max(1, Math.round(h));
  const ctx = canvas.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return { canvas, ctx };
}

export function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Couldn't create the image."))), type, quality)
  );
}

// Natural size, with a fallback for SVGs that have no width/height of their own.
export function sizeOf(img: HTMLImageElement) {
  return { w: img.naturalWidth || 512, h: img.naturalHeight || 512 };
}

// Draws the image into a w x h box: "cover" fills and crops, "contain" fits inside and pads.
export function drawFitted(ctx: CanvasRenderingContext2D, img: HTMLImageElement, w: number, h: number, mode: "cover" | "contain", padding = 0) {
  const { w: iw, h: ih } = sizeOf(img);
  const bw = w - padding * 2;
  const bh = h - padding * 2;
  const scale = mode === "cover" ? Math.max(bw / iw, bh / ih) : Math.min(bw / iw, bh / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function formatBytes(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

// Wraps text onto lines that fit maxWidth at the context's current font.
export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const para of text.split(/\n/)) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else line = test;
    }
    lines.push(line);
  }
  return lines;
}

// A .ico file holding PNG images (supported by every current browser and Windows).
export async function buildIco(pngs: { size: number; blob: Blob }[]): Promise<Blob> {
  const datas = await Promise.all(pngs.map(async (p) => new Uint8Array(await p.blob.arrayBuffer())));
  const header = new ArrayBuffer(6 + 16 * pngs.length);
  const view = new DataView(header);
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, pngs.length, true);
  let offset = header.byteLength;
  pngs.forEach((p, i) => {
    const e = 6 + i * 16;
    view.setUint8(e, p.size >= 256 ? 0 : p.size);
    view.setUint8(e + 1, p.size >= 256 ? 0 : p.size);
    view.setUint8(e + 2, 0);
    view.setUint8(e + 3, 0);
    view.setUint16(e + 4, 1, true);
    view.setUint16(e + 6, 32, true);
    view.setUint32(e + 8, datas[i].byteLength, true);
    view.setUint32(e + 12, offset, true);
    offset += datas[i].byteLength;
  });
  return new Blob([header, ...datas.map((d) => d.buffer as ArrayBuffer)], { type: "image/x-icon" });
}
