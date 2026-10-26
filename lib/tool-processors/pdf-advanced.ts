import { PDFDocument } from "pdf-lib";
import { openPdf, type PdfPage } from "./pdfjs-loader";
import { pageToStructuredParagraphs, type TextItem } from "./pdf-text";
import { buildDocx, type DocBlock } from "./docx-lite";
import { encryptPdfDocument } from "./pdf-encrypt";

// PDF -> JPG, PDF -> Word (text only), Protect PDF and Unlock PDF. All of it runs in the browser.

type Progress = (done: number, total: number) => void;

const MAX_PIXELS = 25_000_000; // keeps huge pages from exhausting memory

async function renderJpeg(page: PdfPage, scale: number, quality: number) {
  let viewport = page.getViewport({ scale });
  if (viewport.width * viewport.height > MAX_PIXELS) {
    viewport = page.getViewport({ scale: scale * Math.sqrt(MAX_PIXELS / (viewport.width * viewport.height)) });
  }
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create a drawing surface for this page.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", quality));
  canvas.width = 0;
  canvas.height = 0;
  if (!blob) throw new Error("Could not create an image from this page.");
  return blob;
}

export async function pdfToJpgPages(
  file: File,
  opts: { password?: string; dpi: number; quality: number },
  onProgress?: Progress
): Promise<Blob[]> {
  const doc = await openPdf(file, opts.password);
  try {
    const out: Blob[] = [];
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      out.push(await renderJpeg(page, opts.dpi / 72, opts.quality));
      page.cleanup();
      onProgress?.(n, doc.numPages);
    }
    return out;
  } finally {
    await doc.destroy();
  }
}

export async function pdfToDocx(file: File, password: string | undefined, onProgress?: Progress): Promise<Blob> {
  const doc = await openPdf(file, password);
  try {
    const pagesParas: { text: string; size: number }[][] = [];
    let chars = 0;
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const content = await page.getTextContent();
      const paras = pageToStructuredParagraphs(content.items as TextItem[]);
      pagesParas.push(paras);
      for (const p of paras) chars += p.text.length;
      page.cleanup();
      onProgress?.(n, doc.numPages);
    }
    if (chars < 10) {
      throw new Error(
        "No selectable text was found in this PDF — it looks like a scanned document (pictures of pages). Use the PDF OCR tool instead, which reads text out of scanned pages."
      );
    }

    // Body size = the most common paragraph size across the document.
    // Anything noticeably larger is treated as a heading — a simple,
    // honest heuristic (not true layout reconstruction, just a readable
    // structure instead of one flat wall of text).
    const allSizes = pagesParas.flat().map((p) => Math.round(p.size));
    const freq = new Map<number, number>();
    for (const s of allSizes) freq.set(s, (freq.get(s) ?? 0) + 1);
    const bodySize = [...freq.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 11;

    const blocks: DocBlock[] = [];
    pagesParas.forEach((paras, n) => {
      if (n > 0) blocks.push({ type: "pagebreak" });
      for (const p of paras) {
        if (p.size >= bodySize * 1.45) blocks.push({ type: "heading", text: p.text, level: 1 });
        else if (p.size >= bodySize * 1.15) blocks.push({ type: "heading", text: p.text, level: 2 });
        else blocks.push({ type: "p", text: p.text });
      }
    });
    const bytes = buildDocx(blocks);
    return new Blob([bytes as unknown as BlobPart], {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
  } finally {
    await doc.destroy();
  }
}

export async function protectPdf(file: File, password: string): Promise<Blob> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let pdf: PDFDocument;
  try {
    pdf = await PDFDocument.load(bytes);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (/encrypt/i.test(msg)) throw new Error("This PDF already has a password. Unlock it first, then protect it again.");
    throw new Error("This file could not be read as a PDF.");
  }
  await encryptPdfDocument(pdf, password);
  const out = await pdf.save({ useObjectStreams: false, updateFieldAppearances: false });
  return new Blob([out as unknown as BlobPart], { type: "application/pdf" });
}

// Rebuilds the PDF from page pictures, so the new file opens without a password.
export async function unlockPdfAsImages(
  file: File,
  password: string,
  opts: { dpi: number; quality: number },
  onProgress?: Progress
): Promise<Blob> {
  const doc = await openPdf(file, password);
  try {
    const out = await PDFDocument.create();
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const size = page.getViewport({ scale: 1 });
      const jpg = await renderJpeg(page, opts.dpi / 72, opts.quality);
      const img = await out.embedJpg(new Uint8Array(await jpg.arrayBuffer()));
      const p = out.addPage([size.width, size.height]);
      p.drawImage(img, { x: 0, y: 0, width: size.width, height: size.height });
      page.cleanup();
      onProgress?.(n, doc.numPages);
    }
    const bytes = await out.save();
    return new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
  } finally {
    await doc.destroy();
  }
}
