import type { Metadata } from "next";
import "../globals.css";
import LocaleRootLayout from "@/components/i18n/LocaleRootLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://toolkitties.com"),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LocaleRootLayout locale="de">{children}</LocaleRootLayout>;
}
