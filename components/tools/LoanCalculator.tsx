"use client";

import { useMemo, useState } from "react";
import { loanSummary } from "@/lib/tool-processors/mini-tools";
import { Stack, Field, Stat, inputCls, fmtNumber } from "./ui";

export default function LoanCalculator() {
  const [amount, setAmount] = useState("500000");
  const [rate, setRate] = useState("12");
  const [term, setTerm] = useState("5");
  const [unit, setUnit] = useState<"years" | "months">("years");
  const [symbol, setSymbol] = useState("");

  const months = Math.round((Number(term) || 0) * (unit === "years" ? 12 : 1));
  const principal = Number(amount);
  const annualRate = Number(rate);
  const valid = principal > 0 && annualRate >= 0 && annualRate <= 100 && months >= 1 && months <= 600;

  const result = useMemo(() => (valid ? loanSummary(principal, annualRate, months) : null), [valid, principal, annualRate, months]);
  const money = (n: number) => `${symbol ? symbol + " " : ""}${fmtNumber(n)}`;

  return (
    <Stack>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Loan amount"><input type="number" min={0} className={inputCls} value={amount} onChange={(e) => setAmount(e.target.value)} /></Field>
        <Field label="Yearly interest rate (%)"><input type="number" min={0} max={100} step="0.01" className={inputCls} value={rate} onChange={(e) => setRate(e.target.value)} /></Field>
        <Field label="Loan term"><input type="number" min={1} className={inputCls} value={term} onChange={(e) => setTerm(e.target.value)} /></Field>
        <Field label="Term unit">
          <select className={inputCls} value={unit} onChange={(e) => setUnit(e.target.value as "years" | "months")}>
            <option value="years">Years</option>
            <option value="months">Months</option>
          </select>
        </Field>
        <Field label="Currency symbol (optional)"><input className={inputCls} value={symbol} onChange={(e) => setSymbol(e.target.value.slice(0, 5))} placeholder="Rs, $, €" /></Field>
      </div>
      {!valid && <p className="text-sm text-red-800">Enter an amount above 0, a rate between 0 and 100, and a term of up to 50 years (600 months).</p>}
      {result && (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat strong label="Monthly payment (EMI)" value={money(result.emi)} />
            <Stat label="Total interest" value={money(result.interest)} />
            <Stat label="Total you will pay" value={money(result.total)} />
          </div>
          <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-sand/50 text-xs text-slate">
                <tr><th className="px-4 py-2">Year</th><th className="px-4 py-2">Principal paid</th><th className="px-4 py-2">Interest paid</th><th className="px-4 py-2">Balance left</th></tr>
              </thead>
              <tbody>
                {result.years.map((y) => (
                  <tr key={y.year} className="border-t border-ink/10">
                    <td className="px-4 py-2">{y.year}</td>
                    <td className="px-4 py-2">{money(y.principal)}</td>
                    <td className="px-4 py-2">{money(y.interest)}</td>
                    <td className="px-4 py-2">{money(y.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate">An estimate for a fixed-rate loan with equal monthly payments. Your lender&apos;s figure can differ because of fees, rounding and how they count days.</p>
        </>
      )}
    </Stack>
  );
}
