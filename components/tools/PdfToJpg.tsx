"use client";

import { useEffect, useMemo, useState } from "react";
import Dropzone from "@/components/workspace/Dropzone";
import { FileDownload } from "@/components/workspace/OutputPanel";
import { pdfToJpgPages } from "@/lib/tool-processors/pdf-advanced";
import { PdfPasswordError } from "@/lib/tool-processors/pdfjs-loader";
import { makeZip } from "@/lib/tool-processors/zip";
import { Stack, Field, ErrorNote, btnCls, inputCls, baseName } from "./ui";
import PasswordInput from "./PasswordInput";

function PageResult({ blob, name, n }: { blob: Blob; name: string; n: number }) {
  const url = useMemo(() => URL.createObjectURL(blob), [blob]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return (
    <a href={url} download={name} className="flex flex-col items-center gap-1 rounded-xl border border-ink/10 bg-white p-2 text-xs text-ink hover:border-moss/50">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={`Page ${n}`} className="h-32 w-auto rounded border border-ink/10" />
      Page {n} · Download
    </a>
  );
}

export default function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [dpi, setDpi] = useState(150);
  const [quality, setQuality] = useState(90);
  const [password, setPassword] = useState("");
  const [needPassword, setNeedPassword] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<Blob[] | null>(null);

  async function run() {
    if (!file) return;
    setBusy("Starting…");
    setError(null);
    setPages(null);
    try {
      const blobs = await pdfToJpgPages(file, { password, dpi, quality: quality / 100 }, (d, t) => setBusy(`Page ${d} of ${t}`));
      setPages(blobs);
    } catch (e) {
      if (e instanceof PdfPasswordError) setNeedPassword(true);
      setError(e instanceof Error ? e.message : "Something went wrong. Please try another PDF.");
    } finally {
      setBusy(null);
    }
  }

  const name = baseName(file ?? undefined, "pdf");
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  useEffect(() => {
    let alive = true;
    if (!pages || pages.length < 2) {
      setZipBlob(null);
      return;
    }
    Promise.all(pages.map(async (b, i) => ({ name: `${name}-page-${i + 1}.jpg`, data: new Uint8Array(await b.arrayBuffer()) }))).then((entries) => {
      if (alive) setZipBlob(new Blob([makeZip(entries) as unknown as BlobPart], { type: "application/zip" }));
    });
    return () => {
      alive = false;
    };
  }, [pages, name]);

  return (
    <Stack>
      <Dropzone
        accept="application/pdf,.pdf"
        label="Drop a PDF here, or click to browse"
        onFiles={(f) => {
          setFile(f[0] ?? null);
          setPages(null);
          setError(null);
          setNeedPassword(false);
          setPassword("");
        }}
      />
      {file && <p className="text-sm text-slate">Selected: {file.name}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Image sharpness">
          <select className={inputCls} value={dpi} onChange={(e) => { setDpi(Number(e.target.value)); setPages(null); }}>
            <option value={100}>Small (100 dpi)</option>
            <option value={150}>Standard (150 dpi)</option>
            <option value={200}>Sharp (200 dpi)</option>
            <option value={300}>Print quality (300 dpi, large files)</option>
          </select>
        </Field>
        <Field label={`JPG quality: ${quality}`}>
          <input type="range" min={50} max={100} value={quality} onChange={(e) => { setQuality(Number(e.target.value)); setPages(null); }} className="w-full accent-moss" />
        </Field>
      </div>
      {needPassword && <PasswordInput label="PDF password" value={password} onChange={setPassword} />}
      <button type="button" className={btnCls} disabled={!file || busy !== null} onClick={run}>
        {busy ? `Working… ${busy}` : "Convert to JPG"}
      </button>
      {error && <ErrorNote message={error} />}
      {pages && pages.length === 1 && <FileDownload blob={pages[0]} filename={`${name}.jpg`} previewImage />}
      {pages && pages.length > 1 && (
        <>
          {zipBlob && <FileDownload blob={zipBlob} filename={`${name}-pages.zip`} />}
          <div className="flex flex-wrap gap-3">
            {pages.map((b, i) => (
              <PageResult key={i} blob={b} n={i + 1} name={`${name}-page-${i + 1}.jpg`} />
            ))}
          </div>
        </>
      )}
    </Stack>
  );
}
