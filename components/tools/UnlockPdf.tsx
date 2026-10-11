"use client";

import { useState } from "react";
import Dropzone from "@/components/workspace/Dropzone";
import { FileDownload } from "@/components/workspace/OutputPanel";
import { unlockPdfAsImages } from "@/lib/tool-processors/pdf-advanced";
import { PdfPasswordError } from "@/lib/tool-processors/pdfjs-loader";
import { Stack, Field, ErrorNote, btnCls, inputCls, baseName } from "./ui";
import PasswordInput from "./PasswordInput";

export default function UnlockPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [dpi, setDpi] = useState(150);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  async function run() {
    if (!file) return;
    setBusy("Starting…");
    setError(null);
    setResult(null);
    try {
      setResult(await unlockPdfAsImages(file, password, { dpi, quality: 0.88 }, (d, t) => setBusy(`Page ${d} of ${t}`)));
    } catch (e) {
      setError(e instanceof PdfPasswordError || e instanceof Error ? e.message : "Something went wrong. Please try another PDF.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <Stack>
      <p className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-ink">
        You need to know the password. This tool opens the PDF with it and saves a new copy that has no password. The pages are rebuilt as pictures, so the new file is larger and its text can no longer be selected or searched.
      </p>
      <Dropzone
        accept="application/pdf,.pdf"
        label="Drop a locked PDF here, or click to browse"
        onFiles={(f) => {
          setFile(f[0] ?? null);
          setResult(null);
          setError(null);
        }}
      />
      {file && <p className="text-sm text-slate">Selected: {file.name}</p>}
      <PasswordInput label="PDF password" value={password} onChange={(v) => { setPassword(v); setResult(null); }} hint="Leave empty if the file opens without a password but has restrictions such as no copying or printing." />
      <Field label="Page sharpness">
        <select className={inputCls} value={dpi} onChange={(e) => { setDpi(Number(e.target.value)); setResult(null); }}>
          <option value={100}>Small file (100 dpi)</option>
          <option value={150}>Standard (150 dpi)</option>
          <option value={200}>Sharp (200 dpi, larger file)</option>
        </select>
      </Field>
      <button type="button" className={btnCls} disabled={!file || busy !== null} onClick={run}>
        {busy ? `Working… ${busy}` : "Unlock PDF"}
      </button>
      {error && <ErrorNote message={error} />}
      {result && <FileDownload blob={result} filename={`${baseName(file ?? undefined, "document")}-unlocked.pdf`} />}
    </Stack>
  );
}
