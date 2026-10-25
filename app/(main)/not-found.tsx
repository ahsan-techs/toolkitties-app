import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Shown for any address that does not match a page or a tool (including a wrong tool name).
const popular = [
  { href: "/merge-pdf", label: "Merge PDF" },
  { href: "/compress-pdf", label: "Compress PDF" },
  { href: "/split-pdf", label: "Split PDF" },
  { href: "/pdf-to-word", label: "PDF to Word" },
  { href: "/image-to-pdf", label: "Image to PDF" },
  { href: "/compress-image", label: "Compress Image" },
  { href: "/qr-code-generator", label: "QR Code Generator" },
  { href: "/word-counter", label: "Word Counter" },
];

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container-content flex flex-col items-center gap-4 py-24 text-center">
        <span className="text-4xl" aria-hidden="true">🧭</span>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Error 404</p>
        <h1 className="font-display text-3xl font-semibold text-ink md:text-4xl">We couldn&apos;t find that page</h1>
        <p className="max-w-md text-base text-slate">
          The link may be old or mistyped. Try one of the places below, or browse every free tool.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Link href="/all-tools" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-ink/85">
            View all tools
          </Link>
          <Link href="/blog" className="rounded-full border border-ink/15 bg-white px-6 py-3 text-sm font-semibold text-ink hover:border-moss/50">
            Read the guides
          </Link>
          <Link href="/contact" className="rounded-full border border-ink/15 bg-white px-6 py-3 text-sm font-semibold text-ink hover:border-moss/50">
            Contact us
          </Link>
        </div>
        <section className="mt-8 w-full max-w-2xl" aria-label="Popular tools">
          <h2 className="font-display text-lg font-semibold text-ink">Popular tools</h2>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {popular.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="nav-pill">{t.label}</Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
