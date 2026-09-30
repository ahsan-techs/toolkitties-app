"use client";

import { useState } from "react";
import type { ToolGroup } from "@/lib/tools-data";
import ToolCard from "./ToolCard";

export default function ToolGroupSection({ group }: { group: ToolGroup }) {
  const [expanded, setExpanded] = useState(false);
  const visibleTools = expanded ? group.tools : group.tools.slice(0, 4);

  return (
    <div className="py-8">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink">
            <span>{group.icon}</span>
            {group.title}
          </h2>
          <p className="mt-1 text-sm text-slate">{group.blurb}</p>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="whitespace-nowrap text-sm font-semibold text-moss hover:text-moss/70"
        >
          {expanded ? "Show less" : `Explore all ${group.title}`} →
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 transition-all duration-300 md:grid-cols-4">
        {visibleTools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
