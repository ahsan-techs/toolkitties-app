"use client";

import { useState } from "react";
import type { ToolGroup } from "@/lib/tools-data";
import ToolCard from "./ToolCard";
import Reveal from "./motion/Reveal";

export default function ToolGroupSection({ group }: { group: ToolGroup }) {
  const [expanded, setExpanded] = useState(false);
  const visibleTools = expanded ? group.tools : group.tools.slice(0, 4);

  return (
    <div className="py-8">
      <Reveal className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink">
            <span>{group.icon}</span>
            {group.title}
          </h2>
          <p className="mt-1 text-sm text-slate">{group.blurb}</p>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="btn-premium whitespace-nowrap rounded-full border border-moss/20 bg-white/60 px-4 py-2 text-sm font-semibold text-moss hover:bg-moss/10"
        >
          {expanded ? "Show less" : `Explore all ${group.title}`} →
        </button>
      </Reveal>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {visibleTools.map((tool, i) => (
          <Reveal key={tool.slug} delay={(i % 4) * 0.07} y={36} scale={0.97} className="h-full">
            <ToolCard tool={tool} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
