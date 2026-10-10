"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import Dropzone from "@/components/workspace/Dropzone";
import { FileDownload } from "@/components/workspace/OutputPanel";
import { Stack, Field, ErrorNote, btnCls, ghostBtnCls, inputCls, blobFrom } from "./ui";

const A4 = { w: 595.28, h: 841.89 };
const MARGIN = 24;

// Draws the image through a canvas so phone photos keep the right orientation.
async function rasterize(file: File, type: "image/jpeg" | "image/png"): Promise<Uint8Array> {
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not process one of the images.");
  if (type === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, type, 0.92));
  if (!blob) throw new Error("Could not read one of the images.");
  return new Uint8Array(await blob.arrayBuffer());
}

export default function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [size, setSize] = useState<"fit" | "a4">("fit");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  const move = (i: number, dir: -1 | 1) => {
    setResult(null);
    setFiles((list) => {
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const copy = [...list];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };

  async function build() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const pdf = await PDFDocument.create();
      for (const file of files) {
        const isPng = file.type === "image/png";
        const bytes = await rasterize(file, isPng ? "image/png" : "image/jpeg");
        const img = isPng ? await pdf.embedPng(bytes) : await pdf.embedJpg(bytes);
        if (size === "fit") {
          const page = pdf.addPage([img.width, img.height]);
          page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        } else {
          const landscape = img.width > img.height;
          const pw = landscape ? A4.h : A4.w;
          const ph = landscape ? A4.w : A4.h;
          const scale = Math.min((pw - MARGIN * 2) / img.width, (ph - MARGIN * 2) / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          const page = pdf.addPage([pw, ph]);
          page.drawImage(img, { x: (pw - w) / 2, y: (ph - h) / 2, width: w, height: h });
        }
      }
      setResult(blobFrom(await pdf.save(), "application/pdf"));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try different images.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stack>
      <Dropzone
        multiple
        accept="image/*"
        label="Drop images here, or click to browse (you can add several)"
        onFiles={(f) => {
          setResult(null);
          setFiles((prev) => [...prev, ...f.filter((x) => x.type.startsWith("image/"))]);
        }}
      />
      {files.length > 0 && (
        <ul className="flex flex-col gap-2">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white px-4 py-2 text-sm">
              <span className="truncate">{i + 1}. {f.name}</span>
              <span className="flex flex-none gap-2">
                <button type="button" className={ghostBtnCls} onClick={() => move(i, -1)} aria-label={`Move ${f.name} up`}>↑</button>
                <button type="button" className={ghostBtnCls} onClick={() => move(i, 1)} aria-label={`Move ${f.name} down`}>↓</button>
                <button type="button" className={ghostBtnCls} onClick={() => { setResult(null); setFiles((l) => l.filter((_, k) => k !== i)); }}>Remove</button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <Field label="Page size">
        <select className={inputCls} value={size} onChange={(e) => { setSize(e.target.value as "fit" | "a4"); setResult(null); }}>
          <option value="fit">Same size as each image</option>
          <option value="a4">A4 page with margins</option>
        </select>
      </Field>
      <button type="button" className={btnCls} disabled={files.length === 0 || busy} onClick={build}>
        {busy ? "Creating PDF…" : "Create PDF"}
      </button>
      {error && <ErrorNote message={error} />}
      {result && <FileDownload blob={result} filename="images.pdf" />}
    </Stack>
  );
}
