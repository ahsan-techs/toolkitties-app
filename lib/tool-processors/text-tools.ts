// All functions here run 100% client-side — no server round trip.

export function countWords(text: string) {
  const trimmed = text.trim();
  const words = trimmed.length ? trimmed.split(/\s+/).length : 0;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const sentences = (text.match(/[.!?]+/g) || []).length;
  const readingMinutes = Math.max(1, Math.round(words / 200));
  return { words, characters, charactersNoSpaces, sentences, readingMinutes };
}

export function toUpperCase(text: string) {
  return text.toUpperCase();
}
export function toLowerCase(text: string) {
  return text.toLowerCase();
}
export function toTitleCase(text: string) {
  // Capitalises the first letter of every word (letters from any language), lower-cases the rest.
  return text.toLowerCase().replace(/(^|[\s(\[{"\u201C/])(\p{L})/gu, (_m, pre: string, ch: string) => pre + ch.toUpperCase());
}
export function toSentenceCase(text: string) {
  const lower = text.toLowerCase();
  return lower.replace(/(^\s*\p{L}|\n\s*\p{L}|[.!?]\s+\p{L})/gu, (c) => c.toUpperCase());
}

export function formatJson(raw: string) {
  const parsed = JSON.parse(raw);
  return JSON.stringify(parsed, null, 2);
}
export function minifyJson(raw: string) {
  const parsed = JSON.parse(raw);
  return JSON.stringify(parsed);
}

export function encodeBase64(text: string) {
  if (typeof window === "undefined") return "";
  return window.btoa(unescape(encodeURIComponent(text)));
}
export function decodeBase64(text: string) {
  if (typeof window === "undefined") return "";
  return decodeURIComponent(escape(window.atob(text)));
}

// Small, dependency-free Markdown -> HTML renderer. Everything is escaped first, and links are
// only kept when they are safe (http, https, mailto, tel or relative), so pasted text can never
// run a script in the preview.
function escapeHtml(v: string) {
  return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function isSafeUrl(url: string) {
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(url);
  return !scheme || ["http", "https", "mailto", "tel"].includes(scheme[1].toLowerCase());
}

function renderInline(raw: string) {
  const codes: string[] = [];
  let t = raw.replace(/`([^`]+)`/g, (_m, c: string) => {
    codes.push(`<code>${escapeHtml(c)}</code>`);
    return `\u0000${codes.length - 1}\u0000`;
  });
  t = escapeHtml(t);
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, url: string) => {
    const plain = url.replace(/&amp;/g, "&").replace(/&quot;/g, '"');
    return isSafeUrl(plain) ? `<a href="${escapeHtml(plain)}" target="_blank" rel="noopener noreferrer">${label}</a>` : label;
  });
  t = t
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/~~([^~]+)~~/g, "<del>$1</del>")
    .replace(/\*([^*\n]+)\*/g, "<em>$1</em>")
    .replace(/(^|[^\w])_([^_\n]+)_(?!\w)/g, "$1<em>$2</em>");
  return t.replace(/\u0000(\d+)\u0000/g, (_m, i: string) => codes[Number(i)]);
}

export function renderMarkdown(md: string) {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;
  const isBlank = (l: string) => l.trim() === "";
  const special = (l: string) =>
    /^(#{1,6})\s+/.test(l) || /^\s*([-*+]|\d+[.)])\s+/.test(l) || /^>\s?/.test(l) || /^```/.test(l) || /^(-{3,}|\*{3,}|_{3,})\s*$/.test(l);

  while (i < lines.length) {
    const line = lines[i];
    if (isBlank(line)) { i++; continue; }

    if (/^```/.test(line)) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
      i++;
      out.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      out.push(`<h${heading[1].length}>${renderInline(heading[2].trim())}</h${heading[1].length}>`);
      i++;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) { out.push("<hr/>"); i++; continue; }
    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) quote.push(lines[i++].replace(/^>\s?/, ""));
      out.push(`<blockquote>${quote.map(renderInline).join("<br/>")}</blockquote>`);
      continue;
    }
    const bullet = /^\s*[-*+]\s+/;
    const numbered = /^\s*\d+[.)]\s+/;
    if (bullet.test(line) || numbered.test(line)) {
      const ordered = numbered.test(line);
      const re = ordered ? numbered : bullet;
      const items: string[] = [];
      while (i < lines.length && re.test(lines[i])) items.push(`<li>${renderInline(lines[i++].replace(re, ""))}</li>`);
      out.push(`<${ordered ? "ol" : "ul"}>${items.join("")}</${ordered ? "ol" : "ul"}>`);
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && !isBlank(lines[i]) && (para.length === 0 || !special(lines[i]))) para.push(lines[i++]);
    out.push(`<p>${para.map(renderInline).join("<br/>")}</p>`);
  }
  return out.join("\n");
}

export function encodeUrl(text: string) {
  return encodeURIComponent(text);
}
export function decodeUrl(text: string) {
  return decodeURIComponent(text);
}

// MD5 isn't available via the browser's native SubtleCrypto API, so it's
// implemented in plain JS here. SHA-1/256/512 use the real, fast native
// implementation.
function md5(input: string): string {
  function rotl(x: number, c: number) { return (x << c) | (x >>> (32 - c)); }
  function toHex(word: number) {
    let s = "";
    for (let i = 0; i < 4; i++) s += ((word >> (i * 8)) & 0xff).toString(16).padStart(2, "0");
    return s;
  }
  const K = Array.from({ length: 64 }, (_, i) => Math.floor(Math.abs(Math.sin(i + 1)) * 2 ** 32) >>> 0);
  const S = [7,12,17,22,7,12,17,22,7,12,17,22,7,12,17,22,5,9,14,20,5,9,14,20,5,9,14,20,5,9,14,20,4,11,16,23,4,11,16,23,4,11,16,23,4,11,16,23,6,10,15,21,6,10,15,21,6,10,15,21,6,10,15,21];

  const bytes = new TextEncoder().encode(input);
  const bitLen = bytes.length * 8;
  const withOne = new Uint8Array(((bytes.length + 8) >> 6) * 64 + 64);
  withOne.set(bytes);
  withOne[bytes.length] = 0x80;
  const dv = new DataView(withOne.buffer);
  dv.setUint32(withOne.length - 8, bitLen >>> 0, true);
  dv.setUint32(withOne.length - 4, Math.floor(bitLen / 2 ** 32), true);

  let [a0, b0, c0, d0] = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];

  for (let chunk = 0; chunk < withOne.length; chunk += 64) {
    const M = new Array(16);
    for (let i = 0; i < 16; i++) M[i] = dv.getUint32(chunk + i * 4, true);
    let [a, b, c, d] = [a0, b0, c0, d0];
    for (let i = 0; i < 64; i++) {
      let f, g;
      if (i < 16) { f = (b & c) | (~b & d); g = i; }
      else if (i < 32) { f = (d & b) | (~d & c); g = (5 * i + 1) % 16; }
      else if (i < 48) { f = b ^ c ^ d; g = (3 * i + 5) % 16; }
      else { f = c ^ (b | ~d); g = (7 * i) % 16; }
      f = (f + a + K[i] + M[g]) >>> 0;
      a = d; d = c; c = b;
      b = (b + rotl(f, S[i])) >>> 0;
    }
    a0 = (a0 + a) >>> 0; b0 = (b0 + b) >>> 0; c0 = (c0 + c) >>> 0; d0 = (d0 + d) >>> 0;
  }
  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
}

export async function generateHash(text: string, algorithm: "MD5" | "SHA-1" | "SHA-256" | "SHA-512"): Promise<string> {
  if (algorithm === "MD5") return md5(text);
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export type DiffRow = { line: number; a: string; b: string; changed: boolean };

// Compares two texts line by line. A line added or removed in the middle only marks that
// line, instead of marking everything after it.
export function diffLines(a: string, b: string): DiffRow[] {
  const A = a.split("\n");
  const B = b.split("\n");
  const n = A.length;
  const m = B.length;
  const rows: DiffRow[] = [];

  if (n * m > 4_000_000) {
    // Very large inputs: fall back to a simple same-position comparison.
    for (let i = 0; i < Math.max(n, m); i++) {
      const la = A[i] ?? "";
      const lb = B[i] ?? "";
      rows.push({ line: i + 1, a: la, b: lb, changed: la !== lb });
    }
    return rows;
  }

  const w = m + 1;
  const dp = new Uint16Array((n + 1) * w);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i * w + j] = A[i] === B[j] ? dp[(i + 1) * w + j + 1] + 1 : Math.max(dp[(i + 1) * w + j], dp[i * w + j + 1]);
    }
  }

  const removed: string[] = [];
  const added: string[] = [];
  const flush = () => {
    const pairs = Math.max(removed.length, added.length);
    for (let k = 0; k < pairs; k++) rows.push({ line: 0, a: removed[k] ?? "", b: added[k] ?? "", changed: true });
    removed.length = 0;
    added.length = 0;
  };

  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (A[i] === B[j]) {
      flush();
      rows.push({ line: 0, a: A[i], b: B[j], changed: false });
      i++;
      j++;
    } else if (dp[(i + 1) * w + j] >= dp[i * w + j + 1]) {
      removed.push(A[i++]);
    } else {
      added.push(B[j++]);
    }
  }
  while (i < n) removed.push(A[i++]);
  while (j < m) added.push(B[j++]);
  flush();
  return rows.map((r, idx) => ({ ...r, line: idx + 1 }));
}

export function slugify(text: string) {
  return text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Reads CSV the way spreadsheets write it: quoted cells, commas and line breaks inside quotes,
// doubled quotes, Windows line endings, and comma / semicolon / tab / pipe separators.
function parseCsv(input: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (inQuotes) {
      if (ch === '"') {
        if (input[i + 1] === '"') { cell += '"'; i++; } else inQuotes = false;
      } else cell += ch;
      continue;
    }
    if (ch === '"' && cell === "") inQuotes = true;
    else if (ch === delimiter) { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && input[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell !== "" || row.length > 0) { row.push(cell); rows.push(row); }
  return rows;
}

function detectDelimiter(input: string) {
  const firstLine = input.split(/\r?\n/, 1)[0] ?? "";
  let best = ",";
  let bestCount = 0;
  for (const d of [",", ";", "\t", "|"]) {
    let count = 0;
    let quoted = false;
    for (const ch of firstLine) {
      if (ch === '"') quoted = !quoted;
      else if (ch === d && !quoted) count++;
    }
    if (count > bestCount) { best = d; bestCount = count; }
  }
  return best;
}

export function csvToJson(csv: string) {
  const src = csv.replace(/^\uFEFF/, "");
  if (!src.trim()) return "[]";
  const rows = parseCsv(src, detectDelimiter(src)).filter((r) => r.some((c) => c.trim() !== ""));
  if (rows.length === 0) return "[]";
  const used = new Map<string, number>();
  const headers = rows[0].map((h, i) => {
    const base = h.trim() || `column_${i + 1}`;
    const seen = used.get(base) ?? 0;
    used.set(base, seen + 1);
    return seen === 0 ? base : `${base}_${seen + 1}`;
  });
  const data = rows.slice(1).map((cells) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => (obj[h] = (cells[i] ?? "").trim()));
    return obj;
  });
  return JSON.stringify(data, null, 2);
}

const LOREM_WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");
const LOREM_OPENING = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

function loremSentence() {
  const length = 8 + Math.floor(Math.random() * 9);
  const words = Array.from({ length }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  if (length > 10) words[Math.floor(length / 2)] += ",";
  const text = words.join(" ");
  return text[0].toUpperCase() + text.slice(1) + ".";
}

export function generateLorem(paragraphs: number) {
  const count = Math.min(50, Math.max(1, Math.floor(paragraphs) || 1));
  const out: string[] = [];
  for (let p = 0; p < count; p++) {
    const sentences = p === 0 ? [LOREM_OPENING] : [];
    const total = 4 + Math.floor(Math.random() * 3);
    while (sentences.length < total) sentences.push(loremSentence());
    out.push(sentences.join(" "));
  }
  return out.join("\n\n");
}

export function removeDuplicateLines(text: string) {
  const seen = new Set<string>();
  return text
    .split("\n")
    .filter((line) => {
      if (seen.has(line)) return false;
      seen.add(line);
      return true;
    })
    .join("\n");
}
