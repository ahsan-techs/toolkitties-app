"use client";

import { useState } from "react";
import { bmiValue, bmiCategory, healthyWeightRangeKg } from "@/lib/tool-processors/mini-tools";
import { Stack, Field, Stat, inputCls, ghostBtnCls, fmtNumber } from "./ui";

export default function BmiCalculator() {
  const [units, setUnits] = useState<"metric" | "imperial">("metric");
  const [kg, setKg] = useState("");
  const [cm, setCm] = useState("");
  const [lb, setLb] = useState("");
  const [ft, setFt] = useState("");
  const [inch, setInch] = useState("");

  const weightKg = units === "metric" ? Number(kg) : Number(lb) * 0.45359237;
  const heightM = units === "metric" ? Number(cm) / 100 : (Number(ft) * 12 + Number(inch)) * 0.0254;
  const ready = weightKg > 0 && heightM > 0.5 && heightM < 2.8 && weightKg < 700;

  const value = ready ? bmiValue(weightKg, heightM) : null;
  const [lo, hi] = ready ? healthyWeightRangeKg(heightM) : [0, 0];
  const showRange = (kgVal: number) => (units === "metric" ? `${fmtNumber(kgVal, 1)} kg` : `${fmtNumber(kgVal / 0.45359237, 1)} lb`);

  return (
    <Stack>
      <div className="flex gap-2">
        <button type="button" className={`${ghostBtnCls} ${units === "metric" ? "border-moss text-moss" : ""}`} onClick={() => setUnits("metric")}>Metric (kg, cm)</button>
        <button type="button" className={`${ghostBtnCls} ${units === "imperial" ? "border-moss text-moss" : ""}`} onClick={() => setUnits("imperial")}>Imperial (lb, ft, in)</button>
      </div>
      {units === "metric" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Weight (kg)"><input type="number" min={0} className={inputCls} value={kg} onChange={(e) => setKg(e.target.value)} placeholder="70" /></Field>
          <Field label="Height (cm)"><input type="number" min={0} className={inputCls} value={cm} onChange={(e) => setCm(e.target.value)} placeholder="175" /></Field>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Weight (lb)"><input type="number" min={0} className={inputCls} value={lb} onChange={(e) => setLb(e.target.value)} placeholder="154" /></Field>
          <Field label="Height (ft)"><input type="number" min={0} className={inputCls} value={ft} onChange={(e) => setFt(e.target.value)} placeholder="5" /></Field>
          <Field label="Height (in)"><input type="number" min={0} className={inputCls} value={inch} onChange={(e) => setInch(e.target.value)} placeholder="9" /></Field>
        </div>
      )}
      {value !== null ? (
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat strong label="Your BMI" value={fmtNumber(value, 1)} />
          <Stat label="Category (adults)" value={bmiCategory(value)} />
          <Stat label="Healthy weight for your height" value={`${showRange(lo)} – ${showRange(hi)}`} />
        </div>
      ) : (
        <p className="text-sm text-slate">Enter your weight and height to see your BMI.</p>
      )}
      <p className="text-xs text-slate">BMI is a general screening number for adults aged 20 and over. It does not measure body fat, muscle or health, and is not medical advice. Talk to a doctor about your own situation.</p>
    </Stack>
  );
}
