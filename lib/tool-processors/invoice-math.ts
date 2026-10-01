// Pure, dependency-free helpers for the Invoice Generator (no PDF code here).

export type Item = { id: number; description: string; qty: string; rate: string };
export type LateModel = "flat" | "simple" | "compound";
export type LateConfig = { model: LateModel; value: string; grace: string; cap: string };

// "prefix" is deliberately PDF-safe (standard PDF fonts can't draw ₹ or د.إ).
export const CURRENCIES = [
  { code: "USD", prefix: "$", name: "US Dollar" },
  { code: "EUR", prefix: "€", name: "Euro" },
  { code: "GBP", prefix: "£", name: "British Pound" },
  { code: "CAD", prefix: "CA$", name: "Canadian Dollar" },
  { code: "AUD", prefix: "A$", name: "Australian Dollar" },
  { code: "PKR", prefix: "PKR ", name: "Pakistani Rupee" },
  { code: "INR", prefix: "INR ", name: "Indian Rupee" },
  { code: "AED", prefix: "AED ", name: "UAE Dirham" },
];

// Rough offline estimates (per 1 USD). Only used if the live-rate request fails,
// and the UI says so clearly.
export const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.78,
  CAD: 1.36,
  AUD: 1.52,
  PKR: 280,
  INR: 83.5,
  AED: 3.6725,
};

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Parse a form string into a safe, non-negative number. */
export const num = (v: string) => {
  const n = parseFloat(v);
  return isFinite(n) && n > 0 ? n : 0;
};

export function money(amount: number, code: string): string {
  const prefix = CURRENCIES.find((c) => c.code === code)?.prefix ?? `${code} `;
  return prefix + amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function totals(items: Item[], taxPct: string, discountPct: string) {
  const subtotal = round2(items.reduce((s, i) => s + num(i.qty) * num(i.rate), 0));
  const discount = round2((subtotal * Math.min(num(discountPct), 100)) / 100);
  const tax = round2(((subtotal - discount) * num(taxPct)) / 100);
  return { subtotal, discount, tax, total: round2(subtotal - discount + tax) };
}

/** Late fee owed `daysAfterDue` days after the due date (grace period and cap applied). */
export function lateFee(total: number, cfg: LateConfig, daysAfterDue: number): number {
  const d = daysAfterDue - Math.floor(num(cfg.grace));
  if (d <= 0 || total <= 0) return 0;
  const v = num(cfg.value);
  let fee = 0;
  if (cfg.model === "flat") fee = v;
  else if (cfg.model === "simple") fee = ((total * v) / 100) * (d / 30);
  else fee = total * (Math.pow(1 + v / 100, d / 30) - 1);
  const cap = num(cfg.cap);
  if (cap > 0) fee = Math.min(fee, (total * cap) / 100);
  return round2(fee);
}

/** Rates are "units per 1 USD". */
export function convert(amount: number, from: string, to: string, rates: Record<string, number>): number {
  const a = rates[from];
  const b = rates[to];
  if (!a || !b) return 0;
  return (amount / a) * b;
}

export function addDays(iso: string, days: number): Date | null {
  const d = new Date(`${iso}T00:00:00`);
  if (isNaN(d.getTime())) return null;
  d.setDate(d.getDate() + days);
  return d;
}

export const fmtDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** Plain-English late-payment clause for the PDF. Empty string when no fee is set. */
export function lateTermsText(cfg: LateConfig, currency: string): string {
  const v = num(cfg.value);
  if (v <= 0) return "";
  const g = Math.floor(num(cfg.grace));
  const after = g > 0 ? `more than ${g} day${g === 1 ? "" : "s"} after the due date` : "after the due date";
  let s = "";
  if (cfg.model === "flat") s = `A one-time late fee of ${money(v, currency)} applies to any balance still unpaid ${after}.`;
  else if (cfg.model === "simple") s = `Balances unpaid ${after} accrue a late fee of ${+v.toFixed(2)}% per month (simple, calculated daily).`;
  else s = `Balances unpaid ${after} accrue a late fee of ${+v.toFixed(2)}% per month, compounding monthly.`;
  const cap = num(cfg.cap);
  if (cap > 0) s += ` Late fees will not exceed ${+cap.toFixed(2)}% of the invoice total.`;
  return s;
}
