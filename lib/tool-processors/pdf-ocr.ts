import { createWorker } from "tesseract.js";
import { openPdf } from "./pdfjs-loader";

export type OcrProgress = { page: number; totalPages: number; status: string; progressPct: number };

// Runs OCR on every page of a PDF (rendered to a canvas at a resolution
// good enough for recognition) or directly on a single image file.
// Everything — rendering, recognition, the language model — runs in the
// browser; nothing is uploaded anywhere.
export async function ocrFile(file: File, onProgress?: (p: OcrProgress) => void): Promise<string> {
  const worker = await createWorker("eng", 1, {
    logger: (m) => {
      if (m.status && typeof m.progress === "number") {
        onProgress?.({ page: 0, totalPages: 0, status: m.status, progressPct: Math.round(m.progress * 100) });
      }
    },
  });

  try {
    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      const doc = await openPdf(file);
      try {
        let combined = "";
        for (let n = 1; n <= doc.numPages; n++) {
          const page = await doc.getPage(n);
          const viewport = page.getViewport({ scale: 2 }); // ~200dpi-ish — a good balance of OCR accuracy vs speed/memory
          const canvas = document.createElement("canvas");
          canvas.width = Math.round(viewport.width);
          canvas.height = Math.round(viewport.height);
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("Your browser could not create a drawing surface for this page.");
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport }).promise;
          page.cleanup();

          const { data } = await worker.recognize(canvas);
          combined += (n > 1 ? `\n\n--- Page ${n} ---\n\n` : `--- Page ${n} ---\n\n`) + data.text.trim();
          canvas.width = 0;
          canvas.height = 0;
          onProgress?.({ page: n, totalPages: doc.numPages, status: "page done", progressPct: Math.round((n / doc.numPages) * 100) });
        }
        return combined.trim();
      } finally {
        await doc.destroy();
      }
    }

    const { data } = await worker.recognize(file);
    return data.text.trim();
  } finally {
    await worker.terminate();
  }
}
