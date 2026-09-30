import { toolGroups } from "@/lib/tools-data";
import { locales, localeLabels } from "@/lib/i18n/config";

export const dynamic = "force-static";

// /llms.txt — a plain-language summary of the site for AI assistants and
// answer engines. Built from the same data as the site itself, so it never
// drifts out of date.
export function GET() {
  const base = "https://toolkitties.com";
  const lines: string[] = [];

  lines.push("# Toolkitties");
  lines.push("");
  lines.push("> Toolkitties is a free collection of 50+ everyday file and text tools (PDF, image, text, developer utilities and calculators) that run entirely in the user's web browser. Files are processed on the user's own device using client-side code and are never uploaded to a server. No signup or login is required.");
  lines.push("");
  lines.push("## Key facts");
  lines.push("- Privacy: all processing happens locally in the browser; no file uploads, no accounts.");
  lines.push("- Pricing: free tier for casual use; optional paid Pro ($6.99/month) and Business ($12.99/month) plans, billed in USD via Lemon Squeezy.");
  lines.push(`- Languages: English plus ${locales.map((l) => localeLabels[l].english).join(", ")}.`);
  lines.push(`- Homepage: ${base}`);
  lines.push("");

  for (const group of toolGroups) {
    lines.push(`## ${group.title}`);
    for (const tool of group.tools) {
      const status = tool.functional ? "" : " (coming soon)";
      lines.push(`- [${tool.name}](${base}/${tool.slug}): ${tool.description}${status}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
