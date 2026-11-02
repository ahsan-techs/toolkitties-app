import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/motion/Reveal";
import RevealWords from "@/components/motion/RevealWords";
import DeviceCard from "@/components/apps/DeviceCard";
import InstallPanel from "@/components/apps/InstallPanel";
import { SITE_URL } from "@/lib/site-config";

const url = `${SITE_URL}/apps`;
const title = "Get Toolkitties on Any Device — Desktop, Android, iPhone & iPad | Toolkitties";
const description = "Install Toolkitties as a free app on your desktop, laptop, Android phone, iPhone or iPad. No app store, no download, no signup — just a faster way to open it.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: "Toolkitties", type: "website", images: [{ url: "/og/home.png", width: 1200, height: 630, alt: title }] },
};

const devices = [
  { href: "/apps/desktop", icon: "💻", title: "Desktop & Laptop", text: "Windows, Mac, Linux or Chromebook — pin it to your taskbar or dock." },
  { href: "/apps/android", icon: "🤖", title: "Android", text: "Add it to your home screen from Chrome in a couple of taps." },
  { href: "/apps/ios", icon: "🍏", title: "iPhone & iPad", text: "Add it to your home screen from Safari’s Share menu." },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is there a Toolkitties app in the App Store or Play Store?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No — Toolkitties doesn’t have a listing in any app store. It’s installed directly from your browser as a Progressive Web App, which works the same way (its own icon, its own window) without needing a download from a store.",
      },
    },
    {
      "@type": "Question",
      name: "Does installing Toolkitties cost anything?",
      acceptedAnswer: { "@type": "Answer", text: "No. Installing is free, just like using any tool on the site." },
    },
  ],
};

export default function Page() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="container-content py-14 md:py-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <header className="mx-auto max-w-3xl text-center">
          <p className="mx-auto inline-block rounded-full border border-moss/20 bg-white/60 px-4 py-1.5 text-sm font-medium text-moss">
            Works on everything
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink md:text-6xl">
            <RevealWords text="Get Toolkitties on any device." triggerOn="mount" className="inline" />
          </h1>
          <p className="mt-5 text-base text-slate md:text-lg">
            One free, installable web app — no app store, no download, no signup. Pick your device below for the exact steps.
          </p>
        </header>

        <section className="mx-auto mt-14 grid max-w-5xl gap-6 md:grid-cols-3" aria-label="Choose your device">
          {devices.map((d, i) => (
            <Reveal key={d.href} delay={i * 0.08} y={20}>
              <DeviceCard {...d} />
            </Reveal>
          ))}
        </section>

        <Reveal className="mx-auto mt-20 max-w-3xl rounded-3xl border border-ink/10 bg-white/60 p-6 md:p-10">
          <h2 className="text-center font-display text-2xl font-semibold text-ink md:text-3xl">Already on your phone? Scan this.</h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-slate">
            Point your camera at the code below to open Toolkitties on whatever device you’re holding right now.
          </p>
          <div className="mt-8">
            <InstallPanel platform="android" />
          </div>
        </Reveal>

        <Reveal className="mx-auto mt-16 max-w-2xl text-center">
          <h2 className="font-display text-xl font-semibold text-ink">Why install at all?</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate">
            Installing doesn’t unlock anything the website doesn’t already have — every tool works exactly the same either way. It just
            gives you a real icon to tap, a full-screen window with no browser bar in the way, and pages you’ve already opened keep working
            without a connection. If you’d rather just bookmark the page, that works perfectly too.
          </p>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
