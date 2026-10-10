"use client";

import { useMemo, useState } from "react";
import { TextOutput } from "@/components/workspace/OutputPanel";
import { sortLines, type SortMode } from "@/lib/tool-processors/mini-tools";
import { Stack, Field, inputCls } from "./ui";

export default function SortLines() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<SortMode>("az");
  const [trim, setTrim] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [numeric, setNumeric] = useState(true);

  const lines = useMemo(
    () => sortLines(input, { mode, trim, removeEmpty, ignoreCase, numeric }),
    [input, mode, trim, removeEmpty, ignoreCase, numeric]
  );
  const output = lines.join("\n");

  const check = (label: string, value: boolean, set: (v: boolean) => void) => (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)} className="h-4 w-4 accent-moss" />
      {label}
    </label>
  );

  return (
    <Stack>
      <Field label="Your lines (one per line)">
        <textarea className={`${inputCls} min-h-[180px] font-mono`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={"banana\napple\ncherry"} />
      </Field>
      <Field label="Order">
        <select className={inputCls} value={mode} onChange={(e) => setMode(e.target.value as SortMode)}>
          <option value="az">A to Z</option>
          <option value="za">Z to A</option>
          <option value="short">Shortest first</option>
          <option value="long">Longest first</option>
          <option value="reverse">Reverse the current order</option>
          <option value="none">Keep order (only clean up)</option>
        </select>
      </Field>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        {check("Trim spaces around each line", trim, setTrim)}
        {check("Remove empty lines", removeEmpty, setRemoveEmpty)}
        {check("Ignore upper/lower case", ignoreCase, setIgnoreCase)}
        {check("Sort numbers naturally (2 before 10)", numeric, setNumeric)}
      </div>
      <p className="text-xs text-slate">{input ? `${lines.length} line${lines.length === 1 ? "" : "s"} in the result` : "Your result appears here as you type."}</p>
      <TextOutput value={output} />
    </Stack>
  );
}
