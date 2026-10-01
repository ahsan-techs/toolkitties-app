import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { money, num, type Item } from "./invoice-math";

// Built entirely in the browser with pdf-lib — nothing is uploaded anywhere.

export type PdfInvoice = {
  number: string;
  issueDate: string; // already formatted for display
  dueText: string;
  currency: string;
  fromName: string;
  fromDetails: string;
  toName: string;
  toDetails: string;
  items: Item[];
  taxPct: number;
  discountPct: number;
  totals: { subtotal: number; discount: number; tax: number; total: number };
  notes: string;
  lateTerms: string;
  converted: string; // e.g. "Approx. EUR 920.00 at 1 USD = 0.9200 EUR"
};

export type PdfOptions = { size: "A4" | "Letter"; accent: string; compact: boolean };

function parseHex(h: string): [number, number, number] {
  const n = parseInt(h.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export async function buildInvoicePdf(inv: PdfInvoice, opt: PdfOptions): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Invoice ${inv.number}`.trim());
  doc.setProducer("Toolkitties");
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const ok = new Set(font.getCharacterSet());

  const [W, H] = opt.size === "Letter" ? [612, 792] : [595.28, 841.89];
  const M = 48;
  const [r, g, b] = parseHex(opt.accent);
  const accent = rgb(r, g, b);
  const tint = rgb(1 - (1 - r) * 0.1, 1 - (1 - g) * 0.1, 1 - (1 - b) * 0.1);
  const ink = rgb(0.08, 0.09, 0.1);
  const mute = rgb(0.4, 0.42, 0.45);
  const rule = rgb(0.86, 0.87, 0.88);
  const white = rgb(1, 1, 1);
  type Col = typeof ink;
  const fs = opt.compact ? 9.5 : 10.5;
  const pad = opt.compact ? 5 : 10;

  let page = doc.addPage([W, H]);
  page.drawRectangle({ x: 0, y: H - 10, width: W, height: 10, color: accent });
  let y = H - M - 4;

  // Standard PDF fonts only cover Latin text; swap anything else for "?" so saving never fails.
  const clean = (s: string) =>
    Array.from(s.replace(/\r\n?/g, "\n").replace(/\t/g, " "))
      .map((ch) => (ch === "\n" || ok.has(ch.codePointAt(0)!) ? ch : "?"))
      .join("");

  const wrap = (t: string, f: typeof font, size: number, maxW: number) => {
    const out: string[] = [];
    for (const raw of clean(t).split("\n")) {
      let ln = "";
      for (const word of raw.split(/\s+/).filter(Boolean)) {
        let w = word;
        while (f.widthOfTextAtSize(w, size) > maxW) {
          let n = w.length;
          while (n > 1 && f.widthOfTextAtSize(w.slice(0, n), size) > maxW) n--;
          if (ln) {
            out.push(ln);
            ln = "";
          }
          out.push(w.slice(0, n));
          w = w.slice(n);
        }
        const test = ln ? `${ln} ${w}` : w;
        if (f.widthOfTextAtSize(test, size) <= maxW) ln = test;
        else {
          out.push(ln);
          ln = w;
        }
      }
      out.push(ln);
    }
    return out;
  };

  const put = (t: string, x: number, top: number, size: number, o: { b?: boolean; c?: Col; r?: boolean } = {}) => {
    const s = clean(t).replace(/\n/g, " ");
    const f = o.b ? bold : font;
    page.drawText(s, { x: o.r ? x - f.widthOfTextAtSize(s, size) : x, y: top - size, size, font: f, color: o.c ?? ink });
  };

  const need = (h: number) => {
    if (y - h < M + 14) {
      page = doc.addPage([W, H]);
      y = H - M;
      return true;
    }
    return false;
  };

  const para = (t: string, o: { size?: number; b?: boolean; c?: Col; x?: number; w?: number } = {}) => {
    const size = o.size ?? fs;
    const lead = size * 1.45;
    const x = o.x ?? M;
    for (const l of wrap(t, o.b ? bold : font, size, o.w ?? W - M - x)) {
      need(lead);
      if (l) put(l, x, y, size, { b: o.b, c: o.c });
      y -= l ? lead : lead * 0.6;
    }
  };

  // ---- Header ----
  put("INVOICE", M, y, 26, { b: true, c: accent });
  let my = y;
  for (const [k, v] of [["Invoice #", inv.number || "-"], ["Issued", inv.issueDate], ["Due", inv.dueText]] as [string, string][]) {
    if (!v) continue;
    put(v, W - M, my, fs, { b: true, r: true });
    put(k, W - M - bold.widthOfTextAtSize(clean(v), fs) - 12, my, fs, { c: mute, r: true });
    my -= fs + 7;
  }
  y -= 62;

  // ---- From / Bill to ----
  const colW = (W - 2 * M - 30) / 2;
  const top = y;
  let low = y;
  for (const [label, name, det, x] of [
    ["FROM", inv.fromName, inv.fromDetails, M],
    ["BILL TO", inv.toName, inv.toDetails, M + colW + 30],
  ] as [string, string, string, number][]) {
    y = top;
    put(label, x, y, 8.5, { b: true, c: mute });
    y -= 16;
    if (name.trim()) para(name, { b: true, size: fs + 1, x, w: colW });
    if (det.trim()) para(det, { size: fs - 0.5, c: mute, x, w: colW });
    low = Math.min(low, y);
  }
  y = low - 22;

  // ---- Items table ----
  const amtR = W - M - 8;
  const rateR = amtR - 100;
  const qtyR = rateR - 80;
  const descW = qtyR - 50 - (M + 8);
  const head = () => {
    page.drawRectangle({ x: M, y: y - 22, width: W - 2 * M, height: 22, color: accent });
    put("DESCRIPTION", M + 8, y - 6, 8.5, { b: true, c: white });
    put("QTY", qtyR, y - 6, 8.5, { b: true, c: white, r: true });
    put("RATE", rateR, y - 6, 8.5, { b: true, c: white, r: true });
    put("AMOUNT", amtR, y - 6, 8.5, { b: true, c: white, r: true });
    y -= 22 + pad;
  };
  need(60);
  head();
  for (const it of inv.items.filter((i) => i.description.trim())) {
    const lines = wrap(it.description, font, fs, descW);
    const h = lines.length * (fs + 4) + pad;
    if (y - h < M + 14) {
      page = doc.addPage([W, H]);
      y = H - M;
      head();
    }
    lines.forEach((l, i) => put(l, M + 8, y - i * (fs + 4), fs));
    put(String(num(it.qty)), qtyR, y, fs, { r: true });
    put(money(num(it.rate), inv.currency), rateR, y, fs, { r: true });
    put(money(num(it.qty) * num(it.rate), inv.currency), amtR, y, fs, { b: true, r: true });
    y -= h;
    page.drawLine({ start: { x: M, y: y + pad - 4 }, end: { x: W - M, y: y + pad - 4 }, thickness: 0.6, color: rule });
  }

  // ---- Totals ----
  need(120);
  y -= 6;
  const lx = W - M - 230;
  const row = (label: string, value: string) => {
    put(label, lx, y, fs, { c: mute });
    put(value, amtR, y, fs, { r: true });
    y -= fs + 8;
  };
  row("Subtotal", money(inv.totals.subtotal, inv.currency));
  if (inv.totals.discount > 0) row(`Discount (${+inv.discountPct.toFixed(2)}%)`, `-${money(inv.totals.discount, inv.currency)}`);
  if (inv.totals.tax > 0) row(`Tax (${+inv.taxPct.toFixed(2)}%)`, money(inv.totals.tax, inv.currency));
  y -= 4;
  page.drawRectangle({ x: lx - 10, y: y - 26, width: W - M - lx + 10, height: 32, color: tint });
  put("Total due", lx, y - 5, 12, { b: true, c: accent });
  put(money(inv.totals.total, inv.currency), amtR, y - 4, 14, { b: true, c: accent, r: true });
  y -= 44;
  if (inv.converted) {
    put(inv.converted, amtR, y, 8.5, { c: mute, r: true });
    y -= 22;
  }

  // ---- Notes & late terms ----
  for (const [label, text] of [["NOTES & PAYMENT DETAILS", inv.notes], ["LATE PAYMENT TERMS", inv.lateTerms]] as [string, string][]) {
    if (!text.trim()) continue;
    need(54);
    y -= 8;
    put(label, M, y, 8.5, { b: true, c: mute });
    y -= 16;
    para(text, { size: fs - 0.5 });
  }

  // ---- Footer on every page ----
  const pages = doc.getPages();
  pages.forEach((p, i) => {
    p.drawText("Created free with Toolkitties.com", { x: M, y: 26, size: 8, font, color: mute });
    if (pages.length > 1) {
      const s = `Page ${i + 1} of ${pages.length}`;
      p.drawText(s, { x: W - M - font.widthOfTextAtSize(s, 8), y: 26, size: 8, font, color: mute });
    }
  });

  return doc.save();
}
