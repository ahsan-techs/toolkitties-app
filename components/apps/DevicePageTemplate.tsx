import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/motion/Reveal";
import InstallPanel from "@/components/apps/InstallPanel";

const benefits = [
  { icon: "⚡", title: "Opens instantly", text: "Launches straight from your home screen or app list — no browser chrome, no typing the address." },
  { icon: "📶", title: "Works when you’re offline", text: "Pages you’ve already opened stay available even with no connection, so a half-finished task isn’t stuck waiting on Wi-Fi." },
  { icon: "🔒", title: "Nothing extra to trust", text: "It’s the same Toolkitties running in your browser’s engine — no separate app binary, no app-store account, no extra permissions to grant." },
];

export default function DevicePageTemplate({
  platform,
  icon,
  title,
  blurb,
  browserNote,
}: {
  platform: "desktop" | "android" | "ios";
  icon: string;
  title: string;
  blurb: string;
  browserNote: string;
}) {
  return (
    <>
      <Navbar />
      <main id="main-content" className="container-content py-14 md:py-20">
        <Reveal eager className="mx-auto max-w-3xl text-center">
          <span className="text-5xl">{icon}</span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-ink md:text-5xl">{title}</h1>
          <p className="mt-4 text-base text-slate md:text-lg">{blurb}</p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl rounded-3xl border border-ink/10 bg-white/60 p-6 md:p-10">
          <InstallPanel platform={platform} />
          <p className="mt-6 text-center text-xs text-slate">{browserNote}</p>
        </Reveal>

        <section className="mx-auto mt-16 max-w-3xl" aria-labelledby="why-install">
          <h2 id="why-install" className="text-center font-display text-2xl font-semibold text-ink md:text-3xl">
            Why install instead of just bookmarking it?
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.08} y={20}>
                <div className="h-full rounded-2xl border border-ink/10 bg-white/70 p-6">
                  <span className="text-2xl">{b.icon}</span>
                  <h3 className="mt-3 font-display text-base font-semibold text-ink">{b.title}</h3>
                  <p className="mt-2 text-sm text-slate">{b.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Reveal className="mx-auto mt-16 max-w-3xl text-center">
          <p className="text-sm text-slate">
            There’s no separate app-store listing — installing just saves this same site to run like an app, in seconds, for free.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link href="/apps" className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink hover:border-moss/40">
              See every device
            </Link>
            <Link href="/all-tools" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-ink/85">
              Browse all tools
            </Link>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
