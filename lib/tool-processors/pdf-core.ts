import { PDFDocument, PDFHexString, PDFName, type PDFRef } from "pdf-lib";

// Shared logic for Merge PDF and Split PDF. Everything runs in the browser via pdf-lib —
// files are never uploaded.

export class PdfReadError extends Error {
  encrypted: boolean;
  constructor(message: string, encrypted = false) {
    super(message);
    this.name = "PdfReadError";
    this.encrypted = encrypted;
  }
}

export async function loadPdf(file: File): Promise<PDFDocument> {
  let bytes: ArrayBuffer;
  try {
    bytes = await file.arrayBuffer();
  } catch {
    throw new PdfReadError(`"${file.name}" could not be read. Try adding it again.`);
  }
  try {
    return await PDFDocument.load(bytes);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (/encrypt/i.test(msg)) {
      throw new PdfReadError(`"${file.name}" is password protected. Remove the password with Unlock PDF first.`, true);
    }
    throw new PdfReadError(`"${file.name}" does not look like a valid PDF, or it is damaged.`);
  }
}

// ---------------------------------------------------------------------------
// Page ranges: "1-3, 5, 8-" , "odd", "even", "last", "all"
// ---------------------------------------------------------------------------

export function parsePageRanges(input: string, total: number): number[] {
  const text = input.trim().toLowerCase();
  if (!text) throw new Error("Type the pages you want, for example 1-3, 5, 8-10.");
  if (total < 1) throw new Error("This PDF has no pages.");

  const out: number[] = [];
  const parts = text
    .split(/[,;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (parts.length === 0) throw new Error("Type the pages you want, for example 1-3, 5, 8-10.");

  for (const part of parts) {
    if (part === "all") {
      for (let i = 1; i <= total; i++) out.push(i);
      continue;
    }
    if (part === "odd") {
      for (let i = 1; i <= total; i += 2) out.push(i);
      continue;
    }
    if (part === "even") {
      for (let i = 2; i <= total; i += 2) out.push(i);
      continue;
    }

    const norm = part.replace(/\blast\b/g, String(total)).replace(/\s*(?:-|–|—|\bto\b)\s*/g, "-");
    const range = /^(\d*)-(\d*)$/.exec(norm);
    if (range) {
      if (range[1] === "" && range[2] === "") throw new Error(`"${part}" is not a valid page range.`);
      const a = range[1] === "" ? 1 : parseInt(range[1], 10);
      const b = range[2] === "" ? total : parseInt(range[2], 10);
      if (a < 1 || a > total) throw new Error(`Page ${a} doesn't exist. This PDF has ${total} page${total === 1 ? "" : "s"}.`);
      if (b < 1 || b > total) throw new Error(`Page ${b} doesn't exist. This PDF has ${total} page${total === 1 ? "" : "s"}.`);
      if (a > b) throw new Error(`"${part}" goes backwards. Write it as ${b}-${a}.`);
      for (let i = a; i <= b; i++) out.push(i);
      continue;
    }
    if (/^\d+$/.test(norm)) {
      const n = parseInt(norm, 10);
      if (n < 1 || n > total) throw new Error(`Page ${n} doesn't exist. This PDF has ${total} page${total === 1 ? "" : "s"}.`);
      out.push(n);
      continue;
    }
    throw new Error(`Couldn't understand "${part}". Use page numbers and ranges like 1-3, 5, 8-10.`);
  }
  return out;
}

// [1,2,3,5,7,8] -> "1-3, 5, 7-8"
export function formatRanges(pages: number[]): string {
  const sorted = Array.from(new Set(pages)).sort((a, b) => a - b);
  const parts: string[] = [];
  let i = 0;
  while (i < sorted.length) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++;
    parts.push(j > i ? `${sorted[i]}-${sorted[j]}` : String(sorted[i]));
    i = j + 1;
  }
  return parts.join(", ");
}

// ---------------------------------------------------------------------------
// Merge
// ---------------------------------------------------------------------------

export type MergeInput = { file: File; range: string };
export type Progress = (done: number, total: number) => void;

// Adds one top-level bookmark per merged file so readers can jump between the sources.
function addFileBookmarks(doc: PDFDocument, marks: { title: string; pageIndex: number }[]) {
  if (marks.length === 0) return;
  const ctx = doc.context;
  const outlineRef = ctx.nextRef();
  const refs: PDFRef[] = marks.map(() => ctx.nextRef());
  marks.forEach((m, i) => {
    const entries: Record<string, unknown> = {
      Title: PDFHexString.fromText(m.title),
      Parent: outlineRef,
      Dest: [doc.getPage(m.pageIndex).ref, PDFName.of("Fit")],
    };
    if (i > 0) entries.Prev = refs[i - 1];
    if (i < marks.length - 1) entries.Next = refs[i + 1];
    ctx.assign(refs[i], ctx.obj(entries as Parameters<typeof ctx.obj>[0]));
  });
  ctx.assign(outlineRef, ctx.obj({ Type: "Outlines", First: refs[0], Last: refs[refs.length - 1], Count: marks.length }));
  doc.catalog.set(PDFName.of("Outlines"), outlineRef);
}

export async function mergePdfs(
  items: MergeInput[],
  opts: { title?: string; bookmarks?: boolean } = {},
  onProgress?: Progress
): Promise<{ bytes: Uint8Array; pageCount: number }> {
  if (items.length < 2) throw new Error("Add at least two PDFs to merge.");
  const merged = await PDFDocument.create();
  const marks: { title: string; pageIndex: number }[] = [];
  let pageCount = 0;
  for (let i = 0; i < items.length; i++) {
    const { file, range } = items[i];
    const src = await loadPdf(file);
    const total = src.getPageCount();
    const wanted = range.trim() ? parsePageRanges(range, total) : src.getPageIndices().map((n) => n + 1);
    const copied = await merged.copyPages(
      src,
      wanted.map((n) => n - 1)
    );
    marks.push({ title: file.name.replace(/\.pdf$/i, "") || `File ${i + 1}`, pageIndex: pageCount });
    copied.forEach((p) => merged.addPage(p));
    pageCount += copied.length;
    onProgress?.(i + 1, items.length);
  }
  if (opts.bookmarks) addFileBookmarks(merged, marks);
  if (opts.title?.trim()) merged.setTitle(opts.title.trim());
  merged.setProducer("Toolkitties");
  return { bytes: await merged.save(), pageCount };
}

// ---------------------------------------------------------------------------
// Split
// ---------------------------------------------------------------------------

export type SplitMode = "extract" | "each" | "every" | "ranges";
export type SplitOutput = { name: string; bytes: Uint8Array; pages: number };

function safeBase(name: string): string {
  const base = name.replace(/\.[^.]+$/, "").replace(/[\\/:*?"<>|]+/g, "_").trim();
  return base || "document";
}

export function planSplit(mode: SplitMode, value: string, total: number): number[][] {
  if (mode === "extract") return [parsePageRanges(value, total)];

  if (mode === "each") {
    return Array.from({ length: total }, (_, i) => [i + 1]);
  }

  if (mode === "every") {
    const n = Math.floor(Number(value));
    if (!Number.isFinite(n) || n < 1) throw new Error("Enter how many pages each file should have (1 or more).");
    if (n >= total) throw new Error(`This PDF only has ${total} page${total === 1 ? "" : "s"}, so there is nothing to split at ${n} per file. Pick a smaller number.`);
    const groups: number[][] = [];
    for (let start = 1; start <= total; start += n) {
      const g: number[] = [];
      for (let p = start; p < start + n && p <= total; p++) g.push(p);
      groups.push(g);
    }
    return groups;
  }

  // ranges: each group is a separate file, groups separated by ; or a new line
  const groups = value
    .split(/[;\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (groups.length === 0) throw new Error("Type the ranges for each file, separated by semicolons. Example: 1-3; 4-6; 7-10");
  return groups.map((g) => parsePageRanges(g, total));
}

export async function splitPdf(
  file: File,
  mode: SplitMode,
  value: string,
  onProgress?: Progress
): Promise<SplitOutput[]> {
  const src = await loadPdf(file);
  const total = src.getPageCount();
  const groups = planSplit(mode, value, total);
  const base = safeBase(file.name);
  const pad = String(groups.length).length;
  const padPages = String(total).length;

  const outputs: SplitOutput[] = [];
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const doc = await PDFDocument.create();
    const copied = await doc.copyPages(
      src,
      group.map((n) => n - 1)
    );
    copied.forEach((p) => doc.addPage(p));
    doc.setProducer("Toolkitties");
    const bytes = await doc.save();

    let name: string;
    if (mode === "extract") name = `${base}-extracted.pdf`;
    else if (mode === "each") name = `${base}-page-${String(group[0]).padStart(padPages, "0")}.pdf`;
    else name = `${base}-part-${String(i + 1).padStart(pad, "0")}.pdf`;

    outputs.push({ name, bytes, pages: group.length });
    onProgress?.(i + 1, groups.length);
  }
  return outputs;
}
