"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Stack, Field, ErrorNote, inputCls } from "./ui";

const MAX_MATCHES = 500;
const FLAG_OPTIONS: { flag: string; label: string }[] = [
  { flag: "g", label: "g — all matches" },
  { flag: "i", label: "i — ignore case" },
  { flag: "m", label: "m — multiline" },
  { flag: "s", label: "s — dot matches newline" },
  { flag: "u", label: "u — unicode" },
];

type Match = { index: number; text: string; groups: string[] };

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [subject, setSubject] = useState("");

  const result = useMemo(() => {
    if (!pattern) return { error: null as string | null, matches: [] as Match[], truncated: false };
    try {
      const re = new RegExp(pattern, flags);
      const matches: Match[] = [];
      let truncated = false;
      if (re.global) {
        let m: RegExpExecArray | null;
        while ((m = re.exec(subject)) !== null) {
          matches.push({ index: m.index, text: m[0], groups: m.slice(1).map((g) => g ?? "") });
          if (m[0] === "") re.lastIndex++;
          if (matches.length >= MAX_MATCHES) {
            truncated = true;
            break;
          }
        }
      } else {
        const m = re.exec(subject);
        if (m) matches.push({ index: m.index, text: m[0], groups: m.slice(1).map((g) => g ?? "") });
      }
      return { error: null, matches, truncated };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Invalid pattern.", matches: [] as Match[], truncated: false };
    }
  }, [pattern, flags, subject]);

  const highlighted = useMemo(() => {
    const nodes: ReactNode[] = [];
    let cursor = 0;
    result.matches.forEach((m, i) => {
      if (m.text === "" || m.index < cursor) return;
      if (m.index > cursor) nodes.push(subject.slice(cursor, m.index));
      nodes.push(<mark key={i} className="rounded bg-gold/40 px-0.5 text-ink">{m.text}</mark>);
      cursor = m.index + m.text.length;
    });
    nodes.push(subject.slice(cursor));
    return nodes;
  }, [result.matches, subject]);

  const toggleFlag = (f: string) => setFlags((cur) => (cur.includes(f) ? cur.replace(f, "") : cur + f));

  return (
    <Stack>
      <Field label="Regular expression" hint="Write it without the surrounding slashes.">
        <input className={`${inputCls} font-mono`} value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="(\d{3})-(\d{4})" spellCheck={false} />
      </Field>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {FLAG_OPTIONS.map((o) => (
          <label key={o.flag} className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" checked={flags.includes(o.flag)} onChange={() => toggleFlag(o.flag)} className="h-4 w-4 accent-moss" />
            {o.label}
          </label>
        ))}
      </div>
      <Field label="Text to test">
        <textarea className={`${inputCls} min-h-[150px] font-mono`} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Call 555-1234 or 555-9876" />
      </Field>
      {result.error && <ErrorNote message={result.error} />}
      {!result.error && pattern && (
        <>
          <p className="text-sm font-medium text-ink">
            {result.matches.length === 0 ? "No matches." : `${result.matches.length}${result.truncated ? "+" : ""} match${result.matches.length === 1 ? "" : "es"}`}
          </p>
          {result.matches.length > 0 && (
            <>
              <pre className="whitespace-pre-wrap break-words rounded-2xl border border-ink/10 bg-sand/40 p-4 font-mono text-sm text-ink">{highlighted}</pre>
              <ul className="flex flex-col gap-1.5 text-sm text-ink">
                {result.matches.slice(0, 50).map((m, i) => (
                  <li key={i} className="rounded-xl border border-ink/10 bg-white px-3 py-2">
                    <span className="text-slate">#{i + 1} at {m.index}:</span> <code className="font-mono">{JSON.stringify(m.text)}</code>
                    {m.groups.length > 0 && (
                      <span className="text-slate"> — groups: {m.groups.map((g, k) => `${k + 1}=${JSON.stringify(g)}`).join(", ")}</span>
                    )}
                  </li>
                ))}
              </ul>
              {result.matches.length > 50 && <p className="text-xs text-slate">Showing the first 50 matches. All matches are highlighted above.</p>}
            </>
          )}
        </>
      )}
      <p className="text-xs text-slate">Uses your browser&apos;s own JavaScript regex engine. Very complex patterns on very long text can be slow.</p>
    </Stack>
  );
}
