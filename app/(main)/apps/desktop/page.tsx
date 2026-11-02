import type { Metadata } from "next";
import DevicePageTemplate from "@/components/apps/DevicePageTemplate";
import { SITE_URL } from "@/lib/site-config";

const url = `${SITE_URL}/apps/desktop`;
const title = "Install Toolkitties on Desktop & Laptop (Windows, Mac, Linux) | Toolkitties";
const description = "Install Toolkitties as a desktop app on Windows, Mac, Linux or Chromebook — one click in Chrome or Edge, free, no download from anywhere else needed.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: "Toolkitties", type: "website", images: [{ url: "/og/home.png", width: 1200, height: 630, alt: title }] },
};

export default function Page() {
  return (
    <DevicePageTemplate
      platform="desktop"
      icon="💻"
      title="Toolkitties for Desktop & Laptop"
      blurb="Windows, Mac, Linux or Chromebook — install Toolkitties as its own app window, pinned to your taskbar or dock, in one click."
      browserNote="Works in Chrome, Edge, and most Chromium-based browsers. Firefox and Safari on desktop don’t yet support app installs — toolkitties.com still works perfectly as a regular tab there."
    />
  );
}
