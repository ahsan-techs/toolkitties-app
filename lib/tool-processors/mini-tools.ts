// Pure helper functions for the smaller tools. No browser APIs here, so they are
// easy to test. Everything runs locally in the browser; nothing is uploaded.

// ---------------------------------------------------------------- Sort & clean lines
export type SortMode = "az" | "za" | "short" | "long" | "reverse" | "none";

export function sortLines(
  input: string,
  o: { mode: SortMode; trim: boolean; removeEmpty: boolean; ignoreCase: boolean; numeric: boolean }
): string[] {
  let lines = input.split(/\r?\n/);
  if (o.trim) lines = lines.map((l) => l.trim());
  if (o.removeEmpty) lines = lines.filter((l) => l.trim() !== "");
  const key = (s: string) => (o.ignoreCase ? s.toLowerCase() : s);
  const cmp = (a: string, b: string) => key(a).localeCompare(key(b), undefined, { numeric: o.numeric });
  switch (o.mode) {
    case "az": return [...lines].sort(cmp);
    case "za": return [...lines].sort((a, b) => cmp(b, a));
    case "short": return [...lines].sort((a, b) => a.length - b.length || cmp(a, b));
    case "long": return [...lines].sort((a, b) => b.length - a.length || cmp(a, b));
    case "reverse": return [...lines].reverse();
    default: return lines;
  }
}

// ---------------------------------------------------------------- JSON to CSV
function flattenInto(value: unknown, prefix: string, out: Record<string, string>) {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0 && prefix) out[prefix] = "";
    for (const [k, v] of entries) flattenInto(v, prefix ? `${prefix}.${k}` : k, out);
    return;
  }
  const key = prefix || "value";
  if (Array.isArray(value)) {
    const simple = value.every((v) => v === null || ["string", "number", "boolean"].includes(typeof v));
    out[key] = simple ? value.map((v) => (v === null ? "" : String(v))).join("; ") : JSON.stringify(value);
  } else {
    out[key] = value === null || value === undefined ? "" : String(value);
  }
}

export function jsonToCsv(text: string, delimiter: string): { csv: string; rows: number; columns: number } {
  const data: unknown = JSON.parse(text);
  const items: unknown[] = Array.isArray(data) ? data : [data];
  const rows = items.map((item) => {
    const out: Record<string, string> = {};
    flattenInto(item, "", out);
    return out;
  });
  const columns: string[] = [];
  const seen = new Set<string>();
  for (const r of rows) {
    for (const k of Object.keys(r)) {
      if (!seen.has(k)) {
        seen.add(k);
        columns.push(k);
      }
    }
  }
  if (columns.length === 0) throw new Error("There is nothing to convert in this JSON.");
  const esc = (v: string) =>
    v.includes(delimiter) || v.includes('"') || v.includes("\n") || v.includes("\r") ? `"${v.replace(/"/g, '""')}"` : v;
  const lines = [columns.map(esc).join(delimiter), ...rows.map((r) => columns.map((c) => esc(r[c] ?? "")).join(delimiter))];
  return { csv: lines.join("\n"), rows: rows.length, columns: columns.length };
}

// ---------------------------------------------------------------- JWT decoder
function b64urlDecode(part: string): string {
  const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const bin = atob(padded);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function humanizeSeconds(diffSeconds: number): string {
  const abs = Math.abs(diffSeconds);
  const units: [number, string][] = [[86400, "day"], [3600, "hour"], [60, "minute"]];
  let label = `${Math.round(abs)} second${Math.round(abs) === 1 ? "" : "s"}`;
  for (const [size, name] of units) {
    if (abs >= size) {
      const n = Math.floor(abs / size);
      label = `${n} ${name}${n === 1 ? "" : "s"}`;
      break;
    }
  }
  return diffSeconds >= 0 ? `in ${label}` : `${label} ago`;
}

export type JwtResult = {
  headerText: string;
  payloadText: string;
  signature: string;
  times: { claim: string; iso: string; relative: string }[];
  expired: boolean | null;
};

export function decodeJwt(raw: string, nowMs: number = Date.now()): JwtResult {
  const token = raw.trim().replace(/^bearer\s+/i, "");
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("A JWT has three parts separated by dots (header.payload.signature).");
  let header: unknown;
  let payload: unknown;
  try {
    header = JSON.parse(b64urlDecode(parts[0]));
    payload = JSON.parse(b64urlDecode(parts[1]));
  } catch {
    throw new Error("Could not decode this token. Check that you pasted the whole thing.");
  }
  const times: JwtResult["times"] = [];
  let expired: boolean | null = null;
  if (payload && typeof payload === "object") {
    const p = payload as Record<string, unknown>;
    for (const [claim, label] of [["iat", "Issued at (iat)"], ["nbf", "Not before (nbf)"], ["exp", "Expires (exp)"]] as const) {
      const v = p[claim];
      if (typeof v === "number" && isFinite(v)) {
        times.push({ claim: label, iso: new Date(v * 1000).toISOString(), relative: humanizeSeconds(v - nowMs / 1000) });
        if (claim === "exp") expired = v * 1000 < nowMs;
      }
    }
  }
  return {
    headerText: JSON.stringify(header, null, 2),
    payloadText: JSON.stringify(payload, null, 2),
    signature: parts[2],
    times,
    expired,
  };
}

// ---------------------------------------------------------------- Number base converter
const DIGITS = "0123456789abcdefghijklmnopqrstuvwxyz";

export function parseInBase(input: string, base: number): bigint | null {
  let s = input.trim().toLowerCase().replace(/[\s_,]/g, "");
  let negative = false;
  if (s.startsWith("-")) {
    negative = true;
    s = s.slice(1);
  }
  if (base === 16 && s.startsWith("0x")) s = s.slice(2);
  if (base === 2 && s.startsWith("0b")) s = s.slice(2);
  if (base === 8 && s.startsWith("0o")) s = s.slice(2);
  if (!s) return null;
  const b = BigInt(base);
  let result = BigInt(0);
  for (const ch of s) {
    const d = DIGITS.indexOf(ch);
    if (d < 0 || d >= base) return null;
    result = result * b + BigInt(d);
  }
  return negative ? -result : result;
}

// ---------------------------------------------------------------- Colour converter + contrast
export type Rgb = [number, number, number];

export function parseHex(input: string): Rgb | null {
  let s = input.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(s)) s = s.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(s)) return null;
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
}

export function toHex([r, g, b]: Rgb): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function rgbToHsl([r, g, b]: Rgb): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0, s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function luminance([r, g, b]: Rgb): number {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const la = luminance(a), lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// ---------------------------------------------------------------- Loan / EMI
export type LoanYear = { year: number; principal: number; interest: number; balance: number };

export function loanSummary(principal: number, annualRatePct: number, months: number) {
  const r = annualRatePct / 100 / 12;
  const emi = r === 0 ? principal / months : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const total = emi * months;
  const years: LoanYear[] = [];
  let balance = principal, yp = 0, yi = 0;
  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    const paid = emi - interest;
    balance = Math.max(0, balance - paid);
    yp += paid;
    yi += interest;
    if (m % 12 === 0 || m === months) {
      years.push({ year: Math.ceil(m / 12), principal: yp, interest: yi, balance: m === months ? 0 : balance });
      yp = 0;
      yi = 0;
    }
  }
  return { emi, total, interest: total - principal, years };
}

// ---------------------------------------------------------------- BMI
export function bmiValue(weightKg: number, heightM: number): number {
  return weightKg / (heightM * heightM);
}

export function bmiCategory(v: number): string {
  if (v < 18.5) return "Underweight";
  if (v < 25) return "Healthy weight";
  if (v < 30) return "Overweight";
  return "Obesity";
}

export function healthyWeightRangeKg(heightM: number): [number, number] {
  return [18.5 * heightM * heightM, 24.9 * heightM * heightM];
}

// ---------------------------------------------------------------- Days between dates
const DAY_MS = 86400000;

export function parseYmd(s: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const ms = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  return isNaN(ms) ? null : ms;
}

export function dateDiff(aMs: number, bMs: number, includeEnd: boolean) {
  const from = Math.min(aMs, bMs);
  const to = Math.max(aMs, bMs) + (includeEnd ? DAY_MS : 0);
  const days = Math.round((to - from) / DAY_MS);

  const a = new Date(from), b = new Date(to);
  let years = b.getUTCFullYear() - a.getUTCFullYear();
  let months = b.getUTCMonth() - a.getUTCMonth();
  let d = b.getUTCDate() - a.getUTCDate();
  if (d < 0) {
    months -= 1;
    d += new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), 0)).getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  let business = 0;
  if (days <= 366 * 300) {
    for (let t = from; t < to; t += DAY_MS) {
      const wd = new Date(t).getUTCDay();
      if (wd !== 0 && wd !== 6) business++;
    }
  }
  return { days, weeks: Math.floor(days / 7), leftoverDays: days % 7, years, months, d, business, reversed: aMs > bMs };
}
