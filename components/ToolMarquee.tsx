import Link from "next/link";
import type { CSSProperties } from "react";
import { allTools, type Tool } from "@/lib/tools-data";

// Two rows of working tools. Row 1 moves left, row 2 moves right. Hovering a row stops it
// (CSS only, see .marquee in globals.css) so the visitor can click a tool to open it.
const workingTools = allTools.filter((t) => t.functional);
const rowOne = workingTools.filter((_, i) => i % 2 === 0);
const rowTwo = workingTools.filter((_, i) => i % 2 === 1).reverse();

function LaneItems({ tools, hidden }: { tools: Tool[]; hidden: boolean }) {
  return (
    <ul className="marquee-group" aria-hidden={hidden ? true : undefined}>
      {tools.map((tool) => (
        <li key={tool.slug}>
          <Link href={`/${tool.slug}`} tabIndex={hidden ? -1 : undefined} className="lane-card group">
            <span aria-hidden="true" className="card-glow">
              <span className="card-glow-ring" />
            </span>
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-moss/10 to-gold/20 text-xl">
              {tool.icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-sm font-semibold text-ink">{tool.name}</span>
              <span className="mt-0.5 inline-block rounded-full bg-moss/10 px-2 py-0.5 text-[10px] font-semibold text-moss">
                Free
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Lane({ tools, direction, label }: { tools: Tool[]; direction: "left" | "right"; label: string }) {
  // About 5 seconds per tool keeps the speed gentle and readable.
  const style = { "--marquee-duration": `${Math.max(40, tools.length * 5)}s` } as CSSProperties;
  return (
    <div className={`marquee marquee-${direction}`} style={style} role="group" aria-label={label}>
      <div className="marquee-track">
        <LaneItems tools={tools} hidden={false} />
        <LaneItems tools={tools} hidden={true} />
      </div>
    </div>
  );
}

export default function ToolMarquee() {
  return (
    <section aria-labelledby="lanes-title" className="relative py-6">
      <div className="container-content">
        <h2 id="lanes-title" className="font-display text-2xl font-semibold text-ink">
          Pick a tool and start
        </h2>
        <p className="mt-1 text-sm text-slate">Hover a row to stop it, then click any tool to open it.</p>
      </div>
      <Lane tools={rowOne} direction="left" label="Free tools, moving left" />
      <Lane tools={rowTwo} direction="right" label="Free tools, moving right" />
    </section>
  );
}
