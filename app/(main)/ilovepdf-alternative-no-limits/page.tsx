import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site-config";

const url = `${SITE_URL}/ilovepdf-alternative-no-limits`;
const title = "iLovePDF Alternative With No Daily Limits, Free | Toolkitties";
const description = "Hit iLovePDF's daily task limit? Toolkitties merges, compresses and edits PDFs with no daily cap, no upload, and no ads — free.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: "Toolkitties", type: "website", images: [{ url: "/og/home.png", width: 1200, height: 630, alt: title }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og/home.png"] },
};

const tools = [
  { slug: "merge-pdf", name: "Merge PDF", icon: "🔗" },
  { slug: "compress-pdf", name: "Compress PDF", icon: "📉" },
  { slug: "split-pdf", name: "Split PDF", icon: "✂️" },
  { slug: "esign-pdf", name: "eSign PDF", icon: "✍️" },
  { slug: "protect-pdf", name: "Protect PDF", icon: "🔒" },
  { slug: "pdf-to-word", name: "PDF to Word", icon: "📝" },
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is Toolkitties really free, with no daily limit?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Every tool runs in your browser instead of on a server, so there's no per-task cost for us to ration — which is why there's no daily cap." },
      },
      {
        "@type": "Question",
        name: "Does Toolkitties upload my PDF anywhere?",
        acceptedAnswer: { "@type": "Answer", text: "No. Files are processed entirely in your browser's memory and never sent to a server — you can verify this yourself in your browser's Network tab." },
      },
    ],
  };

  return (
    <>
      <Navbar />
      <main className="container-content py-14 md:py-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <header className="max-w-3xl">
          <p className="inline-block rounded-full border border-moss/20 bg-white/60 px-4 py-1.5 text-sm font-medium text-moss">iLovePDF alternative</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Hit iLovePDF&apos;s daily limit? Switch to a PDF tool with none.
          </h1>
          <p className="mt-4 text-base text-slate md:text-lg">
            Toolkitties merges, compresses, splits, signs and protects PDFs — free, with no daily task limit, no ads, and no upload to a
            server. It runs entirely in your browser.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/merge-pdf" className="rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white hover:bg-moss/90">Try Merge PDF free →</Link>
            <Link href="/all-tools" className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink hover:border-moss/40">See all 67 tools</Link>
          </div>
        </header>

        <section className="mt-14" aria-labelledby="compare">
          <h2 id="compare" className="font-display text-2xl font-semibold text-ink">Toolkitties vs iLovePDF&apos;s free plan</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/10">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-sand/50 text-ink">
                <tr>
                  <th className="px-4 py-3 font-semibold"></th>
                  <th className="px-4 py-3 font-semibold">Toolkitties</th>
                  <th className="px-4 py-3 font-semibold">iLovePDF (Free)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10 bg-white">
                <tr><td className="px-4 py-3 text-slate">Daily task limit</td><td className="px-4 py-3 font-medium text-ink">None</td><td className="px-4 py-3 text-slate">Limited, varies by task</td></tr>
                <tr><td className="px-4 py-3 text-slate">File uploaded to a server</td><td className="px-4 py-3 font-medium text-ink">No — processed in your browser</td><td className="px-4 py-3 text-slate">Yes</td></tr>
                <tr><td className="px-4 py-3 text-slate">Account required</td><td className="px-4 py-3 font-medium text-ink">No</td><td className="px-4 py-3 text-slate">No, for basic tools</td></tr>
                <tr><td className="px-4 py-3 text-slate">Ads</td><td className="px-4 py-3 font-medium text-ink">No</td><td className="px-4 py-3 text-slate">Yes</td></tr>
                <tr><td className="px-4 py-3 text-slate">Price for unlimited use</td><td className="px-4 py-3 font-medium text-ink">Free</td><td className="px-4 py-3 text-slate">From $5/month</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate">Competitor details based on iLovePDF&apos;s published pricing as of October 2026 and may change.</p>
        </section>

        <section className="mt-14" aria-labelledby="tools">
          <h2 id="tools" className="font-display text-2xl font-semibold text-ink">Popular PDF tools, ready to use</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {tools.map((t) => (
              <Link key={t.slug} href={`/${t.slug}`} className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur hover:border-moss/40">
                <span className="text-2xl" aria-hidden="true">{t.icon}</span>
                <span className="font-display text-base font-semibold text-ink">{t.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 max-w-3xl" aria-labelledby="why">
          <h2 id="why" className="font-display text-2xl font-semibold text-ink">Why there&apos;s no limit to hit</h2>
          <p className="mt-3 text-base leading-7 text-slate">
            Server-based tools like iLovePDF process your file on their infrastructure, which costs them money per task — daily limits exist
            to manage that cost on the free tier. Toolkitties processes your file in your own browser's memory using your device&apos;s own
            processing power, so there's no per-task server cost to ration in the first place.
          </p>
          <p className="mt-3 text-base leading-7 text-slate">
            Read more in <Link href="/blog/toolkitties-vs-ilovepdf-vs-smallpdf" className="bl-link">our full comparison</Link> or{" "}
            <Link href="/blog/pdf-tools-without-uploading-your-file" className="bl-link">how to check for yourself</Link> that nothing is uploaded.
          </p>
        </section>

        <section className="mt-14 max-w-3xl rounded-3xl bg-ink p-8 text-paper" aria-labelledby="start">
          <h2 id="start" className="font-display text-2xl font-semibold">Start without limits</h2>
          <p className="mt-3 text-base leading-7 text-paper/80">No signup, no daily cap, no catch. Pick a tool and go.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/merge-pdf" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink hover:bg-[#d99a3f]">Merge a PDF now →</Link>
            <Link href="/all-tools" className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-paper hover:bg-white/10">Browse all tools</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
