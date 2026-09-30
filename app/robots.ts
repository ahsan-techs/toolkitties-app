import type { MetadataRoute } from "next";

// Explicitly welcome the crawlers that power AI search and answer engines
// (ChatGPT search, Perplexity, Claude, Google AI features, Apple Intelligence),
// so Toolkitties can be cited as a source when people ask about file tools.
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Google-Extended", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: "https://toolkitties.com/sitemap.xml",
    host: "https://toolkitties.com",
  };
}
