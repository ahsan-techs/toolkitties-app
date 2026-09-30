// Image tools run entirely in the browser using the Canvas API — the file
// never leaves the user's device.

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Conversion failed"))), type, quality);
  });
}

export async function convertImage(file: File, mimeType: string, quality = 0.92) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
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
  const width = size;
  const height = Math.round(size / naturalRatio);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);
  return canvasToBlob(canvas, "image/png");
}

export async function compressImage(file: File, quality: number) {
  return convertImage(file, "image/jpeg", quality);
}

export async function resizeImage(file: File, width: number, height: number) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, width, height);
  return canvasToBlob(canvas, file.type || "image/png");
}

export async function cropImage(file: File, x: number, y: number, width: number, height: number) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
  return canvasToBlob(canvas, file.type || "image/png");
}

export async function rotateImage(file: File, degrees: number) {
  const img = await loadImage(file);
  const rad = (degrees * Math.PI) / 180;
  const swap = degrees % 180 !== 0;
  const canvas = document.createElement("canvas");
  canvas.width = swap ? img.naturalHeight : img.naturalWidth;
  canvas.height = swap ? img.naturalWidth : img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rad);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
  return canvasToBlob(canvas, file.type || "image/png");
}

export async function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function watermarkImage(file: File, text: string) {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  const fontSize = Math.max(18, Math.floor(canvas.width / 18));
  ctx.font = `600 ${fontSize}px sans-serif`;
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(-Math.PI / 8);
  ctx.fillText(text, 0, 0);
  ctx.restore();
  return canvasToBlob(canvas, file.type || "image/png");
}

export async function generateFavicons(file: File) {
  const sizes = [16, 32, 48, 180, 512];
  const img = await loadImage(file);
  const blobs: { size: number; blob: Blob }[] = [];
  for (const size of sizes) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, size, size);
    const blob = await canvasToBlob(canvas, "image/png");
    blobs.push({ size, blob });
  }
  return blobs;
}

export async function convertHeicToJpg(file: File, quality = 0.9): Promise<Blob> {
  // heic2any does the actual HEIC decode (browsers can't natively read Apple's
  // HEIC format), then we hand back a normal JPEG blob.
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({ blob: file, toType: "image/jpeg", quality });
  // heic2any returns a single Blob, or an array of Blobs for multi-image HEIC files.
  return Array.isArray(result) ? result[0] : result;
}
