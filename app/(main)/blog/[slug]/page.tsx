import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundShapes from "@/components/BackgroundShapes";
import PostBody from "@/components/blog/PostBody";
import PostCard from "@/components/blog/PostCard";
import ToolCta from "@/components/blog/ToolCta";
import EthicalAd from "@/components/EthicalAd";
import ShareBar from "@/components/blog/ShareBar";
import { allPosts, findPost, readingMinutes, relatedPosts } from "@/lib/blog";

const BASE = "https://toolkitties.com";

export function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = findPost(params.slug);
  if (!post) return {};
  const url = `${BASE}/blog/${post.slug}`;
  const image = `/og/${post.tool}.png`;
  return {
    title: post.seoTitle,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.seoTitle,
      description: post.description,
      url,
      siteName: "Toolkitties",
      type: "article",
      publishedTime: post.published,
      modifiedTime: post.updated,
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: "summary_large_image", title: post.seoTitle, description: post.description, images: [image] },
  };
}

function fmt(date: string) {
  return new Date(date + "T00:00:00Z").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = findPost(params.slug);
  if (!post) notFound();

  const url = `${BASE}/blog/${post.slug}`;
  const mins = readingMinutes(post);
  const related = relatedPosts(post);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.description,
      image: `${BASE}/og/${post.tool}.png`,
      datePublished: post.published,
      dateModified: post.updated,
      mainEntityOfPage: url,
      author: { "@type": "Organization", name: "Toolkitties", url: BASE },
      publisher: { "@type": "Organization", name: "Toolkitties", url: BASE },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Guides", item: `${BASE}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bl-progress" aria-hidden="true" />
      <div className="relative isolate overflow-x-clip">
        <BackgroundShapes />
        <main className="container-content py-10 md:py-14">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

          <nav aria-label="Breadcrumb" className="text-sm text-slate">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-moss">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/blog" className="hover:text-moss">Guides</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-ink/70" aria-current="page">{post.category}</li>
            </ol>
          </nav>

          <header className="mt-6 max-w-3xl">
            <span className="bl-chip-static" data-cat={post.category}>{post.emoji} {post.category}</span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-ink md:text-5xl">{post.title}</h1>
            <p className="mt-4 text-base text-slate md:text-lg">{post.description}</p>
            <p className="bl-byline">
              <span>By the Toolkitties team</span>
              <span aria-hidden="true">·</span>
              <span>Updated <time dateTime={post.updated}>{fmt(post.updated)}</time></span>
              <span aria-hidden="true">·</span>
              <span>{mins} min read</span>
            </p>
            <ShareBar url={url} title={post.title} />
          </header>

          <div className="mt-10 grid gap-10 lg:grid-cols-[15rem_minmax(0,1fr)]">
            <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-slate">On this page</p>
                <ol className="flex flex-col">
                  <li><a href="#takeaways" className="bl-toc">Key takeaways</a></li>
                  {post.sections.map((s) => (
                    <li key={s.id}><a href={`#${s.id}`} className="bl-toc">{s.heading}</a></li>
                  ))}
                  <li><a href="#faq" className="bl-toc">FAQ</a></li>
                </ol>
              </div>
            </nav>

            <article className="bl-prose min-w-0 max-w-3xl">
              <section id="takeaways" className="bl-takeaways scroll-mt-24" aria-labelledby="tk-title">
                <h2 id="tk-title">Key takeaways</h2>
                <ul>
                  {post.takeaways.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </section>

              {post.sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <h2>{s.heading}</h2>
                  <PostBody blocks={s.blocks} />
                  {i === 0 && <ToolCta toolSlug={post.tool} />}
                </section>
              ))}

              <section id="faq" className="scroll-mt-24">
                <h2>Frequently asked questions</h2>
                <div className="bl-faq">
                  {post.faqs.map((f) => (
                    <details key={f.q}>
                      <summary>{f.q}</summary>
                      <p>{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>

              <EthicalAd />
              <ToolCta toolSlug={post.tool} />
              <ShareBar url={url} title={post.title} />
            </article>
          </div>

          <section className="mt-16" aria-labelledby="more-title">
            <h2 id="more-title" className="font-display text-2xl font-bold text-ink">Keep reading</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
