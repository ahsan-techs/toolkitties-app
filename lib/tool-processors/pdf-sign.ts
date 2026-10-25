import { PDFDocument } from "pdf-lib";
import { openPdf } from "./pdfjs-loader";

export type SignaturePlacement = {
  // Fractions (0..1) of the page size, measured from the TOP-LEFT — this
  // matches how the preview canvas and the drag handle are measured.
  xFrac: number;
  yFrac: number;
  widthFrac: number;
};

// Renders page 1 of a PDF to a data URL, purely so the signer can see where
// on the page they're placing the signature. Nothing leaves the browser.
export async function renderPdfPagePreview(file: File, targetWidth = 700): Promise<{ dataUrl: string; width: number; height: number }> {
  const doc = await openPdf(file);
  try {
    const page = await doc.getPage(1);
    const base = page.getViewport({ scale: 1 });
    const viewport = page.getViewport({ scale: targetWidth / base.width });
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(viewport.width));
    canvas.height = Math.max(1, Math.round(viewport.height));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Your browser could not create a drawing surface for this page.");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: ctx, viewport }).promise;
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    canvas.width = 0;
    canvas.height = 0;
    page.cleanup();
    return { dataUrl, width: canvas.width, height: canvas.height };
  } finally {
    await doc.destroy();
  }
}

// Burns a transparent-background signature PNG onto a PDF at a fractional
// position, either on page 1 only or on every page, and returns the signed
// file as a downloadable Blob. All of this runs locally with pdf-lib.
export async function signPdf(file: File, signaturePngDataUrl: string, placement: SignaturePlacement, allPages: boolean): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(bytes);
  const pngBytes = await (await fetch(signaturePngDataUrl)).arrayBuffer();
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const aspect = pngImage.height / pngImage.width;

  const allPdfPages = pdfDoc.getPages();
  const targetPages = allPages ? allPdfPages : allPdfPages.slice(0, 1);

  for (const page of targetPages) {
    const { width: pw, height: ph } = page.getSize();
    const drawWidth = placement.widthFrac * pw;
    const drawHeight = drawWidth * aspect;
    const x = placement.xFrac * pw;
    // placement.yFrac is measured from the TOP of the page; pdf-lib's
    // origin is bottom-left, so flip it before drawing.
    const y = ph - placement.yFrac * ph - drawHeight;
    page.drawImage(pngImage, { x, y, width: drawWidth, height: drawHeight });
  }

  const outBytes = await pdfDoc.save();
  return new Blob([outBytes as unknown as BlobPart], { type: "application/pdf" });
}
