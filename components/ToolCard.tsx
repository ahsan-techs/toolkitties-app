import Link from "next/link";
import type { Tool } from "@/lib/tools-data";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/${tool.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white p-5 transition hover:-translate-y-0.5 hover:border-moss/40 hover:shadow-md"
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
