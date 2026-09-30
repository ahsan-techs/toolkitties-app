import type { Metadata } from "next";
import TranslatedHomePage, { getHomeMetadata } from "@/components/i18n/TranslatedHomePage";

export function generateMetadata(): Metadata {
  return getHomeMetadata("fr");
}

export default function Page() {
  return <TranslatedHomePage locale="fr" />;
}
