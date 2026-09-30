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
  return text.replace(/\w\S*/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}
export function toSentenceCase(text: string) {
  const lower = text.toLowerCase();
  return lower.replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
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

// Small, dependency-free Markdown -> HTML renderer covering the common cases.
export function renderMarkdown(md: string) {
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/^\- (.*$)/gim, "<li>$1</li>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/\n/g, "<br/>");

  return `<p>${html}</p>`;
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

export function diffLines(a: string, b: string) {
  const linesA = a.split("\n");
  const linesB = b.split("\n");
  const max = Math.max(linesA.length, linesB.length);
  const rows: { line: number; a: string; b: string; changed: boolean }[] = [];
  for (let i = 0; i < max; i++) {
    const la = linesA[i] ?? "";
    const lb = linesB[i] ?? "";
    rows.push({ line: i + 1, a: la, b: lb, changed: la !== lb });
  }
  return rows;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function csvToJson(csv: string) {
  const [headerLine, ...rows] = csv.trim().split("\n");
  const headers = headerLine.split(",").map((h) => h.trim());
  const data = rows
    .filter((r) => r.trim().length)
    .map((row) => {
      const cells = row.split(",").map((c) => c.trim());
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => (obj[h] = cells[i] ?? ""));
      return obj;
    });
  return JSON.stringify(data, null, 2);
}

const LOREM_WORDS =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(" ");
export function generateLorem(paragraphs: number) {
  const out: string[] = [];
  for (let p = 0; p < paragraphs; p++) {
    const sentence = Array.from({ length: 24 }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]).join(" ");
    out.push(sentence[0].toUpperCase() + sentence.slice(1) + ".");
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
