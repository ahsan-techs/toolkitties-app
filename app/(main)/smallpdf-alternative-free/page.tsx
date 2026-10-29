import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site-config";

const url = `${SITE_URL}/smallpdf-alternative-free`;
const title = "Smallpdf Alternative That's Actually Free, No Limit | Toolkitties";
const description = "Smallpdf's free plan caps you at 2 tasks a day. Toolkitties has no daily limit, no upload, and no account — compress, convert and edit PDFs free.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: "Toolkitties", type: "website", images: [{ url: "/og/home.png", width: 1200, height: 630, alt: title }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og/home.png"] },
};

const tools = [
  { slug: "compress-pdf", name: "Compress PDF", icon: "📉" },
  { slug: "pdf-to-jpg", name: "PDF to JPG", icon: "🖼️" },
  { slug: "pdf-to-word", name: "PDF to Word", icon: "📝" },
  { slug: "esign-pdf", name: "eSign PDF", icon: "✍️" },
  { slug: "pdf-to-excel", name: "PDF to Excel", icon: "📥" },
  { slug: "pdf-ocr", name: "PDF OCR", icon: "🔎" },
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many PDFs can I compress per day on Toolkitties?",
        acceptedAnswer: { "@type": "Answer", text: "As many as you need — there's no daily limit, because compression happens in your browser instead of on a server." },
      },
      {
        "@type": "Question",
        name: "Why does Smallpdf limit free users to 2 tasks a day?",
        acceptedAnswer: { "@type": "Answer", text: "Smallpdf processes files on its own servers, which costs money per task — the 2-task daily cap is how the free tier manages that cost. Toolkitties avoids this by processing files in your browser instead." },
      },
    ],
  };

  return (
    <>
      <Navbar />
      <main className="container-content py-14 md:py-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <header className="max-w-3xl">
          <p className="inline-block rounded-full border border-moss/20 bg-white/60 px-4 py-1.5 text-sm font-medium text-moss">Smallpdf alternative</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            2 tasks a day isn&apos;t enough? Here&apos;s a PDF tool with no cap.
          </h1>
          <p className="mt-4 text-base text-slate md:text-lg">
            Smallpdf&apos;s free plan limits you to 2 tasks a day. Toolkitties has no daily limit, no file upload, and no account —
            compress, convert, sign and edit PDFs as many times as you need, free.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/compress-pdf" className="rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white hover:bg-moss/90">Compress a PDF free →</Link>
            <Link href="/all-tools" className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink hover:border-moss/40">See all 67 tools</Link>
          </div>
        </header>

        <section className="mt-14" aria-labelledby="compare">
          <h2 id="compare" className="font-display text-2xl font-semibold text-ink">Toolkitties vs Smallpdf&apos;s free plan</h2>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/10">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead className="bg-sand/50 text-ink">
                <tr>
                  <th className="px-4 py-3 font-semibold"></th>
                  <th className="px-4 py-3 font-semibold">Toolkitties</th>
                  <th className="px-4 py-3 font-semibold">Smallpdf (Free)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/10 bg-white">
                <tr><td className="px-4 py-3 text-slate">Tasks per day</td><td className="px-4 py-3 font-medium text-ink">No limit</td><td className="px-4 py-3 text-slate">2</td></tr>
                <tr><td className="px-4 py-3 text-slate">File uploaded to a server</td><td className="px-4 py-3 font-medium text-ink">No — processed in your browser</td><td className="px-4 py-3 text-slate">Yes</td></tr>
                <tr><td className="px-4 py-3 text-slate">Account required</td><td className="px-4 py-3 font-medium text-ink">No</td><td className="px-4 py-3 text-slate">No, for basic tools</td></tr>
                <tr><td className="px-4 py-3 text-slate">Price for unlimited use</td><td className="px-4 py-3 font-medium text-ink">Free</td><td className="px-4 py-3 text-slate">From $10–12/month</td></tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate">Competitor details based on Smallpdf&apos;s published pricing as of October 2026 and may change.</p>
        </section>

        <section className="mt-14" aria-labelledby="tools">
          <h2 id="tools" className="font-display text-2xl font-semibold text-ink">Tools people hit the Smallpdf limit on most</h2>
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
          <h2 id="why" className="font-display text-2xl font-semibold text-ink">Why Toolkitties doesn&apos;t need a daily cap</h2>
          <p className="mt-3 text-base leading-7 text-slate">
            Smallpdf's 2-a-day limit on the free plan exists because every task runs on Smallpdf's own servers, which costs them money.
            Toolkitties sidesteps that entirely — pdf-lib and pdf.js run as JavaScript inside the page you already have open, so your file
            never leaves your browser and there's no per-task server cost to limit.
          </p>
          <p className="mt-3 text-base leading-7 text-slate">
            See the full breakdown in <Link href="/blog/toolkitties-vs-ilovepdf-vs-smallpdf" className="bl-link">our comparison guide</Link>,
            or read about <Link href="/blog/free-pdf-compressor-no-daily-limit" className="bl-link">compressing PDFs with no daily limit</Link>.
          </p>
        </section>

        <section className="mt-14 max-w-3xl rounded-3xl bg-ink p-8 text-paper" aria-labelledby="start">
          <h2 id="start" className="font-display text-2xl font-semibold">No limit, no signup</h2>
          <p className="mt-3 text-base leading-7 text-paper/80">Pick up where Smallpdf&apos;s free plan stops you.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/compress-pdf" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink hover:bg-[#d99a3f]">Compress a PDF now →</Link>
            <Link href="/all-tools" className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-paper hover:bg-white/10">Browse all tools</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
