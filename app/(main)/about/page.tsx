import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { allTools } from "@/lib/tools-data";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site-config";

const url = `${SITE_URL}/about`;
const title = "About Toolkitties: Free, Private Online Tools";
const description =
  "Toolkitties is a free set of online tools for PDF, images, text and everyday work. They run in your browser, with no signup, and we are honest about what each tool can do.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: "Toolkitties", type: "website", images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "About Toolkitties" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og/home.png"] },
};

const principles = [
  { icon: "🆓", title: "Free, really", copy: "No account, no trial and no paid plan. You open a tool and use it." },
  { icon: "🔒", title: "Private by design", copy: "Our tools process files in your browser, so your documents are not uploaded to a Toolkitties server." },
  { icon: "🎯", title: "Honest about limits", copy: "We say what each tool does and does not do. For example, PDF to Word copies text only, and Unlock PDF needs the password." },
  { icon: "⚡", title: "Simple and fast", copy: "No installs, no pop-ups and no waiting for an email. It works on a phone, tablet or computer." },
];

export default function AboutPage() {
  const count = allTools.filter((t) => t.functional).length;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      name: title,
      url,
      description,
      isPartOf: { "@type": "WebSite", name: "Toolkitties", url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Toolkitties",
      url: SITE_URL,
      email: CONTACT_EMAIL,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="container-content py-14 md:py-20">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <header className="max-w-3xl">
          <p className="inline-block rounded-full border border-moss/20 bg-white/60 px-4 py-1.5 text-sm font-medium text-moss">About us</p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            Everyday tools that respect your files
          </h1>
          <p className="mt-4 text-base text-slate md:text-lg">
            Toolkitties is a free collection of {count} online tools for PDF, images, text, developers and small businesses. We built it
            so that quick jobs, like merging a PDF or shrinking a photo, do not need an account, an install or an upload.
          </p>
        </header>

        <section className="mt-12" aria-labelledby="principles">
          <h2 id="principles" className="font-display text-2xl font-semibold text-ink">What we stand for</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="rounded-2xl border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-moss/10 to-gold/20 text-2xl" aria-hidden="true">{p.icon}</span>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate">{p.copy}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 max-w-3xl" aria-labelledby="story">
          <h2 id="story" className="font-display text-2xl font-semibold text-ink">Why Toolkitties exists</h2>
          <p className="mt-3 text-base leading-7 text-slate">
            Many online tools ask you to upload your documents to a stranger&apos;s server, sign up for an account, or pay once you pass a small
            limit. For a private contract or an ID copy, that is a lot to ask. Toolkitties takes the opposite approach: the work happens on your
            own device, and the tools are free to use.
          </p>
          <p className="mt-3 text-base leading-7 text-slate">
            You do not have to take our word for it. Open your browser&apos;s developer tools, go to the Network tab, run a tool and see for
            yourself what is sent. We explain how in our guide{" "}
            <Link href="/blog/are-online-pdf-tools-safe" className="bl-link">Are online PDF tools safe?</Link>
          </p>
        </section>

        <section className="mt-14 max-w-3xl" aria-labelledby="how">
          <h2 id="how" className="font-display text-2xl font-semibold text-ink">What you can do here</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-7 text-slate marker:text-moss">
            <li>Merge, split, compress, rotate and protect PDFs.</li>
            <li>Convert, resize, crop and compress images, including iPhone HEIC photos.</li>
            <li>Clean up text, format JSON, and generate QR codes, passwords and hashes.</li>
            <li>Create invoices, quotations and proposals as PDFs.</li>
          </ul>
          <p className="mt-4 text-base leading-7 text-slate">
            Browse <Link href="/all-tools" className="bl-link">all tools</Link> or read the <Link href="/blog" className="bl-link">guides and tutorials</Link>.
          </p>
        </section>

        <section className="mt-14 max-w-3xl rounded-3xl bg-ink p-8 text-paper" aria-labelledby="talk">
          <h2 id="talk" className="font-display text-2xl font-semibold">Talk to us</h2>
          <p className="mt-3 text-base leading-7 text-paper/80">
            Found a bug, want a new tool, or have a question about privacy? We read every message.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={`mailto:${CONTACT_EMAIL}`} className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink hover:bg-[#d99a3f]">Email us</a>
            <Link href="/contact" className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-paper hover:bg-white/10">Contact page</Link>
            <Link href="/privacy" className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-paper hover:bg-white/10">Privacy Policy</Link>
            <Link href="/terms" className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-paper hover:bg-white/10">Terms of Service</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
