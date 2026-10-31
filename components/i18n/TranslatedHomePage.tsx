import type { Metadata } from "next";
import Link from "next/link";
import LocaleHeader from "@/components/i18n/LocaleHeader";
import LocaleFooter from "@/components/i18n/LocaleFooter";
import Reveal from "@/components/motion/Reveal";
import { toolGroups } from "@/lib/tools-data";
import { locales, localeLabels, type Locale } from "@/lib/i18n/config";
import { toolTranslations } from "@/lib/i18n/tool-translations";
import { uiStrings } from "@/lib/i18n/ui-translations";
import { groupTitles } from "@/lib/i18n/group-translations";


const OG_LOCALE: Record<string, string> = { es: "es_ES", pt: "pt_BR", de: "de_DE", fr: "fr_FR", hi: "hi_IN", id: "id_ID", ja: "ja_JP", ar: "ar_AR" };

export function getHomeMetadata(locale: Locale): Metadata {
  const t = uiStrings[locale];
  const url = `https://toolkitties.com/${locale}`;

  const languageAlternates: Record<string, string> = { "x-default": "https://toolkitties.com", en: "https://toolkitties.com" };
  for (const l of locales) languageAlternates[l] = `https://toolkitties.com/${l}`;

  return {
    title: `Toolkitties — ${t.heroKicker}`,
    description: t.heroSubtitle,
    alternates: { canonical: url, languages: languageAlternates },
    openGraph: { title: `Toolkitties — ${t.heroKicker}`, description: t.heroSubtitle, url, siteName: "Toolkitties", type: "website", locale: OG_LOCALE[locale], images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Toolkitties" }] },
    twitter: { card: "summary_large_image", images: ["/og/home.png"] },
  };
}

export default function TranslatedHomePage({ locale }: { locale: Locale }) {
  const t = uiStrings[locale];
  const dir = localeLabels[locale].dir;

  const localizedHrefs: Partial<Record<Locale, string>> = {};
  for (const l of locales) localizedHrefs[l] = `/${l}`;

  return (
    <>
      <LocaleHeader locale={locale} englishHref="/" localizedHrefs={localizedHrefs} />
      <main dir={dir}>
        <section className="container-content py-16 text-center">
          <span className="rounded-full bg-moss/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-moss">{t.heroKicker}</span>
          <h1 className="mx-auto mt-5 max-w-3xl font-display text-5xl font-bold leading-[1.02] tracking-tight text-ink [text-wrap:balance] md:text-7xl md:leading-[0.98]">{t.heroTitle}</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate md:mt-8 md:text-lg">{t.heroSubtitle}</p>
        </section>

        <section className="container-content flex flex-col gap-14 pb-20">
          {toolGroups.map((group, gi) => {
            const title = groupTitles[group.id]?.[locale] ?? group.title;
            const functionalTools = group.tools.filter((tool) => tool.functional && toolTranslations[tool.slug]?.[locale]);
            if (functionalTools.length === 0) return null;

            return (
              <Reveal key={group.id} eager={gi === 0}>
                <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-ink">
                  <span>{group.icon}</span>
                  {title}
                </h2>
                <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {functionalTools.map((tool) => {
                    const tr = toolTranslations[tool.slug][locale];
                    return (
                      <Link
                        key={tool.slug}
                        href={`/${locale}/${tr.slug}`}
                        className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-white p-4 text-sm text-ink hover:border-moss/40"
                      >
                        <span className="text-xl">{tool.icon}</span>
                        {tr.name}
                      </Link>
                    );
                  })}
                </div>
              </Reveal>
            );
          })}
        </section>
      </main>
      <LocaleFooter locale={locale} />
    </>
  );
}
