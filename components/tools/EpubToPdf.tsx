"use client";

import { useState } from "react";
import Dropzone from "@/components/workspace/Dropzone";
import { FileDownload } from "@/components/workspace/OutputPanel";
import { convertEpubToPdf } from "@/lib/tool-processors/epub-to-pdf";
import { Stack, ErrorNote, btnCls, baseName, blobFrom } from "./ui";

export default function EpubToPdf() {
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
      const bytes = await convertEpubToPdf(file);
      setResult(blobFrom(bytes, "application/pdf"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try another EPUB file.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stack>
      <p className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink">
        This tool copies the <strong>chapter text and headings</strong> out of your EPUB into a clean, readable PDF. The book’s original
        fonts, cover image and exact page layout are not kept — for a quick read or printing the text, this is usually all you need.
      </p>
      <Dropzone
        accept="application/epub+zip,.epub"
        label="Drop an EPUB file here, or click to browse"
        onFiles={(f) => {
          setFile(f[0] ?? null);
          setResult(null);
          setError(null);
        }}
      />
      {file && <p className="text-sm text-slate">Selected: {file.name}</p>}
      <button type="button" className={btnCls} disabled={!file || busy} onClick={run}>
        {busy ? "Converting…" : "Convert to PDF"}
      </button>
      {error && <ErrorNote message={error} />}
      {result && <FileDownload blob={result} filename={`${baseName(file ?? undefined, "book")}.pdf`} />}
    </Stack>
  );
}
