"use client";

import { useMemo, useState } from "react";
import { TextOutput } from "@/components/workspace/OutputPanel";
import { jsonToCsv } from "@/lib/tool-processors/mini-tools";
import { Stack, Field, ErrorNote, inputCls, btnCls } from "./ui";

export default function JsonToCsv() {
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState(",");

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return { ok: true as const, ...jsonToCsv(input, delimiter) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Invalid JSON." };
    }
  }, [input, delimiter]);

  const download = () => {
    if (!result || !result.ok) return;
    const blob = new Blob(["\uFEFF" + result.csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <Stack>
      <Field label="Paste your JSON (an array of objects works best)">
        <textarea className={`${inputCls} min-h-[200px] font-mono`} value={input} onChange={(e) => setInput(e.target.value)} placeholder={'[{"name":"Ayesha","city":"Lahore"},{"name":"Ali","city":"Karachi"}]'} />
      </Field>
      <Field label="Separator">
        <select className={inputCls} value={delimiter} onChange={(e) => setDelimiter(e.target.value)}>
          <option value=",">Comma (,)</option>
          <option value=";">Semicolon (;)</option>
          <option value={"\t"}>Tab</option>
        </select>
      </Field>
      {result && !result.ok && <ErrorNote message={result.error} />}
      {result && result.ok && (
        <>
          <p className="text-xs text-slate">{result.rows} row{result.rows === 1 ? "" : "s"}, {result.columns} column{result.columns === 1 ? "" : "s"}. Nested objects become columns like address.city.</p>
          <TextOutput value={result.csv} />
          <button type="button" className={btnCls} onClick={download}>Download CSV file</button>
        </>
      )}
    </Stack>
  );
}
