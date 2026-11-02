import type { Metadata } from "next";
import DevicePageTemplate from "@/components/apps/DevicePageTemplate";
import { SITE_URL } from "@/lib/site-config";

const url = `${SITE_URL}/apps/ios`;
const title = "Install the Toolkitties App on iPhone & iPad | Toolkitties";
const description = "Add Toolkitties to your iPhone or iPad home screen using Safari’s Add to Home Screen — a free installable web app, no App Store download needed.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: "Toolkitties", type: "website", images: [{ url: "/og/home.png", width: 1200, height: 630, alt: title }] },
};

export default function Page() {
  return (
    <DevicePageTemplate
      platform="ios"
      icon="🍏"
      title="Toolkitties for iPhone & iPad"
      blurb="There’s no listing in the App Store — Apple reserves the automatic install prompt for Chromium browsers, so on iOS you add it yourself from Safari’s Share menu. It takes about ten seconds."
      browserNote="This only works in Safari — Chrome, Firefox and other browsers on iOS can’t add apps to your home screen, even though they can all open toolkitties.com fine."
    />
  );
}
