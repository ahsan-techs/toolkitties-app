import { PDFDocument, PDFName, PDFNumber, PDFArray, PDFRawStream, PDFDict, rgb, StandardFonts, degrees, type PDFFont, type PDFPage } from "pdf-lib";
import { loadPdf, parsePageRanges, formatRanges } from "./pdf-core";

// All PDF processing happens locally in the browser via pdf-lib (and pdf.js for page pictures).
// Files are never uploaded to a server.

export type ToolResult = { bytes: Uint8Array; note?: string };
type Progress = (done: number, total: number) => void;

// ---------------------------------------------------------------------------
// Compress
// ---------------------------------------------------------------------------

export type CompressLevel = "recommended" | "smaller" | "smallest";

const JPEG_SETTINGS: Record<Exclude<CompressLevel, "smallest">, { quality: number; maxSide: number }> = {
  recommended: { quality: 0.7, maxSide: 2000 },
  smaller: { quality: 0.5, maxSide: 1400 },
};

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function filterNames(dict: PDFDict): string[] {
  const f = dict.lookup(PDFName.of("Filter"));
  if (f instanceof PDFName) return [f.toString()];
  if (f instanceof PDFArray) return f.asArray().map((x) => x.toString());
  return [];
}

// Only plain RGB / grey JPEG pictures are re-compressed. Anything unusual is left exactly as it is.
function isSimpleColorSpace(dict: PDFDict): boolean {
  const cs = dict.lookup(PDFName.of("ColorSpace"));
  if (cs instanceof PDFName) return cs.toString() === "/DeviceRGB" || cs.toString() === "/DeviceGray";
  if (cs instanceof PDFArray && cs.size() >= 2 && cs.lookup(0)?.toString() === "/ICCBased") {
    const profile = cs.lookup(1);
    if (profile instanceof PDFRawStream) {
      const n = profile.dict.lookup(PDFName.of("N"));
      return n instanceof PDFNumber && (n.asNumber() === 3 || n.asNumber() === 1);
    }
  }
  return false;
}

async function shrinkJpeg(
  data: Uint8Array,
  quality: number,
  maxSide: number
): Promise<{ data: Uint8Array; width: number; height: number } | null> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(new Blob([data as unknown as BlobPart], { type: "image/jpeg" }));
  } catch {
    return null;
  }
  try {
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", quality));
    canvas.width = 0;
    canvas.height = 0;
    if (!blob || blob.size >= data.length * 0.95) return null;
    return { data: new Uint8Array(await blob.arrayBuffer()), width, height };
  } finally {
    bitmap.close();
  }
}

export async function compressPdf(
  file: File,
  level: CompressLevel = "recommended",
  onProgress?: Progress
): Promise<ToolResult & { kept: boolean }> {
  const originalSize = file.size;
  const original = new Uint8Array(await file.arrayBuffer());

  const finish = (bytes: Uint8Array, extra: string, unshrinkable = 0): ToolResult & { kept: boolean } => {
    if (bytes.length >= originalSize * 0.97) {
      return {
        bytes: original,
        kept: true,
        note:
          unshrinkable > 0
            ? "The large pictures in this PDF are stored in a way that cannot be shrunk without turning the pages into pictures. Your original file is returned unchanged. Choose the Smallest option if losing selectable text is fine."
            : "This PDF is already well optimised, so a smaller file could not be made. Your original file is returned unchanged. Try a stronger option if you need it smaller.",
      };
    }
    const saved = Math.round((1 - bytes.length / originalSize) * 100);
    return { bytes, kept: false, note: `${formatSize(originalSize)} to ${formatSize(bytes.length)}, ${saved}% smaller. ${extra}`.trim() };
  };

  if (level === "smallest") {
    // Every page becomes a picture, so the text can no longer be selected. Works for any PDF.
    const { unlockPdfAsImages } = await import("./pdf-advanced");
    const { PdfPasswordError } = await import("./pdfjs-loader");
    try {
      const blob = await unlockPdfAsImages(file, "", { dpi: 100, quality: 0.55 }, onProgress);
      return finish(new Uint8Array(await blob.arrayBuffer()), "Pages were turned into pictures, so the text is no longer selectable.");
    } catch (e) {
      if (e instanceof PdfPasswordError) {
        throw new Error("This PDF is password protected. Remove the password with Unlock PDF first.");
      }
      throw e;
    }
  }

  const doc = await loadPdf(file);
  const settings = JPEG_SETTINGS[level];
  const entries = doc.context.enumerateIndirectObjects();
  const bigPictures = entries.filter(
    ([, obj]) =>
      obj instanceof PDFRawStream &&
      obj.dict.lookup(PDFName.of("Subtype"))?.toString() === "/Image" &&
      obj.getContents().length > 100_000
  ).length;
  const candidates = entries.filter(([, obj]) => {
    if (!(obj instanceof PDFRawStream)) return false;
    const d = obj.dict;
    if (d.lookup(PDFName.of("Subtype"))?.toString() !== "/Image") return false;
    const filters = filterNames(d);
    if (filters.length !== 1 || filters[0] !== "/DCTDecode") return false;
    if (d.has(PDFName.of("Decode")) || d.has(PDFName.of("Mask")) || d.has(PDFName.of("ImageMask"))) return false;
    const bpc = d.lookup(PDFName.of("BitsPerComponent"));
    if (bpc instanceof PDFNumber && bpc.asNumber() !== 8) return false;
    return isSimpleColorSpace(d) && obj.getContents().length > 20_000;
  });

  let shrunk = 0;
  for (let i = 0; i < candidates.length; i++) {
    const [ref, obj] = candidates[i];
    const stream = obj as PDFRawStream;
    const result = await shrinkJpeg(stream.getContents(), settings.quality, settings.maxSide);
    if (result) {
      const dict = doc.context.obj({
        Type: "XObject",
        Subtype: "Image",
        Width: result.width,
        Height: result.height,
        ColorSpace: "DeviceRGB",
        BitsPerComponent: 8,
        Filter: "DCTDecode",
      });
      const smask = stream.dict.get(PDFName.of("SMask"));
      if (smask) dict.set(PDFName.of("SMask"), smask);
      doc.context.assign(ref, PDFRawStream.of(dict, result.data));
      shrunk++;
    }
    onProgress?.(i + 1, candidates.length);
  }

  doc.setProducer("Toolkitties");
  const bytes = await doc.save({ useObjectStreams: true, addDefaultPage: false });
  const detail =
    candidates.length === 0
      ? "This PDF has no large pictures, so only its structure was tidied."
      : `${shrunk} of ${candidates.length} picture${candidates.length === 1 ? "" : "s"} compressed. Any text in the file stays sharp and selectable.`;
  return finish(bytes, detail, Math.max(0, bigPictures - candidates.length));
}

// ---------------------------------------------------------------------------
// Placing text on a page. pdf-lib draws in the page's own (unrotated) coordinates, but many PDFs,
// especially scans, are stored with a rotation. This helper takes coordinates as the viewer sees
// the page and converts them, so numbers and watermarks always appear upright.
// ---------------------------------------------------------------------------

function visualSize(page: PDFPage) {
  const { width, height } = page.getSize();
  const angle = ((page.getRotation().angle % 360) + 360) % 360;
  return angle === 90 || angle === 270 ? { width: height, height: width, angle } : { width, height, angle };
}

function drawVisualText(
  page: PDFPage,
  text: string,
  o: { font: PDFFont; size: number; vx: number; vy: number; turn?: number; color: ReturnType<typeof rgb>; opacity?: number }
) {
  const { width: W, height: H } = page.getSize();
  const { angle } = visualSize(page);
  let x = o.vx;
  let y = o.vy;
  if (angle === 90) { x = W - o.vy; y = o.vx; }
  else if (angle === 180) { x = W - o.vx; y = H - o.vy; }
  else if (angle === 270) { x = o.vy; y = H - o.vx; }
  page.drawText(text, {
    x,
    y,
    size: o.size,
    font: o.font,
    color: o.color,
    opacity: o.opacity,
    rotate: degrees((o.turn ?? 0) + angle),
  });
}

// ---------------------------------------------------------------------------
// Rotate / delete / reorder
// ---------------------------------------------------------------------------

export async function rotatePdf(file: File, degreesToRotate: number, pagesSpec = ""): Promise<ToolResult> {
  if (![90, 180, 270].includes(degreesToRotate)) throw new Error("Choose 90, 180 or 270 degrees.");
  const doc = await loadPdf(file);
  const total = doc.getPageCount();
  const wanted = pagesSpec.trim() ? new Set(parsePageRanges(pagesSpec, total)) : null;
  doc.getPages().forEach((page, i) => {
    if (wanted && !wanted.has(i + 1)) return;
    page.setRotation(degrees((page.getRotation().angle + degreesToRotate) % 360));
  });
  const count = wanted ? wanted.size : total;
  return { bytes: await doc.save(), note: `Rotated ${count} page${count === 1 ? "" : "s"} by ${degreesToRotate} degrees.` };
}

export async function deletePages(file: File, spec: string): Promise<ToolResult> {
  const doc = await loadPdf(file);
  const total = doc.getPageCount();
  const pages = Array.from(new Set(parsePageRanges(spec, total))).sort((a, b) => b - a);
  if (pages.length >= total) throw new Error("You can't delete every page. Leave at least one page in the PDF.");
  pages.forEach((n) => doc.removePage(n - 1));
  return {
    bytes: await doc.save(),
    note: `Removed ${pages.length} page${pages.length === 1 ? "" : "s"}. The new PDF has ${total - pages.length} page${total - pages.length === 1 ? "" : "s"}.`,
  };
}

// New page order. Ranges may go forwards or backwards (for example 5-1), pages may repeat, and any
// page you leave out is not included in the new file.
function parseOrder(spec: string, total: number): number[] {
  if (!spec.trim()) throw new Error("Type the new page order, for example 3, 1, 2 or 5-1.");
  const out: number[] = [];
  for (const part of spec.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean)) {
    const m = /^(\d+)\s*(?:-|–|—|to)\s*(\d+)$/i.exec(part);
    if (m) {
      const a = parseInt(m[1], 10);
      const b = parseInt(m[2], 10);
      for (const n of [a, b]) {
        if (n < 1 || n > total) throw new Error(`Page ${n} doesn't exist. This PDF has ${total} page${total === 1 ? "" : "s"}.`);
      }
      if (a <= b) for (let i = a; i <= b; i++) out.push(i);
      else for (let i = a; i >= b; i--) out.push(i);
    } else {
      out.push(...parsePageRanges(part, total));
    }
  }
  return out;
}

export async function reorderPages(file: File, spec: string): Promise<ToolResult> {
  const src = await loadPdf(file);
  const total = src.getPageCount();
  const order = parseOrder(spec, total);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, order.map((n) => n - 1));
  pages.forEach((p) => out.addPage(p));
  out.setProducer("Toolkitties");
  const missing = Array.from({ length: total }, (_, i) => i + 1).filter((n) => !order.includes(n));
  const note =
    `The new PDF has ${order.length} page${order.length === 1 ? "" : "s"}.` +
    (missing.length ? ` Pages left out: ${formatRanges(missing)}.` : "");
  return { bytes: await out.save(), note };
}

// ---------------------------------------------------------------------------
// Watermark and page numbers
// ---------------------------------------------------------------------------

async function embedOrExplain(doc: PDFDocument, name: StandardFonts, text: string): Promise<PDFFont> {
  const font = await doc.embedFont(name);
  try {
    font.encodeText(text);
  } catch {
    throw new Error("PDF text supports English letters, numbers and common symbols. Please remove special or non-Latin characters.");
  }
  return font;
}

export async function watermarkPdf(file: File, text: string): Promise<ToolResult> {
  const label = text.trim();
  if (!label) throw new Error("Type the watermark text first.");
  const doc = await loadPdf(file);
  const font = await embedOrExplain(doc, StandardFonts.HelveticaBold, label);
  const turn = 30;
  const rad = (turn * Math.PI) / 180;
  const unit = font.widthOfTextAtSize(label, 1);

  doc.getPages().forEach((page) => {
    const { width, height } = visualSize(page);
    // Largest size that still fits along the diagonal line of the page.
    const available = Math.min(width / Math.cos(rad), height / Math.sin(rad)) * 0.8;
    const size = Math.max(10, Math.min(64, available / unit));
    const w = unit * size;
    const h = size * 0.7;
    // Place the text so its middle sits in the middle of the page after it is turned.
    const vx = width / 2 - ((w / 2) * Math.cos(rad) - (h / 2) * Math.sin(rad));
    const vy = height / 2 - ((w / 2) * Math.sin(rad) + (h / 2) * Math.cos(rad));
    drawVisualText(page, label, { font, size, vx, vy, turn, color: rgb(0.55, 0.55, 0.55), opacity: 0.35 });
  });
  return { bytes: await doc.save(), note: `Watermark added to ${doc.getPageCount()} page${doc.getPageCount() === 1 ? "" : "s"}.` };
}

export type NumberFormat = "number" | "page" | "of";
export type NumberPosition = "bottom-center" | "bottom-right" | "bottom-left" | "top-center";

export async function addPageNumbers(
  file: File,
  opts: { format?: NumberFormat; position?: NumberPosition; start?: number } = {}
): Promise<ToolResult> {
  const format = opts.format ?? "number";
  const position = opts.position ?? "bottom-center";
  const start = Number.isFinite(opts.start) ? Math.floor(opts.start as number) : 1;
  const doc = await loadPdf(file);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const total = doc.getPageCount();
  const size = 11;
  const margin = 28;

  doc.getPages().forEach((page, i) => {
    const n = start + i;
    const label = format === "of" ? `Page ${n} of ${start + total - 1}` : format === "page" ? `Page ${n}` : String(n);
    const { width, height } = visualSize(page);
    const w = font.widthOfTextAtSize(label, size);
    let vx = (width - w) / 2;
    if (position === "bottom-right") vx = width - margin - w;
    if (position === "bottom-left") vx = margin;
    const vy = position === "top-center" ? height - margin : margin - 4;
    drawVisualText(page, label, { font, size, vx, vy, color: rgb(0.3, 0.3, 0.3) });
  });
  return { bytes: await doc.save(), note: `Numbered ${total} page${total === 1 ? "" : "s"}.` };
}

// ---------------------------------------------------------------------------
// Helpers shared with the screens
// ---------------------------------------------------------------------------

export function bytesToBlob(bytes: Uint8Array, mime = "application/pdf"): Blob {
  return new Blob([bytes as unknown as BlobPart], { type: mime });
}

export function downloadBytes(bytes: Uint8Array, filename: string, mime = "application/pdf") {
  const blob = bytesToBlob(bytes, mime);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
