"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Dropzone from "@/components/workspace/Dropzone";
import { FileDownload } from "@/components/workspace/OutputPanel";
import { loadPdf, mergePdfs, parsePageRanges, PdfReadError } from "@/lib/tool-processors/pdf-core";
import { explainEncrypted, renderThumbs } from "@/lib/tool-processors/pdf-thumbs";
import { Stack, Field, ErrorNote, btnCls, ghostBtnCls, inputCls } from "./ui";

type Item = {
  id: number;
  file: File;
  pages: number | null; // null = could not be read
  problem?: string;
  range: string;
  thumb?: string;
};

function fmtSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function isPdf(f: File): boolean {
  return f.type === "application/pdf" || /\.pdf$/i.test(f.name);
}

export default function MergePdf() {
  const [items, setItems] = useState<Item[]>([]);
  const [reading, setReading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [outName, setOutName] = useState("merged");
  const [bookmarks, setBookmarks] = useState(true);
  const [result, setResult] = useState<{ blob: Blob; pages: number; files: number } | null>(null);
  const nextId = useRef(1);
  const dragFrom = useRef<number | null>(null);
  const [dragSrc, setDragSrc] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const touch = () => {
    setResult(null);
    setError(null);
  };

  async function addFiles(list: File[]) {
    touch();
    setNotice(null);
    const pdfs = list.filter(isPdf);
    const skipped = list.length - pdfs.length;
    if (skipped > 0) setNotice(`${skipped} file${skipped === 1 ? " was" : "s were"} skipped because ${skipped === 1 ? "it is" : "they are"} not PDF.`);
    if (pdfs.length === 0) return;

    setReading(true);
    const added: Item[] = [];
    for (const file of pdfs) {
      const id = nextId.current++;
      try {
        const doc = await loadPdf(file);
        added.push({ id, file, pages: doc.getPageCount(), range: "" });
      } catch (e) {
        let problem = e instanceof Error ? e.message : "This file could not be read.";
        if (e instanceof PdfReadError && e.encrypted) problem = await explainEncrypted(file);
        added.push({ id, file, pages: null, problem, range: "" });
      }
    }
    if (!alive.current) return;
    setItems((prev) => [...prev, ...added]);
    setReading(false);

    // First-page previews are a bonus: any failure is ignored.
    for (const item of added) {
      if (item.pages === null) continue;
      try {
        await renderThumbs(item.file, {
          maxPages: 1,
          width: 140,
          isCancelled: () => !alive.current,
          onThumb: (_page, url) => setItems((prev) => prev.map((x) => (x.id === item.id ? { ...x, thumb: url } : x))),
        });
      } catch {
        /* no preview */
      }
    }
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    touch();
    setItems((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
  };

  const remove = (id: number) => {
    touch();
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const setRange = (id: number, range: string) => {
    touch();
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, range } : x)));
  };

  const sortByName = () => {
    touch();
    setItems((prev) => [...prev].sort((a, b) => a.file.name.localeCompare(b.file.name, undefined, { numeric: true, sensitivity: "base" })));
  };

  const reverse = () => {
    touch();
    setItems((prev) => [...prev].reverse());
  };

  // Per-file validation of the page range typed by the person.
  const rangeProblems = useMemo(() => {
    const map = new Map<number, string>();
    for (const it of items) {
      if (it.pages === null || !it.range.trim()) continue;
      try {
        parsePageRanges(it.range, it.pages);
      } catch (e) {
        map.set(it.id, e instanceof Error ? e.message : "Invalid page range.");
      }
    }
    return map;
  }, [items]);

  const usable = items.filter((x) => x.pages !== null);
  const totalPages = useMemo(() => {
    let sum = 0;
    for (const it of items) {
      if (it.pages === null) continue;
      if (!it.range.trim()) sum += it.pages;
      else {
        try {
          sum += parsePageRanges(it.range, it.pages).length;
        } catch {
          /* counted as 0 until fixed */
        }
      }
    }
    return sum;
  }, [items]);
  const totalSize = usable.reduce((s, x) => s + x.file.size, 0);
  const canMerge = usable.length >= 2 && rangeProblems.size === 0 && !busy && !reading;

  async function merge() {
    setBusy("Starting…");
    setError(null);
    setResult(null);
    try {
      const title = outName.trim() || "merged";
      const { bytes, pageCount } = await mergePdfs(
        usable.map((x) => ({ file: x.file, range: x.range })),
        { title, bookmarks },
        (d, t) => setBusy(`File ${d} of ${t}`)
      );
      setResult({ blob: new Blob([bytes as unknown as BlobPart], { type: "application/pdf" }), pages: pageCount, files: usable.length });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong while merging. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  const fileName = `${(outName.trim() || "merged").replace(/\.pdf$/i, "").replace(/[\\/:*?"<>|]+/g, "_")}.pdf`;

  return (
    <Stack>
      <Dropzone
        multiple
        accept="application/pdf,.pdf"
        label={items.length ? "Drop more PDFs here, or click to add more" : "Drop your PDFs here, or click to browse (select several at once)"}
        onFiles={addFiles}
      />

      {reading && <p className="text-sm text-slate">Reading your files…</p>}
      {notice && <p className="rounded-xl border border-ink/10 bg-sand/40 px-4 py-3 text-sm text-ink/80">{notice}</p>}

      {items.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-slate">
              {usable.length} file{usable.length === 1 ? "" : "s"} · {totalPages} page{totalPages === 1 ? "" : "s"} · {fmtSize(totalSize)}
              {" · "}Drag ⠿ to reorder
            </p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={ghostBtnCls} onClick={sortByName}>Sort A–Z</button>
              <button type="button" className={ghostBtnCls} onClick={reverse}>Reverse</button>
              <button type="button" className={ghostBtnCls} onClick={() => { touch(); setItems([]); setNotice(null); }}>Clear all</button>
            </div>
          </div>

          <ul className="flex flex-col gap-2">
            {items.map((it, i) => {
              const rangeProblem = rangeProblems.get(it.id);
              return (
                <li
                  key={it.id}
                  data-idx={i}
                  className={`flex flex-col gap-3 rounded-xl border bg-white p-3 text-sm sm:flex-row sm:items-center ${
                    it.pages === null ? "border-red-200" : dragOver === i && dragSrc !== i ? "border-moss ring-2 ring-moss/30" : "border-ink/10"
                  } ${dragSrc === i ? "opacity-60" : ""}`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <button
                      type="button"
                      title="Drag to reorder"
                      aria-label={`Drag ${it.file.name} to reorder`}
                      style={{ touchAction: "none" }}
                      className="flex h-10 w-8 flex-none cursor-grab select-none items-center justify-center rounded-lg text-lg text-slate hover:bg-sand/60 active:cursor-grabbing"
                      onPointerDown={(e) => {
                        e.currentTarget.setPointerCapture(e.pointerId);
                        dragFrom.current = i;
                        setDragSrc(i);
                        setDragOver(i);
                      }}
                      onPointerMove={(e) => {
                        if (dragFrom.current === null) return;
                        const el = document.elementFromPoint(e.clientX, e.clientY)?.closest("li[data-idx]");
                        const to = el ? Number(el.getAttribute("data-idx")) : NaN;
                        if (Number.isFinite(to)) setDragOver(to);
                      }}
                      onPointerUp={() => {
                        const from = dragFrom.current;
                        const to = dragOver;
                        dragFrom.current = null;
                        setDragSrc(null);
                        setDragOver(null);
                        if (from !== null && to !== null) move(from, to);
                      }}
                      onPointerCancel={() => {
                        dragFrom.current = null;
                        setDragSrc(null);
                        setDragOver(null);
                      }}
                    >
                      ⠿
                    </button>
                    <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">{i + 1}</span>
                    {it.thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={it.thumb} alt="" className="h-16 w-12 flex-none rounded border border-ink/10 object-cover" />
                    ) : (
                      <span className="flex h-16 w-12 flex-none items-center justify-center rounded border border-ink/10 bg-sand/40 text-lg">📄</span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{it.file.name}</p>
                      {it.pages === null ? (
                        <p className="text-xs text-red-700">{it.problem} Remove it to continue.</p>
                      ) : (
                        <p className="text-xs text-slate">
                          {it.pages} page{it.pages === 1 ? "" : "s"} · {fmtSize(it.file.size)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-none flex-wrap items-center gap-2">
                    {it.pages !== null && (
                      <div className="flex flex-col">
                        <input
                          className={`${inputCls} !w-36 !px-3 !py-2 text-xs`}
                          value={it.range}
                          onChange={(e) => setRange(it.id, e.target.value)}
                          placeholder="All pages"
                          aria-label={`Pages to use from ${it.file.name}`}
                        />
                      </div>
                    )}
                    <button type="button" className={`${ghostBtnCls} !h-10 !w-10 !px-0 text-base`} onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move ${it.file.name} up`}>↑</button>
                    <button type="button" className={`${ghostBtnCls} !h-10 !w-10 !px-0 text-base`} onClick={() => move(i, i + 1)} disabled={i === items.length - 1} aria-label={`Move ${it.file.name} down`}>↓</button>
                    <button type="button" className={ghostBtnCls} onClick={() => remove(it.id)}>Remove</button>
                  </div>
                  {rangeProblem && <p className="w-full text-xs text-red-700 sm:order-last">{rangeProblem}</p>}
                </li>
              );
            })}
          </ul>
          <p className="text-xs text-slate">
            Tip: to use only some pages of a file, type them in its box, e.g. <span className="font-mono">1-3, 7</span> or <span className="font-mono">odd</span>. Leave it empty to use every page.
          </p>

          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" className="h-4 w-4 accent-moss" checked={bookmarks} onChange={(e) => { setBookmarks(e.target.checked); setResult(null); }} />
            Add a bookmark for each file (easy navigation in the merged PDF)
          </label>
          {totalSize > 250 * 1024 * 1024 && (
            <p className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink">
              These files add up to {fmtSize(totalSize)}. Merging happens on your device, so very large totals can be slow or run out of memory on phones. A laptop works best.
            </p>
          )}
          <Field label="Name of the merged file">
            <input className={inputCls} value={outName} onChange={(e) => { setOutName(e.target.value); setResult(null); }} placeholder="merged" />
          </Field>
        </>
      )}

      <button type="button" className={btnCls} disabled={!canMerge} onClick={merge}>
        {busy ? `Merging… ${busy}` : usable.length < 2 ? "Add at least 2 PDFs to merge" : "Merge PDFs"}
      </button>

      {error && <ErrorNote message={error} />}

      {result && (
        <>
          <p className="text-center text-sm text-ink/80">
            ✅ Merged {result.files} files into one PDF with {result.pages} page{result.pages === 1 ? "" : "s"}.
          </p>
          <FileDownload blob={result.blob} filename={fileName} />
          <div className="flex flex-col gap-2 border-t border-ink/10 pt-4">
            <p className="text-xs font-medium text-slate">What next?</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/compress-pdf" className={ghostBtnCls}>🗜️ Compress the result</Link>
              <Link href="/pdf-page-numbers" className={ghostBtnCls}>🔢 Add page numbers</Link>
              <Link href="/watermark-pdf" className={ghostBtnCls}>💧 Add a watermark</Link>
              <Link href="/split-pdf" className={ghostBtnCls}>✂️ Split a PDF</Link>
            </div>
          </div>
        </>
      )}
    </Stack>
  );
}
