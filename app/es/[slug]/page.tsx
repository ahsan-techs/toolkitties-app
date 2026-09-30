import type { Metadata } from "next";
import TranslatedToolPage, { getToolMetadata, getToolStaticParams } from "@/components/i18n/TranslatedToolPage";

export function generateStaticParams() {
  return getToolStaticParams("es");
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return getToolMetadata("es", params.slug);
}

export default function Page({ params }: { params: { slug: string } }) {
  return <TranslatedToolPage locale="es" slug={params.slug} />;
}
