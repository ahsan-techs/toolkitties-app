import type { Metadata } from "next";
import TranslatedToolPage, { getToolMetadata, getToolStaticParams } from "@/components/i18n/TranslatedToolPage";

export function generateStaticParams() {
  return getToolStaticParams("hi");
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return getToolMetadata("hi", params.slug);
}

export default function Page({ params }: { params: { slug: string } }) {
  return <TranslatedToolPage locale="hi" slug={params.slug} />;
}
