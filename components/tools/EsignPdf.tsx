"use client";

import { useEffect, useRef, useState } from "react";
import Dropzone from "@/components/workspace/Dropzone";
import { FileDownload } from "@/components/workspace/OutputPanel";
import { renderPdfPagePreview, signPdf, type SignaturePlacement } from "@/lib/tool-processors/pdf-sign";
import { Stack, ErrorNote, btnCls, ghostBtnCls, baseName } from "./ui";

export default function EsignPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<{ dataUrl: string; width: number; height: number } | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const [hasStroke, setHasStroke] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [placement, setPlacement] = useState<SignaturePlacement>({ xFrac: 0.1, yFrac: 0.8, widthFrac: 0.25 });
  const [allPages, setAllPages] = useState(false);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blob | null>(null);

  const padRef = useRef<HTMLCanvasElement>(null);
  const previewBoxRef = useRef<HTMLDivElement>(null);
  const drawing = useRef(false);
  const dragging = useRef(false);

  // Render page 1 as a preview the moment a PDF is dropped.
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    let cancelled = false;
    setLoadingPreview(true);
    setPreviewError(null);
    renderPdfPagePreview(file)
      .then((p) => !cancelled && setPreview(p))
      .catch((e) => !cancelled && setPreviewError(e instanceof Error ? e.message : "Could not preview this PDF."))
      .finally(() => !cancelled && setLoadingPreview(false));
    return () => {
      cancelled = true;
    };
  }, [file]);

  const padPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = padRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * canvas.width, y: ((e.clientY - rect.top) / rect.height) * canvas.height };
  };

  const clearPad = () => {
    const canvas = padRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setHasStroke(false);
    setSignatureUrl(null);
  };

  const useSignature = () => {
    const canvas = padRef.current;
    if (!canvas || !hasStroke) return;
    setSignatureUrl(canvas.toDataURL("image/png"));
  };

  const onOverlayPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onOverlayPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current || !previewBoxRef.current) return;
    const rect = previewBoxRef.current.getBoundingClientRect();
    const xFrac = Math.min(1 - placement.widthFrac, Math.max(0, (e.clientX - rect.left) / rect.width));
    const yFrac = Math.min(0.95, Math.max(0, (e.clientY - rect.top) / rect.height));
    setPlacement((p) => ({ ...p, xFrac, yFrac }));
  };
  const onOverlayPointerUp = () => {
    dragging.current = false;
  };

  const run = async () => {
    if (!file || !signatureUrl) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      setResult(await signPdf(file, signatureUrl, placement, allPages));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong while signing this PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack>
      <Dropzone
        accept="application/pdf,.pdf"
        label={file ? `Selected: ${file.name}` : "Drop a PDF here, or click to browse"}
        onFiles={(f) => {
          setFile(f[0] ?? null);
          setResult(null);
          setError(null);
          setSignatureUrl(null);
        }}
      />

      {loadingPreview && <p className="text-sm text-slate">Loading a preview of page 1…</p>}
      {previewError && <ErrorNote message={previewError} />}

      {!signatureUrl && file && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-ink">Draw your signature below</p>
          <canvas
            ref={padRef}
            width={500}
            height={160}
            className="w-full touch-none rounded-xl border border-ink/15 bg-white"
            onPointerDown={(e) => {
              drawing.current = true;
              const ctx = padRef.current!.getContext("2d")!;
              const { x, y } = padPos(e);
              ctx.beginPath();
              ctx.moveTo(x, y);
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drawing.current) return;
              const ctx = padRef.current!.getContext("2d")!;
              const { x, y } = padPos(e);
              ctx.lineWidth = 3;
              ctx.lineCap = "round";
              ctx.strokeStyle = "#111111";
              ctx.lineTo(x, y);
              ctx.stroke();
              setHasStroke(true);
            }}
            onPointerUp={() => {
              drawing.current = false;
            }}
          />
          <div className="flex gap-2">
            <button type="button" className={ghostBtnCls} onClick={clearPad} disabled={!hasStroke}>
              Clear
            </button>
            <button type="button" className={btnCls} onClick={useSignature} disabled={!hasStroke}>
              Use this signature
            </button>
          </div>
        </div>
      )}

      {signatureUrl && preview && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium text-ink">Drag the signature to position it, then adjust the size</p>
          <div
            ref={previewBoxRef}
            className="relative w-full select-none overflow-hidden rounded-xl border border-ink/15"
            style={{ aspectRatio: `${preview.width} / ${preview.height}` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview.dataUrl} alt="Page 1 preview" className="pointer-events-none absolute inset-0 h-full w-full" />
            <div
              onPointerDown={onOverlayPointerDown}
              onPointerMove={onOverlayPointerMove}
              onPointerUp={onOverlayPointerUp}
              className="absolute cursor-move touch-none"
              style={{ left: `${placement.xFrac * 100}%`, top: `${placement.yFrac * 100}%`, width: `${placement.widthFrac * 100}%` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={signatureUrl} alt="Your signature" className="pointer-events-none w-full" />
            </div>
          </div>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-ink">
            Signature size
            <input
              type="range"
              min={10}
              max={50}
              value={Math.round(placement.widthFrac * 100)}
              onChange={(e) => setPlacement((p) => ({ ...p, widthFrac: Number(e.target.value) / 100 }))}
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={allPages} onChange={(e) => setAllPages(e.target.checked)} />
            Apply this signature to every page (not just page 1)
          </label>

          <div className="flex gap-2">
            <button type="button" className={ghostBtnCls} onClick={clearPad}>
              Redraw signature
            </button>
            <button type="button" className={btnCls} disabled={busy} onClick={run}>
              {busy ? "Signing…" : "Sign & download PDF"}
            </button>
          </div>
        </div>
      )}

      {error && <ErrorNote message={error} />}
      {result && (
        <>
          <FileDownload blob={result} filename={`${baseName(file ?? undefined, "document")}-signed.pdf`} />
          <p className="text-xs text-slate">🔒 Your signature and document never left this device — everything was drawn and saved locally in your browser.</p>
        </>
      )}
    </Stack>
  );
}
