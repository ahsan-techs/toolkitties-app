"use client";

import { useMemo, useState } from "react";
import ToolCard from "@/components/ToolCard";
import { toolGroups } from "@/lib/tools-data";

export default function AllToolsSearch() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const groups = useMemo(() => {
    if (!q) return toolGroups;
    return toolGroups
      .map((g) => ({
        ...g,
        tools: g.tools.filter((t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.slug.includes(q.replace(/\s+/g, "-"))),
      }))
      .filter((g) => g.tools.length > 0);
  }, [q]);

  const total = groups.reduce((n, g) => n + g.tools.length, 0);

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()} className="mx-auto max-w-2xl">
        <div className="glass flex items-center gap-3 rounded-full px-5 py-1.5 transition focus-within:ring-2 focus-within:ring-moss/40">
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-none text-moss">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search all tools"
            autoComplete="off"
            placeholder="Search all tools, e.g. “merge pdf”"
            className="min-w-0 flex-1 bg-transparent py-3 text-sm text-ink outline-none placeholder:text-slate md:text-base"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-slate hover:bg-ink/5 hover:text-ink"
            >
              ✕
            </button>
          )}
        </div>
        <p className="mt-3 text-center text-sm text-slate" aria-live="polite">
          {q ? `${total} tool${total === 1 ? "" : "s"} found` : `${total} free tools`}
        </p>
      </form>

      {groups.length === 0 ? (
        <div className="mx-auto mt-12 max-w-md rounded-3xl border border-dashed border-ink/15 bg-white/60 p-10 text-center">
          <p className="font-display text-lg font-semibold text-ink">No tool found</p>
          <p className="mt-2 text-sm text-slate">Try a different word, like “pdf”, “image” or “json”.</p>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-12">
          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`g-${group.id}`}>
              <h2 id={`g-${group.id}`} className="mb-5 flex items-center gap-2 font-display text-2xl font-semibold text-ink">
                <span aria-hidden="true">{group.icon}</span>
                {group.title}
                <span className="text-sm font-medium text-slate">({group.tools.length})</span>
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {group.tools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
