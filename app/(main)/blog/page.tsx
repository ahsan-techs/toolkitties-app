import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundShapes from "@/components/BackgroundShapes";
import PostCard from "@/components/blog/PostCard";
import { allPosts, type PostCategory } from "@/lib/blog";

const url = "https://toolkitties.com/blog";
const title = "Guides and Tutorials: PDF, Images and Everyday Tools | Toolkitties";
const description = "Step-by-step guides for merging, compressing and splitting PDFs, converting images, writing invoices and more. Free and private.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: "Toolkitties", type: "website", images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Toolkitties guides and tutorials" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og/home.png"] },
};

const order: PostCategory[] = ["PDF", "Images", "Business", "Writing", "Privacy"];
const slug = (c: string) => c.toLowerCase();

export default function BlogIndex() {
  const [featured, ...rest] = allPosts;
  const cats = order.filter((c) => rest.some((p) => p.category === c));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Toolkitties guides and tutorials",
    url,
    description,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allPosts.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${url}/${p.slug}`, name: p.title })),
    },
  };

  return (
    <>
      <Navbar />
      <div className="relative isolate overflow-x-clip">
        <BackgroundShapes />
        <main className="container-content py-12 md:py-16">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Guides</p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">Guides and tutorials</h1>
            <p className="mt-4 text-base text-slate md:text-lg">
              Plain, practical help for PDFs, images and everyday documents. Every guide goes with a free tool that runs in your browser.
            </p>
            <nav aria-label="Categories" className="mt-6 flex flex-wrap justify-center gap-2">
              {cats.map((c) => (
                <a key={c} href={`#${slug(c)}`} className="nav-pill">{c}</a>
              ))}
            </nav>
          </header>

          <section className="mt-12" aria-label="Latest guide">
            <PostCard post={featured} featured />
          </section>

          {cats.map((c) => {
            const list = rest.filter((p) => p.category === c);
            if (list.length === 0) return null;
            return (
              <section key={c} id={slug(c)} className="mt-14 scroll-mt-24" aria-labelledby={`h-${slug(c)}`}>
                <h2 id={`h-${slug(c)}`} className="font-display text-2xl font-bold text-ink">{c}</h2>
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((p) => <PostCard key={p.slug} post={p} />)}
                </div>
              </section>
            );
          })}
        </main>
      </div>
      <Footer />
    </>
  );
}
