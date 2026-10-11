"use client";

import { useEffect, useState, type ReactNode } from "react";
import { MIME_LABEL, supportsEncode, type Mime, type OutFmt } from "@/lib/tool-processors/image-engine";

export type ToolProps = { initialOpts?: Record<string, string> };

export function useObjectUrl(blob: Blob | null | undefined): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!blob) {
      setUrl(null);
      return;
    }
    const u = URL.createObjectURL(blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [blob]);
  return url;
}

export function num(v: string | undefined, fallback: number): number {
  if (v === undefined || v === "") return fallback;
  const n = Number(v);
  return isFinite(n) ? n : fallback;
}

export const checkerStyle = {
  backgroundImage: "conic-gradient(#e4e4e0 25%, #ffffff 0 50%, #e4e4e0 0 75%, #ffffff 0)",
  backgroundSize: "16px 16px",
} as const;

const fieldCls = "w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-moss";

export function OptionsCard({ title = "Options", children }: { title?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ink/10 bg-sand/30 p-4 md:p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate">{title}</p>
      {children}
    </div>
  );
}

export function Grid({ children, cols = 2 }: { children: ReactNode; cols?: 2 | 3 | 4 }) {
  const c = cols === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return <div className={`grid gap-4 ${c}`}>{children}</div>;
}

export function FieldLabel({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-ink">{label}</span>
      {children}
      {hint ? <span className="text-xs text-slate">{hint}</span> : null}
    </label>
  );
}

export function Segmented<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label?: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-xs font-medium text-ink">{label}</span>}
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
              value === o.value ? "border-ink bg-ink text-paper" : "border-ink/15 bg-white text-ink hover:border-moss/50"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function RangeField({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  unit = "",
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  unit?: string;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="flex justify-between text-xs font-medium text-ink">
        <span>{label}</span>
        <span className="text-slate">
          {value}
          {unit}
        </span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-moss" />
      {hint ? <span className="text-xs text-slate">{hint}</span> : null}
    </label>
  );
}

export function CheckField({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <label className="flex items-start gap-2 text-sm text-ink">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 accent-moss" />
      <span>
        {label}
        {hint ? <span className="block text-xs text-slate">{hint}</span> : null}
      </span>
    </label>
  );
}

export function NumField({
  label,
  value,
  onChange,
  min,
  max,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <FieldLabel label={label} hint={hint}>
      <input type="number" inputMode="numeric" min={min} max={max} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={fieldCls} />
    </FieldLabel>
  );
}

export function TextInput({ label, value, onChange, placeholder, hint }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string }) {
  return (
    <FieldLabel label={label} hint={hint}>
      <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={fieldCls} />
    </FieldLabel>
  );
}

export function SelectBox<T extends string>({ label, value, onChange, options, hint }: { label: string; value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; hint?: string }) {
  return (
    <FieldLabel label={label} hint={hint}>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className={fieldCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldLabel>
  );
}

export function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <FieldLabel label={label}>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-ink/15 bg-white p-1" />
        <input value={value} onChange={(e) => onChange(e.target.value)} className={fieldCls} maxLength={9} />
      </div>
    </FieldLabel>
  );
}

export function Chips({ items, onPick }: { items: { label: string; onClick?: () => void; key?: string }[]; onPick?: (i: number) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it, i) => (
        <button
          key={it.key ?? it.label}
          type="button"
          onClick={() => (it.onClick ? it.onClick() : onPick?.(i))}
          className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-medium text-ink transition hover:border-moss/50"
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

export function useAvifSupport(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(supportsEncode("image/avif")), []);
  return ok;
}

/** Output format + quality (+ background for JPG) — shared by every image tool. */
export function FormatControls({
  value,
  onChange,
  quality,
  onQuality,
  bg,
  onBg,
  allowSame = true,
  showQuality = true,
}: {
  value: OutFmt;
  onChange: (v: OutFmt) => void;
  quality: number;
  onQuality: (v: number) => void;
  bg: string;
  onBg: (v: string) => void;
  allowSame?: boolean;
  showQuality?: boolean;
}) {
  const avif = useAvifSupport();
  const options: { value: OutFmt; label: string }[] = [
    ...(allowSame ? [{ value: "same" as OutFmt, label: "Same as original" }] : []),
    ...(["image/jpeg", "image/png", "image/webp"] as Mime[]).map((m) => ({ value: m as OutFmt, label: MIME_LABEL[m] })),
    ...(avif ? [{ value: "image/avif" as OutFmt, label: "AVIF" }] : []),
  ];
  const lossy = value !== "image/png";
  return (
    <Grid cols={3}>
      <SelectBox label="Output format" value={value} onChange={onChange} options={options} />
      {showQuality && lossy && <RangeField label="Quality" value={quality} min={10} max={100} onChange={onQuality} unit="%" hint="Lower = smaller file" />}
      {(value === "image/jpeg" || value === "same") && <ColorField label="Background (replaces transparency)" value={bg} onChange={onBg} />}
    </Grid>
  );
}

export function InfoNote({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warn" }) {
  return (
    <p className={`rounded-xl px-4 py-3 text-xs ${tone === "warn" ? "bg-gold/10 text-gold" : "bg-moss/5 text-moss"}`}>{children}</p>
  );
}
