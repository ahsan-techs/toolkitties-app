import type { Metadata } from "next";
import DevicePageTemplate from "@/components/apps/DevicePageTemplate";
import { SITE_URL } from "@/lib/site-config";

const url = `${SITE_URL}/apps/android`;
const title = "Install the Toolkitties App on Android | Toolkitties";
const description = "Add Toolkitties to your Android home screen in one tap — a free installable web app with every PDF, image and text tool, no Play Store download needed.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: "Toolkitties", type: "website", images: [{ url: "/og/home.png", width: 1200, height: 630, alt: title }] },
};

export default function Page() {
  return (
    <DevicePageTemplate
      platform="android"
      icon="🤖"
      title="Toolkitties for Android"
      blurb="There’s no listing in the Play Store — Toolkitties installs straight from Chrome instead, as a real app icon on your home screen, in a couple of taps."
      browserNote="Works in Chrome for Android, and most Chromium-based Android browsers. If you don’t see an install prompt, open the browser menu (⋮) and look for Add to Home screen or Install app."
    />
  );
}
