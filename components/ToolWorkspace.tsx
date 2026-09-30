"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Tool } from "@/lib/tools-data";
import Dropzone from "@/components/workspace/Dropzone";
import { TextOutput, FileDownload } from "@/components/workspace/OutputPanel";
import WaveLoader from "@/components/WaveLoader";
import * as text from "@/lib/tool-processors/text-tools";
import * as image from "@/lib/tool-processors/image-tools";
import * as pdf from "@/lib/tool-processors/pdf-tools";
import * as dev from "@/lib/tool-processors/dev-tools";

const IMAGE_MIME: Record<string, string> = {
  "jpg-to-png": "image/png",
  "png-to-jpg": "image/jpeg",
  "webp-to-jpg": "image/jpeg",
};

// Tools where the on-screen defaults are already good enough to process
// automatically the instant a file is dropped — no extra click needed.
const AUTO_PROCESS_IMAGE = new Set(["jpg-to-png", "png-to-jpg", "webp-to-jpg", "compress-image", "resize-image", "rotate-image", "image-to-base64", "favicon-generator", "svg-to-png", "heic-to-jpg"]);
const AUTO_PROCESS_PDF = new Set(["compress-pdf", "rotate-pdf", "pdf-page-numbers"]);

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
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generic bags of state reused across tool kinds.
  const [files, setFiles] = useState<File[]>([]);
  const [inputText, setInputText] = useState("");
  const [inputTextB, setInputTextB] = useState("");
  const [outputText, setOutputText] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<{ blob: Blob; filename: string; previewImage?: boolean } | null>(null);
  const [opts, setOpts] = useState<Record<string, string>>(() => initialOpts ?? {});

  const setOpt = (key: string, value: string) => setOpts((o) => ({ ...o, [key]: value }));

  const run = async (fn: () => Promise<void> | void) => {
    setError(null);
    setProcessing(true);
    setOutputText(null);
    setOutputBlob(null);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try a different file.");
    } finally {
      setProcessing(false);
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
            <Link key={s.slug} href={`/${s.slug}`} className="rounded-full border border-ink/15 bg-white px-4 py-2 text-xs font-medium text-ink hover:border-moss/50">
              {s.label}
            </Link>
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
          const set = await image.generateFavicons(file);
          const biggest = set[set.length - 1];
          setOutputBlob({ blob: biggest.blob, filename: "favicon-512.png", previewImage: true });
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
          const blob = await image.compressImage(file, quality);
          setOutputBlob({ blob, filename: originalName("-compressed.jpg"), previewImage: true });
          return;
        }
        if (tool.slug === "resize-image") {
          const w = Number(opts.width || 800);
          const h = Number(opts.height || 600);
          const blob = await image.resizeImage(file, w, h);
          setOutputBlob({ blob, filename: originalName("-resized.png"), previewImage: true });
          return;
        }
        if (tool.slug === "crop-image") {
          const x = Number(opts.x || 0);
          const y = Number(opts.y || 0);
          const w = Number(opts.width || 300);
          const h = Number(opts.height || 300);
          const blob = await image.cropImage(file, x, y, w, h);
          setOutputBlob({ blob, filename: originalName("-cropped.png"), previewImage: true });
          return;
        }
        if (tool.slug === "rotate-image") {
          const deg = Number(opts.degrees || 90);
          const blob = await image.rotateImage(file, deg);
          setOutputBlob({ blob, filename: originalName("-rotated.png"), previewImage: true });
          return;
        }
        if (tool.slug === "watermark-image") {
          const blob = await image.watermarkImage(file, opts.text || "Toolkitties");
          setOutputBlob({ blob, filename: originalName("-watermarked.png"), previewImage: true });
          return;
        }
      });

    // Auto-process the moment a file lands, for tools whose defaults are
    // already good enough — no extra "click to process" step needed.
    useEffect(() => {
      if (files[0] && AUTO_PROCESS_IMAGE.has(tool.slug)) {
        doProcess();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    return (
      <Workspace>
        <Dropzone
          accept={tool.slug === "heic-to-jpg" ? "image/heic,image/heif,.heic,.heif" : "image/*"}
          onFiles={setFiles}
          label={files[0] ? `Selected: ${files[0].name}` : "Drop an image here, or click to browse"}
        />

        {tool.slug === "svg-to-png" && (
          <SelectField label="Output size" value={opts.size || "512"} onChange={(v) => setOpt("size", v)} options={[["128", "128px"], ["256", "256px"], ["512", "512px"], ["1024", "1024px"]]} />
        )}
        {tool.slug === "compress-image" && (
          <Slider label="Quality" value={opts.quality || "80"} onChange={(v) => setOpt("quality", v)} min={10} max={95} unit="%" />
        )}
        {tool.slug === "resize-image" && (
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Width (px)" value={opts.width || "800"} onChange={(v) => setOpt("width", v)} />
            <NumberField label="Height (px)" value={opts.height || "600"} onChange={(v) => setOpt("height", v)} />
          </div>
        )}
        {tool.slug === "crop-image" && (
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="X" value={opts.x || "0"} onChange={(v) => setOpt("x", v)} />
            <NumberField label="Y" value={opts.y || "0"} onChange={(v) => setOpt("y", v)} />
            <NumberField label="Width (px)" value={opts.width || "300"} onChange={(v) => setOpt("width", v)} />
            <NumberField label="Height (px)" value={opts.height || "300"} onChange={(v) => setOpt("height", v)} />
          </div>
        )}
        {tool.slug === "rotate-image" && (
          <SelectField label="Rotate by" value={opts.degrees || "90"} onChange={(v) => setOpt("degrees", v)} options={[["90", "90°"], ["180", "180°"], ["270", "270°"]]} />
        )}
        {tool.slug === "watermark-image" && (
          <TextField label="Watermark text" value={opts.text || ""} onChange={(v) => setOpt("text", v)} placeholder="Toolkitties" />
        )}

        <PrimaryButton onClick={doProcess} disabled={!files[0] || processing}>
          Process image
        </PrimaryButton>

        {processing && <WaveLoader />}
        {error && <ErrorNote message={error} />}
        {outputBlob && <FileDownload {...outputBlob} />}
        {outputText && <TextOutput value={outputText} />}
        <NextSteps />
      </Workspace>
    );
  }

  // --------------------------------------------------------------------
  // PDF tools
  // --------------------------------------------------------------------
  if (["merge-pdf", "split-pdf", "compress-pdf", "rotate-pdf", "delete-pdf-pages", "organize-pdf", "watermark-pdf", "pdf-page-numbers"].includes(tool.slug)) {
    const doProcess = () =>
      run(async () => {
        if (tool.slug === "merge-pdf") {
          if (files.length < 2) throw new Error("Add at least two PDFs to merge.");
          const bytes = await pdf.mergePdfs(files);
          setOutputBlob({ blob: pdf.bytesToBlob(bytes), filename: "merged.pdf" });
          return;
        }
        const file = files[0];
        if (!file) throw new Error("Add a PDF first.");

        if (tool.slug === "split-pdf") {
          const pages = (opts.pages || "1").split(",").map((n) => parseInt(n.trim(), 10)).filter(Boolean);
          const bytes = await pdf.splitPdf(file, pages);
          setOutputBlob({ blob: pdf.bytesToBlob(bytes), filename: originalName("-split.pdf") });
          return;
        }
        if (tool.slug === "compress-pdf") {
          const bytes = await pdf.compressPdf(file);
          setOutputBlob({ blob: pdf.bytesToBlob(bytes), filename: originalName("-compressed.pdf") });
          return;
        }
        if (tool.slug === "rotate-pdf") {
          const bytes = await pdf.rotatePdf(file, Number(opts.degrees || 90));
          setOutputBlob({ blob: pdf.bytesToBlob(bytes), filename: originalName("-rotated.pdf") });
          return;
        }
        if (tool.slug === "delete-pdf-pages") {
          const pages = (opts.pages || "").split(",").map((n) => parseInt(n.trim(), 10)).filter(Boolean);
          if (!pages.length) throw new Error("List which page numbers to remove, e.g. 2, 4");
          const bytes = await pdf.deletePages(file, pages);
          setOutputBlob({ blob: pdf.bytesToBlob(bytes), filename: originalName("-edited.pdf") });
          return;
        }
        if (tool.slug === "organize-pdf") {
          const order = (opts.order || "").split(",").map((n) => parseInt(n.trim(), 10)).filter(Boolean);
          if (!order.length) throw new Error("List the new page order, e.g. 3, 1, 2");
          const bytes = await pdf.reorderPages(file, order);
          setOutputBlob({ blob: pdf.bytesToBlob(bytes), filename: originalName("-reordered.pdf") });
          return;
        }
        if (tool.slug === "watermark-pdf") {
          const bytes = await pdf.watermarkPdf(file, opts.text || "Toolkitties");
          setOutputBlob({ blob: pdf.bytesToBlob(bytes), filename: originalName("-watermarked.pdf") });
          return;
        }
        if (tool.slug === "pdf-page-numbers") {
          const bytes = await pdf.addPageNumbers(file);
          setOutputBlob({ blob: pdf.bytesToBlob(bytes), filename: originalName("-numbered.pdf") });
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
          multiple={tool.slug === "merge-pdf"}
          onFiles={setFiles}
          label={files.length ? `Selected: ${files.map((f) => f.name).join(", ")}` : "Drop your PDF here, or click to browse"}
        />

        {tool.slug === "split-pdf" && <TextField label="Pages to keep (comma separated)" value={opts.pages || ""} onChange={(v) => setOpt("pages", v)} placeholder="1, 2, 5" />}
        {tool.slug === "delete-pdf-pages" && <TextField label="Pages to delete (comma separated)" value={opts.pages || ""} onChange={(v) => setOpt("pages", v)} placeholder="2, 4" />}
        {tool.slug === "organize-pdf" && <TextField label="New page order (comma separated)" value={opts.order || ""} onChange={(v) => setOpt("order", v)} placeholder="3, 1, 2" />}
        {tool.slug === "rotate-pdf" && (
          <SelectField label="Rotate by" value={opts.degrees || "90"} onChange={(v) => setOpt("degrees", v)} options={[["90", "90°"], ["180", "180°"], ["270", "270°"]]} />
        )}
        {tool.slug === "watermark-pdf" && <TextField label="Watermark text" value={opts.text || ""} onChange={(v) => setOpt("text", v)} placeholder="Toolkitties" />}

        <PrimaryButton onClick={doProcess} disabled={processing || (tool.slug === "merge-pdf" ? files.length < 2 : !files[0])}>
          Process PDF
        </PrimaryButton>

        {processing && <WaveLoader label="Working on your PDF…" />}
        {error && <ErrorNote message={error} />}
        {outputBlob && <FileDownload {...outputBlob} />}
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
          });
          setOutputText(pw);
          return;
        }
        if (tool.slug === "uuid-generator") {
          setOutputText(dev.generateUuid());
          return;
        }
        if (tool.slug === "lorem-ipsum") {
          setOutputText(text.generateLorem(Number(opts.paragraphs || 3)));
          return;
        }
      });

    return (
      <Workspace>
        {tool.slug === "qr-code-generator" && <TextField label="Link or text" value={inputText} onChange={setInputText} placeholder="https://example.com" />}
        {tool.slug === "password-generator" && <NumberField label="Length" value={opts.length || "16"} onChange={(v) => setOpt("length", v)} />}
        {tool.slug === "lorem-ipsum" && <NumberField label="Paragraphs" value={opts.paragraphs || "3"} onChange={(v) => setOpt("paragraphs", v)} />}

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
    const calcResult = useMemo(() => {
      try {
        if (tool.slug === "unit-converter") {
          const value = Number(opts.value || 0);
          const from = opts.from || "meters";
          const to = opts.to || "feet";
          const kind = opts.kind || "length";
          const result = kind === "length" ? dev.convertLength(value, from, to) : dev.convertWeight(value, from, to);
          return `${value} ${from} = ${result.toFixed(4)} ${to}`;
        }
        if (tool.slug === "percentage-calculator") {
          const a = Number(opts.a || 0);
          const b = Number(opts.b || 0);
          return `${a} is ${dev.calcPercentage(a, b).toFixed(2)}% of ${b}`;
        }
        if (tool.slug === "age-calculator") {
          if (!opts.birthdate) return "";
          const r = dev.calcAge(new Date(opts.birthdate));
          return `${r.years} years, ${r.months} months, ${r.days} days old`;
        }
        if (tool.slug === "color-picker") {
          const hex = opts.hex || "#1F5C4C";
          const rgb = dev.hexToRgb(hex);
          const hsl = dev.rgbToHsl(rgb.r, rgb.g, rgb.b);
          return `HEX: ${hex}\nRGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\nHSL: hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        }
        if (tool.slug === "timestamp-converter") {
          if (opts.mode === "toTimestamp") {
            if (!opts.date) return "";
            return String(dev.dateToTimestamp(new Date(opts.date)));
          }
          if (!opts.timestamp) return "";
          return dev.timestampToDate(Number(opts.timestamp)).toString();
        }
        return "";
      } catch {
        return "";
      }
    }, [tool.slug, opts]);

    return (
      <Workspace>
        {tool.slug === "unit-converter" && (
          <div className="grid grid-cols-2 gap-3">
            <SelectField label="Kind" value={opts.kind || "length"} onChange={(v) => setOpt("kind", v)} options={[["length", "Length"], ["weight", "Weight"]]} />
            <NumberField label="Value" value={opts.value || "1"} onChange={(v) => setOpt("value", v)} />
            <TextField label="From unit" value={opts.from || "meters"} onChange={(v) => setOpt("from", v)} placeholder="meters" />
            <TextField label="To unit" value={opts.to || "feet"} onChange={(v) => setOpt("to", v)} placeholder="feet" />
          </div>
        )}
        {tool.slug === "percentage-calculator" && (
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Value" value={opts.a || "0"} onChange={(v) => setOpt("a", v)} />
            <NumberField label="Out of" value={opts.b || "100"} onChange={(v) => setOpt("b", v)} />
          </div>
        )}
        {tool.slug === "age-calculator" && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Birthdate</label>
            <input type="date" value={opts.birthdate || ""} onChange={(e) => setOpt("birthdate", e.target.value)} className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm" />
          </div>
        )}
        {tool.slug === "color-picker" && (
          <div className="flex items-center gap-3">
            <input type="color" value={opts.hex || "#1F5C4C"} onChange={(e) => setOpt("hex", e.target.value)} className="h-12 w-16 rounded-lg border border-ink/15" />
            <TextField label="" value={opts.hex || "#1F5C4C"} onChange={(v) => setOpt("hex", v)} placeholder="#1F5C4C" />
          </div>
        )}
        {tool.slug === "timestamp-converter" && (
          <div className="flex flex-col gap-3">
            <SelectField label="Direction" value={opts.mode || "fromTimestamp"} onChange={(v) => setOpt("mode", v)} options={[["fromTimestamp", "Timestamp → Date"], ["toTimestamp", "Date → Timestamp"]]} />
            {opts.mode === "toTimestamp" ? (
              <input type="datetime-local" value={opts.date || ""} onChange={(e) => setOpt("date", e.target.value)} className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm" />
            ) : (
              <NumberField label="Unix timestamp" value={opts.timestamp || ""} onChange={(v) => setOpt("timestamp", v)} />
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
          <div className="overflow-hidden rounded-2xl border border-ink/10">
            {rows.map((r) => (
              <div key={r.line} className={`grid grid-cols-2 gap-px text-sm ${r.changed ? "bg-gold/10" : "bg-white"}`}>
                <div className="px-3 py-1.5 font-mono text-xs text-ink/80">{r.a}</div>
                <div className="px-3 py-1.5 font-mono text-xs text-ink/80">{r.b}</div>
              </div>
            ))}
          </div>
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
        <div className="rounded-2xl border border-ink/10 bg-white p-5 text-sm" dangerouslySetInnerHTML={{ __html: liveTextResult }} />
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

function NumberField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">{label}</label>
      <input
        type="number"
        value={value}
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
