"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

// Each tool loads only when its page is opened, so the other pages stay light.
const CompressPdf = dynamic(() => import("./CompressPdf"));

const tools: Record<string, ComponentType> = {
  "merge-pdf": dynamic(() => import("./MergePdf")),
  "split-pdf": dynamic(() => import("./SplitPdf")),
  "image-to-pdf": dynamic(() => import("./ImageToPdf")),
  "image-to-webp": dynamic(() => import("./ImageToWebp")),
  "flip-image": dynamic(() => import("./FlipImage")),
  "sort-lines": dynamic(() => import("./SortLines")),
  "json-to-csv": dynamic(() => import("./JsonToCsv")),
  "jwt-decoder": dynamic(() => import("./JwtDecoder")),
  "regex-tester": dynamic(() => import("./RegexTester")),
  "number-base-converter": dynamic(() => import("./NumberBaseConverter")),
  "color-converter": dynamic(() => import("./ColorConverter")),
  "loan-calculator": dynamic(() => import("./LoanCalculator")),
  "bmi-calculator": dynamic(() => import("./BmiCalculator")),
  "days-between-dates": dynamic(() => import("./DaysBetweenDates")),
  "pdf-to-jpg": dynamic(() => import("./PdfToJpg")),
  "pdf-to-word": dynamic(() => import("./PdfToWord")),
  "protect-pdf": dynamic(() => import("./ProtectPdf")),
  "unlock-pdf": dynamic(() => import("./UnlockPdf")),
};

export default function MiniTool({ slug, initialOpts }: { slug: string; initialOpts?: Record<string, string> }) {
  if (slug === "compress-pdf") return <CompressPdf initialOpts={initialOpts} />;
  const Tool = tools[slug];
  return Tool ? <Tool /> : null;
}
