"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Dropzone from "@/components/workspace/Dropzone";
import { FileDownload } from "@/components/workspace/OutputPanel";
import { PdfReadError } from "@/lib/tool-processors/pdf-core";
import { compressPdf, compressToTarget, type CompressResult, type Level } from "@/lib/tool-processors/pdf-compress";
import { explainEncrypted } from "@/lib/tool-processors/pdf-thumbs";
import { PdfPasswordError } from "@/lib/tool-processors/pdfjs-loader";
import { makeZip } from "@/lib/tool-processors/zip";
import { Stack, Field, ErrorNote, btnCls, ghostBtnCls, inputCls } from "./ui";

const LEVELS: { id: Level; title: string; desc: string; badge?: string }[] = [
  { id: "balanced", title: "Balanced", desc: "Best for email and sharing. Pictures are optimized to about 150 dpi. Text stays sharp and selectable.", badge: "Recommended" },
  { id: "strong", title: "Strong", desc: "Noticeably smaller. Pictures at about 110 dpi, so photos look a little softer. Text stays sharp." },
  { id: "extreme", title: "Extreme", desc: "Smallest with text kept. Pictures at about 85 dpi with visibly lower quality." },
  { id: "lossless", title: "Lossless", desc: "No quality change at all. Only tidies the file structure, so savings are usually small." },
  { id: "flatten", title: "Flatten pages", desc: "Turns every page into a picture. Helps with drawings, maps and heavy vector files. Text can no longer be selected or searched." },
];

type Entry = { id: number; file: File };
type Row =
  | { id: number; name: string; ok: true; blob: Blob | null; result: CompressResult; target: number | null; outName: string }
  | { id: number; name: string; ok: false; error: string };

function fmt(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(bytes >= 10 * 1024 * 1024 ? 1 : 2)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function isPdf(f: File): boolean {
  return f.type === "application/pdf" || /\.pdf$/i.test(f.name);
}

function BlobLink({ blob, name }: { blob: Blob; name: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);
  if (!url) return <span className="text-xs text-slate">Preparing…</span>;
  return (
    <a href={url} download={name} className="flex-none rounded-full bg-moss px-4 py-2 text-xs font-semibold text-paper hover:bg-moss/85">
      Download
    </a>
  );
}

export default function CompressPdf({ initialOpts }: { initialOpts?: Record<string, string> }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [level, setLevel] = useState<Level>("balanced");
  const [target, setTarget] = useState(initialOpts?.targetMb ?? "");
  const [allowFlatten, setAllowFlatten] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [zip, setZip] = useState<Blob | null>(null);
  const nextId = useRef(1);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const targetNum = target.trim() === "" ? null : Number(target);
  const targetInvalid = targetNum !== null && (!Number.isFinite(targetNum) || targetNum <= 0);
  const targetBytes = targetNum !== null && !targetInvalid ? Math.round(targetNum * 1024 * 1024) : null;

  const reset = () => {
    setRows(null);
    setZip(null);
    setError(null);
  };

  function addFiles(list: File[]) {
    reset();
    const pdfs = list.filter(isPdf);
    const skipped = list.length - pdfs.length;
    setNotice(skipped > 0 ? `${skipped} file${skipped === 1 ? " was" : "s were"} skipped because ${skipped === 1 ? "it is" : "they are"} not PDF.` : null);
    setEntries((prev) => [...prev, ...pdfs.map((file) => ({ id: nextId.current++, file }))]);
  }

  async function run() {
    setBusy("Starting…");
    reset();
    const out: Row[] = [];
    const used = new Set<string>();
    for (let i = 0; i < entries.length; i++) {
      const { id, file } = entries[i];
      const prefix = entries.length > 1 ? `File ${i + 1} of ${entries.length} · ` : "";
      const onProgress = (m: string) => alive.current && setBusy(prefix + m);
      try {
        const result = targetBytes !== null ? await compressToTarget(file, targetBytes, { allowFlatten }, onProgress) : await compressPdf(file, level, onProgress);
        let outName = `${file.name.replace(/\.pdf$/i, "") || "document"}-compressed.pdf`;
        for (let n = 2; used.has(outName); n++) outName = `${file.name.replace(/\.pdf$/i, "") || "document"}-compressed-${n}.pdf`;
        used.add(outName);
        out.push({
          id,
          name: file.name,
          ok: true,
          blob: result.keptOriginal ? null : new Blob([result.bytes as unknown as BlobPart], { type: "application/pdf" }),
          result,
          target: targetBytes,
          outName,
        });
      } catch (e) {
        let message = e instanceof Error ? e.message : "This file could not be compressed.";
        if ((e instanceof PdfReadError && e.encrypted) || e instanceof PdfPasswordError) message = await explainEncrypted(file);
        out.push({ id, name: file.name, ok: false, error: message });
      }
      if (!alive.current) return;
    }
    setRows(out);
    const good = out.filter((r): r is Extract<Row, { ok: true }> => r.ok && r.blob !== null && r.result.newSize < r.result.originalSize);
    if (good.length > 1) {
      const bytes = makeZip(good.map((r) => ({ name: r.outName, data: r.result.bytes })));
      setZip(new Blob([bytes as unknown as BlobPart], { type: "application/zip" }));
    }
    setBusy(null);
  }

  const totalBefore = rows ? rows.reduce((s, r) => s + (r.ok ? r.result.originalSize : 0), 0) : 0;
  const totalAfter = rows ? rows.reduce((s, r) => s + (r.ok ? r.result.newSize : 0), 0) : 0;
  const okCount = rows ? rows.filter((r) => r.ok).length : 0;
  const single = rows && rows.length === 1 ? rows[0] : null;

  return (
    <Stack>
      <Dropzone
        multiple
        accept="application/pdf,.pdf"
        label={entries.length ? "Drop more PDFs here, or click to add more" : "Drop your PDFs here, or click to browse"}
        onFiles={addFiles}
      />
      {notice && <p className="rounded-xl border border-ink/10 bg-sand/40 px-4 py-3 text-sm text-ink/80">{notice}</p>}

      {entries.length > 0 && (
        <ul className="flex flex-col gap-2">
          {entries.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white px-4 py-2 text-sm">
              <span className="min-w-0 truncate font-medium text-ink">{e.file.name}</span>
              <span className="flex flex-none items-center gap-3">
                <span className="text-xs text-slate">{fmt(e.file.size)}</span>
                <button type="button" className={ghostBtnCls} disabled={busy !== null} onClick={() => { reset(); setEntries((p) => p.filter((x) => x.id !== e.id)); }}>
                  Remove
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <fieldset className={`flex flex-col gap-2 ${targetBytes !== null ? "opacity-50" : ""}`} disabled={targetBytes !== null || busy !== null}>
        <legend className="mb-1 text-xs font-medium text-ink">Compression level</legend>
        {LEVELS.map((l) => (
          <label
            key={l.id}
            className={`flex cursor-pointer items-start gap-3 rounded-xl border bg-white p-3 text-sm transition ${level === l.id ? "border-moss ring-1 ring-moss/40" : "border-ink/10 hover:border-moss/40"}`}
          >
            <input type="radio" name="compress-level" className="mt-1 accent-moss" checked={level === l.id} onChange={() => { setLevel(l.id); reset(); }} />
            <span className="flex flex-col gap-0.5">
              <span className="font-semibold text-ink">
                {l.title}
                {l.badge && <span className="ml-2 rounded-full bg-moss/10 px-2 py-0.5 text-[10px] font-semibold text-moss">{l.badge}</span>}
              </span>
              <span className="text-xs text-slate">{l.desc}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-sand/40 p-4">
        <Field label="Or compress to a target size (optional)" hint="We start gently and only increase compression until the file fits.">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0.05}
              step={0.1}
              className={`${inputCls} !w-32`}
              value={target}
              onChange={(e) => { setTarget(e.target.value); reset(); }}
              placeholder="e.g. 2"
              aria-label="Target size in megabytes"
            />
            <span className="text-sm text-ink">MB</span>
            {target && (
              <button type="button" className={ghostBtnCls} onClick={() => { setTarget(""); reset(); }}>
                Clear
              </button>
            )}
          </div>
        </Field>
        {targetInvalid && <p className="text-xs text-red-700">Enter a size bigger than 0, for example 2.</p>}
        {targetBytes !== null && (
          <label className="flex items-start gap-2 text-xs text-ink">
            <input type="checkbox" className="mt-0.5 accent-moss" checked={allowFlatten} onChange={(e) => { setAllowFlatten(e.target.checked); reset(); }} />
            If it still does not fit, convert pages to pictures (text can no longer be selected)
          </label>
        )}
      </div>

      <button type="button" className={btnCls} disabled={entries.length === 0 || busy !== null || targetInvalid} onClick={run}>
        {busy ? `Compressing… ${busy}` : targetBytes !== null ? `Compress to ${target} MB` : entries.length > 1 ? `Compress ${entries.length} PDFs` : "Compress PDF"}
      </button>
      <p className="text-center text-xs text-slate">Your files never leave your device. Everything happens in this browser tab.</p>

      {error && <ErrorNote message={error} />}

      {rows && (
        <div className="flex flex-col gap-3">
          {okCount > 1 && totalBefore > totalAfter && (
            <p className="text-center text-sm font-medium text-ink">
              Total: {fmt(totalBefore)} → {fmt(totalAfter)} (−{Math.round((1 - totalAfter / totalBefore) * 100)}%)
            </p>
          )}
          {rows.map((r) => {
            if (!r.ok) {
              return (
                <div key={r.id} className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  <p className="font-medium">{r.name}</p>
                  <p>{r.error}</p>
                </div>
              );
            }
            const { result } = r;
            const pct = Math.round((1 - result.newSize / result.originalSize) * 100);
            const targetMiss = r.target !== null && result.reachedTarget === false;
            const targetHit = r.target !== null && result.reachedTarget === true && !result.keptOriginal;
            return (
              <div key={r.id} className="flex flex-col gap-2 rounded-xl border border-ink/10 bg-white p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{r.name}</p>
                    {result.keptOriginal ? (
                      <p className="text-xs text-slate">{fmt(result.originalSize)} · could not be made smaller</p>
                    ) : (
                      <p className="text-xs text-slate">
                        {fmt(result.originalSize)} → <span className="font-semibold text-moss">{fmt(result.newSize)}</span> (−{pct}%)
                      </p>
                    )}
                  </div>
                  {r.blob && rows.length > 1 && <BlobLink blob={r.blob} name={r.outName} />}
                </div>
                {result.keptOriginal && r.target !== null && result.reachedTarget === true && (
                  <p className="text-xs text-moss">This file is already under your {fmt(r.target)} target, so nothing was changed.</p>
                )}
                {result.keptOriginal && !(r.target !== null && result.reachedTarget === true) && (
                  <p className="text-xs text-ink/80">
                    {result.level === "lossless"
                      ? "Lossless mode only tidies the file structure, and this file has nothing to tidy, so we kept your original. Choose Balanced to shrink the pictures."
                      : result.imagesFound === 0 && result.imagesSkipped > 0
                        ? "The pictures in this PDF use a format we leave untouched to keep colours exact (for example CMYK print images). Try \"Flatten pages\" if you accept that text becomes pictures."
                        : result.imagesFound === 0
                          ? "This PDF has no large pictures to shrink (it is made of text and vector drawings), so we kept your original."
                          : "This PDF is already well optimized, so we kept your original instead of giving you a bigger file."}
                    {r.target === null && result.imagesFound > 0 && result.level !== "extreme" && result.level !== "flatten" ? " A stronger level may help." : ""}
                  </p>
                )}
                {!result.keptOriginal && result.level !== "flatten" && result.imagesFound > 0 && (
                  <p className="text-xs text-slate">
                    {result.imagesRecompressed} of {result.imagesFound} pictures optimized. Text is unchanged and still selectable.
                  </p>
                )}
                {!result.keptOriginal && result.level !== "flatten" && result.imagesFound === 0 && result.level !== "lossless" && (
                  <p className="text-xs text-slate">No large pictures found, so only the file structure was tidied.</p>
                )}
                {!result.keptOriginal && result.level === "flatten" && (
                  <p className="text-xs text-slate">Pages were converted to pictures, so text can no longer be selected.</p>
                )}
                {targetHit && <p className="text-xs text-moss">✓ Reached your {fmt(r.target ?? 0)} target.</p>}
                {targetMiss && (
                  <p className="text-xs text-red-700">
                    Closest we could get is {fmt(result.newSize)}, above your {fmt(r.target ?? 0)} target.
                    {!allowFlatten ? " Tick the option to convert pages to pictures to go smaller." : " Try splitting the file into parts."}
                  </p>
                )}
              </div>
            );
          })}

          {zip && <FileDownload blob={zip} filename="compressed-pdfs.zip" />}
          {single && single.ok && single.blob && <FileDownload blob={single.blob} filename={single.outName} />}

          <div className="flex flex-col gap-2 border-t border-ink/10 pt-4">
            <p className="text-xs font-medium text-slate">What next?</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/merge-pdf" className={ghostBtnCls}>🧩 Merge PDFs</Link>
              <Link href="/split-pdf" className={ghostBtnCls}>✂️ Split a PDF</Link>
              <Link href="/protect-pdf" className={ghostBtnCls}>🔒 Protect with a password</Link>
            </div>
          </div>
        </div>
      )}
    </Stack>
  );
}
