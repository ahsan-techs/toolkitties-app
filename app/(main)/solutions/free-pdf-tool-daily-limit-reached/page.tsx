import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site-config";

const url = `${SITE_URL}/solutions/free-pdf-tool-daily-limit-reached`;
const title = "Hit a Daily Limit on a Free PDF Tool? Here's What to Do | Toolkitties";
const description = "Most free PDF tools cap how many tasks you can run per day. Toolkitties has no daily limit, because it processes files in your browser instead of on a server.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: "Toolkitties", type: "website", images: [{ url: "/og/home.png", width: 1200, height: 630, alt: title }] },
};

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Why do free PDF tools limit tasks per day?",
        acceptedAnswer: { "@type": "Answer", text: "Server-based PDF tools pay for the compute used to process each file, so free plans typically cap the number of tasks per day to control that cost — the limit resets daily until you upgrade to a paid plan." },
      },
      {
        "@type": "Question",
        name: "Does Toolkitties have a daily limit?",
        acceptedAnswer: { "@type": "Answer", text: "No. Every tool processes files in your own browser, so there's no per-task server cost to ration, and no daily cap." },
      },
    ],
  };

  return (
    <>
      <Navbar />
      <main className="container-content py-14 md:py-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <header className="max-w-3xl">
          <p className="inline-block rounded-full border border-moss/20 bg-white/60 px-4 py-1.5 text-sm font-medium text-moss">Fix it</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Daily limit reached? Switch to a tool that doesn&apos;t have one.
          </h1>
          <p className="mt-4 text-base text-slate md:text-lg">
            Free plans on server-based PDF tools typically cap how many tasks you can run per day. If you&apos;re in the middle of a
            batch of files and just got blocked, Toolkitties is a free alternative with no daily limit at all.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/all-tools" className="rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white hover:bg-moss/90">Keep working, no limit →</Link>
            <Link href="/merge-pdf" className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink hover:border-moss/40">Try Merge PDF</Link>
          </div>
        </header>

        <section className="mt-14 max-w-3xl" aria-labelledby="why">
          <h2 id="why" className="font-display text-2xl font-semibold text-ink">Why the limit exists in the first place</h2>
          <p className="mt-3 text-base leading-7 text-slate">
            When a PDF tool processes your file on its own servers, each task costs that company real compute and bandwidth — a daily cap
            on the free tier is how they keep that cost bounded while still offering something for free. It's a reasonable business
            model, but it means a batch job (clearing out a folder of scans, prepping a stack of contracts) can run straight into the
            wall partway through.
          </p>
          <p className="mt-3 text-base leading-7 text-slate">
            Toolkitties removes the cost the limit exists to manage: every tool processes your file inside your own browser, using your
            device's own processing power. There's no server task being metered, so there's nothing to cap.
          </p>
        </section>

        <section className="mt-14 max-w-3xl" aria-labelledby="tools">
          <h2 id="tools" className="font-display text-2xl font-semibold text-ink">Pick up where you left off</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { slug: "merge-pdf", name: "Merge PDF", icon: "🔗" },
              { slug: "compress-pdf", name: "Compress PDF", icon: "📉" },
              { slug: "split-pdf", name: "Split PDF", icon: "✂️" },
              { slug: "pdf-to-word", name: "PDF to Word", icon: "📝" },
            ].map((t) => (
              <Link key={t.slug} href={`/${t.slug}`} className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur hover:border-moss/40">
                <span className="text-2xl" aria-hidden="true">{t.icon}</span>
                <span className="font-display text-base font-semibold text-ink">{t.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 max-w-3xl rounded-3xl bg-ink p-8 text-paper" aria-labelledby="start">
          <h2 id="start" className="font-display text-2xl font-semibold">No cap, no countdown</h2>
          <p className="mt-3 text-base leading-7 text-paper/80">Finish the batch you were working on.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/all-tools" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink hover:bg-[#d99a3f]">Browse all tools →</Link>
            <Link href="/smallpdf-alternative-free" className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-paper hover:bg-white/10">Compare to Smallpdf</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
