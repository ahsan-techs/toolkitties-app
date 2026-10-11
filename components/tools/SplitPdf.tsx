"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Dropzone from "@/components/workspace/Dropzone";
import { FileDownload } from "@/components/workspace/OutputPanel";
import { formatRanges, loadPdf, parsePageRanges, PdfReadError, splitPdf, type SplitMode, type SplitOutput } from "@/lib/tool-processors/pdf-core";
import { explainEncrypted, renderThumbs } from "@/lib/tool-processors/pdf-thumbs";
import { makeZip } from "@/lib/tool-processors/zip";
import { Stack, Field, ErrorNote, btnCls, ghostBtnCls, inputCls, baseName } from "./ui";

const MODES: { id: SplitMode; label: string; help: string }[] = [
  { id: "extract", label: "Extract pages", help: "Pick pages (click them below or type a range) and save them as one new PDF." },
  { id: "each", label: "Every page separately", help: "Turns each page into its own PDF file, bundled in a ZIP." },
  { id: "every", label: "Every N pages", help: "Cuts the document into equal parts, for example every 5 pages." },
  { id: "ranges", label: "Custom ranges", help: "Make several PDFs at once. Separate files with a semicolon or a new line, for example: 1-3; 4-6; 7-10" },
];

const MAX_THUMBS = 100; // previews are generated for the first pages only, to keep big files fast
const MAX_TILES = 200;

function BlobLink({ blob, name, pages }: { blob: Blob; name: string; pages: number }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);
  if (!url) return null;
  return (
    <a href={url} download={name} className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white px-4 py-2 text-sm text-ink hover:border-moss/50">
      <span className="truncate">{name}</span>
      <span className="flex-none text-xs text-slate">{pages} page{pages === 1 ? "" : "s"} · Download</span>
    </a>
  );
}

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [thumbs, setThumbs] = useState<Record<number, string>>({});
  const [loadingPreviews, setLoadingPreviews] = useState(false);
  const [mode, setMode] = useState<SplitMode>("extract");
  const [rangeText, setRangeText] = useState("");
  const [everyN, setEveryN] = useState("2");
  const [groupsText, setGroupsText] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<{ name: string; blob: Blob; pages: number }[] | null>(null);
  const [zip, setZip] = useState<Blob | null>(null);
  const token = useRef(0);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      token.current++;
    };
  }, []);

  const clearResult = () => {
    setOutputs(null);
    setZip(null);
    setError(null);
  };

  async function onFile(files: File[]) {
    const f = files[0];
    token.current++;
    const mine = token.current;
    clearResult();
    setThumbs({});
    setPageCount(0);
    setRangeText("");
    setGroupsText("");
    setFile(null);
    if (!f) return;
    if (!(f.type === "application/pdf" || /\.pdf$/i.test(f.name))) {
      setError("That file is not a PDF. Please choose a .pdf file.");
      return;
    }
    try {
      const doc = await loadPdf(f);
      if (mine !== token.current) return;
      setFile(f);
      setPageCount(doc.getPageCount());
    } catch (e) {
      let message = e instanceof Error ? e.message : "This file could not be read.";
      if (e instanceof PdfReadError && e.encrypted) message = await explainEncrypted(f);
      if (mine === token.current) setError(message);
      return;
    }

    // Page previews are optional: if they fail, page numbers still work.
    setLoadingPreviews(true);
    try {
      await renderThumbs(f, {
        maxPages: MAX_THUMBS,
        width: 150,
        isCancelled: () => mine !== token.current || !alive.current,
        onThumb: (page, url) => setThumbs((t) => (mine === token.current ? { ...t, [page]: url } : t)),
      });
    } catch {
      /* no previews */
    } finally {
      if (mine === token.current && alive.current) setLoadingPreviews(false);
    }
  }

  // The set of pages currently chosen in "extract" mode, derived from the text box.
  const selected = useMemo(() => {
    if (mode !== "extract" || !rangeText.trim() || pageCount === 0) return new Set<number>();
    try {
      return new Set(parsePageRanges(rangeText, pageCount));
    } catch {
      return new Set<number>();
    }
  }, [mode, rangeText, pageCount]);

  const toggle = (n: number) => {
    clearResult();
    const next = new Set<number>(selected);
    if (next.has(n)) next.delete(n);
    else next.add(n);
    setRangeText(formatRanges(Array.from(next)));
  };

  // Live check of the inputs so the person sees what will happen before clicking.
  const plan = useMemo(() => {
    if (!file || pageCount === 0) return { files: 0, error: null as string | null };
    try {
      if (mode === "extract") {
        if (!rangeText.trim()) return { files: 0, error: null };
        parsePageRanges(rangeText, pageCount);
        return { files: 1, error: null };
      }
      if (mode === "each") return { files: pageCount, error: null };
      if (mode === "every") {
        const n = Math.floor(Number(everyN));
        if (!Number.isFinite(n) || n < 1) return { files: 0, error: "Enter how many pages each file should have." };
        if (n >= pageCount) return { files: 0, error: `This PDF only has ${pageCount} page${pageCount === 1 ? "" : "s"}. Pick a smaller number.` };
        return { files: Math.ceil(pageCount / n), error: null };
      }
      const groups = groupsText.split(/[;\n]+/).map((s) => s.trim()).filter(Boolean);
      if (groups.length === 0) return { files: 0, error: null };
      groups.forEach((g) => parsePageRanges(g, pageCount));
      return { files: groups.length, error: null };
    } catch (e) {
      return { files: 0, error: e instanceof Error ? e.message : "Invalid input." };
    }
  }, [file, pageCount, mode, rangeText, everyN, groupsText]);

  async function run() {
    if (!file) return;
    setBusy("Starting…");
    clearResult();
    try {
      const value = mode === "extract" ? rangeText : mode === "every" ? everyN : mode === "ranges" ? groupsText : "";
      const parts: SplitOutput[] = await splitPdf(file, mode, value, (d, t) => setBusy(`${d} of ${t}`));
      const mapped = parts.map((p) => ({ name: p.name, pages: p.pages, blob: new Blob([p.bytes as unknown as BlobPart], { type: "application/pdf" }) }));
      setOutputs(mapped);
      if (mapped.length > 1) {
        const bytes = makeZip(parts.map((p) => ({ name: p.name, data: p.bytes })));
        setZip(new Blob([bytes as unknown as BlobPart], { type: "application/zip" }));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong while splitting. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  const base = baseName(file ?? undefined, "document");
  const tiles = Math.min(pageCount, MAX_TILES);
  const interactive = mode === "extract";
  const help = MODES.find((m) => m.id === mode)?.help ?? "";
  const buttonLabel =
    mode === "extract"
      ? "Extract pages"
      : plan.files > 1
        ? `Split into ${plan.files} PDFs`
        : "Split PDF";

  return (
    <Stack>
      <Dropzone accept="application/pdf,.pdf" label={file ? `Selected: ${file.name}` : "Drop a PDF here, or click to browse"} onFiles={onFile} />

      {file && pageCount > 0 && (
        <>
          <p className="text-sm text-slate">
            {file.name} · {pageCount} page{pageCount === 1 ? "" : "s"}
          </p>
          {file.size > 150 * 1024 * 1024 && (
            <p className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink">
              This file is large ({(file.size / 1024 / 1024).toFixed(0)} MB). Splitting happens on your device, so it can be slow on phones. A laptop works best.
            </p>
          )}

          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Split method">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={mode === m.id}
                onClick={() => {
                  setMode(m.id);
                  clearResult();
                }}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  mode === m.id ? "border-ink bg-ink text-paper" : "border-ink/15 bg-white text-ink hover:border-moss/50"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate">{help}</p>

          {mode === "extract" && (
            <Field label="Pages to extract" hint="Examples: 1-3, 5, 8-10 · odd · even · 4- (page 4 to the end)">
              <input className={inputCls} value={rangeText} onChange={(e) => { setRangeText(e.target.value); clearResult(); }} placeholder="1-3, 5" />
            </Field>
          )}
          {mode === "extract" && (
            <div className="flex flex-wrap gap-2">
              <button type="button" className={ghostBtnCls} onClick={() => { clearResult(); setRangeText(`1-${pageCount}`); }}>Select all</button>
              <button type="button" className={ghostBtnCls} onClick={() => { clearResult(); setRangeText("odd"); }}>Odd pages</button>
              <button type="button" className={ghostBtnCls} onClick={() => { clearResult(); setRangeText("even"); }}>Even pages</button>
              <button type="button" className={ghostBtnCls} onClick={() => { clearResult(); setRangeText(""); }}>Clear</button>
            </div>
          )}
          {mode === "every" && (
            <Field label="Pages per file">
              <input type="number" min={1} className={inputCls} value={everyN} onChange={(e) => { setEveryN(e.target.value); clearResult(); }} />
            </Field>
          )}
          {mode === "ranges" && (
            <Field label="Ranges (one file per range)" hint="Example: 1-3; 4-6; 7-10">
              <textarea rows={3} className={`${inputCls} resize-none`} value={groupsText} onChange={(e) => { setGroupsText(e.target.value); clearResult(); }} placeholder={"1-3; 4-6; 7-10"} />
            </Field>
          )}

          {plan.error && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{plan.error}</p>}

          <div>
            <p className="mb-2 text-xs font-medium text-ink">
              {interactive ? "Click pages to select them" : "Pages"}
              {loadingPreviews && <span className="ml-2 font-normal text-slate">Loading previews…</span>}
              {interactive && selected.size > 0 && <span className="ml-2 font-normal text-moss">{selected.size} selected</span>}
            </p>
            <div className="grid max-h-[26rem] grid-cols-3 gap-2 overflow-y-auto rounded-2xl border border-ink/10 bg-sand/40 p-3 sm:grid-cols-4 md:grid-cols-5">
              {Array.from({ length: tiles }, (_, i) => i + 1).map((n) => {
                const on = selected.has(n);
                return (
                  <button
                    key={n}
                    type="button"
                    disabled={!interactive}
                    onClick={() => toggle(n)}
                    aria-pressed={interactive ? on : undefined}
                    aria-label={`Page ${n}`}
                    className={`relative flex flex-col items-center gap-1 rounded-lg border-2 bg-white p-1.5 text-xs transition disabled:cursor-default ${
                      on ? "border-moss" : "border-transparent"
                    } ${interactive ? "hover:border-moss/50" : ""}`}
                  >
                    {thumbs[n] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumbs[n]} alt="" className="h-28 w-auto max-w-full rounded border border-ink/10 object-contain" />
                    ) : (
                      <span className="flex h-28 w-full items-center justify-center rounded border border-ink/10 bg-sand/60 text-slate">📄</span>
                    )}
                    <span className={on ? "font-semibold text-moss" : "text-ink/70"}>{n}</span>
                    {on && <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-moss text-[10px] text-paper">✓</span>}
                  </button>
                );
              })}
            </div>
            {pageCount > MAX_TILES && (
              <p className="mt-2 text-xs text-slate">
                Showing the first {MAX_TILES} pages. For other pages, type the numbers in the box (this PDF has {pageCount} pages).
              </p>
            )}
            {pageCount > MAX_THUMBS && pageCount <= MAX_TILES && (
              <p className="mt-2 text-xs text-slate">Previews are shown for the first {MAX_THUMBS} pages only.</p>
            )}
          </div>
        </>
      )}

      <button type="button" className={btnCls} disabled={!file || pageCount === 0 || busy !== null || plan.files === 0 || !!plan.error} onClick={run}>
        {busy ? `Working… ${busy}` : buttonLabel}
      </button>

      {error && <ErrorNote message={error} />}

      {outputs && outputs.length === 1 && (
        <>
          <p className="text-center text-sm text-ink/80">✅ Created a PDF with {outputs[0].pages} page{outputs[0].pages === 1 ? "" : "s"}.</p>
          <FileDownload blob={outputs[0].blob} filename={outputs[0].name} />
        </>
      )}
      {outputs && outputs.length > 1 && (
        <>
          <p className="text-center text-sm text-ink/80">✅ Created {outputs.length} PDF files.</p>
          {zip && <FileDownload blob={zip} filename={`${base}-split.zip`} />}
          <div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
            {outputs.slice(0, 60).map((o) => (
              <BlobLink key={o.name} blob={o.blob} name={o.name} pages={o.pages} />
            ))}
            {outputs.length > 60 && <p className="text-xs text-slate">…and {outputs.length - 60} more inside the ZIP.</p>}
          </div>
        </>
      )}

      {outputs && (
        <div className="flex flex-col gap-2 border-t border-ink/10 pt-4">
          <p className="text-xs font-medium text-slate">What next?</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/merge-pdf" className={ghostBtnCls}>🧩 Merge PDFs</Link>
            <Link href="/compress-pdf" className={ghostBtnCls}>🗜️ Compress a PDF</Link>
            <Link href="/organize-pdf" className={ghostBtnCls}>📑 Reorder pages</Link>
          </div>
        </div>
      )}
    </Stack>
  );
}
