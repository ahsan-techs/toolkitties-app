import type { Metadata } from "next";
import TranslatedHomePage, { getHomeMetadata } from "@/components/i18n/TranslatedHomePage";

export function generateMetadata(): Metadata {
  return getHomeMetadata("ar");
}

export default function Page() {
  return <TranslatedHomePage locale="ar" />;
}
