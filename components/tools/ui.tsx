"use client";

import { useState, type ReactNode } from "react";

export const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-moss";
export const btnCls =
  "rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-50";
export const ghostBtnCls =
  "rounded-full border border-ink/15 bg-white px-4 py-2 text-xs font-medium text-ink hover:border-moss/50";

export function Stack({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-5">{children}</div>;
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="text-xs text-slate">{hint}</span> : null}
    </label>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{message}</p>;
}

export function Stat({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-sand/40 p-4">
      <p className="text-xs text-slate">{label}</p>
      <p className={`mt-1 font-display ${strong ? "text-2xl" : "text-lg"} font-semibold text-ink`}>{value}</p>
    </div>
  );
}

export function CopyButton({ value, label = "Copy" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={ghostBtnCls}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}

export function blobFrom(bytes: Uint8Array, type: string): Blob {
  return new Blob([bytes as unknown as BlobPart], { type });
}

export function baseName(file: File | undefined, fallback = "toolkitties-file"): string {
  return file?.name?.replace(/\.[^.]+$/, "") || fallback;
}

export function fmtNumber(n: number, digits = 2): string {
  return n.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
