import type { Locale } from "@/lib/i18n/config";
import { localeLabels } from "@/lib/i18n/config";
import MotionRoot from "@/components/motion/MotionRoot";

// Each language folder (app/es, app/ar, ...) is its own root layout so the
// <html> tag carries the correct lang and dir. Crawlers, browsers, and screen
// readers all use these to know what language a page is actually in.
export default function LocaleRootLayout({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={locale} dir={localeLabels[locale].dir}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="font-body antialiased">
        <MotionRoot>{children}</MotionRoot>
      </body>
    </html>
  );
}
