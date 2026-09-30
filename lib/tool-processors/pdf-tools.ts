import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";

// All PDF processing happens locally in the browser via pdf-lib — files are
// never uploaded to a server.

export async function mergePdfs(files: File[]): Promise<Uint8Array> {
  const merged = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const src = await PDFDocument.load(bytes);
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
  }
  return merged.save();
}

export async function splitPdf(file: File, pageNumbers: number[]): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const out = await PDFDocument.create();
  const zeroIndexed = pageNumbers.map((n) => n - 1);
  const pages = await out.copyPages(src, zeroIndexed);
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

export async function compressPdf(file: File): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  // Re-saving with object streams and no metadata trims redundant structure —
  // real-world savings depend on the source file.
  return doc.save({ useObjectStreams: true, addDefaultPage: false });
}

export async function rotatePdf(file: File, degreesToRotate: number): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  doc.getPages().forEach((page) => {
    const current = page.getRotation().angle;
    page.setRotation(degrees(current + degreesToRotate));
  });
  return doc.save();
}

export async function deletePages(file: File, pagesToRemove: number[]): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const sorted = [...pagesToRemove].sort((a, b) => b - a);
  sorted.forEach((pageNum) => doc.removePage(pageNum - 1));
  return doc.save();
}

export async function reorderPages(file: File, newOrder: number[]): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const src = await PDFDocument.load(bytes);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, newOrder.map((n) => n - 1));
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

export async function watermarkPdf(file: File, text: string): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  doc.getPages().forEach((page) => {
    const { width, height } = page.getSize();
    page.drawText(text, {
      x: width / 2 - (text.length * 10) / 2,
      y: height / 2,
      size: 40,
      font,
      color: rgb(0.6, 0.6, 0.6),
      opacity: 0.35,
      rotate: degrees(-30),
    });
  });
  return doc.save();
}

export async function addPageNumbers(file: File): Promise<Uint8Array> {
  const bytes = await file.arrayBuffer();
  const doc = await PDFDocument.load(bytes);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  doc.getPages().forEach((page, i) => {
    const { width } = page.getSize();
    page.drawText(String(i + 1), {
      x: width / 2,
      y: 24,
      size: 11,
      font,
      color: rgb(0.35, 0.35, 0.35),
    });
  });
  return doc.save();
}

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
