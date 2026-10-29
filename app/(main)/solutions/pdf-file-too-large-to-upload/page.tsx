import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site-config";

const url = `${SITE_URL}/solutions/pdf-file-too-large-to-upload`;
const title = "PDF File Too Large to Upload? Here's a Fix | Toolkitties";
const description = "Many free PDF tools reject or time out on large files because they have to upload it first. Toolkitties compresses PDFs in your browser, with no upload and no size limit beyond your own device's memory.";

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
        name: "Why do large PDFs fail to upload on some free tools?",
        acceptedAnswer: { "@type": "Answer", text: "Most free online PDF tools process your file on their own server, which means it has to be uploaded first — large files can hit a size cap, a slow connection can time out, or the free tier simply limits file size to control server costs." },
      },
      {
        "@type": "Question",
        name: "Is there a file size limit on Toolkitties?",
        acceptedAnswer: { "@type": "Answer", text: "No fixed limit — since the file is processed in your browser instead of being uploaded, the practical limit is your own device's available memory rather than a number set by a server." },
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
            PDF file too large to upload? Skip the upload entirely.
          </h1>
          <p className="mt-4 text-base text-slate md:text-lg">
            Most free PDF tools have to upload your file to their server before they can do anything with it — which is exactly where a
            large file hits a size cap or times out on a slow connection. Toolkitties works differently: it processes the file inside
            your own browser, so there&apos;s no upload step to fail in the first place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/compress-pdf" className="rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white hover:bg-moss/90">Compress your large PDF free →</Link>
            <Link href="/all-tools" className="rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink hover:border-moss/40">See all tools</Link>
          </div>
        </header>

        <section className="mt-14 max-w-3xl" aria-labelledby="why">
          <h2 id="why" className="font-display text-2xl font-semibold text-ink">Why this happens</h2>
          <p className="mt-3 text-base leading-7 text-slate">
            A server-based tool has to receive your whole file before it can start working — for a 150MB scan or report, that upload
            itself can take a while, and many free tiers cap file size specifically to limit how much server storage and bandwidth they
            spend on free users. If the upload stalls or the file exceeds the cap, you get an error with no real way around it short of
            paying for a higher tier.
          </p>
          <p className="mt-3 text-base leading-7 text-slate">
            Toolkitties reads the file directly in your browser's memory using JavaScript libraries (pdf-lib and pdf.js) — there&apos;s no
            upload step, so there&apos;s nothing to cap or time out on that front. The practical ceiling becomes how much memory your own
            device has, which for most modern laptops and phones comfortably handles PDFs well beyond typical free-tier limits.
          </p>
        </section>

        <section className="mt-14 max-w-3xl" aria-labelledby="steps">
          <h2 id="steps" className="font-display text-2xl font-semibold text-ink">What to do with a large PDF</h2>
          <ol className="mt-4 flex flex-col gap-3 text-base leading-7 text-slate">
            <li><strong className="text-ink">1. Try compressing it first.</strong> Most oversized PDFs are large because of embedded images — <Link href="/compress-pdf" className="bl-link">Compress PDF</Link> often shrinks a scan-heavy file dramatically without a visible quality loss.</li>
            <li><strong className="text-ink">2. Split it if you only need part of it.</strong> <Link href="/split-pdf" className="bl-link">Split PDF</Link> breaks a large document into smaller files, useful if you only need to share or upload specific pages elsewhere.</li>
            <li><strong className="text-ink">3. Scanned pages? Try OCR first.</strong> If the file is a scan and you mainly need the text, <Link href="/pdf-ocr" className="bl-link">PDF OCR</Link> can pull out just the text, which is far smaller than the original images.</li>
          </ol>
        </section>

        <section className="mt-14 max-w-3xl rounded-3xl bg-ink p-8 text-paper" aria-labelledby="start">
          <h2 id="start" className="font-display text-2xl font-semibold">No upload, no size games</h2>
          <p className="mt-3 text-base leading-7 text-paper/80">Drop your file in — it stays on your device the whole time.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/compress-pdf" className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink hover:bg-[#d99a3f]">Compress a PDF now →</Link>
            <Link href="/ilovepdf-alternative-no-limits" className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-paper hover:bg-white/10">Compare to iLovePDF</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
