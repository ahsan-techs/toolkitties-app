import * as XLSX from "xlsx";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const MARGIN = 28;
const ROW_HEIGHT = 18;
const FONT_SIZE = 8.5;
const MAX_COL_CHARS = 28; // longer cells are truncated with an ellipsis so columns stay readable

function cellText(v: unknown): string {
  if (v === null || v === undefined) return "";
  const s = String(v);
  return s.length > MAX_COL_CHARS ? s.slice(0, MAX_COL_CHARS - 1) + "…" : s;
}

// Converts every sheet of an .xls/.xlsx workbook into a print-ready, paginated
// PDF table (header row repeated on every page), entirely in the browser.
export async function excelToPdf(file: File): Promise<Blob> {
  const buf = await file.arrayBuffer();
  const workbook = XLSX.read(buf, { type: "array" });
  if (workbook.SheetNames.length === 0) throw new Error("This spreadsheet has no sheets to convert.");

  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (const sheetName of workbook.SheetNames) {
    const ws = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, raw: false, defval: "" }).filter((r) => r.some((c) => String(c ?? "").trim() !== ""));
    if (rows.length === 0) continue;

    const colCount = rows.reduce((max, r) => Math.max(max, r.length), 1);
    const landscape = colCount > 6;
    const pageWidth = landscape ? 841.89 : 595.28; // A4
    const pageHeight = landscape ? 595.28 : 841.89;
    const contentWidth = pageWidth - MARGIN * 2;
    const colWidth = contentWidth / colCount;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - MARGIN;

    // Sheet title
    page.drawText(sheetName, { x: MARGIN, y, size: 13, font: boldFont, color: rgb(0.08, 0.1, 0.09) });
    y -= ROW_HEIGHT + 6;

    const drawHeaderBand = () => {
      page.drawRectangle({ x: MARGIN, y: y - 4, width: contentWidth, height: ROW_HEIGHT, color: rgb(0.93, 0.95, 0.93) });
    };

    const drawRow = (cells: unknown[], bold: boolean) => {
      const rowFont = bold ? boldFont : font;
      cells.slice(0, colCount).forEach((c, i) => {
        page.drawText(cellText(c), { x: MARGIN + i * colWidth + 3, y, size: FONT_SIZE, font: rowFont, color: rgb(0.1, 0.1, 0.1) });
      });
      y -= ROW_HEIGHT;
    };

    const newPageIfNeeded = () => {
      if (y < MARGIN + ROW_HEIGHT) {
        page = pdfDoc.addPage([pageWidth, pageHeight]);
        y = pageHeight - MARGIN;
        drawHeaderBand();
        drawRow(rows[0], true);
      }
    };

    drawHeaderBand();
    drawRow(rows[0], true);
    for (let i = 1; i < rows.length; i++) {
      newPageIfNeeded();
      drawRow(rows[i], false);
    }
  }

  const bytes = await pdfDoc.save();
  return new Blob([bytes as unknown as BlobPart], { type: "application/pdf" });
}
