"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { LazyMotion, domAnimation, m, useScroll, useTransform } from "framer-motion";
import { allTools } from "@/lib/tools-data";

const workingCount = allTools.filter((t) => t.functional).length;

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLElement>(null);

  // As you scroll away, the hero drifts up, softens and shrinks a touch (scroll-linked).
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.96]);

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allTools.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  // The entrance is CSS (.hero-rise in globals.css) rather than JS, so the headline
  // is painted straight away and does not wait for hydration (keeps LCP fast).
  return (
    <section ref={ref} className="container-content relative z-20 pt-16 pb-12 text-center md:pt-24">
      <LazyMotion features={domAnimation}>
        <m.div data-motion style={{ y, opacity, scale }}>
          <p
            className="hero-rise font-display text-sm font-medium uppercase tracking-widest text-moss"
            style={{ animationDelay: "0ms" }}
          >
            {workingCount} working tools, zero installs
          </p>
          <h1
            className="hero-rise mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight text-ink md:text-5xl"
            style={{ animationDelay: "90ms" }}
          >
            Every file tool you reach for, in one clean workspace.
          </h1>
          <p className="hero-rise mx-auto mt-4 max-w-xl text-base text-slate md:text-lg" style={{ animationDelay: "180ms" }}>
            Compress PDFs, convert images, and clean up text — processed on your own device, gone the moment you close the tab.
          </p>

          <div className="hero-rise relative mx-auto mt-8 max-w-xl" style={{ animationDelay: "270ms" }}>
            <div aria-hidden="true" className="pointer-events-none absolute -inset-0 -z-10">
              <div className="orb orb-moss drift-b absolute -left-12 -top-7 h-16 w-16 md:-left-16 md:-top-9 md:h-24 md:w-24" />
              <div className="orb orb-gold drift-a absolute -bottom-8 -right-10 h-14 w-14 md:-bottom-10 md:-right-14 md:h-20 md:w-20" />
            </div>

            <div className="glass rounded-full transition focus-within:ring-2 focus-within:ring-moss/30">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search tools"
                placeholder="Search for a tool — try “compress pdf” or “word counter”"
                className="w-full rounded-full bg-transparent px-6 py-4 text-sm text-ink outline-none placeholder:text-slate md:text-base"
              />
            </div>

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
      </LazyMotion>
    </section>
  );
}
