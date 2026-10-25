import Link from "next/link";
import { findTool } from "@/lib/tools-data";

// "Try it now" card that sends readers from an article to the tool it explains.
export default function ToolCta({ toolSlug }: { toolSlug: string }) {
  const found = findTool(toolSlug);
  if (!found) return null;
  const { tool } = found;
  return (
    <aside className="bl-cta" aria-label={`Try ${tool.name}`}>
      <span className="bl-cta-icon" aria-hidden="true">{tool.icon}</span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg font-bold text-paper">Try {tool.name} now</p>
        <p className="mt-1 text-sm text-paper/75">{tool.description}</p>
        <p className="mt-2 text-xs text-paper/60">Free · No signup · Runs in your browser</p>
      </div>
      <Link href={`/${tool.slug}`} className="bl-cta-btn">Open tool <span aria-hidden="true">→</span></Link>
    </aside>
  );
}
