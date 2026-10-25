import { makeZip } from "./zip";

// Image tools run entirely in the browser using the Canvas API — the file
// never leaves the user's device.

const MAX_SIDE = 16384; // browsers cannot draw canvases larger than this
const MAX_PIXELS = 100_000_000;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("This file could not be opened as an image. Check that it is a valid picture."));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Conversion failed. The image may be too large for your browser."))), type, quality);
  });
}

function makeCanvas(width: number, height: number) {
  if (!Number.isFinite(width) || !Number.isFinite(height) || width < 1 || height < 1) {
    throw new Error("Width and height must be numbers of 1 or more.");
  }
  const w = Math.round(width);
  const h = Math.round(height);
  if (w > MAX_SIDE || h > MAX_SIDE || w * h > MAX_PIXELS) {
    throw new Error("That size is too large for your browser. Try a smaller width and height.");
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create a drawing surface for this image.");
  ctx.imageSmoothingQuality = "high";
  return { canvas, ctx };
}

// The type to write when the picture's own type should be kept (anything unusual becomes PNG).
function keepType(file: File) {
  return ["image/jpeg", "image/png", "image/webp"].includes(file.type) ? file.type : "image/png";
}

// File ending that matches what is really inside the blob.
export function extForBlob(blob: Blob) {
  if (blob.type === "image/jpeg") return ".jpg";
  if (blob.type === "image/webp") return ".webp";
  return ".png";
}

export async function convertImage(file: File, mimeType: string, quality = 0.92) {
  const img = await loadImage(file);
  const { canvas, ctx } = makeCanvas(img.naturalWidth, img.naturalHeight);
  if (mimeType === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);
  return canvasToBlob(canvas, mimeType, quality);
}

// SVGs often have no intrinsic pixel size (or a tiny default like 300x150),
// so rasterize at a chosen output size instead of the SVG's raw dimensions.
export async function convertSvgToPng(file: File, size = 512) {
  const img = await loadImage(file);
  const naturalRatio = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
  const { canvas, ctx } = makeCanvas(size, Math.round(size / naturalRatio));
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvasToBlob(canvas, "image/png");
}

// Saves as JPG. Pass maxSide to also shrink large photos (longest side in pixels, 0 keeps the size).
export async function compressImage(file: File, quality: number, maxSide = 0) {
  const img = await loadImage(file);
  const longest = Math.max(img.naturalWidth, img.naturalHeight);
  const scale = maxSide > 0 && longest > maxSide ? maxSide / longest : 1;
  const { canvas, ctx } = makeCanvas(img.naturalWidth * scale, img.naturalHeight * scale);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvasToBlob(canvas, "image/jpeg", quality);
}

// With keepRatio the picture is fitted inside the given size without stretching. Leave one of
// the two sizes empty (0) to set only the other one.
export async function resizeImage(file: File, width: number, height: number, keepRatio = true) {
  const img = await loadImage(file);
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  let w = width;
  let h = height;
  if (keepRatio) {
    const sw = width > 0 ? width / nw : Infinity;
    const sh = height > 0 ? height / nh : Infinity;
    const scale = Math.min(sw, sh);
    if (!Number.isFinite(scale)) throw new Error("Enter a width or a height.");
    w = nw * scale;
    h = nh * scale;
  }
  const { canvas, ctx } = makeCanvas(w, h);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvasToBlob(canvas, keepType(file));
}

export async function cropImage(file: File, x: number, y: number, width: number, height: number) {
  const img = await loadImage(file);
  const nw = img.naturalWidth;
  const nh = img.naturalHeight;
  if (![x, y, width, height].every(Number.isFinite) || x < 0 || y < 0 || width < 1 || height < 1) {
    throw new Error("X and Y must be 0 or more, and the width and height must be 1 or more.");
  }
  if (x >= nw || y >= nh) {
    throw new Error(`Your image is ${nw} x ${nh} pixels. The crop area must start inside it.`);
  }
  const w = Math.min(width, nw - x);
  const h = Math.min(height, nh - y);
  const { canvas, ctx } = makeCanvas(w, h);
  ctx.drawImage(img, x, y, w, h, 0, 0, canvas.width, canvas.height);
  return canvasToBlob(canvas, keepType(file));
}

export async function rotateImage(file: File, degrees: number) {
  const turn = ((degrees % 360) + 360) % 360;
  if (![90, 180, 270].includes(turn)) throw new Error("Choose 90, 180 or 270 degrees.");
  const img = await loadImage(file);
  const swap = turn !== 180;
  const { canvas, ctx } = makeCanvas(swap ? img.naturalHeight : img.naturalWidth, swap ? img.naturalWidth : img.naturalHeight);
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((turn * Math.PI) / 180);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
  return canvasToBlob(canvas, keepType(file));
}

export async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("This file could not be read."));
    reader.readAsDataURL(file);
  });
}

export async function watermarkImage(file: File, text: string) {
  const label = text.trim();
  if (!label) throw new Error("Type the watermark text first.");
  const img = await loadImage(file);
  const { canvas, ctx } = makeCanvas(img.naturalWidth, img.naturalHeight);
  ctx.drawImage(img, 0, 0);
  let fontSize = Math.max(18, Math.floor(canvas.width / 14));
  ctx.font = `700 ${fontSize}px sans-serif`;
  // Shrink long text so it fits across the picture.
  const maxWidth = canvas.width * 0.8;
  const measured = ctx.measureText(label).width;
  if (measured > maxWidth) {
    fontSize = Math.max(12, Math.floor((fontSize * maxWidth) / measured));
    ctx.font = `700 ${fontSize}px sans-serif`;
  }
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 8);
  // A thin dark outline keeps the white text readable on bright pictures too.
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(2, fontSize / 10);
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.strokeText(label, 0, 0);
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.fillText(label, 0, 0);
  ctx.restore();
  return canvasToBlob(canvas, keepType(file));
}

// ---------------------------------------------------------------------------
// Favicons: one square picture becomes every size a website needs.
// ---------------------------------------------------------------------------

const FAVICON_SIZES = [16, 32, 48, 180, 192, 512];

async function squarePng(img: HTMLImageElement, size: number) {
  const { canvas, ctx } = makeCanvas(size, size);
  // Take the biggest centred square, so non-square logos are cropped instead of squashed.
  const side = Math.min(img.naturalWidth, img.naturalHeight);
  const sx = (img.naturalWidth - side) / 2;
  const sy = (img.naturalHeight - side) / 2;
  ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
  return canvasToBlob(canvas, "image/png");
}

// A .ico file that holds PNG pictures (supported by every current browser).
function buildIco(images: { size: number; bytes: Uint8Array }[]): Uint8Array {
  const headerSize = 6 + images.length * 16;
  const total = headerSize + images.reduce((n, i) => n + i.bytes.length, 0);
  const out = new Uint8Array(total);
  const view = new DataView(out.buffer);
  view.setUint16(2, 1, true);
  view.setUint16(4, images.length, true);
  let offset = headerSize;
  images.forEach((img, i) => {
    const at = 6 + i * 16;
    out[at] = img.size >= 256 ? 0 : img.size;
    out[at + 1] = img.size >= 256 ? 0 : img.size;
    view.setUint16(at + 4, 1, true);
    view.setUint16(at + 6, 32, true);
    view.setUint32(at + 8, img.bytes.length, true);
    view.setUint32(at + 12, offset, true);
    out.set(img.bytes, offset);
    offset += img.bytes.length;
  });
  return out;
}

export const FAVICON_HTML = `<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

export async function generateFavicons(file: File) {
  const img = await loadImage(file);
  const blobs: { size: number; blob: Blob }[] = [];
  for (const size of FAVICON_SIZES) blobs.push({ size, blob: await squarePng(img, size) });
  return blobs;
}

export async function buildFaviconPack(file: File): Promise<{ zip: Blob; preview: Blob; html: string }> {
  const set = await generateFavicons(file);
  const bytesOf = async (size: number) => new Uint8Array(await set.find((s) => s.size === size)!.blob.arrayBuffer());
  const png16 = await bytesOf(16);
  const png32 = await bytesOf(32);
  const png48 = await bytesOf(48);
  const png180 = await bytesOf(180);
  const png192 = await bytesOf(192);
  const png512 = await bytesOf(512);
  const enc = new TextEncoder();
  const manifest = JSON.stringify(
    {
      name: "",
      short_name: "",
      icons: [
        { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
    },
    null,
    2
  );
  const zipBytes = makeZip([
    { name: "favicon.ico", data: buildIco([{ size: 16, bytes: png16 }, { size: 32, bytes: png32 }, { size: 48, bytes: png48 }]) },
    { name: "favicon-16x16.png", data: png16 },
    { name: "favicon-32x32.png", data: png32 },
    { name: "apple-touch-icon.png", data: png180 },
    { name: "android-chrome-192x192.png", data: png192 },
    { name: "android-chrome-512x512.png", data: png512 },
    { name: "site.webmanifest", data: enc.encode(manifest) },
    { name: "favicon-html-snippet.txt", data: enc.encode(FAVICON_HTML) },
  ]);
  return {
    zip: new Blob([zipBytes as unknown as BlobPart], { type: "application/zip" }),
    preview: set.find((s) => s.size === 192)!.blob,
    html: FAVICON_HTML,
  };
}

export async function convertHeicToJpg(file: File, quality = 0.9): Promise<Blob> {
  // heic2any does the actual HEIC decode (browsers can't natively read Apple's
  // HEIC format), then we hand back a normal JPEG blob.
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({ blob: file, toType: "image/jpeg", quality });
  // heic2any returns a single Blob, or an array of Blobs for multi-image HEIC files.
  return Array.isArray(result) ? result[0] : result;
}
