import type { Metadata } from "next";
import TranslatedToolPage, { getToolMetadata, getToolStaticParams } from "@/components/i18n/TranslatedToolPage";

export function generateStaticParams() {
  return getToolStaticParams("fr");
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return getToolMetadata("fr", params.slug);
}

export default function Page({ params }: { params: { slug: string } }) {
  return <TranslatedToolPage locale="fr" slug={params.slug} />;
}
