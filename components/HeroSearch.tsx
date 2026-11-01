"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LazyMotion, domAnimation, m, useScroll, useTransform } from "framer-motion";
import { allTools } from "@/lib/tools-data";
import RevealWords from "@/components/motion/RevealWords";

const workingCount = allTools.filter((t) => t.functional).length;

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [noMatch, setNoMatch] = useState(false);
  // Whether the results dropdown is open, tracked separately from "do we have matches" —
  // the old version showed the dropdown purely from `matches.length > 0`, with no way to
  // ever dismiss it short of clearing the box or navigating away, and no outside-click/
  // Escape handling. That's the "dropdown doesn't behave properly" bug: it could get stuck
  // open, and on touch devices a tap just outside the box (to dismiss the keyboard, say)
  // wouldn't close it either, leaving it sitting over the rest of the page.
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

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

  // Same proven close-on-outside-click + Escape pattern already used by the language
  // switcher dropdown elsewhere on the site. Using "pointerdown" (fires before "click")
  // and checking containment means a click on a result link still lands normally —
  // only a click genuinely outside the search box closes the dropdown.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function goTo(slug: string) {
    setOpen(false);
    router.push(`/${slug}`);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    if (activeIndex >= 0 && matches[activeIndex]) {
      goTo(matches[activeIndex].slug);
    } else if (matches.length > 0) {
      goTo(matches[0].slug);
    } else {
      setNoMatch(true);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || matches.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? matches.length - 1 : i - 1));
    }
  }

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
            100% free: {workingCount} working tools, zero installs
          </p>
          <h1 className="relative mx-auto mt-5 max-w-4xl [text-wrap:balance]">
            {/* Oversized, heavily blurred ghost copy of the headline sitting behind the real
                one — the layered "glow type" look big product-marketing sites use for depth.
                aria-hidden + select-none so it never reaches assistive tech or text selection. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -z-10 select-none font-display text-6xl font-bold leading-[0.95] text-moss/10 blur-xl md:text-8xl"
            >
              Every file tool you reach for, in one clean workspace.
            </span>
            <RevealWords
              text="Every file tool you reach for, in one clean workspace."
              className="font-display text-5xl font-bold leading-[1.02] tracking-tight text-ink md:text-7xl md:leading-[0.98]"
              delay={0.05}
              triggerOn="mount"
            />
          </h1>
          <p className="hero-rise mx-auto mt-8 max-w-xl text-base leading-relaxed text-slate md:mt-10 md:text-lg" style={{ animationDelay: "180ms" }}>
            Compress PDFs, convert images, and clean up text — processed on your own device, gone the moment you close the tab.
          </p>

          <div ref={boxRef} className="hero-rise relative mx-auto mt-10 max-w-2xl md:mt-12" style={{ animationDelay: "270ms" }}>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute -left-6 -top-14 sm:-left-16 sm:top-1/2 sm:-translate-y-1/2 md:-left-40">
                <div className="orb orb-soft orb-moss drift-b h-14 w-14 md:h-24 md:w-24" />
              </div>
              <div className="absolute -bottom-14 -right-4 sm:-right-14 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 md:-right-36">
                <div className="orb orb-soft orb-gold drift-a h-12 w-12 md:h-20 md:w-20" />
              </div>
            </div>

            <form
              role="search"
              onSubmit={onSubmit}
              className="glass flex items-center gap-2 rounded-full p-1.5 pl-5 transition focus-within:ring-2 focus-within:ring-moss/40"
            >
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-none text-moss">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setNoMatch(false);
                  setOpen(true);
                  setActiveIndex(-1);
                }}
                onFocus={() => query.trim() && setOpen(true)}
                onKeyDown={onKeyDown}
                role="combobox"
                aria-expanded={open && matches.length > 0}
                aria-controls="hero-search-results"
                aria-autocomplete="list"
                aria-activedescendant={activeIndex >= 0 && matches[activeIndex] ? `hero-search-opt-${matches[activeIndex].slug}` : undefined}
                aria-label="Search tools"
                autoComplete="off"
                placeholder="Search a tool…"
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm text-ink outline-none placeholder:text-slate md:text-base"
              />
              <button
                type="submit"
                className="btn-premium flex-none rounded-full bg-moss px-5 py-3 text-sm font-semibold text-paper hover:bg-moss/90 md:px-7"
              >
                Search
              </button>
            </form>

            {open && noMatch && matches.length === 0 && (
              <p className="absolute left-0 right-0 top-full z-40 mt-2 rounded-2xl border border-ink/10 bg-white p-4 text-left text-sm text-slate shadow-xl">
                No tool found for “{query}”. Try another word, or{" "}
                <Link href="/all-tools" className="font-semibold text-moss underline" onClick={() => setOpen(false)}>browse all tools</Link>.
              </p>
            )}

            {open && matches.length > 0 && (
              <div
                id="hero-search-results"
                role="listbox"
                className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[60vh] overflow-y-auto rounded-2xl border border-ink/10 bg-white p-2 text-left shadow-xl"
              >
                {matches.map((tool, i) => (
                  <Link
                    key={tool.slug}
                    id={`hero-search-opt-${tool.slug}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    href={`/${tool.slug}`}
                    onClick={() => setOpen(false)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${i === activeIndex ? "bg-sand" : "hover:bg-sand"}`}
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
