"use client";

import { useState } from "react";
import Dropzone from "@/components/workspace/Dropzone";
import { FileDownload } from "@/components/workspace/OutputPanel";
import { Stack, ErrorNote, btnCls, baseName } from "./ui";

export default function FlipImage() {
  const [file, setFile] = useState<File | null>(null);
  const [flipH, setFlipH] = useState(true);
  const [flipV, setFlipV] = useState(false);
  const [gray, setGray] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ blob: Blob; filename: string } | null>(null);

  async function run() {
    if (!file) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const bitmap = await createImageBitmap(file);
      const w = bitmap.width;
      const h = bitmap.height;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Your browser could not process this image.");
      ctx.save();
      ctx.translate(flipH ? w : 0, flipV ? h : 0);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(bitmap, 0, 0);
      ctx.restore();
      bitmap.close();
      if (gray) {
        const data = ctx.getImageData(0, 0, w, h);
        const px = data.data;
        for (let i = 0; i < px.length; i += 4) {
          const v = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
          px[i] = v;
          px[i + 1] = v;
          px[i + 2] = v;
        }
        ctx.putImageData(data, 0, 0);
      }
      const keep = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
      const type = keep ? file.type : "image/png";
      const ext = type === "image/jpeg" ? "jpg" : type === "image/webp" ? "webp" : "png";
      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, type, 0.92));
      if (!blob) throw new Error("Could not create the image. Please try again.");
      setResult({ blob, filename: `${baseName(file)}-edited.${ext}` });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try a different image.");
    } finally {
      setBusy(false);
    }
  }

  const toggle = (label: string, value: boolean, set: (v: boolean) => void) => (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input type="checkbox" checked={value} onChange={(e) => { set(e.target.checked); setResult(null); }} className="h-4 w-4 accent-moss" />
      {label}
    </label>
  );

  return (
    <Stack>
      <Dropzone accept="image/*" label="Drop an image here, or click to browse" onFiles={(f) => { setFile(f[0] ?? null); setResult(null); }} />
      {file && <p className="text-sm text-slate">Selected: {file.name}</p>}
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {toggle("Flip horizontally (mirror)", flipH, setFlipH)}
        {toggle("Flip vertically", flipV, setFlipV)}
        {toggle("Make black & white", gray, setGray)}
      </div>
      <button type="button" className={btnCls} disabled={!file || busy || (!flipH && !flipV && !gray)} onClick={run}>
        {busy ? "Working…" : "Apply"}
      </button>
      {error && <ErrorNote message={error} />}
      {result && <FileDownload blob={result.blob} filename={result.filename} previewImage />}
    </Stack>
  );
}
