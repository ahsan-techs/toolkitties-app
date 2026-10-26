import { openPdf } from "./pdfjs-loader";
import { pageToParagraphs, type TextItem } from "./pdf-text";

const STOPWORDS = new Set(
  "a an the of to in on for and or is are was were be been being this that these those it its as at by from with your you we our not no but if then so can will would could should".split(" ")
);

export async function extractPdfText(file: File): Promise<string[]> {
  const doc = await openPdf(file);
  try {
    const paragraphs: string[] = [];
    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      const content = await page.getTextContent();
      paragraphs.push(...pageToParagraphs(content.items as TextItem[]));
      page.cleanup();
    }
    return paragraphs.filter((p) => p.trim().length > 0);
  } finally {
    await doc.destroy();
  }
}

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);
}

// A deterministic, no-download extractive summarizer: scores sentences by
// how many frequent, non-stopword words they contain, then returns the
// top-scoring sentences in their original order. No model needed, so this
// part is instant and always works.
export function summarizeText(paragraphs: string[], maxSentences = 6): string[] {
  const fullText = paragraphs.join(" ");
  const sentences = splitSentences(fullText);
  if (sentences.length <= maxSentences) return sentences;

  const freq = new Map<string, number>();
  for (const s of sentences) {
    for (const w of s.toLowerCase().match(/[a-z0-9']+/g) ?? []) {
      if (STOPWORDS.has(w) || w.length < 3) continue;
      freq.set(w, (freq.get(w) ?? 0) + 1);
    }
  }

  const scored = sentences.map((s, i) => {
    const words = s.toLowerCase().match(/[a-z0-9']+/g) ?? [];
    const score = words.reduce((sum, w) => sum + (freq.get(w) ?? 0), 0) / Math.max(words.length, 1);
    return { s, i, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, maxSentences).sort((a, b) => a.i - b.i);
  return top.map((t) => t.s);
}

// Picks the paragraph(s) most relevant to a question by plain keyword
// overlap, so the small QA model only has to read a focused chunk instead
// of the whole document (it has a limited context window anyway).
function bestContext(paragraphs: string[], question: string, maxChars = 2000): string {
  const qWords = new Set((question.toLowerCase().match(/[a-z0-9']+/g) ?? []).filter((w) => !STOPWORDS.has(w)));
  const scored = paragraphs.map((p, i) => {
    const words = p.toLowerCase().match(/[a-z0-9']+/g) ?? [];
    const score = words.reduce((s, w) => s + (qWords.has(w) ? 1 : 0), 0);
    return { p, i, score };
  });
  scored.sort((a, b) => b.score - a.score || a.i - b.i);

  let out = "";
  for (const { p } of scored) {
    if (out.length + p.length > maxChars) break;
    out += (out ? " " : "") + p;
  }
  return out || paragraphs.slice(0, 3).join(" ").slice(0, maxChars);
}

type QaPipeline = (question: string, context: string) => Promise<{ answer: string; score: number }>;
let qaPipelinePromise: Promise<QaPipeline> | null = null;

// Loads a small (~65MB, quantized) question-answering model entirely in
// the browser the first time it's needed, cached by the browser afterward.
// Nothing about the document or the question is ever sent anywhere.
async function getQaPipeline(onProgress?: (pct: number) => void): Promise<QaPipeline> {
  if (!qaPipelinePromise) {
    qaPipelinePromise = import("@xenova/transformers").then(async (transformers) => {
      transformers.env.allowLocalModels = false;
      const pipe = await transformers.pipeline("question-answering", "Xenova/distilbert-base-cased-distilled-squad", {
        progress_callback: (p: { status: string; progress?: number }) => {
          if (p.status === "progress" && typeof p.progress === "number") onProgress?.(Math.round(p.progress));
        },
      });
      return (async (question: string, context: string) => {
        const result = await pipe(question, context);
        const r = Array.isArray(result) ? result[0] : result;
        return { answer: String(r.answer ?? "").trim(), score: Number(r.score ?? 0) };
      }) as QaPipeline;
    });
    qaPipelinePromise.catch(() => {
      qaPipelinePromise = null;
    });
  }
  return qaPipelinePromise;
}

export async function askPdf(paragraphs: string[], question: string, onProgress?: (pct: number) => void): Promise<{ answer: string; confident: boolean }> {
  const context = bestContext(paragraphs, question);
  if (!context) return { answer: "This document doesn't seem to have enough text to search.", confident: false };
  const qa = await getQaPipeline(onProgress);
  const { answer, score } = await qa(question, context);
  if (!answer || score < 0.05) {
    return { answer: "I couldn't find a confident answer to that in this document.", confident: false };
  }
  return { answer, confident: score >= 0.3 };
}
