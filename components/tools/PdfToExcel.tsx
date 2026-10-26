"use client";

import { useState } from "react";
import Dropzone from "@/components/workspace/Dropzone";
import { FileDownload } from "@/components/workspace/OutputPanel";
import { pdfToExcel } from "@/lib/tool-processors/pdf-to-excel";
import { Stack, ErrorNote, btnCls, baseName } from "./ui";

export default function PdfToExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      setResult(await pdfToExcel(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not extract a table from this PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stack>
      <Dropzone
        accept="application/pdf,.pdf"
        label={file ? `Selected: ${file.name}` : "Drop a PDF here, or click to browse"}
        onFiles={(f) => {
          setFile(f[0] ?? null);
          setResult(null);
          setError(null);
        }}
      />
      {file && <p className="text-sm text-slate">Selected: {file.name}</p>}
      <p className="text-xs text-slate">Each page becomes its own sheet. Works best on PDFs with real, selectable text — scanned pages need the OCR tool instead.</p>
      <button type="button" className={btnCls} disabled={!file || busy} onClick={run}>
        {busy ? "Extracting…" : "Convert to Excel"}
      </button>
      {error && <ErrorNote message={error} />}
      {result && <FileDownload blob={result} filename={`${baseName(file ?? undefined, "document")}.xlsx`} />}
    </Stack>
  );
}
