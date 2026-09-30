import { localeLabels, type Locale } from "@/lib/i18n/config";
import { uiStrings } from "@/lib/i18n/ui-translations";

export default function LocaleFooter({ locale }: { locale: Locale }) {
  const t = uiStrings[locale];
  const dir = localeLabels[locale].dir;

  return (
    <footer className="border-t border-ink/10 bg-white py-10" dir={dir}>
      <div className="container-content flex flex-col items-center gap-2 text-center">
        <span className="font-display text-base font-semibold">Toolkitties</span>
        <p className="max-w-md text-sm text-slate">{t.footerTagline}</p>
        <p className="mt-4 text-xs text-slate">© {new Date().getFullYear()} Toolkitties. {t.footerCopyright}</p>
      </div>
    </footer>
  );
}
