"use client";

import { useMemo, useState } from "react";
import { parseInBase } from "@/lib/tool-processors/mini-tools";
import { Stack, Field, CopyButton, inputCls, ghostBtnCls } from "./ui";

const OUTPUT_BASES: { base: number; label: string }[] = [
  { base: 2, label: "Binary (base 2)" },
  { base: 8, label: "Octal (base 8)" },
  { base: 10, label: "Decimal (base 10)" },
  { base: 16, label: "Hexadecimal (base 16)" },
  { base: 32, label: "Base 32" },
  { base: 36, label: "Base 36" },
];

export default function NumberBaseConverter() {
  const [input, setInput] = useState("");
  const [base, setBase] = useState(10);

  const value = useMemo(() => (input.trim() ? parseInBase(input, base) : null), [input, base]);
  const invalid = input.trim() !== "" && value === null;

  return (
    <Stack>
      <Field label="Number">
        <input className={`${inputCls} font-mono`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="255" spellCheck={false} />
      </Field>
      <div className="flex flex-wrap items-end gap-3">
        <Field label="Convert from base (2 to 36)">
          <input type="number" min={2} max={36} value={base} onChange={(e) => setBase(Math.min(36, Math.max(2, Math.round(Number(e.target.value)) || 10)))} className={`${inputCls} w-28`} />
        </Field>
        {[2, 8, 10, 16].map((b) => (
          <button key={b} type="button" className={ghostBtnCls} onClick={() => setBase(b)}>{b === 2 ? "Binary" : b === 8 ? "Octal" : b === 10 ? "Decimal" : "Hex"}</button>
        ))}
      </div>
      {invalid && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">That is not a valid base-{base} number. Use only the digits allowed in base {base}.</p>}
      {value !== null && (
        <ul className="flex flex-col gap-2">
          {OUTPUT_BASES.map((o) => {
            const text = value.toString(o.base).toUpperCase();
            return (
              <li key={o.base} className="flex items-center justify-between gap-3 rounded-xl border border-ink/10 bg-white px-4 py-3">
                <div className="min-w-0">
                  <p className="text-xs text-slate">{o.label}</p>
                  <p className="break-all font-mono text-sm text-ink">{text}</p>
                </div>
                <CopyButton value={text} />
              </li>
            );
          })}
        </ul>
      )}
      <p className="text-xs text-slate">Handles very large whole numbers exactly. Decimals (fractions) are not supported.</p>
    </Stack>
  );
}
