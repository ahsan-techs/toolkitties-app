import JSZip from "jszip";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

// Honest scope, matching the rest of the site's document converters: this keeps the
// book's chapter text and heading structure, in reading order, laid out as a clean,
// readable PDF — it does not reproduce the EPUB's original fonts, page images, or
// exact visual layout. A text-focused conversion is something this can actually do
// reliably and verify; faithfully re-rendering arbitrary EPUB CSS/HTML is not.

type Block = { kind: "h1" | "h2" | "p"; text: string };

function resolvePath(base: string, href: string): string {
  if (href.startsWith("/")) return href.slice(1);
  const baseDir = base.includes("/") ? base.slice(0, base.lastIndexOf("/") + 1) : "";
  const combined = (baseDir + href).split("/");
  const out: string[] = [];
  for (const seg of combined) {
    if (seg === "." || seg === "") continue;
    if (seg === "..") out.pop();
    else out.push(seg);
  }
  return out.join("/");
}

function findOpfPath(containerXml: string): string {
  const m = containerXml.match(/full-path\s*=\s*["']([^"']+)["']/i);
  if (!m) throw new Error("This doesn't look like a valid EPUB file (no container.xml rootfile).");
  return m[1];
}

function extractMeta(opfXml: string): { title: string; author: string } {
  const title = opfXml.match(/<dc:title[^>]*>([\s\S]*?)<\/dc:title>/i)?.[1]?.trim() || "Untitled";
  const author = opfXml.match(/<dc:creator[^>]*>([\s\S]*?)<\/dc:creator>/i)?.[1]?.trim() || "";
  return { title: decodeEntities(title), author: decodeEntities(author) };
}

function extractManifest(opfXml: string): Map<string, string> {
  const map = new Map<string, string>();
  const itemRe = /<item\b[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(opfXml))) {
    const tag = m[0];
    const id = tag.match(/\bid\s*=\s*["']([^"']+)["']/i)?.[1];
    const href = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
    if (id && href) map.set(id, href);
  }
  return map;
}

function extractSpine(opfXml: string): string[] {
  const spineBlock = opfXml.match(/<spine[\s\S]*?>([\s\S]*?)<\/spine>/i)?.[1] ?? "";
  const refs: string[] = [];
  const itemrefRe = /<itemref\b[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemrefRe.exec(spineBlock))) {
    const idref = m[0].match(/\bidref\s*=\s*["']([^"']+)["']/i)?.[1];
    if (idref) refs.push(idref);
  }
  return refs;
}

// The common named HTML entities actually seen in real ebook/web content — curly
// quotes, dashes, ellipsis, non-breaking space, and the handful of symbol entities
// that show up often enough to matter. &amp; is deliberately decoded LAST, since
// decoding it earlier would turn a literal "&amp;mdash;" in source text into
// "&mdash;" and then incorrectly decode that too.
const NAMED_ENTITIES: Record<string, string> = {
  lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  mdash: "\u2014", ndash: "\u2013", hellip: "\u2026",
  lsquo: "\u2018", rsquo: "\u2019", ldquo: "\u201C", rdquo: "\u201D",
  copy: "\u00A9", reg: "\u00AE", trade: "\u2122",
};

function decodeEntities(s: string): string {
  let out = s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const codePoint = code[1]?.toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
    }
    const lower = code.toLowerCase();
    return lower === "amp" ? match : (NAMED_ENTITIES[lower] ?? match);
  });
  out = out.replace(/&amp;/g, "&");
  return out;
}

// Turns one chapter's (X)HTML into an ordered list of heading/paragraph blocks.
// Deliberately simple and robust rather than a full HTML parser: strips <script>/
// <style> content outright, treats h1/h2 (and h3-h6, folded into h2) as headings,
// everything else block-level as a paragraph, and collapses whitespace.
function htmlToBlocks(html: string): Block[] {
  let body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  body = body.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "");

  const blocks: Block[] = [];
  const blockRe = /<(h1|h2|h3|h4|h5|h6|p|div|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  let matchedAny = false;
  while ((m = blockRe.exec(body))) {
    matchedAny = true;
    const tag = m[1].toLowerCase();
    const text = decodeEntities(m[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    if (!text) continue;
    blocks.push({ kind: tag === "h1" ? "h1" : /^h[2-6]$/.test(tag) ? "h2" : "p", text });
  }
  // Fallback for chapters that aren't built from clean block tags: just take all the text.
  if (!matchedAny) {
    const text = decodeEntities(body.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    if (text) blocks.push({ kind: "p", text });
  }
  return blocks;
}

export async function convertEpubToPdf(file: File): Promise<Uint8Array> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(file);
  } catch {
    throw new Error("Couldn't open this file as an EPUB — it may be corrupted, or not actually an EPUB file.");
  }

  const containerFile = zip.file("META-INF/container.xml");
  if (!containerFile) throw new Error("This doesn't look like a valid EPUB file (missing META-INF/container.xml).");
  const containerXml = await containerFile.async("string");
  const opfPath = findOpfPath(containerXml);

  const opfFile = zip.file(opfPath);
  if (!opfFile) throw new Error("This EPUB's package file is missing or corrupted.");
  const opfXml = await opfFile.async("string");

  const { title, author } = extractMeta(opfXml);
  const manifest = extractManifest(opfXml);
  const spineIds = extractSpine(opfXml);
  if (spineIds.length === 0) throw new Error("This EPUB doesn't list any chapters to convert.");

  const allBlocks: Block[] = [];
  for (const id of spineIds) {
    const href = manifest.get(id);
    if (!href) continue;
    const path = resolvePath(opfPath, href);
    const chapterFile = zip.file(path);
    if (!chapterFile) continue;
    const html = await chapterFile.async("string");
    allBlocks.push(...htmlToBlocks(html));
  }
  if (allBlocks.length === 0) throw new Error("Couldn't find any readable text in this EPUB.");

  // --- Lay it out as a PDF, same page-break-safe approach as the invoice/proposal
  // generators: compute each block's height before drawing, start a new page rather
  // than split one.
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const W = 595.28,
    H = 841.89,
    M = 56; // A4, in points
  const ink = rgb(0.08, 0.09, 0.1);
  const muted = rgb(0.4, 0.4, 0.42);

  let page = doc.addPage([W, H]);
  let y = H - M;

  const wrap = (text: string, f: typeof font, size: number, maxWidth: number): string[] => {
    const words = text.split(" ");
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (f.widthOfTextAtSize(candidate, size) > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
    return lines;
  };

  const need = (h: number) => {
    if (y - h < M) {
      page = doc.addPage([W, H]);
      y = H - M;
    }
  };

  // Title page
  const titleLines = wrap(title, bold, 26, W - M * 2);
  y -= 120;
  for (const l of titleLines) {
    page.drawText(l, { x: M, y, size: 26, font: bold, color: ink });
    y -= 32;
  }
  if (author) {
    y -= 10;
    page.drawText(author, { x: M, y, size: 14, font, color: muted });
  }
  page = doc.addPage([W, H]);
  y = H - M;

  for (const block of allBlocks) {
    const size = block.kind === "h1" ? 18 : block.kind === "h2" ? 14 : 11;
    const f = block.kind === "p" ? font : bold;
    const lead = size * 1.5;
    const topGap = block.kind === "p" ? 0 : 14;
    need(topGap + lead);
    y -= topGap;
    for (const line of wrap(block.text, f, size, W - M * 2)) {
      need(lead);
      page.drawText(line, { x: M, y: y - size, size, font: f, color: ink });
      y -= lead;
    }
    if (block.kind === "p") y -= 4;
  }

  return doc.save();
}
