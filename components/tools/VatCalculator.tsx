"use client";

import { useState } from "react";
import { taxBreakdown, type TaxMode } from "@/lib/tool-processors/mini-tools";
import { Stack, Field, Stat, inputCls, ghostBtnCls, fmtNumber } from "./ui";

const QUICK_RATES = [5, 10, 15, 18, 20];

export default function VatCalculator() {
  const [mode, setMode] = useState<TaxMode>("add");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("18");

  const a = Number(amount);
  const r = Number(rate);
  const ready = amount.trim() !== "" && Number.isFinite(a) && a >= 0 && rate.trim() !== "" && Number.isFinite(r) && r >= 0 && r <= 100;
  const result = ready ? taxBreakdown(a, r, mode) : null;

  return (
    <Stack>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${ghostBtnCls} ${mode === "add" ? "border-moss text-moss" : ""}`} onClick={() => setMode("add")}>
          Add tax to a price
        </button>
        <button type="button" className={`${ghostBtnCls} ${mode === "remove" ? "border-moss text-moss" : ""}`} onClick={() => setMode("remove")}>
          Remove tax from a price
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={mode === "add" ? "Price before tax" : "Price including tax"}>
          <input type="number" min={0} step="any" inputMode="decimal" className={inputCls} value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="1000" />
        </Field>
        <Field label="Tax rate (%)" hint="VAT, GST or sales tax">
          <input type="number" min={0} max={100} step="any" inputMode="decimal" className={inputCls} value={rate} onChange={(e) => setRate(e.target.value)} placeholder="18" />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate">Quick rates:</span>
        {QUICK_RATES.map((q) => (
          <button key={q} type="button" className={`${ghostBtnCls} !px-3 !py-1 text-xs ${Number(rate) === q ? "border-moss text-moss" : ""}`} onClick={() => setRate(String(q))}>
            {q}%
          </button>
        ))}
      </div>

      {result ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Price before tax" value={fmtNumber(result.net, 2)} />
          <Stat label={`Tax (${fmtNumber(r, 2)}%)`} value={fmtNumber(result.tax, 2)} />
          <Stat strong label="Price including tax" value={fmtNumber(result.gross, 2)} />
        </div>
      ) : (
        <p className="text-sm text-slate">Enter a price and a tax rate between 0 and 100 to see the result.</p>
      )}
      <p className="text-xs text-slate">Tax rates differ by country, region and product. Check the rate that applies to you. This is a calculator, not tax advice.</p>
    </Stack>
  );
}
