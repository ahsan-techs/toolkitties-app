import { toolGroups } from "@/lib/tools-data";
import { toolSeo } from "@/lib/tool-seo";
import { allPosts } from "@/lib/blog";
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
  lines.push("> Toolkitties is a free collection of 60+ everyday file and text tools (PDF, image, text, developer utilities and calculators) that run entirely in the user's web browser. Files are processed on the user's own device using client-side code and are never uploaded to a server. No signup or login is required.");
  lines.push("");
  lines.push("## Key facts");
  lines.push("- Privacy: all processing happens locally in the browser; no file uploads, no accounts.");
  lines.push("- Pricing: completely free. There are no paid plans, subscriptions or hidden fees, and no signup is needed.");
  lines.push(`- Languages: English plus ${locales.map((l) => localeLabels[l].english).join(", ")}.`);
  lines.push(`- Homepage: ${base}`);
  lines.push("");

  for (const group of toolGroups) {
    lines.push(`## ${group.title}`);
    for (const tool of group.tools) {
      const status = tool.functional ? "" : " (coming soon)";
      const also = toolSeo[tool.slug]?.also;
      lines.push(`- [${tool.name}](${base}/${tool.slug}): ${tool.description}${status}${also ? ` Also searched as: ${also.join(", ")}.` : ""}`);
    }
    lines.push("");
  }

  lines.push("## Guides and tutorials");
  for (const post of allPosts) {
    lines.push(`- [${post.title}](${base}/blog/${post.slug}): ${post.description}`);
  }
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
