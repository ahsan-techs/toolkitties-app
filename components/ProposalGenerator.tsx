"use client";

import { useMemo, useState } from "react";
import { buildProposalPdf, proposalToText, composeProposal, type ProposalInput } from "@/lib/tool-processors/proposal";
import { Stack, Field, ErrorNote, inputCls, btnCls, ghostBtnCls, CopyButton } from "./tools/ui";

const PAYMENT_OPTIONS = [
  "50% upfront and 50% on delivery",
  "100% upfront",
  "30% upfront, 40% at the midpoint, 30% on delivery",
  "Payment due within 15 days of the invoice date",
  "Payment due within 30 days of the invoice date",
];

function todayText() {
  return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function ProposalGenerator() {
  const [f, setF] = useState({
    title: "",
    client: "",
    preparedBy: "",
    overview: "",
    scope: "",
    timeline: "",
    price: "",
    payment: PAYMENT_OPTIONS[0],
    validDays: "30",
    terms: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const input: ProposalInput = useMemo(
    () => ({
      title: f.title,
      preparedBy: f.preparedBy,
      client: f.client,
      date: todayText(),
      overview: f.overview,
      scope: f.scope,
      timeline: f.timeline,
      price: f.price,
      payment: f.payment,
      validDays: Math.max(0, Math.floor(Number(f.validDays) || 0)),
      terms: f.terms,
    }),
    [f]
  );
  const composed = useMemo(() => composeProposal(input), [input]);
  const text = useMemo(() => proposalToText(f.title, input), [f.title, input]);

  const download = async () => {
    setError("");
    if (!f.title.trim()) return setError("Add a project title first.");
    setBusy(true);
    try {
      const bytes = await buildProposalPdf(f.title, input);
      const url = URL.createObjectURL(new Blob([bytes as unknown as BlobPart], { type: "application/pdf" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `proposal-${f.title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "project"}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not create the PDF. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Project title">
          <input className={inputCls} value={f.title} onChange={(e) => set("title")(e.target.value)} placeholder="Website redesign" />
        </Field>
        <Field label="Client name">
          <input className={inputCls} value={f.client} onChange={(e) => set("client")(e.target.value)} placeholder="Acme Ltd" />
        </Field>
        <Field label="Prepared by (you or your business)">
          <input className={inputCls} value={f.preparedBy} onChange={(e) => set("preparedBy")(e.target.value)} placeholder="Your name or business" />
        </Field>
        <Field label="Price" hint="For example: USD 2,500 (fixed price)">
          <input className={inputCls} value={f.price} onChange={(e) => set("price")(e.target.value)} placeholder="USD 2,500" />
        </Field>
      </div>

      <Field label="Overview" hint="The problem you will solve and why you are the right choice">
        <textarea rows={4} className={inputCls} value={f.overview} onChange={(e) => set("overview")(e.target.value)} />
      </Field>
      <Field label="Scope of work and deliverables" hint="One item per line">
        <textarea rows={5} className={inputCls} value={f.scope} onChange={(e) => set("scope")(e.target.value)} placeholder={"Design of 5 pages\nMobile-friendly build\nTwo rounds of revisions"} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Timeline">
          <input className={inputCls} value={f.timeline} onChange={(e) => set("timeline")(e.target.value)} placeholder="4 weeks from approval" />
        </Field>
        <Field label="Payment terms">
          <select className={inputCls} value={f.payment} onChange={(e) => set("payment")(e.target.value)}>
            {PAYMENT_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Valid for (days)">
          <input type="number" min={0} className={inputCls} value={f.validDays} onChange={(e) => set("validDays")(e.target.value)} />
        </Field>
      </div>
      <Field label="Terms and conditions (optional)">
        <textarea rows={3} className={inputCls} value={f.terms} onChange={(e) => set("terms")(e.target.value)} placeholder="Revisions, ownership of the work, cancellation..." />
      </Field>

      <div className="rounded-2xl border border-ink/10 bg-white p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate">Preview</p>
        <h3 className="mt-2 font-display text-xl font-semibold text-ink">{f.title.trim() || "Untitled project"}</h3>
        <p className="mt-1 text-xs text-slate">{composed.header.map(([k, v]) => `${k}: ${v}`).join("  ·  ")}</p>
        {composed.sections.map((s) => (
          <div key={s.heading} className="mt-4">
            <h4 className="text-sm font-semibold text-moss">{s.heading}</h4>
            {s.paragraphs.map((t, i) => (
              <p key={i} className="mt-1 whitespace-pre-wrap text-sm text-ink/85">{t}</p>
            ))}
            {s.bullets && (
              <ul className="mt-1 list-disc pl-5 text-sm text-ink/85">
                {s.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className={btnCls} onClick={download} disabled={busy}>
          {busy ? "Building PDF…" : "Download PDF"}
        </button>
        <CopyButton value={text} label="Copy as text" />
        <button type="button" className={ghostBtnCls} onClick={() => setF((s) => ({ ...s, title: "", client: "", preparedBy: "", overview: "", scope: "", timeline: "", price: "", terms: "" }))}>
          Clear
        </button>
      </div>
      {error && <ErrorNote message={error} />}
      <p className="text-xs text-slate">Your proposal is created in your browser and is never uploaded. The PDF supports English (Latin) letters, so other scripts would appear as question marks.</p>
    </Stack>
  );
}
