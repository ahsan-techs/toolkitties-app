import type { MetadataRoute } from "next";
import { allTools, findTool } from "@/lib/tools-data";
import { toolVariants } from "@/lib/tool-variants";
import { locales } from "@/lib/i18n/config";
import { toolTranslations } from "@/lib/i18n/tool-translations";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://toolkitties.com";
  const toolRoutes = allTools.map((tool) => ({
    url: `${base}/${tool.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  const variantRoutes = toolVariants.map((v) => ({
    url: `${base}/${v.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const localeHomeRoutes = locales.map((locale) => ({
    url: `${base}/${locale}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const localeToolRoutes = locales.flatMap((locale) =>
    Object.entries(toolTranslations)
      .filter(([baseSlug]) => findTool(baseSlug)?.tool.functional)
      .map(([, byLocale]) => byLocale[locale])
      .filter(Boolean)
      .map((t) => ({
        url: `${base}/${locale}/${t.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
  );

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    ...toolRoutes,
    ...variantRoutes,
    ...localeHomeRoutes,
    ...localeToolRoutes,
  ];
}
