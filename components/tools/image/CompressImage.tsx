"use client";

import { useState } from "react";
import ImageBatch from "./ImageBatch";
import { Chips, FormatControls, Grid, InfoNote, NumField, OptionsCard, RangeField, SelectBox, Segmented, num, type ToolProps } from "./controls";
import {
  MIME_EXT,
  MIME_LABEL,
  baseName,
  compressPngSmart,
  decodeImage,
  drawResampled,
  encodeCanvas,
  encodeToTarget,
  formatBytes,
  limitSide,
  mimeOf,
  supportsEncode,
  type Mime,
  type OutFmt,
} from "@/lib/tool-processors/image-engine";

const MAX_SIDES = [
  { value: "0", label: "Keep original dimensions" },
  { value: "3840", label: "Limit longest side to 3840 px" },
  { value: "2560", label: "Limit longest side to 2560 px" },
  { value: "1920", label: "Limit longest side to 1920 px" },
  { value: "1280", label: "Limit longest side to 1280 px" },
];

export default function CompressImage({ initialOpts }: ToolProps) {
  const [mode, setMode] = useState<"quality" | "target">(initialOpts?.target ? "target" : "quality");
  const [quality, setQuality] = useState(num(initialOpts?.quality, 80));
  const [targetKb, setTargetKb] = useState(initialOpts?.target ?? "200");
  const [format, setFormat] = useState<OutFmt>((initialOpts?.format as OutFmt) || "same");
  const [bg, setBg] = useState("#ffffff");
  const [maxSide, setMaxSide] = useState("0");
  const [pngMode, setPngMode] = useState<"256" | "128" | "64" | "0">("256");

  const target = Math.max(5, num(targetKb, 200)) * 1024;
  const key = JSON.stringify([mode, quality, mode === "target" ? target : 0, format, bg, maxSide, pngMode]);

  async function process(file: File) {
    const original = mimeOf(file);
    let mime: Mime;
    if (format !== "same") mime = format;
    else if (original === "image/jpeg" || original === "image/png" || original === "image/webp") mime = original;
    else mime = supportsEncode("image/webp") ? "image/webp" : "image/jpeg";

    let note: string | undefined;
    if (mode === "target" && mime === "image/png") {
      mime = supportsEncode("image/webp") ? "image/webp" : "image/jpeg";
      note = `PNG can't be squeezed to an exact size, so this was saved as ${MIME_LABEL[mime]}.`;
    }

    const d = await decodeImage(file);
    try {
      const { w, h } = limitSide(d.width, d.height, Number(maxSide));
      const resized = w !== d.width;
      const canvas = drawResampled(d.source, { x: 0, y: 0, w: d.width, h: d.height }, w, h);

      let blob: Blob;
      let outW = w;
      let outH = h;
      if (mode === "target") {
        const r = await encodeToTarget(canvas, mime, target, bg);
        blob = r.blob;
        outW = r.width;
        outH = r.height;
        if (!r.hit) note = `Couldn't reach ${formatBytes(target)} — this is the smallest we could make it.`;
        else if (r.scale < 1) note = `To fit under ${formatBytes(target)}, the image was also scaled down to ${outW}×${outH}px.`;
      } else {
        blob = await encodeCanvas(canvas, mime, quality / 100, bg);
        if (mime === "image/png") {
          if (pngMode !== "0") {
            const smart = await compressPngSmart(canvas, Number(pngMode));
            if (smart && smart.size < blob.size) {
              blob = smart;
              note = `Smart PNG compression: colours reduced to ${pngMode}, transparency kept.`;
            }
          } else {
            note = "Lossless PNG keeps every pixel exact, so savings are small.";
          }
        }
      }

      // Never hand back something bigger than what the person gave us.
      if (blob.size >= file.size && !resized && mode === "quality" && mimeOf(file) === mime) {
        return { blob: file, filename: file.name, width: d.width, height: d.height, note: "Already well optimised — your original file is kept (we won't make it bigger)." };
      }
      return { blob, filename: `${baseName(file.name)}-compressed.${MIME_EXT[mime]}`, width: outW, height: outH, note };
    } finally {
      d.close();
    }
  }

  return (
    <ImageBatch
      dropLabel="Drop JPG, PNG or WebP images here, or click to browse"
      optionsKey={key}
      process={process}
      zipName="compressed-images"
      showSavings
      options={
        <OptionsCard title="Compression settings">
          <Segmented
            label="How do you want to compress?"
            value={mode}
            onChange={setMode}
            options={[
              { value: "quality", label: "By quality" },
              { value: "target", label: "To a target file size" },
            ]}
          />
          {mode === "quality" ? (
            <RangeField label="Quality" value={quality} min={10} max={95} unit="%" onChange={setQuality} hint="80% is a great balance. Lower = smaller file, softer image." />
          ) : (
            <div className="flex flex-col gap-3">
              <NumField label="Maximum file size (KB)" value={targetKb} onChange={setTargetKb} min={5} hint="We find the best quality that still fits under this size." />
              <Chips
                items={[50, 100, 200, 500, 1024, 2048].map((kb) => ({ label: kb >= 1024 ? `${kb / 1024} MB` : `${kb} KB`, onClick: () => setTargetKb(String(kb)) }))}
              />
            </div>
          )}
          <Grid>
            <SelectBox label="Image size" value={maxSide} onChange={setMaxSide} options={MAX_SIDES} hint="Scaling large photos down saves the most space." />
          </Grid>
          {(format === "same" || format === "image/png") && mode === "quality" && (
            <SelectBox
              label="PNG compression (like TinyPNG)"
              value={pngMode}
              onChange={setPngMode}
              options={[
                { value: "256", label: "Smart — 256 colours (best balance, usually 60–80% smaller)" },
                { value: "128", label: "Strong — 128 colours" },
                { value: "64", label: "Maximum — 64 colours (smallest, simple graphics)" },
                { value: "0", label: "Lossless — keep every pixel exact" },
              ]}
            />
          )}
          <FormatControls value={format} onChange={setFormat} quality={quality} onQuality={setQuality} bg={bg} onBg={setBg} showQuality={false} />
          <InfoNote>Tip: photos saved as PNG become far smaller as JPG or WebP. Choose it under “Output format”.</InfoNote>
        </OptionsCard>
      }
    />
  );
}
