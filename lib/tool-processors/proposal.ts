import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Business proposals are written and turned into a PDF entirely in the browser.

export type ProposalInput = {
  title: string;
  preparedBy: string;
  client: string;
  date: string; // already formatted for display
  overview: string;
  scope: string; // one deliverable per line
  timeline: string;
  price: string;
  payment: string;
  validDays: number;
  terms: string;
};

export type ProposalSection = { heading: string; paragraphs: string[]; bullets?: string[] };

const bulletLines = (text: string) =>
  text
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-*•\d.)]+\s*/, "").trim())
    .filter(Boolean);

export function composeProposal(p: ProposalInput): { header: [string, string][]; sections: ProposalSection[] } {
  const header: [string, string][] = [];
  if (p.client.trim()) header.push(["Prepared for", p.client.trim()]);
  if (p.preparedBy.trim()) header.push(["Prepared by", p.preparedBy.trim()]);
  if (p.date.trim()) header.push(["Date", p.date.trim()]);

  const sections: ProposalSection[] = [];
  if (p.overview.trim()) sections.push({ heading: "Overview", paragraphs: p.overview.trim().split(/\n{2,}/).map((x) => x.trim()) });
  const scope = bulletLines(p.scope);
  if (scope.length) sections.push({ heading: "Scope of work and deliverables", paragraphs: [], bullets: scope });
  if (p.timeline.trim()) sections.push({ heading: "Timeline", paragraphs: [p.timeline.trim()] });
  if (p.price.trim()) sections.push({ heading: "Investment", paragraphs: [p.price.trim()] });
  if (p.payment.trim()) sections.push({ heading: "Payment terms", paragraphs: [p.payment.trim()] });
  if (p.validDays > 0) {
    sections.push({ heading: "Validity", paragraphs: [`This proposal is valid for ${p.validDays} day${p.validDays === 1 ? "" : "s"}${p.date.trim() ? ` from ${p.date.trim()}` : ""}.`] });
  }
  if (p.terms.trim()) sections.push({ heading: "Terms and conditions", paragraphs: p.terms.trim().split(/\n{2,}/).map((x) => x.trim()) });
  sections.push({ heading: "Acceptance", paragraphs: ["To accept this proposal, please sign and date below."] });
  return { header, sections };
}

export function proposalToText(title: string, p: ProposalInput): string {
  const { header, sections } = composeProposal(p);
  const out: string[] = [`PROPOSAL: ${title.trim() || "Untitled project"}`];
  for (const [k, v] of header) out.push(`${k}: ${v}`);
  for (const s of sections) {
    out.push("", s.heading.toUpperCase());
    s.paragraphs.forEach((t) => out.push(t));
    s.bullets?.forEach((b) => out.push(`- ${b}`));
  }
  out.push("", "Client signature: ______________________   Date: ______________", "Provider signature: ____________________   Date: ______________");
  return out.join("\n");
}

function hexToRgb01(h: string): [number, number, number] {
  const n = parseInt(h.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export async function buildProposalPdf(title: string, p: ProposalInput, accentHex = "#1F5C4C"): Promise<Uint8Array> {
  const { header, sections } = composeProposal(p);
  const doc = await PDFDocument.create();
  doc.setTitle(`Proposal: ${title}`.trim());
  doc.setProducer("Toolkitties");
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const ok = new Set(font.getCharacterSet());
  const [r, g, b] = hexToRgb01(accentHex);
  const accent = rgb(r, g, b);
  const ink = rgb(0.08, 0.09, 0.1);
  const mute = rgb(0.4, 0.42, 0.45);
  const W = 595.28, H = 841.89, M = 56;
  const maxW = W - M * 2;

  // Standard PDF fonts only cover Latin text; anything else becomes "?" so saving never fails.
  const clean = (s: string) =>
    Array.from(s.replace(/\r\n?/g, "\n").replace(/\t/g, " "))
      .map((ch) => (ch === "\n" || ok.has(ch.codePointAt(0)!) ? ch : "?"))
      .join("");

  const wrap = (text: string, f: typeof font, size: number, width: number) => {
    const lines: string[] = [];
    for (const raw of clean(text).split("\n")) {
      let line = "";
      for (const word of raw.split(/\s+/).filter(Boolean)) {
        let w = word;
        while (f.widthOfTextAtSize(w, size) > width) {
          let n = w.length;
          while (n > 1 && f.widthOfTextAtSize(w.slice(0, n), size) > width) n--;
          if (line) { lines.push(line); line = ""; }
          lines.push(w.slice(0, n));
          w = w.slice(n);
        }
        const test = line ? `${line} ${w}` : w;
        if (f.widthOfTextAtSize(test, size) <= width) line = test;
        else { if (line) lines.push(line); line = w; }
      }
      lines.push(line);
    }
    return lines;
  };

  let page = doc.addPage([W, H]);
  page.drawRectangle({ x: 0, y: H - 10, width: W, height: 10, color: accent });
  let y = H - M - 6;
  const need = (h: number) => {
    if (y - h < M + 20) {
      page = doc.addPage([W, H]);
      y = H - M;
    }
  };
  const write = (text: string, o: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb>; x?: number; width?: number; gap?: number }) => {
    const size = o.size ?? 11;
    const f = o.bold ? bold : font;
    const lh = size * 1.45;
    for (const line of wrap(text, f, size, o.width ?? maxW)) {
      need(lh);
      page.drawText(line, { x: o.x ?? M, y: y - size, size, font: f, color: o.color ?? ink });
      y -= lh;
    }
    y -= o.gap ?? 0;
  };

  write("PROPOSAL", { size: 11, bold: true, color: accent, gap: 2 });
  write(title.trim() || "Untitled project", { size: 24, bold: true, gap: 8 });
  for (const [k, v] of header) {
    write(`${k}: ${v}`, { size: 10.5, color: mute });
  }
  y -= 10;
  page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.8, color: rgb(0.86, 0.87, 0.88) });
  y -= 18;

  for (const s of sections) {
    need(60);
    write(s.heading, { size: 13, bold: true, color: accent, gap: 3 });
    for (const para of s.paragraphs) write(para, { gap: 5 });
    for (const item of s.bullets ?? []) {
      need(16);
      page.drawCircle({ x: M + 4, y: y - 7, size: 1.8, color: accent });
      write(item, { x: M + 16, width: maxW - 16, gap: 2 });
    }
    y -= 8;
  }

  // Signature lines
  need(80);
  y -= 14;
  const lineW = (maxW - 30) / 2;
  for (const [i, label] of ["Client signature and date", "Provider signature and date"].entries()) {
    const x = M + i * (lineW + 30);
    page.drawLine({ start: { x, y: y - 28 }, end: { x: x + lineW, y: y - 28 }, thickness: 0.8, color: ink });
    page.drawText(label, { x, y: y - 42, size: 9, font, color: mute });
  }

  const pages = doc.getPages();
  pages.forEach((pg, i) => pg.drawText(`Page ${i + 1} of ${pages.length}`, { x: W - M - 60, y: 28, size: 9, font, color: mute }));
  return doc.save();
}
