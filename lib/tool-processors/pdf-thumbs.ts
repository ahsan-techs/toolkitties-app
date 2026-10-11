import { openPdf, PdfPasswordError } from "./pdfjs-loader";

// Renders small page previews with pdf.js. Previews are a nice-to-have: callers should
// catch errors and carry on without them (for example for password-protected files).
export async function renderThumbs(
  file: File,
  opts: { maxPages: number; width: number; isCancelled: () => boolean; onThumb: (page: number, dataUrl: string) => void }
): Promise<void> {
  const doc = await openPdf(file);
  try {
    const last = Math.min(doc.numPages, opts.maxPages);
    for (let n = 1; n <= last; n++) {
      if (opts.isCancelled()) return;
      const page = await doc.getPage(n);
      const base = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: opts.width / base.width });
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.floor(viewport.width));
      canvas.height = Math.max(1, Math.floor(viewport.height));
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport }).promise;
      const url = canvas.toDataURL("image/jpeg", 0.6);
      canvas.width = 0;
      canvas.height = 0;
      page.cleanup();
      if (opts.isCancelled()) return;
      opts.onThumb(n, url);
    }
  } finally {
    await doc.destroy();
  }
}

// For an encrypted PDF: does it need a password to open, or does it open freely but carry
// editing restrictions (very common for bank and government PDFs)?
export async function explainEncrypted(file: File): Promise<string> {
  const name = `"${file.name}"`;
  try {
    const doc = await openPdf(file);
    await doc.destroy();
    return `${name} opens without a password but has editing restrictions, so it cannot be combined as it is. Run it through Unlock PDF (leave the password empty), then add the unlocked copy here.`;
  } catch (e) {
    if (e instanceof PdfPasswordError) return `${name} is password protected. Remove the password with Unlock PDF first, then add it here.`;
    return `${name} is encrypted and could not be opened. Try Unlock PDF first.`;
  }
}
