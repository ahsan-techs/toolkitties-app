"use client";

import { useState } from "react";
import Dropzone from "@/components/workspace/Dropzone";
import { extractPdfText, summarizeText, askPdf } from "@/lib/tool-processors/pdf-ai";
import { Stack, ErrorNote, btnCls } from "./ui";

type QaEntry = { question: string; answer: string; confident: boolean };

export default function PdfAiChat() {
  const [file, setFile] = useState<File | null>(null);
  const [paragraphs, setParagraphs] = useState<string[] | null>(null);
  const [loadingText, setLoadingText] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [summary, setSummary] = useState<string[] | null>(null);

  const [question, setQuestion] = useState("");
  const [asking, setAsking] = useState(false);
  const [modelPct, setModelPct] = useState<number | null>(null);
  const [history, setHistory] = useState<QaEntry[]>([]);

  async function loadFile(f: File) {
    setFile(f);
    setParagraphs(null);
    setSummary(null);
    setHistory([]);
    setError(null);
    setLoadingText(true);
    try {
      const paras = await extractPdfText(f);
      if (paras.join("").trim().length < 10) {
        throw new Error("No selectable text was found in this PDF — it looks like a scanned document. Use the PDF OCR tool first, then paste that text here if you'd like to ask questions about it.");
      }
      setParagraphs(paras);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read this PDF.");
    } finally {
      setLoadingText(false);
    }
  }

  function doSummarize() {
    if (!paragraphs) return;
    setSummary(summarizeText(paragraphs, 6));
  }

  async function doAsk() {
    if (!paragraphs || !question.trim()) return;
    setAsking(true);
    setError(null);
    setModelPct(null);
    const q = question.trim();
    try {
      const { answer, confident } = await askPdf(paragraphs, q, setModelPct);
      setHistory((h) => [...h, { question: q, answer, confident }]);
      setQuestion("");
    } catch {
      setError("Could not load the local AI model — check your connection and try again.");
    } finally {
      setAsking(false);
      setModelPct(null);
    }
  }

  return (
    <Stack>
      <Dropzone
        accept="application/pdf,.pdf"
        label={file ? `Selected: ${file.name}` : "Drop a PDF here, or click to browse"}
        onFiles={(f) => f[0] && loadFile(f[0])}
      />
      {loadingText && <p className="text-sm text-slate">Reading the document…</p>}
      {error && <ErrorNote message={error} />}

      {paragraphs && (
        <>
          <p className="text-xs text-slate">
            🔒 Everything below — the summary and the Q&A model — runs locally in your browser. The document never leaves this device.
          </p>

          <div className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-sand/30 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-ink">📋 Summary</p>
              <button type="button" className={btnCls} onClick={doSummarize}>
                {summary ? "Re-summarize" : "Summarize this PDF"}
              </button>
            </div>
            {summary && (
              <ul className="list-disc pl-5 text-sm text-ink">
                {summary.map((s, i) => (
                  <li key={i} className="mb-1">
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-sand/30 p-4">
            <p className="text-sm font-medium text-ink">💬 Ask a question about this document</p>
            <div className="flex gap-2">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !asking && doAsk()}
                placeholder="e.g. What is the total amount due?"
                className="flex-1 rounded-xl border border-ink/15 bg-white px-3 py-2 text-sm text-ink"
              />
              <button type="button" className={btnCls} disabled={asking || !question.trim()} onClick={doAsk}>
                {asking ? "Thinking…" : "Ask"}
              </button>
            </div>
            {asking && modelPct !== null && <p className="text-xs text-slate">⚙️ Loading the local AI model (one-time download)… {modelPct}%</p>}
            {history.length > 0 && (
              <div className="flex flex-col gap-3 pt-2">
                {history
                  .slice()
                  .reverse()
                  .map((h, i) => (
                    <div key={i} className="rounded-xl bg-white p-3 text-sm">
                      <p className="font-medium text-ink">❓ {h.question}</p>
                      <p className="mt-1 text-ink">{h.confident ? "✅" : "🤔"} {h.answer}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </>
      )}
    </Stack>
  );
}
