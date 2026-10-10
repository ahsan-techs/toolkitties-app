"use client";

import { useState } from "react";
import Dropzone from "@/components/workspace/Dropzone";
import { FileDownload } from "@/components/workspace/OutputPanel";
import { Stack, Field, ErrorNote, btnCls, baseName } from "./ui";

export default function ImageToWebp() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(85);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);

  async function convert() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Your browser could not process this image.");
      ctx.drawImage(bitmap, 0, 0);
      bitmap.close();
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/webp", quality / 100));
      if (!blob || blob.type !== "image/webp") {
        throw new Error("This browser can't create WebP files. Try the latest Chrome, Edge or Firefox.");
      }
      setResult({ blob, filename: `${baseName(file)}.webp` });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try a different image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stack>
      <Dropzone accept="image/*" label="Drop a JPG or PNG here, or click to browse" onFiles={(f) => { setFile(f[0] ?? null); setResult(null); }} />
      {file && <p className="text-sm text-slate">Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)</p>}
      <Field label={`Quality: ${quality}`} hint="Lower quality means a smaller file.">
        <input type="range" min={10} max={100} value={quality} onChange={(e) => { setQuality(Number(e.target.value)); setResult(null); }} className="w-full accent-moss" />
      </Field>
      <button type="button" className={btnCls} disabled={!file || busy} onClick={convert}>
        {busy ? "Converting…" : "Convert to WebP"}
      </button>
      {error && <ErrorNote message={error} />}
      {result && <FileDownload blob={result.blob} filename={result.filename} previewImage />}
    </Stack>
  );
}
