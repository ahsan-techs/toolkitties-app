import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LocaleHeader from "@/components/i18n/LocaleHeader";
import LocaleFooter from "@/components/i18n/LocaleFooter";
import ToolWorkspace from "@/components/ToolWorkspace";
import { findTool } from "@/lib/tools-data";
import { locales, localeLabels, type Locale } from "@/lib/i18n/config";
import { toolTranslations, findToolByLocalizedSlug } from "@/lib/i18n/tool-translations";
import { uiStrings, kindTemplates } from "@/lib/i18n/ui-translations";

// Every localized [locale] route folder (app/es/[slug], app/pt/[slug], ...)
// is a thin wrapper around this shared component/logic, with its own
// `locale` hardcoded — this sidesteps Next's "dynamic segments at the same
// route position must share one param name" restriction versus a single
// app/[locale]/[slug] route, which collides with the existing app/[slug].


const OG_LOCALE: Record<string, string> = { es: "es_ES", pt: "pt_BR", de: "de_DE", fr: "fr_FR", hi: "hi_IN", id: "id_ID", ja: "ja_JP", ar: "ar_AR" };

export function getToolStaticParams(locale: Locale): { slug: string }[] {
  const params: { slug: string }[] = [];
  for (const [baseSlug, byLocale] of Object.entries(toolTranslations)) {
    const found = findTool(baseSlug);
    if (!found || !found.tool.functional) continue; // only functional tools get a working localized page
    const localized = byLocale[locale];
    if (localized) params.push({ slug: localized.slug });
  }
  return params;
}

function resolve(locale: Locale, slug: string) {
  const baseSlug = findToolByLocalizedSlug(locale, slug);
  if (!baseSlug) return null;
  const found = findTool(baseSlug);
  if (!found || !found.tool.functional) return null;
  const translated = toolTranslations[baseSlug]?.[locale];
  if (!translated) return null;
  return { baseSlug, tool: found.tool, group: found.group, translated };
}

export function getToolMetadata(locale: Locale, slug: string): Metadata {
  const r = resolve(locale, slug);
  if (!r) return {};
  const { translated } = r;
  const url = `https://toolkitties.com/${locale}/${translated.slug}`;

  const languageAlternates: Record<string, string> = {
    "x-default": `https://toolkitties.com/${r.baseSlug}`,
    en: `https://toolkitties.com/${r.baseSlug}`,
  };
  for (const l of locales) {
    const t = toolTranslations[r.baseSlug]?.[l];
    if (t) languageAlternates[l] = `https://toolkitties.com/${l}/${t.slug}`;
  }

  return {
    title: `${translated.name} | Toolkitties`,
    description: kindTemplates[locale].privacy(translated.name).slice(0, 155),
    alternates: { canonical: url, languages: languageAlternates },
    openGraph: { title: `${translated.name} | Toolkitties`, url, siteName: "Toolkitties", type: "website", locale: OG_LOCALE[locale] },
  };
}

export default function TranslatedToolPage({ locale, slug }: { locale: Locale; slug: string }) {
  const r = resolve(locale, slug);
  if (!r) notFound();
  const { baseSlug, tool, group, translated } = r;
  const t = uiStrings[locale];
  const kt = kindTemplates[locale];
  const dir = localeLabels[locale].dir;

  const howTo = kt.howTo(translated.name);
  const benefits = kt.benefits();
  const faqs = kt.faqs(translated.name);
  const privacyNote = kt.privacy(translated.name);

  const localizedHrefs: Partial<Record<Locale, string>> = {};
  for (const l of locales) {
    const tr = toolTranslations[baseSlug]?.[l];
    if (tr) localizedHrefs[l] = `/${l}/${tr.slug}`;
  }

  const siblingTools = group.tools.filter((x) => x.slug !== tool.slug && x.functional).slice(0, 4);

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: translated.name,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (runs in browser)",
    inLanguage: locale,
    url: `https://toolkitties.com/${locale}/${translated.slug}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <LocaleHeader locale={locale} englishHref={`/${baseSlug}`} localizedHrefs={localizedHrefs} />
      <main className="container-content py-10 md:py-14" dir={dir}>
        <nav className="mb-6 text-sm text-slate">
          <Link href={`/${locale}`} className="hover:text-moss">{t.home}</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{translated.name}</span>
        </nav>

        <div className="mx-auto max-w-2xl text-center">
          <span className="text-4xl">{tool.icon}</span>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">{translated.name}</h1>
        </div>

        <div className="mx-auto mt-10 max-w-2xl">
          <ToolWorkspace tool={tool} />
        </div>

        <section className="mx-auto mt-16 max-w-2xl">
          <h2 className="font-display text-xl font-semibold text-ink">{t.howToUseTitle(translated.name)}</h2>
          <ol className="mt-5 flex flex-col gap-4">
            {howTo.map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">{i + 1}</span>
                <p className="text-sm text-ink/85">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto mt-14 max-w-2xl">
          <h2 className="font-display text-xl font-semibold text-ink">{t.whyUseTitle(translated.name)}</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-2 rounded-xl border border-ink/10 bg-white p-4 text-sm text-ink/85">
                <span className="text-moss">✓</span>
                {b}
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto mt-14 max-w-2xl rounded-2xl border border-ink/10 bg-sand/40 p-6">
          <h2 className="font-display text-lg font-semibold text-ink">{t.privacyTitle(translated.name)}</h2>
          <p className="mt-3 text-sm text-ink/80">{privacyNote}</p>
        </section>

        <section className="mx-auto mt-14 max-w-2xl">
          <h2 className="font-display text-xl font-semibold text-ink">{t.faqTitle}</h2>
          <div className="mt-5 flex flex-col divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
            {faqs.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="cursor-pointer list-none text-sm font-semibold text-ink">{f.q}</summary>
                <p className="mt-2 text-sm text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {siblingTools.length > 0 && (
          <div className="mx-auto mt-16 max-w-2xl">
            <h2 className="font-display text-lg font-semibold text-ink">{t.moreIn(group.title)}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {siblingTools.map((s) => {
                const st = toolTranslations[s.slug]?.[locale];
                if (!st) return null;
                return (
                  <Link key={s.slug} href={`/${locale}/${st.slug}`} className="flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink hover:border-moss/40">
                    <span>{s.icon}</span>
                    {st.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <LocaleFooter locale={locale} />
    </>
  );
}
