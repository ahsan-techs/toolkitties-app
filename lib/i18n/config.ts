export const locales = ["es", "pt", "de", "fr", "hi", "id", "ja", "ar"] as const;
export type Locale = (typeof locales)[number];

export const localeLabels: Record<Locale, { native: string; english: string; dir: "ltr" | "rtl" }> = {
  es: { native: "Español", english: "Spanish", dir: "ltr" },
  pt: { native: "Português", english: "Portuguese", dir: "ltr" },
  de: { native: "Deutsch", english: "German", dir: "ltr" },
  fr: { native: "Français", english: "French", dir: "ltr" },
  hi: { native: "हिन्दी", english: "Hindi", dir: "ltr" },
  id: { native: "Bahasa Indonesia", english: "Indonesian", dir: "ltr" },
  ja: { native: "日本語", english: "Japanese", dir: "ltr" },
  ar: { native: "العربية", english: "Arabic", dir: "rtl" },
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
