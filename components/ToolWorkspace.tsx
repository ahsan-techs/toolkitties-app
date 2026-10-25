"use client";

import { useEffect, useMemo, useState } from "react";
import type { Tool } from "@/lib/tools-data";
import Dropzone from "@/components/workspace/Dropzone";
import { TextOutput, FileDownload } from "@/components/workspace/OutputPanel";
import WaveLoader from "@/components/WaveLoader";
import * as text from "@/lib/tool-processors/text-tools";
import * as image from "@/lib/tool-processors/image-tools";
import * as pdf from "@/lib/tool-processors/pdf-tools";
import * as dev from "@/lib/tool-processors/dev-tools";
import { useRouter } from "next/navigation";
import { setFileHandoff, consumeFileHandoff } from "@/lib/file-handoff";
import { runBatchJobs } from "@/lib/batch-runner";
import { makeZip } from "@/lib/tool-processors/zip";

const IMAGE_MIME: Record<string, string> = {
  "jpg-to-png": "image/png",
  "png-to-jpg": "image/jpeg",
  "webp-to-jpg": "image/jpeg",
};

// Tools where the on-screen defaults are already good enough to process
// automatically the instant a file is dropped — no extra click needed.
const AUTO_PROCESS_IMAGE = new Set(["jpg-to-png", "png-to-jpg", "webp-to-jpg", "compress-image", "resize-image", "rotate-image", "image-to-base64", "favicon-generator", "svg-to-png", "heic-to-jpg"]);
const AUTO_PROCESS_PDF = new Set(["compress-pdf", "rotate-pdf", "pdf-page-numbers"]);

// Phase 2: tools where dropping many files at once runs them all through
// the same settings, concurrently, instead of one file at a time.
const BATCH_IMAGE_TOOLS = new Set(["compress-image", "resize-image", "rotate-image"]);

// A couple of relevant next steps to suggest once a result is ready, so
// people don't have to think about what to do next.
const NEXT_STEPS: Record<string, { slug: string; label: string }[]> = {
  // Images
  "jpg-to-png": [{ slug: "compress-image", label: "🗜️ Compress it further" }, { slug: "resize-image", label: "📐 Resize it" }],
  "png-to-jpg": [{ slug: "compress-image", label: "🗜️ Compress it further" }, { slug: "resize-image", label: "📐 Resize it" }],
  "webp-to-jpg": [{ slug: "compress-image", label: "🗜️ Compress it further" }],
  "heic-to-jpg": [{ slug: "compress-image", label: "🗜️ Compress it further" }, { slug: "resize-image", label: "📐 Resize it" }],
  "compress-image": [{ slug: "resize-image", label: "📐 Resize this image" }, { slug: "jpg-to-png", label: "🎨 Convert to PNG" }],
  "resize-image": [{ slug: "compress-image", label: "🗜️ Compress the file size" }, { slug: "rotate-image", label: "🔄 Rotate it" }],
  "crop-image": [{ slug: "resize-image", label: "📐 Resize it" }, { slug: "compress-image", label: "🗜️ Compress it" }],
  "rotate-image": [{ slug: "compress-image", label: "🗜️ Compress it" }, { slug: "resize-image", label: "📐 Resize it" }],
  "image-to-base64": [{ slug: "compress-image", label: "🗜️ Compress the source image" }],
  "favicon-generator": [{ slug: "resize-image", label: "📐 Resize your logo first" }],
  "watermark-image": [{ slug: "compress-image", label: "🗜️ Compress the result" }],
  "svg-to-png": [{ slug: "favicon-generator", label: "🌐 Generate a favicon" }, { slug: "resize-image", label: "📐 Resize it" }],

  // PDF
  "merge-pdf": [{ slug: "compress-pdf", label: "🗜️ Compress the result" }, { slug: "pdf-page-numbers", label: "🔢 Add page numbers" }],
  "split-pdf": [{ slug: "compress-pdf", label: "🗜️ Compress the result" }],
  "compress-pdf": [{ slug: "merge-pdf", label: "🧩 Merge with another PDF" }, { slug: "pdf-page-numbers", label: "🔢 Add page numbers" }],
  "rotate-pdf": [{ slug: "compress-pdf", label: "🗜️ Compress the result" }],
  "delete-pdf-pages": [{ slug: "compress-pdf", label: "🗜️ Compress the result" }],
  "organize-pdf": [{ slug: "compress-pdf", label: "🗜️ Compress the result" }],
  "watermark-pdf": [{ slug: "compress-pdf", label: "🗜️ Compress the result" }],
  "pdf-page-numbers": [{ slug: "compress-pdf", label: "🗜️ Compress the result" }, { slug: "merge-pdf", label: "🧩 Merge with another PDF" }],

  // Text
  "word-counter": [{ slug: "case-converter", label: "🔠 Change the text case" }],
  "case-converter": [{ slug: "word-counter", label: "🔢 Check the word count" }],
  "json-formatter": [{ slug: "csv-to-json", label: "📊 Convert CSV to JSON" }],
  base64: [{ slug: "url-encoder", label: "🔗 Try URL encoding too" }],
  "markdown-renderer": [{ slug: "word-counter", label: "🔢 Check the word count" }],
  "url-encoder": [{ slug: "base64", label: "🔐 Try Base64 encoding too" }],
  "text-diff": [{ slug: "word-counter", label: "🔢 Check the word count" }],
  "slug-generator": [{ slug: "case-converter", label: "🔠 Change the case" }],
  "csv-to-json": [{ slug: "json-formatter", label: "🧾 Format the JSON" }],
  "lorem-ipsum": [{ slug: "word-counter", label: "🔢 Check the word count" }],
  "duplicate-lines": [{ slug: "word-counter", label: "🔢 Check the word count" }],

  // Developer & calculators
  "qr-code-generator": [{ slug: "password-generator", label: "🔑 Generate a password" }],
  "password-generator": [{ slug: "uuid-generator", label: "🆔 Generate a UUID" }],
  "uuid-generator": [{ slug: "password-generator", label: "🔑 Generate a password" }],
  "unit-converter": [{ slug: "percentage-calculator", label: "💯 Try the percentage calculator" }],
  "percentage-calculator": [{ slug: "unit-converter", label: "📏 Try the unit converter" }],
  "age-calculator": [{ slug: "timestamp-converter", label: "⏱️ Try the timestamp converter" }],
  "color-picker": [{ slug: "qr-code-generator", label: "🔳 Generate a QR code" }],
  "timestamp-converter": [{ slug: "age-calculator", label: "🎂 Try the age calculator" }],
};

export default function ToolWorkspace({ tool, initialOpts }: { tool: Tool; initialOpts?: Record<string, string> }) {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generic bags of state reused across tool kinds.
  const [files, setFiles] = useState<File[]>([]);
  const [inputText, setInputText] = useState("");
  const [inputTextB, setInputTextB] = useState("");
  const [outputText, setOutputText] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<{ blob: Blob; filename: string; previewImage?: boolean } | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [progress, setProgress] = useState("");
  const [batchResults, setBatchResults] = useState<{ name: string; blob: Blob }[] | null>(null);
  const [batchProgress, setBatchProgress] = useState<{ done: number; total: number } | null>(null);
  const [opts, setOpts] = useState<Record<string, string>>(() => initialOpts ?? {});

  const setOpt = (key: string, value: string) => setOpts((o) => ({ ...o, [key]: value }));

  // Phase 1: Success Screen Bypass — if a previous tool just handed off a
  // processed file for this exact tool, load it straight in, no re-upload.
  useEffect(() => {
    const handoff = consumeFileHandoff(tool.slug);
    if (handoff) {
      const file = new File([handoff.blob], handoff.filename, { type: handoff.blob.type });
      setFiles([file]);
      setNote(`✅ "${handoff.filename}" pichle tool se seedha yahan aa gayi — dobara upload ki zaroorat nahi thi.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const run = async (fn: () => Promise<void> | void) => {
    setError(null);
    setNote(null);
    setProgress("");
    setProcessing(true);
    setOutputText(null);
    setOutputBlob(null);
    try {
      await fn();
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setProcessing(false);
      setProgress("");
    }
  };

  const originalName = (ext: string) => {
    const base = files[0]?.name?.replace(/\.[^.]+$/, "") || "toolkitties-file";
    return `${base}${ext}`;
  };

  const NextSteps = ({ show }: { show?: boolean } = {}) => {
    const steps = NEXT_STEPS[tool.slug];
    const hasResult = show ?? !!(outputBlob || outputText);
    if (!steps || !hasResult) return null;
    return (
      <div className="flex flex-col gap-2 border-t border-ink/10 pt-4">
        <p className="text-xs font-medium text-slate">What next?</p>
        <div className="flex flex-wrap gap-2">
          {steps.map((s) => (
            <button
              key={s.slug}
              type="button"
              onClick={() => {
                if (outputBlob) setFileHandoff({ blob: outputBlob.blob, filename: outputBlob.filename, toSlug: s.slug });
                router.push(`/${s.slug}`);
              }}
              className="rounded-full border border-ink/15 bg-white px-4 py-2 text-xs font-medium text-ink hover:border-moss/50"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // --------------------------------------------------------------------
  // Live text transforms (no explicit "process" button needed)
  // --------------------------------------------------------------------
  const liveTextResult = useMemo(() => {
    try {
      switch (tool.slug) {
        case "word-counter": {
          if (!inputText) return "";
          const r = text.countWords(inputText);
          return `Words: ${r.words}\nCharacters: ${r.characters}\nCharacters (no spaces): ${r.charactersNoSpaces}\nSentences: ${r.sentences}\nEstimated reading time: ${r.readingMinutes} min`;
        }
        case "case-converter": {
          const mode = opts.case || "upper";
          if (!inputText) return "";
          if (mode === "upper") return text.toUpperCase(inputText);
          if (mode === "lower") return text.toLowerCase(inputText);
          if (mode === "title") return text.toTitleCase(inputText);
          return text.toSentenceCase(inputText);
        }
        case "json-formatter":
          if (!inputText.trim()) return "";
          return opts.mode === "minify" ? text.minifyJson(inputText) : text.formatJson(inputText);
        case "base64":
          if (!inputText) return "";
          return opts.mode === "decode" ? text.decodeBase64(inputText) : text.encodeBase64(inputText);
        case "markdown-renderer":
          return inputText ? text.renderMarkdown(inputText) : "";
        case "url-encoder":
          if (!inputText) return "";
          return opts.mode === "decode" ? text.decodeUrl(inputText) : text.encodeUrl(inputText);
        case "slug-generator":
          return inputText ? text.slugify(inputText) : "";
        case "csv-to-json":
          return inputText.trim() ? text.csvToJson(inputText) : "";
        case "duplicate-lines":
          return inputText ? text.removeDuplicateLines(inputText) : "";
        default:
          return null;
      }
    } catch {
      return "⚠️ Couldn't process that input — double check the format.";
    }
  }, [tool.slug, inputText, opts]);

  // --------------------------------------------------------------------
  // Image tools
  // --------------------------------------------------------------------
  if (["jpg-to-png", "png-to-jpg", "webp-to-jpg", "compress-image", "resize-image", "crop-image", "rotate-image", "image-to-base64", "watermark-image", "favicon-generator", "svg-to-png", "heic-to-jpg"].includes(tool.slug)) {
    const doProcess = () =>
      run(async () => {
        const file = files[0];
        if (!file) throw new Error("Add an image first.");

        if (tool.slug === "favicon-generator") {
          const pack = await image.buildFaviconPack(file);
          setOutputBlob({ blob: pack.zip, filename: "favicons.zip" });
          setOutputText(pack.html);
          setNote("The download has favicon.ico, PNG icons (16, 32, 180, 192 and 512 pixels) and a web manifest. Paste the HTML below into the <head> of your website. Non-square pictures are cropped to a centred square.");
          return;
        }
        if (tool.slug === "image-to-base64") {
          const dataUrl = await image.imageToBase64(file);
          setOutputText(dataUrl);
          return;
        }
        if (tool.slug === "svg-to-png") {
          const size = Number(opts.size || 512);
          const blob = await image.convertSvgToPng(file, size);
          setOutputBlob({ blob, filename: originalName("-icon.png"), previewImage: true });
          return;
        }
        if (tool.slug === "heic-to-jpg") {
          const blob = await image.convertHeicToJpg(file);
          setOutputBlob({ blob, filename: originalName(".jpg"), previewImage: true });
          return;
        }
        if (["jpg-to-png", "png-to-jpg", "webp-to-jpg"].includes(tool.slug)) {
          const mime = IMAGE_MIME[tool.slug];
          const blob = await image.convertImage(file, mime);
          setOutputBlob({ blob, filename: originalName(mime === "image/png" ? ".png" : ".jpg"), previewImage: true });
          return;
        }
        if (tool.slug === "compress-image") {
          const quality = Number(opts.quality || 80) / 100;
          const maxSide = Number(opts.maxside || 0);
          const blob = await image.compressImage(file, quality, maxSide);
          if (blob.size >= file.size) {
            setOutputBlob({ blob: file, filename: file.name, previewImage: true });
            setNote("This image is already small, so compressing it would not make it smaller. Your original file is returned unchanged. Try a lower quality or a smaller largest side.");
            return;
          }
          setOutputBlob({ blob, filename: originalName("-compressed.jpg"), previewImage: true });
          setNote(`${formatBytes(file.size)} to ${formatBytes(blob.size)}, ${Math.round((1 - blob.size / file.size) * 100)}% smaller.`);
          return;
        }
        if (tool.slug === "resize-image") {
          const w = Number(opts.width ?? "800") || 0;
          const h = Number(opts.height ?? "") || 0;
          const keep = opts.keep !== "false";
          if (!keep && (!w || !h)) throw new Error("Enter both a width and a height, or turn on Keep proportions.");
          const blob = await image.resizeImage(file, w, h, keep);
          const bmp = await createImageBitmap(blob);
          setNote(`New size: ${bmp.width} x ${bmp.height} pixels.`);
          bmp.close();
          setOutputBlob({ blob, filename: originalName(`-resized${image.extForBlob(blob)}`), previewImage: true });
          return;
        }
        if (tool.slug === "crop-image") {
          const x = Number(opts.x || 0);
          const y = Number(opts.y || 0);
          const w = Number(opts.width || 300);
          const h = Number(opts.height || 300);
          const blob = await image.cropImage(file, x, y, w, h);
          setOutputBlob({ blob, filename: originalName(`-cropped${image.extForBlob(blob)}`), previewImage: true });
          return;
        }
        if (tool.slug === "rotate-image") {
          const deg = Number(opts.degrees || 90);
          const blob = await image.rotateImage(file, deg);
          setOutputBlob({ blob, filename: originalName(`-rotated${image.extForBlob(blob)}`), previewImage: true });
          return;
        }
        if (tool.slug === "watermark-image") {
          const blob = await image.watermarkImage(file, opts.text || "");
          setOutputBlob({ blob, filename: originalName(`-watermarked${image.extForBlob(blob)}`), previewImage: true });
          return;
        }
      });

    // Auto-process the moment a file lands, for tools whose defaults are
    // already good enough — no extra "click to process" step needed.
    const isBatchTool = BATCH_IMAGE_TOOLS.has(tool.slug);
    const isBatchMode = isBatchTool && files.length > 1;

    const computeBatchImage = async (file: File): Promise<{ blob: Blob; name: string }> => {
      const base = file.name.replace(/\.[^.]+$/, "");
      if (tool.slug === "compress-image") {
        const quality = Number(opts.quality || 80) / 100;
        const maxSide = Number(opts.maxside || 0);
        const blob = await image.compressImage(file, quality, maxSide);
        if (blob.size >= file.size) return { blob: file, name: file.name };
        return { blob, name: `${base}-compressed.jpg` };
      }
      if (tool.slug === "resize-image") {
        const w = Number(opts.width ?? "800") || 0;
        const h = Number(opts.height ?? "") || 0;
        const keep = opts.keep !== "false";
        const blob = await image.resizeImage(file, w, h, keep);
        return { blob, name: `${base}-resized${image.extForBlob(blob)}` };
      }
      const deg = Number(opts.degrees || 90);
      const blob = await image.rotateImage(file, deg);
      return { blob, name: `${base}-rotated${image.extForBlob(blob)}` };
    };

    const doBatchProcess = async () => {
      setError(null);
      setNote(null);
      setBatchResults(null);
      setProcessing(true);
      setBatchProgress({ done: 0, total: files.length });
      try {
        let done = 0;
        const results = await runBatchJobs(files, 3, async (file) => {
          const r = await computeBatchImage(file);
          done += 1;
          setBatchProgress({ done, total: files.length });
          return { name: r.name, blob: r.blob };
        });
        setBatchResults(results);
      } catch (e) {
        setError(friendlyError(e));
      } finally {
        setProcessing(false);
      }
    };

    const downloadAllAsZip = async () => {
      if (!batchResults) return;
      const entries = await Promise.all(batchResults.map(async (r) => ({ name: r.name, data: new Uint8Array(await r.blob.arrayBuffer()) })));
      const zipBlob = new Blob([makeZip(entries) as unknown as BlobPart], { type: "application/zip" });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `toolkitties-${tool.slug}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    };

    useEffect(() => {
      if (files[0] && AUTO_PROCESS_IMAGE.has(tool.slug) && !isBatchMode) {
        doProcess();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    return (
      <Workspace>
        <Dropzone
          accept={tool.slug === "heic-to-jpg" ? "image/heic,image/heif,.heic,.heif" : tool.slug === "svg-to-png" ? "image/svg+xml,.svg" : "image/*"}
          multiple={isBatchTool}
          onFiles={(fs) => {
            setBatchResults(null);
            setBatchProgress(null);
            setFiles(fs);
          }}
          label={files.length > 1 ? `${files.length} images selected` : files[0] ? `Selected: ${files[0].name}` : isBatchTool ? "Drop one or many images here, or click to browse" : "Drop an image here, or click to browse"}
        />

        {tool.slug === "svg-to-png" && (
          <SelectField label="Output size" value={opts.size || "512"} onChange={(v) => setOpt("size", v)} options={[["128", "128px"], ["256", "256px"], ["512", "512px"], ["1024", "1024px"]]} />
        )}
        {tool.slug === "compress-image" && (
          <>
            <Slider label="Quality" value={opts.quality || "80"} onChange={(v) => setOpt("quality", v)} min={10} max={95} unit="%" />
            <SelectField
              label="Largest side"
              value={opts.maxside || "0"}
              onChange={(v) => setOpt("maxside", v)}
              options={[["0", "Keep the original size"], ["3840", "3840 px (4K)"], ["2560", "2560 px"], ["1920", "1920 px (Full HD)"], ["1280", "1280 px"]]}
            />
            <p className="text-xs text-slate">The result is saved as a JPG. Transparent areas turn white. Shrinking the largest side is the biggest saving for large photos.</p>
          </>
        )}
        {tool.slug === "resize-image" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="Width (px)" value={opts.width ?? "800"} onChange={(v) => setOpt("width", v)} placeholder="800" />
              <NumberField label="Height (px)" value={opts.height ?? ""} onChange={(v) => setOpt("height", v)} placeholder="Automatic" />
            </div>
            <Checkbox label="Keep proportions (the picture is not stretched)" checked={opts.keep !== "false"} onChange={(v) => setOpt("keep", String(v))} />
          </>
        )}
        {tool.slug === "crop-image" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="X: pixels from the left" value={opts.x ?? "0"} onChange={(v) => setOpt("x", v)} />
              <NumberField label="Y: pixels from the top" value={opts.y ?? "0"} onChange={(v) => setOpt("y", v)} />
              <NumberField label="Width (px)" value={opts.width ?? "300"} onChange={(v) => setOpt("width", v)} />
              <NumberField label="Height (px)" value={opts.height ?? "300"} onChange={(v) => setOpt("height", v)} />
            </div>
            <p className="text-xs text-slate">The crop starts at X and Y and goes right and down. If it reaches past the edge, it is trimmed to fit.</p>
          </>
        )}
        {tool.slug === "rotate-image" && (
          <SelectField label="Rotate by" value={opts.degrees || "90"} onChange={(v) => setOpt("degrees", v)} options={[["90", "90° clockwise"], ["180", "180°"], ["270", "90° anticlockwise"]]} />
        )}
        {tool.slug === "watermark-image" && (
          <TextField label="Watermark text" value={opts.text || ""} onChange={(v) => setOpt("text", v)} placeholder="Your name or website" />
        )}

        <PrimaryButton onClick={isBatchMode ? doBatchProcess : doProcess} disabled={!files[0] || processing}>
          {isBatchMode ? `Process ${files.length} images` : tool.slug === "favicon-generator" ? "Create favicons" : "Process image"}
        </PrimaryButton>

        {processing && <WaveLoader />}
        {processing && batchProgress && (
          <p className="text-xs text-slate">⚙️ Processing {batchProgress.done} of {batchProgress.total}…</p>
        )}
        {error && <ErrorNote message={error} />}
        {!isBatchMode && outputBlob && <FileDownload {...outputBlob} />}
        {!isBatchMode && note && <ResultNote message={note} />}
        {!isBatchMode && outputText && <TextOutput value={outputText} />}

        {batchResults && (
          <div className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-sand/30 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink">✅ {batchResults.length} images ready</p>
              <button onClick={downloadAllAsZip} className="rounded-full bg-moss px-4 py-2 text-xs font-semibold text-white hover:bg-moss/90">
                ⬇️ Download all as ZIP
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {batchResults.map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-xs">
                  <span className="truncate text-ink">{r.name}</span>
                  <span className="text-slate">{formatBytes(r.blob.size)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <NextSteps show={!isBatchMode ? undefined : !!batchResults} />
      </Workspace>
    );
  }

  // --------------------------------------------------------------------
  // PDF tools
  // --------------------------------------------------------------------
  if (["compress-pdf", "rotate-pdf", "delete-pdf-pages", "organize-pdf", "watermark-pdf", "pdf-page-numbers"].includes(tool.slug)) {
    const doProcess = () =>
      run(async () => {
        const file = files[0];
        if (!file) throw new Error("Add a PDF first.");

        const finish = (res: pdf.ToolResult, suffix: string, name = originalName(suffix)) => {
          setOutputBlob({ blob: pdf.bytesToBlob(res.bytes), filename: name });
          if (res.note) setNote(res.note);
        };

        if (tool.slug === "compress-pdf") {
          const level = (opts.level || "recommended") as pdf.CompressLevel;
          const res = await pdf.compressPdf(file, level, (done, total) => setProgress(`Working on ${done} of ${total}…`));
          finish(res, "-compressed.pdf", res.kept ? file.name : originalName("-compressed.pdf"));
          return;
        }
        if (tool.slug === "rotate-pdf") {
          finish(await pdf.rotatePdf(file, Number(opts.degrees || 90), opts.pages || ""), "-rotated.pdf");
          return;
        }
        if (tool.slug === "delete-pdf-pages") {
          finish(await pdf.deletePages(file, opts.pages || ""), "-edited.pdf");
          return;
        }
        if (tool.slug === "organize-pdf") {
          finish(await pdf.reorderPages(file, opts.order || ""), "-reordered.pdf");
          return;
        }
        if (tool.slug === "watermark-pdf") {
          finish(await pdf.watermarkPdf(file, opts.text || ""), "-watermarked.pdf");
          return;
        }
        if (tool.slug === "pdf-page-numbers") {
          const res = await pdf.addPageNumbers(file, {
            format: (opts.format || "number") as pdf.NumberFormat,
            position: (opts.position || "bottom-center") as pdf.NumberPosition,
            start: Number(opts.start || 1),
          });
          finish(res, "-numbered.pdf");
          return;
        }
      });

    // Auto-process for single-file PDF tools that need no extra required
    // input (compress/rotate/page-numbers) — split/delete/organize/watermark
    // still need the person to type something first, so those stay manual.
    useEffect(() => {
      if (files[0] && AUTO_PROCESS_PDF.has(tool.slug)) {
        doProcess();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    return (
      <Workspace>
        <Dropzone
          accept="application/pdf"
          onFiles={setFiles}
          label={files.length ? `Selected: ${files.map((f) => f.name).join(", ")}` : "Drop your PDF here, or click to browse"}
        />

        {tool.slug === "compress-pdf" && (
          <SelectField
            label="How much to compress"
            value={opts.level || "recommended"}
            onChange={(v) => setOpt("level", v)}
            options={[
              ["recommended", "Recommended: smaller file, text stays sharp"],
              ["smaller", "Smaller: stronger picture compression, text stays sharp"],
              ["smallest", "Smallest: pages become pictures (text is not selectable)"],
            ]}
          />
        )}
        {tool.slug === "delete-pdf-pages" && <TextField label="Pages to delete" value={opts.pages || ""} onChange={(v) => setOpt("pages", v)} placeholder="2, 4-6, 9" />}
        {tool.slug === "organize-pdf" && (
          <>
            <TextField label="New page order" value={opts.order || ""} onChange={(v) => setOpt("order", v)} placeholder="3, 1, 2 or 5-1" />
            <p className="text-xs text-slate">Only the pages you list are kept, in the order you type. Ranges can go backwards (5-1), and a page can repeat.</p>
          </>
        )}
        {tool.slug === "rotate-pdf" && (
          <>
            <SelectField label="Rotate by" value={opts.degrees || "90"} onChange={(v) => setOpt("degrees", v)} options={[["90", "90° clockwise"], ["180", "180°"], ["270", "90° anticlockwise"]]} />
            <TextField label="Pages to rotate (leave empty for all pages)" value={opts.pages || ""} onChange={(v) => setOpt("pages", v)} placeholder="All pages, or for example 2, 4-6" />
          </>
        )}
        {tool.slug === "watermark-pdf" && <TextField label="Watermark text" value={opts.text || ""} onChange={(v) => setOpt("text", v)} placeholder="CONFIDENTIAL" />}
        {tool.slug === "pdf-page-numbers" && (
          <div className="grid gap-3 md:grid-cols-3">
            <SelectField label="Format" value={opts.format || "number"} onChange={(v) => setOpt("format", v)} options={[["number", "1, 2, 3"], ["page", "Page 1, Page 2"], ["of", "Page 1 of 10"]]} />
            <SelectField label="Position" value={opts.position || "bottom-center"} onChange={(v) => setOpt("position", v)} options={[["bottom-center", "Bottom centre"], ["bottom-right", "Bottom right"], ["bottom-left", "Bottom left"], ["top-center", "Top centre"]]} />
            <NumberField label="Start at" value={opts.start ?? "1"} onChange={(v) => setOpt("start", v)} />
          </div>
        )}

        <PrimaryButton onClick={doProcess} disabled={processing || !files[0]}>
          Process PDF
        </PrimaryButton>

        {processing && <WaveLoader label={progress || "Working on your PDF…"} />}
        {error && <ErrorNote message={error} />}
        {outputBlob && <FileDownload {...outputBlob} />}
        {note && <ResultNote message={note} />}
        <NextSteps />
      </Workspace>
    );
  }

  // --------------------------------------------------------------------
  // Generators (no file input)
  // --------------------------------------------------------------------
  if (["qr-code-generator", "password-generator", "uuid-generator", "lorem-ipsum"].includes(tool.slug)) {
    const doProcess = () =>
      run(async () => {
        if (tool.slug === "qr-code-generator") {
          if (!inputText.trim()) throw new Error("Enter a link or text first.");
          const dataUrl = await dev.generateQrDataUrl(inputText);
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          setOutputBlob({ blob, filename: "qr-code.png", previewImage: true });
          return;
        }
        if (tool.slug === "password-generator") {
          const pw = dev.generatePassword(Number(opts.length || 16), {
            upper: opts.upper !== "false",
            lower: opts.lower !== "false",
            numbers: opts.numbers !== "false",
            symbols: opts.symbols !== "false",
            avoidAmbiguous: opts.ambiguous === "true",
          });
          setOutputText(pw);
          return;
        }
        if (tool.slug === "uuid-generator") {
          setOutputText(dev.generateUuid());
          return;
        }
        if (tool.slug === "lorem-ipsum") {
          const count = Number(opts.paragraphs || 3);
          if (!Number.isFinite(count) || count < 1 || count > 50) throw new Error("Choose between 1 and 50 paragraphs.");
          setOutputText(text.generateLorem(count));
          return;
        }
      });

    return (
      <Workspace>
        {tool.slug === "qr-code-generator" && <TextField label="Link or text" value={inputText} onChange={setInputText} placeholder="https://example.com" />}
        {tool.slug === "password-generator" && (
          <>
            <NumberField label="Length (4 to 128)" value={opts.length ?? "16"} onChange={(v) => setOpt("length", v)} />
            <div className="grid gap-2 sm:grid-cols-2">
              <Checkbox label="Uppercase letters (A-Z)" checked={opts.upper !== "false"} onChange={(v) => setOpt("upper", String(v))} />
              <Checkbox label="Lowercase letters (a-z)" checked={opts.lower !== "false"} onChange={(v) => setOpt("lower", String(v))} />
              <Checkbox label="Numbers (0-9)" checked={opts.numbers !== "false"} onChange={(v) => setOpt("numbers", String(v))} />
              <Checkbox label="Symbols (!@#$...)" checked={opts.symbols !== "false"} onChange={(v) => setOpt("symbols", String(v))} />
              <Checkbox label="Avoid look-alike characters (0, O, 1, l, I)" checked={opts.ambiguous === "true"} onChange={(v) => setOpt("ambiguous", String(v))} />
            </div>
          </>
        )}
        {tool.slug === "lorem-ipsum" && <NumberField label="Paragraphs (1 to 50)" value={opts.paragraphs ?? "3"} onChange={(v) => setOpt("paragraphs", v)} />}

        <PrimaryButton onClick={doProcess} disabled={processing}>
          Generate
        </PrimaryButton>

        {processing && <WaveLoader label="Generating…" />}
        {error && <ErrorNote message={error} />}
        {outputBlob && <FileDownload {...outputBlob} />}
        {outputText && <TextOutput value={outputText} />}
        <NextSteps />
      </Workspace>
    );
  }

  // --------------------------------------------------------------------
  // Calculators / converters
  // --------------------------------------------------------------------
  if (["unit-converter", "percentage-calculator", "age-calculator", "color-picker", "timestamp-converter"].includes(tool.slug)) {
    const unitKind = (opts.kind || "length") as dev.UnitKind;
    const unitList = dev.UNIT_CATALOG[unitKind].units;
    const unitFrom = unitList.some((u) => u.id === opts.from) ? (opts.from as string) : unitList[0].id;
    const unitTo = unitList.some((u) => u.id === opts.to) ? (opts.to as string) : unitList[1].id;
    const pctMode = opts.mode || "is";
    const colorRgb = dev.hexToRgb(opts.hex || "#1F5C4C");
    const colorHex = colorRgb ? "#" + [colorRgb.r, colorRgb.g, colorRgb.b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase() : "#1F5C4C";

    const calcResult = useMemo(() => {
      try {
        if (tool.slug === "unit-converter") {
          const raw = (opts.value ?? "1").trim();
          if (raw === "" || !Number.isFinite(Number(raw))) return "Enter a number to convert.";
          const value = Number(raw);
          const result = dev.convertUnit(unitKind, value, unitFrom, unitTo);
          const label = (id: string) => unitList.find((u) => u.id === id)?.label ?? id;
          return `${formatNumber(value)} ${label(unitFrom)} = ${formatNumber(result)} ${label(unitTo)}`;
        }
        if (tool.slug === "percentage-calculator") {
          const a = Number(opts.a ?? "0");
          const b = Number(opts.b ?? "100");
          if (!Number.isFinite(a) || !Number.isFinite(b)) return "Enter numbers in both boxes.";
          if (pctMode === "of") return `${formatNumber(a)}% of ${formatNumber(b)} = ${formatNumber((a / 100) * b)}`;
          if (pctMode === "change") {
            if (a === 0) return "The starting value can't be 0.";
            const change = dev.calcPercentageChange(a, b);
            return `${formatNumber(Math.abs(change))}% ${change >= 0 ? "increase" : "decrease"} (from ${formatNumber(a)} to ${formatNumber(b)})`;
          }
          if (b === 0) return "The second number can't be 0.";
          return `${formatNumber(a)} is ${formatNumber(dev.calcPercentage(a, b))}% of ${formatNumber(b)}`;
        }
        if (tool.slug === "age-calculator") {
          if (!opts.birthdate) return "";
          const birth = dev.parseLocalDate(opts.birthdate);
          if (!birth) return "Enter a valid date of birth.";
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          if (birth.getTime() > today.getTime()) return "That date is in the future. Enter a past date of birth.";
          const r = dev.calcAge(birth, today);
          const totalDays = Math.round((today.getTime() - birth.getTime()) / 86400000);
          let next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
          if (next.getTime() < today.getTime()) next = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
          const untilBirthday = Math.round((next.getTime() - today.getTime()) / 86400000);
          return `${r.years} years, ${r.months} months, ${r.days} days old\nTotal days lived: ${totalDays.toLocaleString("en-US")}\nNext birthday: ${untilBirthday === 0 ? "today!" : `in ${untilBirthday} day${untilBirthday === 1 ? "" : "s"}`}`;
        }
        if (tool.slug === "color-picker") {
          if (!colorRgb) return "Enter a valid HEX colour such as #1F5C4C.";
          const hsl = dev.rgbToHsl(colorRgb.r, colorRgb.g, colorRgb.b);
          return `HEX: ${colorHex}\nRGB: rgb(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b})\nHSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        }
        if (tool.slug === "timestamp-converter") {
          if (opts.mode === "toTimestamp") {
            if (!opts.date) return "";
            const d = new Date(opts.date);
            if (isNaN(d.getTime())) return "Pick a valid date and time.";
            return `Seconds: ${dev.dateToTimestamp(d)}\nMilliseconds: ${d.getTime()}\nUTC: ${d.toISOString()}`;
          }
          if (!opts.timestamp) return "";
          const n = Number(opts.timestamp);
          if (!Number.isFinite(n)) return "Enter a Unix timestamp (numbers only).";
          const d = dev.timestampToDate(n);
          if (isNaN(d.getTime())) return "That timestamp is out of range.";
          return `Local time: ${d.toString()}\nUTC: ${d.toISOString()}\n(Read as ${Math.abs(n) >= 1e11 ? "milliseconds" : "seconds"})`;
        }
        return "";
      } catch {
        return "That input could not be converted. Check the values and try again.";
      }
    }, [tool.slug, opts, unitKind, unitFrom, unitTo, pctMode, colorRgb, colorHex, unitList]);

    return (
      <Workspace>
        {tool.slug === "unit-converter" && (
          <div className="grid gap-3 md:grid-cols-2">
            <SelectField
              label="What are you converting?"
              value={unitKind}
              onChange={(v) => {
                const list = dev.UNIT_CATALOG[v as dev.UnitKind].units;
                setOpts((o) => ({ ...o, kind: v, from: list[0].id, to: list[1].id }));
              }}
              options={(Object.keys(dev.UNIT_CATALOG) as dev.UnitKind[]).map((k) => [k, dev.UNIT_CATALOG[k].label] as [string, string])}
            />
            <NumberField label="Value" value={opts.value ?? "1"} onChange={(v) => setOpt("value", v)} />
            <SelectField label="From" value={unitFrom} onChange={(v) => setOpt("from", v)} options={unitList.map((u) => [u.id, u.label] as [string, string])} />
            <SelectField label="To" value={unitTo} onChange={(v) => setOpt("to", v)} options={unitList.map((u) => [u.id, u.label] as [string, string])} />
            <button
              type="button"
              onClick={() => setOpts((o) => ({ ...o, from: unitTo, to: unitFrom }))}
              className="w-fit rounded-full border border-ink/15 bg-white px-4 py-2 text-xs font-semibold text-ink hover:border-moss/50"
            >
              ⇄ Swap units
            </button>
          </div>
        )}
        {tool.slug === "percentage-calculator" && (
          <div className="grid gap-3 md:grid-cols-3">
            <SelectField
              label="What do you want to find?"
              value={pctMode}
              onChange={(v) => setOpt("mode", v)}
              options={[["is", "X is what % of Y"], ["of", "What is X% of Y"], ["change", "% change from X to Y"]]}
            />
            <NumberField label={pctMode === "of" ? "Percentage (X)" : pctMode === "change" ? "From (X)" : "Value (X)"} value={opts.a ?? "0"} onChange={(v) => setOpt("a", v)} />
            <NumberField label={pctMode === "of" ? "Of the number (Y)" : pctMode === "change" ? "To (Y)" : "Out of (Y)"} value={opts.b ?? "100"} onChange={(v) => setOpt("b", v)} />
          </div>
        )}
        {tool.slug === "age-calculator" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Date of birth</label>
            <input type="date" value={opts.birthdate || ""} onChange={(e) => setOpt("birthdate", e.target.value)} className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm" />
          </div>
        )}
        {tool.slug === "color-picker" && (
          <div className="flex items-end gap-3">
            <input type="color" aria-label="Pick a colour" value={colorHex.toLowerCase()} onChange={(e) => setOpt("hex", e.target.value)} className="h-12 w-16 rounded-lg border border-ink/15" />
            <div className="flex-1">
              <TextField label="HEX colour" value={opts.hex ?? "#1F5C4C"} onChange={(v) => setOpt("hex", v)} placeholder="#1F5C4C" />
            </div>
          </div>
        )}
        {tool.slug === "timestamp-converter" && (
          <div className="flex flex-col gap-3">
            <SelectField label="Direction" value={opts.mode || "fromTimestamp"} onChange={(v) => setOpt("mode", v)} options={[["fromTimestamp", "Timestamp → Date"], ["toTimestamp", "Date → Timestamp"]]} />
            {opts.mode === "toTimestamp" ? (
              <input type="datetime-local" aria-label="Date and time" value={opts.date || ""} onChange={(e) => setOpt("date", e.target.value)} className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm" />
            ) : (
              <NumberField label="Unix timestamp (seconds or milliseconds)" value={opts.timestamp ?? ""} onChange={(v) => setOpt("timestamp", v)} />
            )}
          </div>
        )}

        {calcResult && <TextOutput value={calcResult} />}
        <NextSteps show={!!calcResult} />
      </Workspace>
    );
  }

  // --------------------------------------------------------------------
  // Text diff (two inputs)
  // --------------------------------------------------------------------
  if (tool.slug === "text-diff") {
    const rows = useMemo(() => text.diffLines(inputText, inputTextB), [inputText, inputTextB]);
    return (
      <Workspace>
        <div className="grid gap-4 md:grid-cols-2">
          <TextArea label="Original text" value={inputText} onChange={setInputText} />
          <TextArea label="Changed text" value={inputTextB} onChange={setInputTextB} />
        </div>
        {(inputText || inputTextB) && (
          <>
            <p className="text-sm text-slate">
              {rows.filter((r) => r.changed).length === 0
                ? "The two texts are identical."
                : `${rows.filter((r) => r.changed).length} line${rows.filter((r) => r.changed).length === 1 ? "" : "s"} differ. Red is only in the original, green is only in the changed text.`}
            </p>
            <div className="overflow-hidden rounded-2xl border border-ink/10">
              {rows.map((r) => (
                <div key={r.line} className="grid grid-cols-2 gap-px bg-ink/5 text-sm">
                  <div className={`whitespace-pre-wrap break-words px-3 py-1.5 font-mono text-xs text-ink/80 ${r.changed && r.a !== "" ? "bg-[#FBE9E7]" : "bg-white"}`}>{r.a || "\u00A0"}</div>
                  <div className={`whitespace-pre-wrap break-words px-3 py-1.5 font-mono text-xs text-ink/80 ${r.changed && r.b !== "" ? "bg-[#E5F3EC]" : "bg-white"}`}>{r.b || "\u00A0"}</div>
                </div>
              ))}
            </div>
          </>
        )}
        <NextSteps show={!!(inputText || inputTextB)} />
      </Workspace>
    );
  }

  // --------------------------------------------------------------------
  // Hash generator (async — uses the browser's native crypto API)
  // --------------------------------------------------------------------
  if (tool.slug === "hash-generator") {
    const [hashResult, setHashResult] = useState("");
    useEffect(() => {
      const algo = (opts.algo || "SHA-256") as "MD5" | "SHA-1" | "SHA-256" | "SHA-512";
      if (!inputText) {
        setHashResult("");
        return;
      }
      let cancelled = false;
      text.generateHash(inputText, algo).then((h) => {
        if (!cancelled) setHashResult(h);
      });
      return () => {
        cancelled = true;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputText, opts.algo]);

    return (
      <Workspace>
        <TextArea label="Text to hash" value={inputText} onChange={setInputText} />
        <SelectField
          label="Algorithm"
          value={opts.algo || "SHA-256"}
          onChange={(v) => setOpt("algo", v)}
          options={[["MD5", "MD5"], ["SHA-1", "SHA-1"], ["SHA-256", "SHA-256"], ["SHA-512", "SHA-512"]]}
        />
        {hashResult && <TextOutput value={hashResult} />}
        {!inputText && <p className="text-center text-sm text-slate">Start typing above and your hash appears instantly.</p>}
        <NextSteps show={!!hashResult} />
      </Workspace>
    );
  }

  // --------------------------------------------------------------------
  // Default: generic text-in / text-out tools
  // --------------------------------------------------------------------
  return (
    <Workspace>
      <TextArea label="Paste your text" value={inputText} onChange={setInputText} />

      {tool.slug === "case-converter" && (
        <SelectField label="Case" value={opts.case || "upper"} onChange={(v) => setOpt("case", v)} options={[["upper", "UPPER CASE"], ["lower", "lower case"], ["title", "Title Case"], ["sentence", "Sentence case"]]} />
      )}
      {tool.slug === "json-formatter" && (
        <SelectField label="Mode" value={opts.mode || "format"} onChange={(v) => setOpt("mode", v)} options={[["format", "Format / prettify"], ["minify", "Minify"]]} />
      )}
      {tool.slug === "base64" && (
        <SelectField label="Mode" value={opts.mode || "encode"} onChange={(v) => setOpt("mode", v)} options={[["encode", "Encode"], ["decode", "Decode"]]} />
      )}
      {tool.slug === "url-encoder" && (
        <SelectField label="Mode" value={opts.mode || "encode"} onChange={(v) => setOpt("mode", v)} options={[["encode", "Encode"], ["decode", "Decode"]]} />
      )}

      {liveTextResult && tool.slug === "markdown-renderer" && (
        <div className="tk-prose rounded-2xl border border-ink/10 bg-white p-5 text-sm" dangerouslySetInnerHTML={{ __html: liveTextResult }} />
      )}
      {liveTextResult && tool.slug !== "markdown-renderer" && <TextOutput value={liveTextResult} />}
      {!inputText && <p className="text-center text-sm text-slate">Start typing above and your result appears instantly.</p>}
      <NextSteps show={!!liveTextResult} />
    </Workspace>
  );
}

// ==========================================================================
// Small shared field components
// ==========================================================================

function Workspace({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-5 rounded-3xl border border-ink/10 bg-white p-6 md:p-8">{children}</div>;
}

function PrimaryButton({ children, onClick, disabled }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-paper transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function ErrorNote({ message }: { message: string }) {
  return <p className="rounded-xl bg-gold/10 px-4 py-3 text-sm text-gold">{message}</p>;
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      {label && <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-moss"
      />
    </div>
  );
}

function NumberField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <input
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-moss"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-moss"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}

function Slider({ label, value, onChange, min, max, unit }: { label: string; value: string; onChange: (v: string) => void; min: number; max: number; unit?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label}: {value}
        {unit}
      </label>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(e.target.value)} className="w-full accent-moss" />
    </div>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        className="w-full resize-none rounded-2xl border border-ink/15 bg-white p-4 text-sm outline-none focus:border-moss"
        placeholder="Type or paste here…"
      />
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-moss" />
      {label}
    </label>
  );
}

function ResultNote({ message }: { message: string }) {
  return (
    <p role="status" className="rounded-xl bg-moss/10 px-4 py-3 text-sm text-moss">
      {message}
    </p>
  );
}

function formatBytes(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(2)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

// Numbers shown to people: separators and up to 10 meaningful digits, never "1e-7" style output for normal values.
function formatNumber(n: number) {
  if (!Number.isFinite(n)) return "not a number";
  return n.toLocaleString("en-US", { maximumSignificantDigits: 10 });
}

// Turns technical library messages into something a visitor can act on.
function friendlyError(e: unknown): string {
  const msg = e instanceof Error ? e.message : "";
  if (/encrypt/i.test(msg)) return "This PDF is password protected. Remove the password with Unlock PDF first.";
  if (/Failed to parse|No PDF header|Invalid object ref/i.test(msg)) return "This file does not look like a valid PDF, or it is damaged.";
  return msg || "Something went wrong. Please try a different file.";
}
