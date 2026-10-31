import type { Metadata, Viewport } from "next";
import "../globals.css";
import LocaleRootLayout from "@/components/i18n/LocaleRootLayout";

export const metadata: Metadata = {
  metadataBase: new URL("https://toolkitties.com"),
};

export const viewport: Viewport = {
  themeColor: "#F5F6F3",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <LocaleRootLayout locale="ja">{children}</LocaleRootLayout>;
}
