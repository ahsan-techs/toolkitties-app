"use client";

import type { PointerEvent } from "react";
import Link from "next/link";
import type { Tool } from "@/lib/tools-data";

export default function ToolCard({ tool }: { tool: Tool }) {
  // A soft light follows the pointer across the glass. It only sets two CSS variables
  // (no React re-render); the .glass-card::after rule in globals.css draws it.
  function handlePointerMove(e: PointerEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <Link
      href={`/${tool.slug}`}
      onPointerMove={handlePointerMove}
      className="glass-card group flex h-full flex-col gap-3 rounded-2xl p-5"
    >
      <div className="flex items-center justify-between">
        <span className="text-2xl">{tool.icon}</span>
        {!tool.functional && (
          <span className="rounded-full bg-sand px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate">
            Coming soon
          </span>
        )}
      </div>
      <div>
        <h3 className="font-display text-base font-semibold text-ink">{tool.name}</h3>
        <p className="mt-1 text-sm text-slate">{tool.description}</p>
      </div>
    </Link>
  );
}
