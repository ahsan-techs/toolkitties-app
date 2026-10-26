import * as XLSX from "xlsx";
import { openPdf } from "./pdfjs-loader";
import type { TextItem } from "./pdf-text";

// Groups a page's raw text items into rows (by y-proximity, same approach as
// pageToParagraphs) and then splits each row into cells wherever the
// horizontal gap between items is much wider than a normal word-space —
// a simple, dependency-free heuristic for column boundaries in a table.
function pageToRows(rawItems: TextItem[]): string[][] {
  const items = rawItems.filter(
    (i): i is Required<Pick<TextItem, "str" | "transform">> & TextItem =>
      typeof i.str === "string" && i.str.trim() !== "" && Array.isArray(i.transform) && i.transform.length >= 6
  );
  if (items.length === 0) return [];

  type Line = { y: number; size: number; items: { x: number; w: number; str: string }[] };
  const sorted = [...items].sort((a, b) => b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4]);
  const lines: Line[] = [];
  for (const it of sorted) {
    const y = it.transform[5];
    const size = Math.abs(it.transform[3]) || it.height || 10;
    const line = lines.find((l) => Math.abs(l.y - y) <= Math.max(l.size, size) * 0.5);
    const entry = { x: it.transform[4], w: it.width ?? 0, str: it.str };
    if (line) line.items.push(entry);
    else lines.push({ y, size, items: [entry] });
  }
  lines.sort((a, b) => b.y - a.y);

  return lines.map((line) => {
    line.items.sort((a, b) => a.x - b.x);
    const cells: string[] = [];
    let current = "";
    let prevEnd: number | null = null;
    for (const it of line.items) {
      const gap = prevEnd === null ? 0 : it.x - prevEnd;
      if (prevEnd !== null && gap > line.size * 1.6) {
        cells.push(current.replace(/\s+/g, " ").trim());
        current = it.str;
      } else {
        if (prevEnd !== null && gap > line.size * 0.2 && !current.endsWith(" ")) current += " ";
        current += it.str;
      }
      prevEnd = it.x + it.w;
    }
    cells.push(current.replace(/\s+/g, " ").trim());
    return cells.filter((c, i) => c !== "" || i < cells.length - 1);
  });
}

// Extracts every page's table-like text into one workbook (one sheet per
// page), purely from the PDF's embedded text layer — works best on PDFs
// with real tables, not scanned images (those need OCR, a separate tool).
export async function pdfToExcel(file: File): Promise<Blob> {
  const doc = await openPdf(file);
  try {
    const workbook = XLSX.utils.book_new();
    let anySheet = false;
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const content = await page.getTextContent();
      const rows = pageToRows(content.items as TextItem[]);
      page.cleanup();
      if (rows.length === 0) continue;
      const ws = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, ws, `Page ${n}`.slice(0, 31));
      anySheet = true;
    }
    if (!anySheet) {
      throw new Error("No extractable text found — this looks like a scanned PDF. Try the OCR tool instead, which reads scanned pages.");
    }
    const bytes = XLSX.write(workbook, { type: "array", bookType: "xlsx" }) as ArrayBuffer;
    return new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  } finally {
    await doc.destroy();
  }
}
