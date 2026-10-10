"use client";

import { useMemo, useState } from "react";
import { parseYmd, dateDiff } from "@/lib/tool-processors/mini-tools";
import { Stack, Field, Stat, inputCls } from "./ui";

export default function DaysBetweenDates() {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [includeEnd, setIncludeEnd] = useState(false);

  const result = useMemo(() => {
    const a = parseYmd(start);
    const b = parseYmd(end);
    return a !== null && b !== null ? dateDiff(a, b, includeEnd) : null;
  }, [start, end, includeEnd]);

  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

  return (
    <Stack>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start date"><input type="date" className={inputCls} value={start} onChange={(e) => setStart(e.target.value)} /></Field>
        <Field label="End date"><input type="date" className={inputCls} value={end} onChange={(e) => setEnd(e.target.value)} /></Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-ink">
        <input type="checkbox" checked={includeEnd} onChange={(e) => setIncludeEnd(e.target.checked)} className="h-4 w-4 accent-moss" />
        Count the last day too
      </label>
      {result ? (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <Stat strong label="Total days" value={result.days.toLocaleString()} />
            <Stat label="Weeks and days" value={`${plural(result.weeks, "week")}, ${plural(result.leftoverDays, "day")}`} />
            <Stat label="Working days (Mon–Fri)" value={result.business.toLocaleString()} />
          </div>
          <Stat label="Years, months and days" value={`${plural(result.years, "year")}, ${plural(result.months, "month")}, ${plural(result.d, "day")}`} />
          {result.reversed && <p className="text-xs text-slate">Your start date is after your end date, so the dates were swapped to give a positive answer.</p>}
          <p className="text-xs text-slate">Working days skip Saturdays and Sundays only. Public holidays are not taken off.</p>
        </>
      ) : (
        <p className="text-sm text-slate">Pick two dates to see the difference.</p>
      )}
    </Stack>
  );
}
