import Link from "next/link";
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

          <div className="group relative">
            <button className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink/80 hover:bg-sand">
              {localeLabels[locale].native} ▾
            </button>
            <div className="invisible absolute right-0 top-full mt-1 flex w-44 flex-col rounded-xl border border-ink/10 bg-white py-1 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
              <Link href={englishHref} className="px-4 py-2 text-sm text-ink/80 hover:bg-sand">
                🇬🇧 English
              </Link>
              {locales.map((l) => {
                const href = localizedHrefs[l];
                if (!href) return null;
                return (
                  <Link key={l} href={href} className={`px-4 py-2 text-sm hover:bg-sand ${l === locale ? "font-semibold text-moss" : "text-ink/80"}`}>
                    {localeLabels[l].native}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
