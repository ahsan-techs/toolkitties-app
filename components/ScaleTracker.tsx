"use client";

import { Fragment, useRef } from "react";
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import CountUp from "./motion/CountUp";
import Reveal from "./motion/Reveal";

const headline = "Built for fast, everyday file tasks".split(" ");

const stats = [
  { to: 50, suffix: "+", label: "Free tools" },
  { to: 9, suffix: "", label: "Languages" },
  { to: 0, suffix: "", label: "Signups required" },
  { to: 0, suffix: "", label: "Files uploaded" },
];

// Each word brightens as the section scrolls into the middle of the screen.
function Word({ word, i, progress, still }: { word: string; i: number; progress: MotionValue<number>; still: boolean }) {
  const start = 0.05 + (i / headline.length) * 0.6;
  const opacity = useTransform(progress, [start, start + 0.2], [still ? 1 : 0.22, 1]);
  return (
    <m.span data-reveal style={{ opacity }} className="inline-block">
      {word}
    </m.span>
  );
}

export default function ScaleTracker() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.25"] });

  return (
    <section ref={ref} className="border-y border-ink/10 bg-ink py-20 text-paper">
      <div className="container-content">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-paper/15 bg-paper/5 text-[#6FD1B0]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
              <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </span>
          <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight md:text-5xl">
            {headline.map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                <Word word={word} i={i} progress={scrollYProgress} still={!!reduce} />
                {i < headline.length - 1 ? " " : null}
              </Fragment>
            ))}
          </h2>
          <Reveal delay={0.1} y={16}>
            <p className="text-sm text-paper/70 md:text-base">No signup, no uploads — everything runs in your browser</p>
          </Reveal>
        </div>

        <Reveal delay={0.15} y={28} className="mx-auto mt-12 max-w-4xl">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col bg-ink px-4 py-7 text-center">
                <dt className="order-2 mt-1 text-xs font-medium uppercase tracking-wider text-paper/60">{s.label}</dt>
                <dd className="font-display text-4xl font-semibold text-paper md:text-5xl">
                  <CountUp to={s.to} suffix={s.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
