// Shared image engine for the Image & Media tools.
// Everything here runs in the visitor's browser (Canvas API) — files are never uploaded.
// Pure helpers (planResize, searchTarget, buildIco, parseSvgSize, ...) have no DOM
// dependency so they can be unit-tested in Node.

export type Mime = "image/jpeg" | "image/png" | "image/webp" | "image/avif";
export type OutFmt = "same" | Mime;
export type Rect = { x: number; y: number; w: number; h: number };

export const MIME_EXT: Record<Mime, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};
export const MIME_LABEL: Record<Mime, string> = {
  "image/jpeg": "JPG",
  "image/png": "PNG",
  "image/webp": "WebP",
  "image/avif": "AVIF",
};

// ---------------------------------------------------------------------------
// Small pure helpers
// ---------------------------------------------------------------------------

export function formatBytes(bytes: number): string {
  if (!isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(bytes < 10240 ? 1 : 0)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
}

export function baseName(name: string, fallback = "image"): string {
  const stem = name.replace(/\.[^.]+$/, "").trim();
  return stem || fallback;
}

export function uniqueName(name: string, used: Set<string>): string {
  const key = name.toLowerCase();
  if (!used.has(key)) {
    used.add(key);
    return name;
  }
  const dot = name.lastIndexOf(".");
  const stem = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot) : "";
  let i = 2;
  while (used.has(`${stem}-${i}${ext}`.toLowerCase())) i++;
  const out = `${stem}-${i}${ext}`;
  used.add(out.toLowerCase());
  return out;
}

const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|bmp|avif|svg|heic|heif|tiff?|ico)$/i;

export function looksLikeImage(file: { name: string; type: string }): boolean {
  return file.type.startsWith("image/") || IMAGE_EXT_RE.test(file.name);
}
export function isHeic(file: { name: string; type: string }): boolean {
  return /heic|heif/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
}
export function isSvg(file: { name: string; type: string }): boolean {
  return file.type === "image/svg+xml" || /\.svg$/i.test(file.name);
}

export function mimeOf(file: { name: string; type: string }): Mime | null {
  const t = file.type.toLowerCase();
  if (t === "image/jpeg" || t === "image/jpg") return "image/jpeg";
  if (t === "image/png") return "image/png";
  if (t === "image/webp") return "image/webp";
  if (t === "image/avif") return "image/avif";
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "avif") return "image/avif";
  return null;
}

/** "Same as original" resolves to the input format when the browser can write it, else PNG. */
export function resolveMime(file: { name: string; type: string }, fmt: OutFmt): Mime {
  if (fmt !== "same") return fmt;
  const m = mimeOf(file);
  return m === "image/jpeg" || m === "image/png" || m === "image/webp" ? m : "image/png";
}

// ---------------------------------------------------------------------------
// SVG helpers (regex based so they work without a DOM)
// ---------------------------------------------------------------------------

export function parseSvgSize(svg: string): { width: number; height: number } | null {
  const tag = svg.match(/<svg\b[^>]*>/i)?.[0];
  if (!tag) return null;
  const attr = (n: string) => {
    const m = tag.match(new RegExp(`\\s${n}\\s*=\\s*["']([^"']+)["']`, "i"));
    return m ? m[1] : null;
  };
  const toNum = (v: string | null) => {
    if (!v || v.includes("%")) return null;
    const n = parseFloat(v);
    return isFinite(n) && n > 0 ? n : null;
  };
  let w = toNum(attr("width"));
  let h = toNum(attr("height"));
  const vbRaw = attr("viewBox");
  const vb = vbRaw ? vbRaw.trim().split(/[\s,]+/).map(Number) : null;
  if ((!w || !h) && vb && vb.length === 4 && vb[2] > 0 && vb[3] > 0) {
    if (w && !h) h = (w * vb[3]) / vb[2];
    else if (h && !w) w = (h * vb[2]) / vb[3];
    else {
      w = vb[2];
      h = vb[3];
    }
  }
  return w && h ? { width: w, height: h } : null;
}

/** Rewrites the root <svg> so it has an explicit size, a viewBox and an xmlns (needed to render as <img>). */
export function withSvgSize(svg: string, width: number, height: number): string {
  const orig = parseSvgSize(svg);
  return svg.replace(/<svg\b[^>]*>/i, (tag) => {
    const hasViewBox = /\sviewBox\s*=/i.test(tag);
    const hasXmlns = /\sxmlns\s*=/i.test(tag);
    let t = tag.replace(/\s(width|height)\s*=\s*("[^"]*"|'[^']*')/gi, "");
    let extra = "";
    if (!hasXmlns) extra += ` xmlns="http://www.w3.org/2000/svg"`;
    if (!hasViewBox && orig) extra += ` viewBox="0 0 ${orig.width} ${orig.height}"`;
    extra += ` width="${Math.round(width)}" height="${Math.round(height)}"`;
    t = t.replace(/<svg\b/i, `<svg${extra}`);
    return t;
  });
}

// ---------------------------------------------------------------------------
// Decoding
// ---------------------------------------------------------------------------

export type Decoded = {
  source: CanvasImageSource;
  width: number;
  height: number;
  close: () => void;
};

function loadHtmlImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("decode failed"));
    img.src = url;
  });
}

/**
 * Decodes any browser-readable image (JPG, PNG, WebP, GIF, BMP, AVIF, SVG, ICO…).
 * EXIF rotation is applied. SVGs are rasterised at `svgWidth` (or a crisp default size).
 */
export async function decodeImage(file: File, opts: { svgWidth?: number } = {}): Promise<Decoded> {
  const fail = () =>
    new Error(
      isHeic(file)
        ? `“${file.name}” is a HEIC photo. Use the HEIC to JPG tool for these files.`
        : `Couldn't read “${file.name}”. It may be damaged or in a format your browser can't open.`
    );

  if (isSvg(file)) {
    let text: string;
    try {
      text = await file.text();
    } catch {
      throw fail();
    }
    const size = parseSvgSize(text) ?? { width: 1024, height: 1024 };
    const targetW = opts.svgWidth ?? Math.min(4096, Math.max(size.width, 1024));
    const targetH = Math.max(1, Math.round((targetW * size.height) / size.width));
    const blob = new Blob([withSvgSize(text, targetW, targetH)], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    try {
      const img = await loadHtmlImage(url);
      return { source: img, width: Math.round(targetW), height: targetH, close: () => {} };
    } catch {
      throw new Error(`“${file.name}” isn't a valid SVG file.`);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  try {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
    return { source: bmp, width: bmp.width, height: bmp.height, close: () => bmp.close() };
  } catch {
    // fall through to <img>
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await loadHtmlImage(url);
    if (!img.naturalWidth || !img.naturalHeight) throw new Error("empty");
    return { source: img, width: img.naturalWidth, height: img.naturalHeight, close: () => {} };
  } catch {
    throw fail();
  } finally {
    URL.revokeObjectURL(url);
  }
}

// ---------------------------------------------------------------------------
// Canvas helpers
// ---------------------------------------------------------------------------

export const MAX_SIDE = 16384;
export const MAX_PIXELS = 150_000_000;

export function makeCanvas(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const W = Math.round(w);
  const H = Math.round(h);
  if (!(W >= 1 && H >= 1)) throw new Error("Image size must be at least 1 pixel.");
  if (W > MAX_SIDE || H > MAX_SIDE || W * H > MAX_PIXELS) {
    throw new Error(`That size is too large for a browser (max ${MAX_SIDE}px per side). Try a smaller size.`);
  }
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not process this image. Try a smaller one.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return { canvas, ctx };
}

/** High-quality resample: halves repeatedly so big downscales stay sharp (no aliasing). */
export function drawResampled(src: CanvasImageSource, from: Rect, dw: number, dh: number): HTMLCanvasElement {
  const DW = Math.max(1, Math.round(dw));
  const DH = Math.max(1, Math.round(dh));
  let cur: CanvasImageSource = src;
  let r: Rect = { ...from };
  while (r.w > DW * 2 || r.h > DH * 2) {
    const nw = Math.max(DW, Math.ceil(r.w / 2));
    const nh = Math.max(DH, Math.ceil(r.h / 2));
    const t = makeCanvas(nw, nh);
    t.ctx.drawImage(cur, r.x, r.y, r.w, r.h, 0, 0, nw, nh);
    cur = t.canvas;
    r = { x: 0, y: 0, w: nw, h: nh };
  }
  const out = makeCanvas(DW, DH);
  out.ctx.drawImage(cur, r.x, r.y, r.w, r.h, 0, 0, DW, DH);
  return out.canvas;
}

export function flattenOnColor(canvas: HTMLCanvasElement, color: string): HTMLCanvasElement {
  const t = makeCanvas(canvas.width, canvas.height);
  t.ctx.fillStyle = color;
  t.ctx.fillRect(0, 0, canvas.width, canvas.height);
  t.ctx.drawImage(canvas, 0, 0);
  return t.canvas;
}

const supportCache = new Map<string, boolean>();
export function supportsEncode(mime: Mime): boolean {
  if (typeof document === "undefined") return false;
  if (mime === "image/png" || mime === "image/jpeg") return true;
  const hit = supportCache.get(mime);
  if (hit !== undefined) return hit;
  let ok = false;
  try {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    ok = c.toDataURL(mime).startsWith(`data:${mime}`);
  } catch {
    ok = false;
  }
  supportCache.set(mime, ok);
  return ok;
}

async function rawEncode(canvas: HTMLCanvasElement, mime: Mime, quality: number): Promise<Blob> {
  const blob = await new Promise<Blob | null>((res) =>
    canvas.toBlob(res, mime, mime === "image/png" ? undefined : quality)
  );
  if (!blob) throw new Error("Your browser couldn't create this image. Try a smaller image or another format.");
  if (blob.type !== mime) {
    throw new Error(`Your browser can't create ${MIME_LABEL[mime]} files. Please pick PNG or JPG, or use a recent Chrome, Edge or Firefox.`);
  }
  return blob;
}

/** Encodes a canvas. JPG has no transparency, so it is flattened on `bg` first. */
export async function encodeCanvas(canvas: HTMLCanvasElement, mime: Mime, quality = 0.92, bg = "#ffffff"): Promise<Blob> {
  const c = mime === "image/jpeg" ? flattenOnColor(canvas, bg) : canvas;
  return rawEncode(c, mime, Math.min(1, Math.max(0.01, quality)));
}

// ---------------------------------------------------------------------------
// "Compress to a target size" search
// ---------------------------------------------------------------------------

export type TargetResult = { blob: Blob; quality: number; scale: number; hit: boolean };

/**
 * Finds the highest quality whose output is <= target bytes. If even a decent quality is
 * too big, the image is shrunk step by step instead of producing a blurry mess.
 */
export async function searchTarget(
  encodeAt: (quality: number, scale: number) => Promise<Blob>,
  target: number,
  o: { minQ?: number; maxQ?: number; iterations?: number; maxShrinks?: number } = {}
): Promise<TargetResult> {
  const minQ = o.minQ ?? 0.4;
  const maxQ = o.maxQ ?? 0.95;
  const iterations = o.iterations ?? 7;
  const maxShrinks = o.maxShrinks ?? 10;
  let scale = 1;
  let last: Blob | null = null;

  for (let shrink = 0; shrink <= maxShrinks; shrink++) {
    const low = await encodeAt(minQ, scale);
    last = low;
    if (low.size <= target) {
      const high = await encodeAt(maxQ, scale);
      if (high.size <= target) return { blob: high, quality: maxQ, scale, hit: true };
      let lo = minQ;
      let hi = maxQ;
      let best = low;
      let bestQ = minQ;
      for (let i = 0; i < iterations; i++) {
        const mid = (lo + hi) / 2;
        const b = await encodeAt(mid, scale);
        if (b.size <= target) {
          best = b;
          bestQ = mid;
          lo = mid;
        } else {
          hi = mid;
        }
      }
      return { blob: best, quality: bestQ, scale, hit: true };
    }
    scale *= Math.max(0.5, Math.min(0.92, Math.sqrt(target / low.size) * 0.96));
  }
  return { blob: last as Blob, quality: minQ, scale, hit: false };
}

export async function encodeToTarget(
  canvas: HTMLCanvasElement,
  mime: Mime,
  targetBytes: number,
  bg = "#ffffff"
): Promise<TargetResult & { width: number; height: number }> {
  const base = mime === "image/jpeg" ? flattenOnColor(canvas, bg) : canvas;
  let cachedScale = -1;
  let cached: HTMLCanvasElement = base;
  const res = await searchTarget(async (q, scale) => {
    if (scale !== cachedScale) {
      cached =
        scale === 1
          ? base
          : drawResampled(base, { x: 0, y: 0, w: base.width, h: base.height }, base.width * scale, base.height * scale);
      cachedScale = scale;
    }
    return rawEncode(cached, mime, q);
  }, targetBytes);
  return {
    ...res,
    width: Math.max(1, Math.round(base.width * res.scale)),
    height: Math.max(1, Math.round(base.height * res.scale)),
  };
}

// ---------------------------------------------------------------------------
// Resize planning
// ---------------------------------------------------------------------------

export type ResizeSpec = {
  mode: "pixels" | "percent";
  width: number; // 0 = auto
  height: number; // 0 = auto
  percent: number;
  lock: boolean; // keep aspect ratio (fit inside the box, never distort)
  fit: "stretch" | "contain" | "cover"; // only used when lock is off and both sizes are set
  noUpscale?: boolean;
};
export type ResizePlan = { outW: number; outH: number; src: Rect; dst: Rect };

const clampDim = (n: number) => Math.min(MAX_SIDE, Math.max(1, Math.round(n)));

export function planResize(sw: number, sh: number, s: ResizeSpec): ResizePlan {
  const full: Rect = { x: 0, y: 0, w: sw, h: sh };
  if (s.mode === "percent") {
    const p = Math.max(1, s.percent) / 100;
    const outW = clampDim(sw * p);
    const outH = clampDim(sh * p);
    return { outW, outH, src: full, dst: { x: 0, y: 0, w: outW, h: outH } };
  }

  const w = s.width > 0 ? s.width : 0;
  const h = s.height > 0 ? s.height : 0;

  // Only one side given, or ratio locked: scale proportionally inside the box.
  if (s.lock || !w || !h) {
    let scale: number;
    if (w && h) scale = Math.min(w / sw, h / sh);
    else if (w) scale = w / sw;
    else if (h) scale = h / sh;
    else scale = 1;
    if (s.noUpscale && scale > 1) scale = 1;
    const outW = clampDim(sw * scale);
    const outH = clampDim(sh * scale);
    return { outW, outH, src: full, dst: { x: 0, y: 0, w: outW, h: outH } };
  }

  // Exact output size.
  const outW = clampDim(w);
  const outH = clampDim(h);
  if (s.fit === "stretch") return { outW, outH, src: full, dst: { x: 0, y: 0, w: outW, h: outH } };

  if (s.fit === "contain") {
    let scale = Math.min(outW / sw, outH / sh);
    if (s.noUpscale && scale > 1) scale = 1;
    const dw = Math.max(1, Math.round(sw * scale));
    const dh = Math.max(1, Math.round(sh * scale));
    return { outW, outH, src: full, dst: { x: Math.round((outW - dw) / 2), y: Math.round((outH - dh) / 2), w: dw, h: dh } };
  }

  // cover: fill the box and crop the overflow from the centre
  const scale = Math.max(outW / sw, outH / sh);
  const cw = Math.min(sw, Math.round(outW / scale));
  const ch = Math.min(sh, Math.round(outH / scale));
  return {
    outW,
    outH,
    src: { x: Math.round((sw - cw) / 2), y: Math.round((sh - ch) / 2), w: cw, h: ch },
    dst: { x: 0, y: 0, w: outW, h: outH },
  };
}

// ---------------------------------------------------------------------------
// Rotation / crop math
// ---------------------------------------------------------------------------

export function rotatedBounds(w: number, h: number, degrees: number): { w: number; h: number } {
  const d = ((degrees % 360) + 360) % 360;
  if (d === 0 || d === 180) return { w, h };
  if (d === 90 || d === 270) return { w: h, h: w };
  const r = (d * Math.PI) / 180;
  const cos = Math.abs(Math.cos(r));
  const sin = Math.abs(Math.sin(r));
  const round = (v: number) => Math.ceil(+v.toFixed(6));
  return { w: round(w * cos + h * sin), h: round(w * sin + h * cos) };
}

export type DragMode = "move" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Fits a rectangle to an aspect ratio around its centre, staying inside W×H. */
export function fitAspect(r: Rect, aspect: number, W: number, H: number): Rect {
  let w = r.w;
  let h = w / aspect;
  if (h > r.h) {
    h = r.h;
    w = h * aspect;
  }
  const maxW = Math.min(W, H * aspect);
  if (w > maxW) {
    w = maxW;
    h = w / aspect;
  }
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  const x = clamp(cx - w / 2, 0, W - w);
  const y = clamp(cy - h / 2, 0, H - h);
  return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
}

/** Applies a pointer drag (in image pixels) to a crop rectangle. */
export function applyDrag(r: Rect, mode: DragMode, dx: number, dy: number, W: number, H: number, aspect: number | null, min = 16): Rect {
  if (mode === "move") {
    return {
      x: Math.round(clamp(r.x + dx, 0, W - r.w)),
      y: Math.round(clamp(r.y + dy, 0, H - r.h)),
      w: r.w,
      h: r.h,
    };
  }
  const hasE = mode.includes("e");
  const hasW = mode.includes("w");
  const hasS = mode.includes("s");
  const hasN = mode.includes("n");

  if (!aspect) {
    let left = r.x;
    let right = r.x + r.w;
    let top = r.y;
    let bottom = r.y + r.h;
    if (hasW) left = clamp(left + dx, 0, right - min);
    if (hasE) right = clamp(right + dx, left + min, W);
    if (hasN) top = clamp(top + dy, 0, bottom - min);
    if (hasS) bottom = clamp(bottom + dy, top + min, H);
    return { x: Math.round(left), y: Math.round(top), w: Math.round(right - left), h: Math.round(bottom - top) };
  }

  const ax = hasW ? r.x + r.w : hasE ? r.x : r.x + r.w / 2;
  const ay = hasN ? r.y + r.h : hasS ? r.y : r.y + r.h / 2;
  let w = r.w + (hasE ? dx : 0) - (hasW ? dx : 0);
  let h = r.h + (hasS ? dy : 0) - (hasN ? dy : 0);
  w = Math.max(w, min);
  h = Math.max(h, min);
  const horizontal = mode === "e" || mode === "w";
  const vertical = mode === "n" || mode === "s";
  if (horizontal) h = w / aspect;
  else if (vertical) w = h * aspect;
  else if (Math.abs(w - r.w) >= Math.abs(h - r.h) * aspect) h = w / aspect;
  else w = h * aspect;

  const maxW = hasW ? ax : hasE ? W - ax : 2 * Math.min(ax, W - ax);
  const maxH = hasN ? ay : hasS ? H - ay : 2 * Math.min(ay, H - ay);
  const shrink = Math.min(1, maxW / w, maxH / h);
  w *= shrink;
  h *= shrink;
  const grow = Math.max(1, min / w, min / h);
  w *= grow;
  h *= grow;

  const x = hasW ? ax - w : hasE ? ax : ax - w / 2;
  const y = hasN ? ay - h : hasS ? ay : ay - h / 2;
  return {
    x: Math.round(clamp(x, 0, Math.max(0, W - w))),
    y: Math.round(clamp(y, 0, Math.max(0, H - h))),
    w: Math.round(w),
    h: Math.round(h),
  };
}

// ---------------------------------------------------------------------------
// Pixel adjustments (done manually so they work in every browser, incl. Safari)
// ---------------------------------------------------------------------------

export type Adjustments = {
  brightness: number; // -100..100
  contrast: number; // -100..100
  saturation: number; // -100..100
  grayscale: boolean;
  sepia: boolean;
  invert: boolean;
};

export const NO_ADJUSTMENTS: Adjustments = { brightness: 0, contrast: 0, saturation: 0, grayscale: false, sepia: false, invert: false };

export function hasAdjustments(a: Adjustments): boolean {
  return a.brightness !== 0 || a.contrast !== 0 || a.saturation !== 0 || a.grayscale || a.sepia || a.invert;
}

export function applyAdjustments(ctx: CanvasRenderingContext2D, w: number, h: number, a: Adjustments): void {
  if (!hasAdjustments(a)) return;
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  const add = (a.brightness / 100) * 255;
  const c255 = (a.contrast / 100) * 255;
  const cf = (259 * (c255 + 255)) / (255 * (259 - c255));
  const sat = 1 + a.saturation / 100;
  const cl = (v: number) => (v < 0 ? 0 : v > 255 ? 255 : v);
  for (let i = 0; i < d.length; i += 4) {
    let r = d[i];
    let g = d[i + 1];
    let b = d[i + 2];
    if (add) {
      r += add;
      g += add;
      b += add;
    }
    if (a.contrast) {
      r = cf * (r - 128) + 128;
      g = cf * (g - 128) + 128;
      b = cf * (b - 128) + 128;
    }
    if (a.saturation) {
      const l = 0.299 * r + 0.587 * g + 0.114 * b;
      r = l + (r - l) * sat;
      g = l + (g - l) * sat;
      b = l + (b - l) * sat;
    }
    if (a.grayscale) {
      const l = 0.299 * r + 0.587 * g + 0.114 * b;
      r = g = b = l;
    }
    if (a.sepia) {
      const nr = 0.393 * r + 0.769 * g + 0.189 * b;
      const ng = 0.349 * r + 0.686 * g + 0.168 * b;
      const nb = 0.272 * r + 0.534 * g + 0.131 * b;
      r = nr;
      g = ng;
      b = nb;
    }
    if (a.invert) {
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
    }
    d[i] = cl(r);
    d[i + 1] = cl(g);
    d[i + 2] = cl(b);
  }
  ctx.putImageData(img, 0, 0);
}

// ---------------------------------------------------------------------------
// ICO builder (PNG-in-ICO, supported by every modern browser and OS)
// ---------------------------------------------------------------------------

export function buildIco(images: { size: number; png: Uint8Array }[]): Uint8Array {
  const count = images.length;
  const headerLen = 6 + count * 16;
  const total = headerLen + images.reduce((s, i) => s + i.png.length, 0);
  const out = new Uint8Array(total);
  const dv = new DataView(out.buffer);
  dv.setUint16(0, 0, true);
  dv.setUint16(2, 1, true); // type: icon
  dv.setUint16(4, count, true);
  let offset = headerLen;
  images.forEach((img, i) => {
    const p = 6 + i * 16;
    out[p] = img.size >= 256 ? 0 : img.size;
    out[p + 1] = img.size >= 256 ? 0 : img.size;
    out[p + 2] = 0;
    out[p + 3] = 0;
    dv.setUint16(p + 4, 1, true); // planes
    dv.setUint16(p + 6, 32, true); // bits per pixel
    dv.setUint32(p + 8, img.png.length, true);
    dv.setUint32(p + 12, offset, true);
    out.set(img.png, offset);
    offset += img.png.length;
  });
  return out;
}

// ---------------------------------------------------------------------------
// Misc
// ---------------------------------------------------------------------------

export async function blobToBytes(blob: Blob): Promise<Uint8Array> {
  return new Uint8Array(await blob.arrayBuffer());
}

export function blobFromBytes(bytes: Uint8Array, type: string): Blob {
  return new Blob([bytes as unknown as BlobPart], { type });
}

/** Reads a file as a base64 data URL. */
export function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.readAsDataURL(file);
  });
}

export function limitSide(w: number, h: number, maxSide: number): { w: number; h: number } {
  if (!maxSide || (w <= maxSide && h <= maxSide)) return { w, h };
  const s = maxSide / Math.max(w, h);
  return { w: Math.max(1, Math.round(w * s)), h: Math.max(1, Math.round(h * s)) };
}

// ---------------------------------------------------------------------------
// Smart PNG compression: colour quantisation + indexed (palette) PNG writer
// ---------------------------------------------------------------------------

import { crc32 } from "./zip";

export type Quantized = { palette: Uint8Array; indices: Uint8Array; count: number };

/** Median-cut quantiser on a 5-5-5-4 bit RGBA histogram. `palette` is RGBA, 4 bytes per colour. */
export function quantizeRgba(data: Uint8ClampedArray | Uint8Array, maxColors: number): Quantized {
  const n = data.length / 4;
  const hist = new Uint32Array(1 << 19);
  const keyOf = (i: number) => ((data[i] >> 3) << 14) | ((data[i + 1] >> 3) << 9) | ((data[i + 2] >> 3) << 4) | (data[i + 3] >> 4);
  const keys = new Int32Array(n);
  for (let p = 0, i = 0; p < n; p++, i += 4) {
    const k = keyOf(i);
    keys[p] = k;
    hist[k]++;
  }
  type Entry = { key: number; count: number; r: number; g: number; b: number; a: number };
  const entries: Entry[] = [];
  for (let k = 0; k < hist.length; k++) {
    if (hist[k]) {
      entries.push({ key: k, count: hist[k], r: ((k >> 14) & 31) * 8 + 4, g: ((k >> 9) & 31) * 8 + 4, b: ((k >> 4) & 31) * 8 + 4, a: (k & 15) * 16 + 8 });
    }
  }
  // exact average colours for each histogram cell (better fidelity than cell centres)
  const sums = new Map<number, [number, number, number, number]>();
  if (entries.length > 1) {
    for (let p = 0, i = 0; p < n; p++, i += 4) {
      const k = keys[p];
      let s = sums.get(k);
      if (!s) sums.set(k, (s = [0, 0, 0, 0]));
      s[0] += data[i];
      s[1] += data[i + 1];
      s[2] += data[i + 2];
      s[3] += data[i + 3];
    }
    for (const e of entries) {
      const s = sums.get(e.key)!;
      e.r = s[0] / e.count;
      e.g = s[1] / e.count;
      e.b = s[2] / e.count;
      e.a = s[3] / e.count;
    }
  }

  let boxes: Entry[][] = [entries];
  const range = (box: Entry[]) => {
    const lo = [255, 255, 255, 255];
    const hi = [0, 0, 0, 0];
    for (const e of box) {
      const v = [e.r, e.g, e.b, e.a];
      for (let c = 0; c < 4; c++) {
        if (v[c] < lo[c]) lo[c] = v[c];
        if (v[c] > hi[c]) hi[c] = v[c];
      }
    }
    let best = 0;
    for (let c = 1; c < 4; c++) if (hi[c] - lo[c] > hi[best] - lo[best]) best = c;
    return { channel: best, spread: hi[best] - lo[best] };
  };
  while (boxes.length < maxColors) {
    let pick = -1;
    let pickScore = 0;
    boxes.forEach((b, i) => {
      if (b.length < 2) return;
      const { spread } = range(b);
      const score = spread * Math.sqrt(b.reduce((s, e) => s + e.count, 0));
      if (score > pickScore) {
        pickScore = score;
        pick = i;
      }
    });
    if (pick < 0) break;
    const box = boxes[pick];
    const { channel } = range(box);
    const get = (e: Entry) => (channel === 0 ? e.r : channel === 1 ? e.g : channel === 2 ? e.b : e.a);
    box.sort((x, y) => get(x) - get(y));
    const total = box.reduce((s, e) => s + e.count, 0);
    let acc = 0;
    let cut = 1;
    for (let i = 0; i < box.length - 1; i++) {
      acc += box[i].count;
      cut = i + 1;
      if (acc >= total / 2) break;
    }
    boxes = [...boxes.slice(0, pick), box.slice(0, cut), box.slice(cut), ...boxes.slice(pick + 1)];
  }

  const count = boxes.length;
  const palette = new Uint8Array(count * 4);
  const keyToIndex = new Map<number, number>();
  boxes.forEach((box, bi) => {
    let t = 0;
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;
    for (const e of box) {
      t += e.count;
      r += e.r * e.count;
      g += e.g * e.count;
      b += e.b * e.count;
      a += e.a * e.count;
      keyToIndex.set(e.key, bi);
    }
    palette[bi * 4] = Math.round(r / t);
    palette[bi * 4 + 1] = Math.round(g / t);
    palette[bi * 4 + 2] = Math.round(b / t);
    palette[bi * 4 + 3] = Math.round(a / t);
  });
  const indices = new Uint8Array(n);
  for (let p = 0; p < n; p++) indices[p] = keyToIndex.get(keys[p]) as number;
  return { palette, indices, count };
}

function pngChunk(type: string, data: Uint8Array): Uint8Array {
  const out = new Uint8Array(12 + data.length);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

async function zlibDeflate(bytes: Uint8Array): Promise<Uint8Array | null> {
  const CS = (globalThis as unknown as { CompressionStream?: new (f: string) => GenericTransformStream }).CompressionStream;
  if (!CS) return null;
  const stream = new Blob([bytes as unknown as BlobPart]).stream().pipeThrough(new CS("deflate"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Writes an 8-bit indexed PNG. Returns null if the browser has no deflate support. */
export async function encodeIndexedPng(w: number, h: number, q: Quantized): Promise<Uint8Array | null> {
  const raw = new Uint8Array((w + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w + 1)] = 0;
    raw.set(q.indices.subarray(y * w, (y + 1) * w), y * (w + 1) + 1);
  }
  const idat = await zlibDeflate(raw);
  if (!idat) return null;
  const ihdr = new Uint8Array(13);
  const dv = new DataView(ihdr.buffer);
  dv.setUint32(0, w);
  dv.setUint32(4, h);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 3; // indexed colour
  const plte = new Uint8Array(q.count * 3);
  const trns = new Uint8Array(q.count);
  let hasAlpha = false;
  for (let i = 0; i < q.count; i++) {
    plte[i * 3] = q.palette[i * 4];
    plte[i * 3 + 1] = q.palette[i * 4 + 1];
    plte[i * 3 + 2] = q.palette[i * 4 + 2];
    trns[i] = q.palette[i * 4 + 3];
    if (trns[i] < 255) hasAlpha = true;
  }
  const parts = [new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]), pngChunk("IHDR", ihdr), pngChunk("PLTE", plte)];
  if (hasAlpha) parts.push(pngChunk("tRNS", trns));
  parts.push(pngChunk("IDAT", idat), pngChunk("IEND", new Uint8Array(0)));
  const out = new Uint8Array(parts.reduce((s, p) => s + p.length, 0));
  let off = 0;
  for (const p of parts) {
    out.set(p, off);
    off += p.length;
  }
  return out;
}

/** Quantises a canvas and returns a much smaller palette PNG (or null if unsupported). */
export async function compressPngSmart(canvas: HTMLCanvasElement, colors: number): Promise<Blob | null> {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const q = quantizeRgba(img.data, Math.min(256, Math.max(2, colors)));
  const bytes = await encodeIndexedPng(canvas.width, canvas.height, q);
  return bytes ? new Blob([bytes as unknown as BlobPart], { type: "image/png" }) : null;
}
