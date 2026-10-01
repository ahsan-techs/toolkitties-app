"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CURRENCIES,
  FALLBACK_RATES,
  addDays,
  convert,
  fmtDate,
  lateFee,
  lateTermsText,
  money,
  num,
  totals,
  type Item,
  type LateConfig,
  type LateModel,
} from "@/lib/tool-processors/invoice-math";

const THEME_KEY = "toolkitties-invoice-theme";
const MATRIX_DAYS = [7, 14, 30, 60, 90, 120];
const ACCENTS = ["#1F5C4C", "#4F46E5", "#E11D48", "#D97706", "#111827"];

const inp =
  "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500";

// ==========================================================================
// Small UI pieces
// ==========================================================================

function Card({ title, hint, children, className = "" }: { title: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {hint && <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-zinc-600 dark:text-zinc-400">{text}</span>
      {children}
    </label>
  );
}

function Seg<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <div className="inline-flex flex-wrap rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
      {options.map(([v, l]) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            value === v ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white" : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function Toggle({ on, onChange, label, disabled }: { on: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button type="button" role="switch" aria-checked={on} disabled={disabled} onClick={() => onChange(!on)} className="flex w-full items-center justify-between gap-3 text-left text-sm disabled:cursor-not-allowed disabled:opacity-40">
      <span>{label}</span>
      <span className={`relative h-6 w-11 flex-none rounded-full transition ${on ? "bg-emerald-600" : "bg-zinc-300 dark:bg-zinc-700"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

// ==========================================================================
// Late-fee timeline chart (SVG). Click anywhere on it to move the marker.
// ==========================================================================

function Timeline({ fee, maxDay, grace, capAmt, day, onPick, fmt }: { fee: (d: number) => number; maxDay: number; grace: number; capAmt: number; day: number; onPick: (d: number) => void; fmt: (n: number) => string }) {
  const W = 640, H = 240, L = 70, R = 14, T = 16, B = 32;
  const pts = Array.from({ length: maxDay + 1 }, (_, d) => fee(d));
  const ymax = Math.max(...pts, 1);
  const x = (d: number) => L + (d / maxDay) * (W - L - R);
  const y = (v: number) => T + (1 - v / ymax) * (H - T - B);
  const line = pts.map((v, d) => `${d ? "L" : "M"}${x(d).toFixed(1)} ${y(v).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Late fee growth over time">
      <defs>
        <linearGradient id="lfGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((f) => (
        <g key={f}>
          <line x1={L} x2={W - R} y1={y(ymax * f)} y2={y(ymax * f)} className="stroke-zinc-200 dark:stroke-zinc-800" />
          <text x={L - 8} y={y(ymax * f) + 4} textAnchor="end" className="fill-zinc-500 text-[11px]">{fmt(ymax * f)}</text>
        </g>
      ))}
      {grace > 0 && (
        <>
          <rect x={x(0)} y={T} width={x(Math.min(grace, maxDay)) - x(0)} height={H - T - B} className="fill-emerald-500/10" />
          <text x={x(0) + 6} y={T + 13} className="fill-emerald-600 text-[10px] font-semibold dark:fill-emerald-400">Grace</text>
        </>
      )}
      <path d={`${line} L${x(maxDay)} ${y(0)} L${x(0)} ${y(0)} Z`} fill="url(#lfGrad)" />
      <path d={line} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinejoin="round" />
      {capAmt > 0 && capAmt <= ymax && (
        <>
          <line x1={L} x2={W - R} y1={y(capAmt)} y2={y(capAmt)} stroke="#f59e0b" strokeDasharray="5 4" />
          <text x={W - R} y={y(capAmt) - 5} textAnchor="end" className="fill-amber-600 text-[10px] font-semibold dark:fill-amber-400">Cap</text>
        </>
      )}
      {[0, 30, 60, 90, 120, 150, 180].filter((d) => d <= maxDay).map((d) => (
        <text key={d} x={x(d)} y={H - 10} textAnchor="middle" className="fill-zinc-500 text-[11px]">{d}d</text>
      ))}
      <line x1={x(day)} x2={x(day)} y1={T} y2={H - B} className="stroke-zinc-400 dark:stroke-zinc-500" strokeDasharray="3 3" />
      <circle cx={x(day)} cy={y(fee(day))} r="5.5" fill="#f43f5e" stroke="white" strokeWidth="2" />
      <rect
        x={L}
        y={T}
        width={W - L - R}
        height={H - T - B}
        fill="transparent"
        className="cursor-crosshair"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - r.left) / r.width) * (W - L - R);
          onPick(Math.max(0, Math.min(maxDay, Math.round((px / (W - L - R)) * maxDay))));
        }}
      />
    </svg>
  );
}

// ==========================================================================
// Main component
// ==========================================================================

export default function InvoiceGenerator() {
  const [dark, setDark] = useState(false);
  const [inv, setInv] = useState({ number: "INV-001", issueDate: "", terms: "15", currency: "USD", tax: "0", discount: "0", fromName: "", fromDetails: "", toName: "", toDetails: "", notes: "" });
  const [items, setItems] = useState<Item[]>([
    { id: 1, description: "Website design", qty: "1", rate: "1200" },
    { id: 2, description: "Hosting (12 months)", qty: "12", rate: "15" },
  ]);
  const nextId = useRef(3);
  const [late, setLate] = useState<LateConfig>({ model: "simple", value: "1.5", grace: "5", cap: "25" });
  const [day, setDay] = useState(30);
  const [preview, setPreview] = useState<string[]>(["EUR", "GBP"]);
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [rateInfo, setRateInfo] = useState<{ live: boolean; loading: boolean; updated?: string }>({ live: false, loading: true });
  const [pdf, setPdf] = useState({ size: "A4" as "A4" | "Letter", accent: ACCENTS[0], compact: false, lateTerms: true, converted: false, fileName: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const setField = (k: keyof typeof inv) => (v: string) => setInv((s) => ({ ...s, [k]: v }));

  // Theme: remember the choice; default light.
  useEffect(() => {
    try {
      if (localStorage.getItem(THEME_KEY) === "dark") setDark(true);
    } catch {}
    setInv((s) => (s.issueDate ? s : { ...s, issueDate: new Date().toISOString().slice(0, 10) }));
  }, []);
  const toggleTheme = () =>
    setDark((d) => {
      try {
        localStorage.setItem(THEME_KEY, d ? "light" : "dark");
      } catch {}
      return !d;
    });

  // Live exchange rates (only the currency list is requested — your invoice data never leaves the browser).
  const loadRates = useCallback(async () => {
    setRateInfo((r) => ({ ...r, loading: true }));
    try {
      const res = await fetch("https://open.er-api.com/v6/latest/USD");
      const j = await res.json();
      if (j.result !== "success") throw new Error("bad response");
      const next: Record<string, number> = {};
      for (const c of CURRENCIES) {
        if (typeof j.rates?.[c.code] !== "number") throw new Error("missing rate");
        next[c.code] = j.rates[c.code];
      }
      setRates(next);
      setRateInfo({ live: true, loading: false, updated: new Date(j.time_last_update_unix * 1000).toLocaleDateString("en-GB") });
    } catch {
      setRates(FALLBACK_RATES);
      setRateInfo({ live: false, loading: false });
    }
  }, []);
  useEffect(() => {
    loadRates();
  }, [loadRates]);

  // ---- Derived numbers ----
  const t = totals(items, inv.tax, inv.discount);
  const cur = inv.currency;
  const termDays = parseInt(inv.terms, 10) || 0;
  const dueDate = inv.issueDate ? addDays(inv.issueDate, termDays) : null;
  const dueText = termDays === 0 ? "Due on receipt" : dueDate ? fmtDate(dueDate) : "";
  const previews = preview.filter((c) => c !== cur);
  const feeAt = (d: number) => lateFee(t.total, late, d);
  const feeNow = feeAt(day);
  const capAmt = (t.total * num(late.cap)) / 100;
  const axisFmt = (n: number) => (CURRENCIES.find((c) => c.code === cur)?.prefix ?? "") + new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);

  const rowsDef =
    late.model === "flat"
      ? [0.5, 1, 1.5, 2].map((m) => ({ label: `${money(num(late.value) * m, cur)} flat`, value: String(num(late.value) * m), sel: m === 1 }))
      : Array.from(new Set([1, 1.5, 2, 3, 5, num(late.value)]))
          .filter((v) => v > 0)
          .sort((a, b) => a - b)
          .map((v) => ({ label: `${+v.toFixed(2)}% / month`, value: String(v), sel: v === num(late.value) }));
  const matrix = rowsDef.map((r) => ({ ...r, cells: MATRIX_DAYS.map((d) => lateFee(t.total, { ...late, value: r.value }, d)) }));
  const maxCell = Math.max(...matrix.flatMap((r) => r.cells), 0.01);

  // ---- Items ----
  const setItem = (id: number, k: "description" | "qty" | "rate", v: string) => setItems((a) => a.map((i) => (i.id === id ? { ...i, [k]: v } : i)));
  const addItem = () => setItems((a) => [...a, { id: nextId.current++, description: "", qty: "1", rate: "0" }]);

  // ---- PDF ----
  const exportPdf = async () => {
    setErr("");
    if (!items.some((i) => i.description.trim())) return setErr("Add at least one line item with a description.");
    if (t.total <= 0) return setErr("Enter a quantity and rate so the total is above zero.");
    setBusy(true);
    try {
      const { buildInvoicePdf } = await import("@/lib/tool-processors/invoice-pdf");
      const code = pdf.converted ? previews[0] : undefined;
      const converted = code ? `Approx. ${money(convert(t.total, cur, code, rates), code)} at 1 ${cur} = ${convert(1, cur, code, rates).toFixed(4)} ${code} (${rateInfo.live ? `rate of ${rateInfo.updated}` : "estimated rate"})` : "";
      const bytes = await buildInvoicePdf(
        {
          number: inv.number,
          issueDate: inv.issueDate ? fmtDate(new Date(`${inv.issueDate}T00:00:00`)) : "",
          dueText,
          currency: cur,
          fromName: inv.fromName,
          fromDetails: inv.fromDetails,
          toName: inv.toName,
          toDetails: inv.toDetails,
          items,
          taxPct: num(inv.tax),
          discountPct: num(inv.discount),
          totals: t,
          notes: inv.notes,
          lateTerms: pdf.lateTerms ? lateTermsText(late, cur) : "",
          converted,
        },
        { size: pdf.size, accent: pdf.accent, compact: pdf.compact }
      );
      const url = URL.createObjectURL(new Blob([bytes as unknown as BlobPart], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(pdf.fileName.trim() || `invoice-${inv.number}`).replace(/[^\w.-]+/g, "-")}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Couldn't create the PDF. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const modelHint = late.model === "flat" ? "One fixed fee once the grace period ends." : late.model === "simple" ? "A % of the invoice per month, accruing daily." : "A % per month that compounds on itself.";

  return (
    <div className={dark ? "dark" : ""}>
      <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 sm:p-6">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-xl text-white shadow-lg shadow-emerald-600/25">🧾</span>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Invoice Studio</h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Live totals · late-fee simulator · multi-currency · PDF export</p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="flex items-center gap-2.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium shadow-sm transition-colors dark:border-zinc-700 dark:bg-zinc-900"
          >
            <span>{dark ? "🌙" : "☀️"}</span>
            {dark ? "Dark" : "Light"}
            <span className={`relative h-5 w-9 rounded-full transition ${dark ? "bg-emerald-600" : "bg-zinc-300"}`}>
              <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all ${dark ? "left-[18px]" : "left-0.5"}`} />
            </span>
          </button>
        </header>

        <div className="mt-6 flex flex-col-reverse gap-6">
          {/* ---------------- Editor ---------------- */}
          <div className="min-w-0 space-y-6">
            <Card title="Invoice details">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Label text="Invoice #"><input className={inp} value={inv.number} onChange={(e) => setField("number")(e.target.value)} /></Label>
                <Label text="Issue date"><input type="date" className={inp} value={inv.issueDate} onChange={(e) => setField("issueDate")(e.target.value)} /></Label>
                <Label text="Payment terms">
                  <select className={inp} value={inv.terms} onChange={(e) => setField("terms")(e.target.value)}>
                    {[["0", "Due on receipt"], ["7", "Net 7"], ["15", "Net 15"], ["30", "Net 30"], ["45", "Net 45"], ["60", "Net 60"]].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </Label>
                <Label text="Currency">
                  <select className={inp} value={cur} onChange={(e) => setField("currency")(e.target.value)}>
                    {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.code} — {c.name}</option>)}
                  </select>
                </Label>
                <Label text="Tax %"><input type="number" min="0" step="any" inputMode="decimal" className={inp} value={inv.tax} onChange={(e) => setField("tax")(e.target.value)} /></Label>
                <Label text="Discount %"><input type="number" min="0" step="any" inputMode="decimal" className={inp} value={inv.discount} onChange={(e) => setField("discount")(e.target.value)} /></Label>
              </div>
            </Card>

            <Card title="From & Bill to">
              <div className="grid gap-4 sm:grid-cols-2">
                {([["From (you)", "fromName", "fromDetails"], ["Bill to (client)", "toName", "toDetails"]] as const).map(([title, nameKey, detKey]) => (
                  <div key={nameKey} className="space-y-2">
                    <Label text={title}><input className={inp} placeholder="Name or business" value={inv[nameKey]} onChange={(e) => setField(nameKey)(e.target.value)} /></Label>
                    <textarea rows={3} className={`${inp} resize-none`} placeholder="Address, email, tax ID…" value={inv[detKey]} onChange={(e) => setField(detKey)(e.target.value)} />
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Line items" hint="Amounts update instantly.">
              <div className="space-y-3">
                {items.map((it) => (
                  <div key={it.id} className="grid grid-cols-12 items-center gap-2">
                    <input className={`${inp} col-span-12 sm:col-span-5`} placeholder="Description" value={it.description} onChange={(e) => setItem(it.id, "description", e.target.value)} />
                    <input type="number" min="0" step="any" inputMode="decimal" aria-label="Quantity" className={`${inp} col-span-3 sm:col-span-2`} value={it.qty} onChange={(e) => setItem(it.id, "qty", e.target.value)} />
                    <input type="number" min="0" step="any" inputMode="decimal" aria-label="Rate" className={`${inp} col-span-4 sm:col-span-2`} value={it.rate} onChange={(e) => setItem(it.id, "rate", e.target.value)} />
                    <p className="col-span-4 truncate text-right text-sm font-semibold tabular-nums sm:col-span-2">{money(num(it.qty) * num(it.rate), cur)}</p>
                    <button type="button" aria-label="Remove item" disabled={items.length === 1} onClick={() => setItems((a) => a.filter((i) => i.id !== it.id))} className="col-span-1 text-zinc-400 transition hover:text-rose-500 disabled:opacity-30">✕</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addItem} className="mt-4 rounded-xl border border-dashed border-zinc-300 px-4 py-2 text-xs font-semibold text-emerald-700 transition hover:border-emerald-600 dark:border-zinc-700 dark:text-emerald-400">+ Add line item</button>
              <p className="mt-2 text-[11px] text-zinc-500 dark:text-zinc-400">Columns: description · quantity · rate · amount</p>
            </Card>

            <Card title="Notes & payment details">
              <textarea rows={3} className={`${inp} resize-none`} placeholder="Bank / payment link, thank-you note…" value={inv.notes} onChange={(e) => setField("notes")(e.target.value)} />
            </Card>

            <Card title="PDF export settings" hint="Controls how your downloaded invoice looks.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><p className="mb-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">Page size</p><Seg value={pdf.size} onChange={(v) => setPdf((p) => ({ ...p, size: v }))} options={[["A4", "A4"], ["Letter", "US Letter"]]} /></div>
                <div><p className="mb-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">Layout density</p><Seg value={pdf.compact ? "c" : "n"} onChange={(v) => setPdf((p) => ({ ...p, compact: v === "c" }))} options={[["n", "Comfortable"], ["c", "Compact"]]} /></div>
                <div className="sm:col-span-2">
                  <p className="mb-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">Accent colour</p>
                  <div className="flex gap-2.5">
                    {ACCENTS.map((c) => (
                      <button key={c} type="button" aria-label={`Accent ${c}`} onClick={() => setPdf((p) => ({ ...p, accent: c }))} style={{ backgroundColor: c }} className={`h-8 w-8 rounded-full transition ${pdf.accent === c ? "ring-2 ring-offset-2 ring-emerald-500 ring-offset-white dark:ring-offset-zinc-900" : "opacity-80 hover:opacity-100"}`} />
                    ))}
                  </div>
                </div>
                <div className="space-y-3 sm:col-span-2">
                  <Toggle on={pdf.lateTerms} onChange={(v) => setPdf((p) => ({ ...p, lateTerms: v }))} label="Print late-payment terms from the simulator" />
                  <Toggle on={pdf.converted && previews.length > 0} disabled={previews.length === 0} onChange={(v) => setPdf((p) => ({ ...p, converted: v }))} label={`Add approx. total in ${previews[0] ?? "a preview currency"}`} />
                </div>
                <div className="sm:col-span-2"><Label text="File name (optional)"><input className={inp} placeholder={`invoice-${inv.number}`} value={pdf.fileName} onChange={(e) => setPdf((p) => ({ ...p, fileName: e.target.value }))} /></Label></div>
                <button type="button" onClick={exportPdf} disabled={busy} className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-700 disabled:opacity-60 sm:col-span-2">
                  {busy ? "Building PDF…" : "⬇ Download PDF"}
                </button>
                {err && <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-xs text-rose-600 dark:text-rose-300 sm:col-span-2">{err}</p>}
              </div>
            </Card>
          </div>

          {/* ---------------- Summary + currencies (shown first) ---------------- */}
          <aside className="grid min-w-0 gap-6 md:grid-cols-2">
            <section className="overflow-hidden rounded-2xl border border-emerald-700/30 bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 text-white shadow-lg shadow-emerald-900/10">
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-100/80">Total due</p>
              <p className="mt-1 truncate text-3xl font-semibold tabular-nums tracking-tight">{money(t.total, cur)}</p>
              <p className="mt-1 text-xs text-emerald-100/80">{dueText ? (termDays === 0 ? dueText : `Due ${dueText}`) : "Pick an issue date to see the due date"}</p>
              <dl className="mt-4 space-y-1.5 border-t border-white/20 pt-4 text-sm tabular-nums">
                <div className="flex justify-between"><dt className="text-emerald-100/80">Subtotal</dt><dd>{money(t.subtotal, cur)}</dd></div>
                {t.discount > 0 && <div className="flex justify-between"><dt className="text-emerald-100/80">Discount</dt><dd>-{money(t.discount, cur)}</dd></div>}
                {t.tax > 0 && <div className="flex justify-between"><dt className="text-emerald-100/80">Tax ({+num(inv.tax).toFixed(2)}%)</dt><dd>{money(t.tax, cur)}</dd></div>}
              </dl>
              <button type="button" onClick={exportPdf} disabled={busy} className="mt-5 w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-emerald-800 shadow transition hover:bg-emerald-50 disabled:opacity-60">
                {busy ? "Building PDF…" : "⬇ Download PDF"}
              </button>
              {err && <p className="mt-3 rounded-lg bg-rose-500/20 px-3 py-2 text-xs text-rose-50">{err}</p>}
              <p className="mt-3 text-[11px] text-emerald-100/70">🔒 Your invoice is created in your browser and never uploaded.</p>
            </section>

            <Card title="Currency preview" hint="Toggle currencies to see your total converted.">
              <div className="flex flex-wrap gap-2">
                {CURRENCIES.filter((c) => c.code !== cur).map((c) => {
                  const on = preview.includes(c.code);
                  return (
                    <button key={c.code} type="button" aria-pressed={on} onClick={() => setPreview((p) => (on ? p.filter((x) => x !== c.code) : [...p, c.code]))} className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${on ? "border-emerald-600 bg-emerald-600 text-white" : "border-zinc-200 text-zinc-600 hover:border-emerald-600 dark:border-zinc-700 dark:text-zinc-300"}`}>
                      {c.code}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 space-y-2">
                {previews.length === 0 && <p className="text-xs text-zinc-500 dark:text-zinc-400">Pick one or more currencies above.</p>}
                {previews.map((code) => (
                  <div key={code} className="flex items-baseline justify-between gap-3 rounded-xl bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/70">
                    <div><p className="text-xs font-semibold">{code}</p><p className="text-[11px] text-zinc-500 dark:text-zinc-400">1 {cur} = {convert(1, cur, code, rates).toFixed(4)}</p></div>
                    <p className="truncate text-sm font-semibold tabular-nums">{money(convert(t.total, cur, code, rates), code)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                <span>{rateInfo.loading ? "Fetching live rates…" : rateInfo.live ? `Live rates · ${rateInfo.updated}` : "Offline estimates (live rates unavailable)"}</span>
                <button type="button" onClick={loadRates} className="font-semibold text-emerald-700 hover:underline dark:text-emerald-400">Refresh</button>
              </div>
              <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer" className="mt-1 block text-[10px] text-zinc-400 hover:underline">Rates by Exchange Rate API</a>
            </Card>
          </aside>
        </div>

        {/* ---------------- Late Fee Matrix ---------------- */}
        <Card className="mt-6" title="Late Fee Matrix" hint="Simulate what a late payment would cost — then print the policy on your invoice.">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <p className="mb-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">Fee model</p>
              <Seg<LateModel> value={late.model} onChange={(v) => setLate((l) => ({ ...l, model: v }))} options={[["flat", "Flat fee"], ["simple", "% / month"], ["compound", "Compounding"]]} />
            </div>
            <div className="w-32"><Label text={late.model === "flat" ? `Fee (${cur})` : "Rate % / month"}><input type="number" min="0" step="any" inputMode="decimal" className={inp} value={late.value} onChange={(e) => setLate((l) => ({ ...l, value: e.target.value }))} /></Label></div>
            <div className="w-28"><Label text="Grace days"><input type="number" min="0" step="1" inputMode="numeric" className={inp} value={late.grace} onChange={(e) => setLate((l) => ({ ...l, grace: e.target.value }))} /></Label></div>
            <div className="w-32"><Label text="Cap % (0 = none)"><input type="number" min="0" step="any" inputMode="decimal" className={inp} value={late.cap} onChange={(e) => setLate((l) => ({ ...l, cap: e.target.value }))} /></Label></div>
          </div>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{modelHint}</p>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_230px]">
            <div className="min-w-0">
              <Timeline fee={feeAt} maxDay={180} grace={Math.floor(num(late.grace))} capAmt={capAmt} day={day} onPick={setDay} fmt={axisFmt} />
              <input type="range" min={0} max={180} value={day} onChange={(e) => setDay(Number(e.target.value))} aria-label="Days after due date" className="mt-2 w-full accent-emerald-600" />
            </div>
            <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800/70">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">If paid</p>
              <p className="text-2xl font-semibold tabular-nums">{day} <span className="text-sm font-medium text-zinc-500">days late</span></p>
              <dl className="mt-3 space-y-2 text-sm tabular-nums">
                <div className="flex justify-between gap-2"><dt className="text-zinc-500 dark:text-zinc-400">Late fee</dt><dd className="font-semibold text-rose-600 dark:text-rose-400">{money(feeNow, cur)}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-zinc-500 dark:text-zinc-400">% of invoice</dt><dd>{t.total > 0 ? ((feeNow / t.total) * 100).toFixed(1) : "0.0"}%</dd></div>
                <div className="flex justify-between gap-2 border-t border-zinc-200 pt-2 dark:border-zinc-700"><dt className="font-medium">Client pays</dt><dd className="font-semibold">{money(t.total + feeNow, cur)}</dd></div>
              </dl>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <p className="mb-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">Fee by rate × days after due date {num(late.grace) > 0 && `(after ${Math.floor(num(late.grace))}-day grace)`}</p>
            <table className="w-full min-w-[520px] border-separate border-spacing-1 text-xs tabular-nums">
              <thead>
                <tr><th className="p-1.5 text-left font-medium text-zinc-500">Scenario</th>{MATRIX_DAYS.map((d) => <th key={d} className="p-1.5 text-right font-medium text-zinc-500">{d}d</th>)}</tr>
              </thead>
              <tbody>
                {matrix.map((r) => (
                  <tr key={r.label}>
                    <td className={`whitespace-nowrap p-1.5 font-semibold ${r.sel ? "text-emerald-700 dark:text-emerald-400" : ""}`}>{r.label}{r.sel && " ★"}</td>
                    {r.cells.map((fee, i) => (
                      <td key={i} style={fee > 0 ? { backgroundColor: `rgba(244,63,94,${(0.07 + (0.5 * fee) / maxCell).toFixed(2)})` } : undefined} className={`rounded-md p-1.5 text-right ${fee === 0 ? "text-zinc-400" : ""} ${r.sel ? "font-semibold" : ""}`}>
                        {money(fee, cur)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-[11px] text-zinc-500 dark:text-zinc-400">★ = your current setting. Late-fee and interest limits differ by country and state — check local rules before adding them to a contract.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
