"use client";

import { useState } from "react";
import { marginBreakdown, priceForMargin, priceForMarkup } from "@/lib/tool-processors/mini-tools";
import { Stack, Field, Stat, inputCls, ghostBtnCls, fmtNumber } from "./ui";

type Mode = "find-margin" | "find-price";
type Target = "margin" | "markup";

export default function ProfitMarginCalculator() {
  const [mode, setMode] = useState<Mode>("find-margin");
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [target, setTarget] = useState<Target>("margin");
  const [targetPct, setTargetPct] = useState("30");

  const c = Number(cost);
  const costOk = cost.trim() !== "" && Number.isFinite(c) && c >= 0;

  let body: React.ReactNode;
  if (mode === "find-margin") {
    const p = Number(price);
    const ok = costOk && price.trim() !== "" && Number.isFinite(p) && p >= 0;
    const r = ok ? marginBreakdown(c, p) : null;
    body = r ? (
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label={r.profit >= 0 ? "Profit" : "Loss"} value={fmtNumber(r.profit, 2)} />
        <Stat strong label="Profit margin" value={Number.isFinite(r.marginPct) ? `${fmtNumber(r.marginPct, 2)}%` : "not defined"} />
        <Stat label="Markup" value={Number.isFinite(r.markupPct) ? `${fmtNumber(r.markupPct, 2)}%` : "not defined"} />
      </div>
    ) : (
      <p className="text-sm text-slate">Enter your cost and your selling price to see your profit, margin and markup.</p>
    );
  } else {
    const t = Number(targetPct);
    const valid = costOk && targetPct.trim() !== "" && Number.isFinite(t) && t >= 0 && (target === "markup" || t < 100);
    const sell = valid ? (target === "margin" ? priceForMargin(c, t) : priceForMarkup(c, t)) : null;
    body =
      sell !== null ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat strong label="Selling price" value={fmtNumber(sell, 2)} />
          <Stat label="Profit per item" value={fmtNumber(sell - c, 2)} />
          <Stat label={target === "margin" ? "Equivalent markup" : "Equivalent margin"} value={`${fmtNumber(target === "margin" ? (c > 0 ? ((sell - c) / c) * 100 : 0) : sell > 0 ? ((sell - c) / sell) * 100 : 0, 2)}%`} />
        </div>
      ) : (
        <p className="text-sm text-slate">{target === "margin" ? "Enter your cost and a target margin below 100%." : "Enter your cost and a target markup."}</p>
      );
  }

  return (
    <Stack>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${ghostBtnCls} ${mode === "find-margin" ? "border-moss text-moss" : ""}`} onClick={() => setMode("find-margin")}>
          Find my margin
        </button>
        <button type="button" className={`${ghostBtnCls} ${mode === "find-price" ? "border-moss text-moss" : ""}`} onClick={() => setMode("find-price")}>
          Find my selling price
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cost of the item">
          <input type="number" min={0} step="any" inputMode="decimal" className={inputCls} value={cost} onChange={(e) => setCost(e.target.value)} placeholder="60" />
        </Field>
        {mode === "find-margin" ? (
          <Field label="Selling price">
            <input type="number" min={0} step="any" inputMode="decimal" className={inputCls} value={price} onChange={(e) => setPrice(e.target.value)} placeholder="100" />
          </Field>
        ) : (
          <Field label={target === "margin" ? "Target profit margin (%)" : "Target markup (%)"}>
            <input type="number" min={0} step="any" inputMode="decimal" className={inputCls} value={targetPct} onChange={(e) => setTargetPct(e.target.value)} placeholder="30" />
          </Field>
        )}
      </div>

      {mode === "find-price" && (
        <div className="flex flex-wrap gap-2">
          <button type="button" className={`${ghostBtnCls} ${target === "margin" ? "border-moss text-moss" : ""}`} onClick={() => setTarget("margin")}>
            Use margin
          </button>
          <button type="button" className={`${ghostBtnCls} ${target === "markup" ? "border-moss text-moss" : ""}`} onClick={() => setTarget("markup")}>
            Use markup
          </button>
        </div>
      )}

      {body}
      <p className="text-xs text-slate">
        Margin is profit as a share of the selling price. Markup is profit as a share of the cost. A 50% markup is a 33.3% margin, so the two are not the same.
      </p>
    </Stack>
  );
}
