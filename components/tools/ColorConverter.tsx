"use client";

import { useMemo, useState } from "react";
import { parseHex, toHex, rgbToHsl, contrastRatio } from "@/lib/tool-processors/mini-tools";
import { Stack, Field, CopyButton, inputCls } from "./ui";

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const rgb = parseHex(value);
  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <input type="color" aria-label={`${label} picker`} value={rgb ? toHex(rgb).toLowerCase() : "#000000"} onChange={(e) => onChange(e.target.value.toUpperCase())} className="h-12 w-16 rounded-lg border border-ink/15" />
        <input className={`${inputCls} font-mono`} value={value} onChange={(e) => onChange(e.target.value)} spellCheck={false} />
      </div>
    </Field>
  );
}

export default function ColorConverter() {
  const [color, setColor] = useState("#1F5C4C");
  const [fg, setFg] = useState("#15171A");
  const [bg, setBg] = useState("#F5F6F3");

  const rgb = parseHex(color);
  const fgRgb = parseHex(fg);
  const bgRgb = parseHex(bg);
  const ratio = useMemo(() => (fgRgb && bgRgb ? contrastRatio(fgRgb, bgRgb) : null), [fgRgb, bgRgb]);

  const rows = rgb
    ? [
        { label: "HEX", value: toHex(rgb) },
        { label: "RGB", value: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})` },
        { label: "HSL", value: (() => { const [h, s, l] = rgbToHsl(rgb); return `hsl(${h}, ${s}%, ${l}%)`; })() },
      ]
    : [];

  const badge = (label: string, pass: boolean) => (
    <span key={label} className={`rounded-full px-3 py-1 text-xs font-semibold ${pass ? "bg-moss/15 text-moss" : "bg-red-100 text-red-800"}`}>
      {label}: {pass ? "Pass" : "Fail"}
    </span>
  );

  return (
    <Stack>
      <h2 className="font-display text-lg font-semibold text-ink">Convert a colour</h2>
      <ColorField label="Colour (HEX)" value={color} onChange={setColor} />
      {!rgb && <p className="text-sm text-red-800">Enter a valid HEX colour such as #1F5C4C or #fff.</p>}
      {rows.length > 0 && (
        <ul className="flex flex-col gap-2">
          {rows.map((r) => (
            <li key={r.label} className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white px-4 py-3">
              <div><p className="text-xs text-slate">{r.label}</p><p className="font-mono text-sm text-ink">{r.value}</p></div>
              <CopyButton value={r.value} />
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-4 font-display text-lg font-semibold text-ink">Check text contrast</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <ColorField label="Text colour" value={fg} onChange={setFg} />
        <ColorField label="Background colour" value={bg} onChange={setBg} />
      </div>
      {fgRgb && bgRgb ? (
        <div className="flex flex-col gap-3">
          <div className="rounded-2xl border border-ink/10 p-6" style={{ backgroundColor: toHex(bgRgb), color: toHex(fgRgb) }}>
            <p className="text-2xl font-semibold">Large sample text</p>
            <p className="mt-1 text-sm">Normal sample text, the quick brown fox jumps over the lazy dog.</p>
          </div>
          {ratio !== null && (
            <>
              <p className="font-display text-xl font-semibold text-ink">{ratio.toFixed(2)} : 1</p>
              <div className="flex flex-wrap gap-2">
                {badge("AA normal text", ratio >= 4.5)}
                {badge("AA large text", ratio >= 3)}
                {badge("AAA normal text", ratio >= 7)}
                {badge("AAA large text", ratio >= 4.5)}
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="text-sm text-red-800">Enter valid HEX colours for both fields.</p>
      )}
    </Stack>
  );
}
