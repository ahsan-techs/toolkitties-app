import Link from "next/link";
import type { Tool } from "@/lib/tools-data";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="tool-card group flex flex-col gap-3 rounded-2xl border border-ink/10 p-5"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-moss/10 to-gold/15 text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
          {tool.icon}
        </span>
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
