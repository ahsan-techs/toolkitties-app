"use client";

import { useState } from "react";

export function TextOutput({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative">
      <textarea
        readOnly
        value={value}
        rows={10}
        className="w-full resize-none rounded-2xl border border-ink/10 bg-sand/40 p-4 font-mono text-sm text-ink outline-none"
      />
      <button
        onClick={async () => {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
        className="absolute right-3 top-3 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-paper hover:bg-ink/80"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  );
}

export function FileDownload({ blob, filename, previewImage }: { blob: Blob; filename: string; previewImage?: boolean }) {
  const url = URL.createObjectURL(blob);
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-ink/10 bg-sand/40 p-6 text-center">
      {previewImage && <img src={url} alt="Preview" className="max-h-64 rounded-xl border border-ink/10 object-contain" />}
      <p className="text-sm text-slate">Your file is ready — {(blob.size / 1024).toFixed(1)} KB</p>
      <a
        href={url}
        download={filename}
        className="rounded-full bg-moss px-6 py-3 text-sm font-semibold text-paper hover:bg-moss/85"
      >
        Download {filename}
      </a>
    </div>
  );
}
