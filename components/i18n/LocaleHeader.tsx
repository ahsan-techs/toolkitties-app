import Link from "next/link";
import LanguageMenu from "@/components/i18n/LanguageMenu";
import { locales, localeLabels, type Locale } from "@/lib/i18n/config";
import { uiStrings } from "@/lib/i18n/ui-translations";

export default function LocaleHeader({
  locale,
  englishHref,
  localizedHrefs,
}: {
  locale: Locale;
  englishHref: string; // where "English" in the switcher should point
  localizedHrefs: Partial<Record<Locale, string>>; // where each other locale's version of this page lives
}) {
  const t = uiStrings[locale];
  const dir = localeLabels[locale].dir;

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur" dir={dir}>
      <div className="container-content flex h-16 items-center justify-between gap-4">
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect x="2" y="2" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
            <rect x="15" y="2" width="9" height="9" rx="2" fill="#1F5C4C" />
            <rect x="2" y="15" width="9" height="9" rx="2" fill="#C7862B" />
            <rect x="15" y="15" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
          </svg>
          <span className="font-display text-lg font-semibold tracking-tight">Toolkitties</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-moss/10 px-3 py-1.5 text-xs font-semibold text-moss md:inline-block">{t.badge}</span>

          <LanguageMenu
            current={localeLabels[locale].native}
            items={[
              { href: englishHref, label: "🇬🇧 English" },
              ...locales.flatMap((l) => (localizedHrefs[l] ? [{ href: localizedHrefs[l] as string, label: localeLabels[l].native, active: l === locale }] : [])),
            ]}
          />
        </div>
      </div>
    </header>
  );
}
