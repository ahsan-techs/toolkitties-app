import type { Metadata } from "next";
import TranslatedHomePage, { getHomeMetadata } from "@/components/i18n/TranslatedHomePage";

export function generateMetadata(): Metadata {
  return getHomeMetadata("hi");
}

export default function Page() {
  return <TranslatedHomePage locale="hi" />;
}
