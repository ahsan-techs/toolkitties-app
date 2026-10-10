"use client";

import { useRef, type ReactElement, type ReactNode } from "react";
import { m, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Small shared pieces                                                       */
/* -------------------------------------------------------------------------- */

type VisualProps = { p: MotionValue<number> };

function Frame({ tone, dark = false, children }: { tone: string; dark?: boolean; children: ReactNode }) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-3xl border bg-gradient-to-br ${tone} ${
        dark ? "border-ink/30" : "border-ink/10"
      }`}
    >
      {children}
    </div>
  );
}

function Lines({ dark = false }: { dark?: boolean }) {
  return (
    <div className="space-y-1.5">
      <div className={`h-1.5 w-1/3 rounded ${dark ? "bg-paper/50" : "bg-moss/70"}`} />
      <div className={`h-1 w-full rounded ${dark ? "bg-paper/25" : "bg-ink/10"}`} />
      <div className={`h-1 w-5/6 rounded ${dark ? "bg-paper/25" : "bg-ink/10"}`} />
      <div className={`h-1 w-2/3 rounded ${dark ? "bg-paper/25" : "bg-ink/10"}`} />
    </div>
  );
}

function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ArrowIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function LockIcon({ className = "h-3 w-3" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  );
}

function ShieldIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  The four visuals. `p` is this step's own 0 → 1 scroll progress.           */
/* -------------------------------------------------------------------------- */

function CompressVisual({ p }: VisualProps) {
  const shrink = useTransform(p, [0, 0.55], [1, 0.8]);
  const afterOpacity = useTransform(p, [0, 0.15], [0.55, 1]);
  const bar = useTransform(p, [0, 0.6], [0, 1]);
  const pct = useTransform(p, (v) => `${Math.round(Math.min(v / 0.6, 1) * 75)}%`);

  return (
    <Frame tone="from-moss/10 via-paper to-gold/10">
      <div className="flex h-full flex-col items-center justify-center gap-4 md:gap-7">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex h-24 w-[4.5rem] flex-col justify-between rounded-xl border border-ink/10 bg-white p-2.5 shadow-md md:h-40 md:w-32 md:p-3.5">
            <Lines />
            <span className="rounded-md bg-sand px-1.5 py-1 text-center text-[10px] font-semibold text-slate md:text-xs">4.8 MB</span>
          </div>

          <ArrowIcon className="h-5 w-5 text-moss md:h-6 md:w-6" />

          <m.div
            style={{ scale: shrink, opacity: afterOpacity }}
            className="flex h-24 w-[4.5rem] flex-col justify-between rounded-xl bg-moss p-2.5 text-paper shadow-xl will-change-transform md:h-40 md:w-32 md:p-3.5"
          >
            <Lines dark />
            <span className="rounded-md bg-paper/15 px-1.5 py-1 text-center text-[10px] font-semibold md:text-xs">1.2 MB</span>
          </m.div>
        </div>

        <div className="w-44 md:w-56">
          <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-ink md:text-xs">
            <span>Compressing</span>
            <span className="text-moss">
              <m.span>{pct}</m.span> smaller
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
            <m.div className="h-full origin-left rounded-full bg-moss" style={{ scaleX: bar }} />
          </div>
        </div>
      </div>
    </Frame>
  );
}

function SignatureVisual({ p }: VisualProps) {
  const draw = useTransform(p, [0.08, 0.55], [0, 1]);
  const badgeScale = useTransform(p, [0.58, 0.78], [0, 1]);
  const badgeOpacity = useTransform(p, [0.58, 0.72], [0, 1]);

  return (
    <Frame tone="from-gold/10 via-paper to-moss/10">
      <div className="flex h-full items-center justify-center">
        <div className="relative w-[78%] max-w-[320px] rounded-2xl border border-ink/10 bg-white p-4 shadow-lg md:p-6">
          <Lines />
          <div className="mt-3 border-b border-dashed border-ink/25 pb-1 md:mt-5">
            <svg viewBox="0 0 160 50" className="h-9 w-32 md:h-14 md:w-44" fill="none" aria-hidden>
              <m.path
                d="M6 38 C 16 6, 28 6, 32 28 S 46 46, 58 22 S 76 4, 86 26 S 104 44, 122 18 L 150 12"
                stroke="#1F5C4C"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ pathLength: draw }}
              />
            </svg>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-[10px] font-medium text-slate md:text-xs">Signature placed on your device</span>
            <m.span
              style={{ scale: badgeScale, opacity: badgeOpacity }}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-moss text-paper md:h-7 md:w-7"
            >
              <CheckIcon className="h-3.5 w-3.5" />
            </m.span>
          </div>
        </div>
      </div>
    </Frame>
  );
}

function FormatTile({ p, k, label, className }: { p: MotionValue<number>; k: number; label: string; className: string }) {
  const start = 0.2 + k * 0.1;
  const opacity = useTransform(p, [start, start + 0.15], [0, 1]);
  const scale = useTransform(p, [start, start + 0.15], [0.6, 1]);

  return (
    <m.div
      style={{ opacity, scale }}
      className={`flex h-12 w-12 items-center justify-center rounded-lg text-[10px] font-bold shadow-md will-change-transform md:h-16 md:w-16 md:text-xs ${className}`}
    >
      {label}
    </m.div>
  );
}

function FormatVisual({ p }: VisualProps) {
  const link = useTransform(p, [0.05, 0.3], [0, 1]);

  return (
    <Frame tone="from-sand via-paper to-moss/10">
      <div className="flex h-full items-center justify-center gap-3 md:gap-6">
        <div className="flex h-20 w-16 flex-col items-center justify-center gap-1 rounded-xl border border-ink/10 bg-white text-xs font-bold text-ink shadow-md md:h-28 md:w-24">
          <span className="h-1.5 w-8 rounded bg-moss/70" />
          PDF
        </div>

        <div className="flex items-center">
          <m.div className="h-0.5 w-8 origin-left rounded-full bg-moss md:w-14" style={{ scaleX: link }} />
          <ArrowIcon className="-ml-1 h-4 w-4 text-moss md:h-5 md:w-5" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <FormatTile p={p} k={0} label="JPG" className="bg-moss text-paper" />
          <FormatTile p={p} k={1} label="PNG" className="bg-gold text-ink" />
          <FormatTile p={p} k={2} label="WEBP" className="bg-ink text-paper" />
          <FormatTile p={p} k={3} label="TXT" className="border border-ink/10 bg-white text-ink" />
        </div>
      </div>
    </Frame>
  );
}

function StatusRow({ p, k, text }: { p: MotionValue<number>; k: number; text: string }) {
  const start = 0.1 + k * 0.22;
  const opacity = useTransform(p, [start, start + 0.15], [0, 1]);
  const x = useTransform(p, [start, start + 0.15], [-10, 0]);

  return (
    <m.div style={{ opacity, x }} className="flex items-center gap-2 text-[11px] text-paper/85 md:text-sm">
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#6FD1B0]/20 text-[#6FD1B0]">
        <CheckIcon className="h-2.5 w-2.5" />
      </span>
      {text}
    </m.div>
  );
}

function SandboxVisual({ p }: VisualProps) {
  const ring = useTransform(p, [0, 1], [0, 180]);

  return (
    <Frame tone="from-ink to-[#262B30]" dark>
      <div className="flex h-full items-center justify-center">
        <div className="w-[88%] max-w-[380px] overflow-hidden rounded-xl border border-paper/10 bg-[#0E1013] shadow-2xl">
          <div className="flex items-center gap-1.5 border-b border-paper/10 bg-ink px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-paper/20" />
            <span className="h-2 w-2 rounded-full bg-paper/20" />
            <span className="h-2 w-2 rounded-full bg-paper/20" />
            <span className="ml-3 flex items-center gap-1.5 rounded-md border border-paper/10 bg-[#0E1013] px-2.5 py-0.5 text-[10px] text-paper/60">
              <LockIcon className="h-3 w-3 text-[#6FD1B0]" />
              your-browser · sandboxed
            </span>
          </div>

          <div className="flex items-center gap-4 p-4 md:gap-6 md:p-6">
            <div className="relative h-14 w-14 shrink-0 md:h-20 md:w-20">
              <m.div style={{ rotate: ring }} className="absolute inset-0 rounded-full border border-dashed border-[#6FD1B0]/70" />
              <div className="absolute inset-0 flex items-center justify-center text-[#6FD1B0]">
                <ShieldIcon className="h-6 w-6 md:h-9 md:w-9" />
              </div>
            </div>
            <div className="flex flex-col gap-2 md:gap-2.5">
              <StatusRow p={p} k={0} text="File opened on your device" />
              <StatusRow p={p} k={1} text="Processed in browser memory" />
              <StatusRow p={p} k={2} text="0 bytes sent to any server" />
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* -------------------------------------------------------------------------- */
/*  Content                                                                   */
/* -------------------------------------------------------------------------- */

type Step = { title: string; copy: string; Visual: (props: VisualProps) => ReactElement };

const steps: Step[] = [
  {
    title: "Work directly on your files",
    copy: "Drop a file into any tool and watch it transform in place — annotate, mark up, and adjust without leaving the page.",
    Visual: CompressVisual,
  },
  {
    title: "Digital signatures made easy",
    copy: "Turn a paper process into a two-minute task. Place a signature, save, and send — no printer required.",
    Visual: SignatureVisual,
  },
  {
    title: "Create the perfect document",
    copy: "Reshape a file into whatever format the moment calls for — PDF, image, or plain text — in a couple of clicks.",
    Visual: FormatVisual,
  },
  {
    title: "Your files stay on your device",
    copy: "Every tool runs inside your browser's own sandbox. Nothing is uploaded, stored, or seen by anyone else.",
    Visual: SandboxVisual,
  },
];

const N = steps.length;
const pad = (n: number) => String(n).padStart(2, "0");

/* -------------------------------------------------------------------------- */
/*  Pinned scroll story (default)                                             */
/* -------------------------------------------------------------------------- */

// Cross-fade window for step i, expressed in section scroll progress (0 → 1).
function windowFor(i: number) {
  const start = i / N;
  const end = (i + 1) / N;
  const f = 0.05;
  if (i === 0) return { input: [end - f, end + f], opacity: [1, 0], y: [0, -28], scale: [1, 0.96] };
  if (i === N - 1) return { input: [start - f, start + f], opacity: [0, 1], y: [28, 0], scale: [0.96, 1] };
  return {
    input: [start - f, start + f, end - f, end + f],
    opacity: [0, 1, 1, 0],
    y: [28, 0, 0, -28],
    scale: [0.96, 1, 1, 0.96],
  };
}

function useStepStyle(progress: MotionValue<number>, i: number) {
  const w = windowFor(i);
  const opacity = useTransform(progress, w.input, w.opacity);
  const y = useTransform(progress, w.input, w.y);
  const scale = useTransform(progress, w.input, w.scale);
  return { opacity, y, scale };
}

function StepText({ step, i, progress }: { step: Step; i: number; progress: MotionValue<number> }) {
  const { opacity, y } = useStepStyle(progress, i);
  return (
    <m.div className="absolute inset-0 will-change-transform" style={{ opacity, y }}>
      <span className="font-display text-sm font-medium tracking-widest text-moss">
        {pad(i + 1)} / {pad(N)}
      </span>
      <h3 className="mt-3 font-display text-2xl font-semibold leading-snug text-ink md:text-4xl">{step.title}</h3>
      <p className="mt-3 max-w-md text-base text-slate md:mt-4">{step.copy}</p>
    </m.div>
  );
}

function StepVisual({ step, i, progress }: { step: Step; i: number; progress: MotionValue<number> }) {
  const { opacity, y, scale } = useStepStyle(progress, i);
  const local = useTransform(progress, [i / N, (i + 1) / N], [0, 1]);
  return (
    <m.div className="pointer-events-none absolute inset-0 will-change-transform" style={{ opacity, y, scale }}>
      <step.Visual p={local} />
    </m.div>
  );
}

function RailSegment({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const fill = useTransform(progress, [i / N, (i + 1) / N], [0, 1]);
  return (
    <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
      <m.div className="h-full origin-left rounded-full bg-moss" style={{ scaleX: fill }} />
    </div>
  );
}

function PinnedStory() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 64px", "end end"] });

  return (
    <section ref={ref} className="pin-track relative" aria-label="How Toolkitties works">
      <div className="pin-stage sticky top-16 flex items-center">
        <div className="container-content w-full">
          <div className="grid items-center gap-5 md:grid-cols-2 md:gap-14">
            <div>
              <div className="relative h-[212px] md:h-[250px]">
                {steps.map((step, i) => (
                  <StepText key={step.title} step={step} i={i} progress={scrollYProgress} />
                ))}
              </div>
              <div className="mt-3 flex gap-2 md:mt-6" aria-hidden>
                {steps.map((step, i) => (
                  <RailSegment key={step.title} i={i} progress={scrollYProgress} />
                ))}
              </div>
            </div>

            <div className="relative h-[220px] sm:h-[250px] md:h-[360px]">
              {steps.map((step, i) => (
                <StepVisual key={step.title} step={step} i={i} progress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reduced-motion fallback: calm, static rows showing the finished state     */
/* -------------------------------------------------------------------------- */

function StaticRow({ step, i }: { step: Step; i: number }) {
  const done = useMotionValue(1);
  return (
    <div className={`flex flex-col items-center gap-10 md:flex-row ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
      <div className="flex-1">
        <h3 className="font-display text-3xl font-semibold leading-snug text-ink">{step.title}</h3>
        <p className="mt-4 max-w-md text-base text-slate">{step.copy}</p>
      </div>
      <div className="h-[250px] w-full flex-1 md:h-[350px]">
        <step.Visual p={done} />
      </div>
    </div>
  );
}

function StaticRows() {
  return (
    <section className="container-content py-20">
      <div className="flex flex-col gap-24">
        {steps.map((step, i) => (
          <StaticRow key={step.title} step={step} i={i} />
        ))}
      </div>
    </section>
  );
}

export default function ScrollFeatureRows() {
  const reduce = useReducedMotion();
  return reduce ? <StaticRows /> : <PinnedStory />;
}
