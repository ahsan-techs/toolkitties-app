import type { Metadata } from "next";
import TranslatedToolPage, { getToolMetadata, getToolStaticParams } from "@/components/i18n/TranslatedToolPage";

export function generateStaticParams() {
  return getToolStaticParams("ar");
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return getToolMetadata("ar", params.slug);
}

export default function Page({ params }: { params: { slug: string } }) {
  return <TranslatedToolPage locale="ar" slug={params.slug} />;
}
