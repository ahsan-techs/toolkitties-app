"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { allTools } from "@/lib/tools-data";

const chips = [
  { label: "PDF", position: "left-[3%] top-28", depth: -70, tilt: -8 },
  { label: "JPG", position: "left-[9%] top-[21rem]", depth: -120, tilt: 6 },
  { label: "{ }", position: "right-[4%] top-32", depth: -90, tilt: 7 },
  { label: "QR", position: "right-[10%] top-[20rem]", depth: -140, tilt: -5 },
];

// Decorative file-type chips that drift at different speeds as you scroll (depth).
function FloatChip({ chip, progress, still }: { chip: (typeof chips)[number]; progress: MotionValue<number>; still: boolean }) {
  const y = useTransform(progress, [0, 1], [0, still ? 0 : chip.depth]);
  const rotate = useTransform(progress, [0, 1], [chip.tilt, still ? chip.tilt : chip.tilt * 2.5]);
  return (
    <m.div
      style={{ y, rotate }}
      className={`absolute hidden h-12 w-12 items-center justify-center rounded-xl border border-ink/10 bg-white font-display text-sm font-semibold text-moss shadow-sm will-change-transform lg:flex ${chip.position}`}
    >
      {chip.label}
    </m.div>
  );
}

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduce ? 1 : 0.2]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60]);
  const orbA = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 110]);
  const orbB = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allTools.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  return (
    <section ref={ref} className="relative">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <m.div style={{ y: gridY }} className="hero-grid absolute inset-x-0 -top-10 h-[130%]" />
        <m.div
          style={{ y: orbA }}
          className="absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,rgba(31,92,76,0.16),transparent)]"
        />
        <m.div
          style={{ y: orbB }}
          className="absolute -right-24 top-24 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(closest-side,rgba(199,134,43,0.16),transparent)]"
        />
        {chips.map((chip) => (
          <FloatChip key={chip.label} chip={chip} progress={scrollYProgress} still={reduce} />
        ))}
      </div>

      <m.div style={{ y: contentY, opacity: contentOpacity }} className="container-content relative z-30 pt-16 pb-12 text-center md:pt-24">
        <p className="font-display text-sm font-medium uppercase tracking-widest text-moss">50+ tools, zero installs</p>
        <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
          Every file tool you reach for, in one clean workspace.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-slate md:text-lg">
          Compress PDFs, convert images, and clean up text — processed on your own device, gone the moment you close the tab.
        </p>

        <div className="relative mx-auto mt-8 max-w-xl">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a tool — try “compress pdf” or “word counter”"
            className="w-full rounded-full border border-ink/15 bg-white px-6 py-4 text-sm text-ink shadow-sm outline-none transition focus:border-moss focus:shadow-md md:text-base"
          />
          {matches.length > 0 && (
            <div className="absolute left-0 right-0 top-full z-40 mt-2 rounded-2xl border border-ink/10 bg-white p-2 text-left shadow-xl">
              {matches.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-sand"
                >
                  <span className="text-lg">{tool.icon}</span>
                  <span>
                    <span className="block text-sm font-medium text-ink">{tool.name}</span>
                    <span className="block text-xs text-slate">{tool.description}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </m.div>
    </section>
  );
}
