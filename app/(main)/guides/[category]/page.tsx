import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundShapes from "@/components/BackgroundShapes";
import PostCard from "@/components/blog/PostCard";
import { allPosts, pillars, findPillar } from "@/lib/blog";
import { toolGroups } from "@/lib/tools-data";

const BASE = "https://toolkitties.com";

export function generateStaticParams() {
  return pillars.map((p) => ({ category: p.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const pillar = findPillar(params.category);
  if (!pillar) return {};
  const url = `${BASE}/guides/${pillar.slug}`;
  return {
    title: pillar.seoTitle,
    description: pillar.description,
    alternates: { canonical: url },
    openGraph: { title: pillar.seoTitle, description: pillar.description, url, siteName: "Toolkitties", type: "website" },
    twitter: { card: "summary_large_image", title: pillar.seoTitle, description: pillar.description },
  };
}

export default function PillarPage({ params }: { params: { category: string } }) {
  const pillar = findPillar(params.category);
  if (!pillar) notFound();

  const url = `${BASE}/guides/${pillar.slug}`;
  const posts = allPosts.filter((p) => p.category === pillar.category);
  const group = toolGroups.find((g) => g.id === pillar.toolGroupId);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: pillar.title,
      description: pillar.description,
      url,
      mainEntity: { "@type": "ItemList", itemListElement: posts.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${BASE}/blog/${p.slug}`, name: p.title })) },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${BASE}/blog` },
        { "@type": "ListItem", position: 3, name: pillar.title, item: url },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <div className="relative isolate overflow-x-clip">
        <BackgroundShapes />
        <main id="main-content" className="container-content py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-slate">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-moss">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/blog" className="hover:text-moss">Guides</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-ink/70" aria-current="page">{pillar.title}</li>
            </ol>
          </nav>

          <header className="mt-6 max-w-3xl">
            <span className="text-4xl">{pillar.emoji}</span>
            <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-ink md:text-5xl">{pillar.title}</h1>
            <p className="mt-4 text-base text-slate md:text-lg">{pillar.description}</p>
          </header>

          <section className="mx-auto mt-6 max-w-3xl rounded-2xl border border-ink/[0.06] bg-sand/30 p-4">
            <p className="text-sm leading-6 text-ink/85"><span className="font-semibold text-ink">In short: </span>{pillar.directAnswer}</p>
          </section>

          {group && (
            <section className="mt-10 max-w-3xl" aria-labelledby="tools-in-guide">
              <h2 id="tools-in-guide" className="font-display text-xl font-semibold text-ink">Tools in this guide</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.tools.filter((t) => t.functional).map((t) => (
                  <Link key={t.slug} href={`/${t.slug}`} className="nav-pill">{t.icon} {t.name}</Link>
                ))}
              </div>
            </section>
          )}

          <section className="mt-12" aria-labelledby="articles-in-guide">
            <h2 id="articles-in-guide" className="font-display text-2xl font-bold text-ink">
              All {posts.length} {pillar.category.toLowerCase()} guides
            </h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
