"use client";

import { useState } from "react";
import Dropzone from "@/components/workspace/Dropzone";
import { ocrFile, type OcrProgress } from "@/lib/tool-processors/pdf-ocr";
import { Stack, ErrorNote, btnCls } from "./ui";

export default function PdfOcr() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [progress, setProgress] = useState<OcrProgress | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setText(null);
    setProgress(null);
    try {
      const result = await ocrFile(file, setProgress);
      if (!result) throw new Error("No readable text was found in this file.");
      setText(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "OCR failed on this file.");
    } finally {
      setBusy(false);
      setProgress(null);
    }
  }

  function download() {
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(file?.name ?? "document").replace(/\.[^.]+$/, "")}-ocr.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Stack>
      <Dropzone
        accept="application/pdf,.pdf,image/*"
        label={file ? `Selected: ${file.name}` : "Drop a scanned PDF or an image here, or click to browse"}
        onFiles={(f) => {
          setFile(f[0] ?? null);
          setText(null);
          setError(null);
        }}
      />
      {file && <p className="text-sm text-slate">Selected: {file.name}</p>}
      <p className="text-xs text-slate">First run downloads a small language model (once, cached by your browser). Multi-page PDFs are processed page by page — large scans can take a minute or two.</p>
      <button type="button" className={btnCls} disabled={!file || busy} onClick={run}>
        {busy ? "Reading text…" : "Extract text (OCR)"}
      </button>
      {busy && progress && (
        <p className="text-xs text-slate">
          ⚙️ {progress.totalPages ? `Page ${progress.page || 1} of ${progress.totalPages}` : progress.status} — {progress.progressPct}%
        </p>
      )}
      {error && <ErrorNote message={error} />}
      {text && (
        <div className="flex flex-col gap-2">
          <textarea readOnly value={text} rows={14} className="w-full rounded-xl border border-ink/15 bg-white p-3 text-sm text-ink" />
          <button type="button" className={btnCls} onClick={download}>
            Download as .txt
          </button>
        </div>
      )}
    </Stack>
  );
}
