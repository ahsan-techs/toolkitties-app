"use client";

import { useMemo, useState } from "react";
import { decodeJwt } from "@/lib/tool-processors/mini-tools";
import { Stack, Field, ErrorNote, CopyButton, inputCls } from "./ui";

export default function JwtDecoder() {
  const [input, setInput] = useState("");

  const result = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return { ok: true as const, data: decodeJwt(input) };
    } catch (e) {
      return { ok: false as const, error: e instanceof Error ? e.message : "Could not decode this token." };
    }
  }, [input]);

  const block = (title: string, text: string) => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">{title}</h3>
        <CopyButton value={text} />
      </div>
      <pre className="overflow-x-auto rounded-2xl border border-ink/10 bg-sand/40 p-4 font-mono text-xs text-ink">{text}</pre>
    </div>
  );

  return (
    <Stack>
      <Field label="Paste your JWT" hint="It is decoded on your device and never sent anywhere.">
        <textarea className={`${inputCls} min-h-[130px] break-all font-mono`} value={input} onChange={(e) => setInput(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." />
      </Field>
      {result && !result.ok && <ErrorNote message={result.error} />}
      {result && result.ok && (
        <>
          {result.data.expired !== null && (
            <p className={`rounded-xl px-4 py-3 text-sm ${result.data.expired ? "border border-red-200 bg-red-50 text-red-800" : "border border-moss/30 bg-moss/10 text-moss"}`}>
              {result.data.expired ? "This token has expired." : "This token has not expired yet."}
            </p>
          )}
          {block("Header", result.data.headerText)}
          {block("Payload", result.data.payloadText)}
          {result.data.times.length > 0 && (
            <ul className="flex flex-col gap-1 text-sm text-ink">
              {result.data.times.map((t) => (
                <li key={t.claim}><span className="font-medium">{t.claim}:</span> {t.iso} <span className="text-slate">({t.relative})</span></li>
              ))}
            </ul>
          )}
          {block("Signature (raw)", result.data.signature)}
          <p className="text-xs text-slate">This tool only decodes the token. It does not check the signature, so never treat a decoded token as proof that it is genuine.</p>
        </>
      )}
    </Stack>
  );
}
