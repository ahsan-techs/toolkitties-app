// Loads pdf.js from /public/pdfjs (self-hosted, same site). It is deliberately NOT bundled
// by Next.js (webpackIgnore), so it can never affect the build or other pages.

export type PdfViewport = { width: number; height: number };
export type PdfPage = {
  getViewport(o: { scale: number }): PdfViewport;
  render(o: { canvasContext: CanvasRenderingContext2D; viewport: PdfViewport }): { promise: Promise<void> };
  getTextContent(): Promise<{ items: unknown[] }>;
  cleanup(): void;
};
export type PdfDoc = { numPages: number; getPage(n: number): Promise<PdfPage>; destroy(): Promise<void> };
type PdfjsLib = {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument(src: { data: Uint8Array; password?: string }): { promise: Promise<PdfDoc> };
};

export class PdfPasswordError extends Error {
  incorrect: boolean;
  constructor(incorrect: boolean) {
    super(incorrect ? "That password is not correct." : "This PDF is password protected. Enter its password to continue.");
    this.incorrect = incorrect;
  }
}

let cached: Promise<PdfjsLib> | null = null;

export function loadPdfjs(): Promise<PdfjsLib> {
  if (!cached) {
    const url = "/pdfjs/pdf.min.mjs";
    cached = import(/* webpackIgnore: true */ url).then((m) => {
      (m as PdfjsLib).GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";
      return m as PdfjsLib;
    });
    cached.catch(() => {
      cached = null;
    });
  }
  return cached;
}

export async function openPdf(file: File, password?: string): Promise<PdfDoc> {
  const lib = await loadPdfjs();
  const data = new Uint8Array(await file.arrayBuffer());
  try {
    return await lib.getDocument({ data, password: password || undefined }).promise;
  } catch (e) {
    const err = e as { name?: string; code?: number };
    if (err?.name === "PasswordException") throw new PdfPasswordError(err.code === 2);
    if (err?.name === "InvalidPDFException") throw new Error("This file does not look like a valid PDF.");
    throw e;
  }
}
