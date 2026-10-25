"use client";

import { useState } from "react";
import Dropzone from "@/components/workspace/Dropzone";
import { FileDownload } from "@/components/workspace/OutputPanel";
import { excelToPdf } from "@/lib/tool-processors/xlsx-pdf";
import { Stack, ErrorNote, btnCls, baseName } from "./ui";

export default function ExcelToPdf() {
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
      setResult(await excelToPdf(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not convert this spreadsheet. Make sure it's a valid .xls or .xlsx file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stack>
      <Dropzone
        accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        label={file ? `Selected: ${file.name}` : "Drop an Excel file here, or click to browse"}
        onFiles={(f) => {
          setFile(f[0] ?? null);
          setResult(null);
          setError(null);
        }}
      />
      {file && <p className="text-sm text-slate">Selected: {file.name}</p>}
      <p className="text-xs text-slate">Every sheet becomes its own page(s). Wide sheets (more than 6 columns) print in landscape automatically. Header rows repeat on every page.</p>
      <button type="button" className={btnCls} disabled={!file || busy} onClick={run}>
        {busy ? "Converting…" : "Convert to PDF"}
      </button>
      {error && <ErrorNote message={error} />}
      {result && <FileDownload blob={result} filename={`${baseName(file ?? undefined, "spreadsheet")}.pdf`} />}
    </Stack>
  );
}
