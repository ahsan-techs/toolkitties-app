import type { Metadata } from "next";
import TranslatedToolPage, { getToolMetadata, getToolStaticParams } from "@/components/i18n/TranslatedToolPage";

export function generateStaticParams() {
  return getToolStaticParams("pt");
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return getToolMetadata("pt", params.slug);
}

export default function Page({ params }: { params: { slug: string } }) {
  return <TranslatedToolPage locale="pt" slug={params.slug} />;
}
