"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { allTools } from "@/lib/tools-data";

export default function HeroSearch() {
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allTools.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  return (
    <section className="container-content pt-16 pb-12 text-center md:pt-24">
      <p className="font-display text-sm font-medium uppercase tracking-widest text-moss">50+ tools, zero installs</p>
      <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
        50+ Premium Tools. 100% Free Forever.
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-base text-slate md:text-lg">
        Compress PDFs, convert images, and clean up text — processed on your own device, gone the moment you close the tab.
      </p>

      <div className="relative mx-auto mt-8 max-w-xl">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a tool — try “compress pdf” or “word counter”"
          className="w-full rounded-full border border-ink/15 bg-white px-6 py-4 text-sm text-ink shadow-sm outline-none transition focus:border-moss md:text-base"
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
    </section>
  );
}
