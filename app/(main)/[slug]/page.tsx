import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolWorkspace from "@/components/ToolWorkspace";
import ToolsSidebar from "@/components/ToolsSidebar";
import { allTools, findTool, toolGroups } from "@/lib/tools-data";
import { toolVariants, findVariant, variantsForTool } from "@/lib/tool-variants";
import { generateHowTo, generateBenefits, generateFaqs, generatePrivacyNote, generateSeoTitle, generateSeoDescription } from "@/lib/seo-content";
import { locales } from "@/lib/i18n/config";
import { toolTranslations } from "@/lib/i18n/tool-translations";

// Slugs that are reserved for other top-level routes and must never be treated as a tool page.
const RESERVED_SLUGS = new Set(["sitemap.xml", "robots.txt", "favicon.ico"]);

export function generateStaticParams() {
  const toolSlugs = allTools.map((tool) => ({ slug: tool.slug }));
  const variantSlugs = toolVariants.map((v) => ({ slug: v.slug }));
  return [...toolSlugs, ...variantSlugs];
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const found = findTool(params.slug);
  if (found) {
    const { tool, group } = found;
    const title = generateSeoTitle(tool, group);
    const description = generateSeoDescription(tool, group);
    const url = `https://toolkitties.com/${tool.slug}`;

    const languageAlternates: Record<string, string> = { "x-default": url, en: url };
    const translations = toolTranslations[tool.slug];
    if (translations) {
      for (const l of locales) {
        const t = translations[l];
        if (t) languageAlternates[l] = `https://toolkitties.com/${l}/${t.slug}`;
      }
    }

    return {
      title,
      description,
      alternates: { canonical: url, languages: languageAlternates },
      openGraph: { title, description, url, siteName: "Toolkitties", type: "website" },
      twitter: { card: "summary", title, description },
    };
  }

  const variant = findVariant(params.slug);
  if (variant) {
    const url = `https://toolkitties.com/${variant.slug}`;
    return {
      title: variant.title,
      description: variant.description,
      alternates: { canonical: url },
      openGraph: { title: variant.title, description: variant.description, url, siteName: "Toolkitties", type: "website" },
      twitter: { card: "summary", title: variant.title, description: variant.description },
    };
  }

  return {};
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  if (RESERVED_SLUGS.has(params.slug)) notFound();

  const found = findTool(params.slug);
  const variant = found ? null : findVariant(params.slug);

  if (!found && !variant) notFound();

  // Resolve to the real, functional tool either way — variants are just a
  // constraint-specific landing page on top of an existing tool.
  const underlying = found ?? findTool(variant!.toolSlug);
  if (!underlying) notFound();
  const { tool, group } = underlying;

  const displayName = variant?.name ?? tool.name;
  const displayDescription = variant?.description ?? tool.description;
  const displayIcon = tool.icon;
  const canonicalSlug = variant?.slug ?? tool.slug;

  const relatedTools = group.tools.filter((t) => t.slug !== tool.slug).slice(0, 4);
  const siblingVariants = variantsForTool(tool.slug).filter((v) => v.slug !== canonicalSlug);
  // On a variant page, always link back to the base tool it's powered by.
  const relatedSearches = variant ? [{ slug: tool.slug, name: tool.name }, ...siblingVariants.map((v) => ({ slug: v.slug, name: v.name }))] : siblingVariants.map((v) => ({ slug: v.slug, name: v.name }));
  const howTo = generateHowTo(tool, group);
  const benefits = generateBenefits(tool, group);
  const faqs = generateFaqs(tool, group);
  const privacyNote = generatePrivacyNote(tool);

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: displayName,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (runs in browser)",
    description: displayDescription,
    url: `https://toolkitties.com/${canonicalSlug}`,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "18400" },
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${displayName}`,
    step: howTo.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Navbar />
      <main className="container-content flex gap-10 py-10 md:py-14">
        <ToolsSidebar currentSlug={tool.slug} />

        <div className="min-w-0 flex-1">
          <nav className="mb-6 text-sm text-slate">
            <Link href="/" className="hover:text-moss">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/#tools`} className="hover:text-moss">{group.title}</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{displayName}</span>
          </nav>

          <div className="mx-auto max-w-2xl text-center">
            <span className="text-4xl">{displayIcon}</span>
            <h1 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">{displayName}</h1>
            <p className="mt-3 text-base text-slate">{displayDescription}</p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl">
            {tool.functional ? (
              <ToolWorkspace tool={tool} initialOpts={variant?.presetOpts} />
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-ink/15 bg-sand/40 p-12 text-center">
                <span className="text-3xl">🛠️</span>
                <p className="font-display text-lg font-semibold text-ink">This tool is coming soon</p>
                <p className="max-w-sm text-sm text-slate">
                  We're finishing {tool.name.toLowerCase()} so it runs fully in your browser, just like the rest of Toolkitties.
                </p>
              </div>
            )}
          </div>

          {/* How to use */}
          <section className="mx-auto mt-16 max-w-2xl">
            <h2 className="font-display text-xl font-semibold text-ink">How to use {displayName}</h2>
            <ol className="mt-5 flex flex-col gap-4">
              {howTo.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">{i + 1}</span>
                  <p className="text-sm text-ink/85">{step}</p>
                </li>
              ))}
            </ol>
          </section>

          {/* Benefits */}
          <section className="mx-auto mt-14 max-w-2xl">
            <h2 className="font-display text-xl font-semibold text-ink">Why use {displayName}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 rounded-xl border border-ink/10 bg-white p-4 text-sm text-ink/85">
                  <span className="text-moss">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </section>

          {/* Privacy */}
          <section className="mx-auto mt-14 max-w-2xl rounded-2xl border border-ink/10 bg-sand/40 p-6">
            <h2 className="font-display text-lg font-semibold text-ink">🔒 Your privacy with {displayName}</h2>
            <p className="mt-3 text-sm text-ink/80">{privacyNote}</p>
          </section>

          {/* FAQs */}
          <section className="mx-auto mt-14 max-w-2xl">
            <h2 className="font-display text-xl font-semibold text-ink">Frequently asked questions</h2>
            <div className="mt-5 flex flex-col divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-white">
              {faqs.map((f) => (
                <details key={f.q} className="group p-5">
                  <summary className="cursor-pointer list-none text-sm font-semibold text-ink">
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm text-ink/75">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {relatedSearches.length > 0 && (
            <section className="mx-auto mt-14 max-w-2xl">
              <h2 className="font-display text-lg font-semibold text-ink">Related searches</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {relatedSearches.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/${r.slug}`}
                    className="rounded-full border border-ink/15 bg-white px-4 py-2 text-sm text-ink/80 hover:border-moss/50 hover:text-ink"
                  >
                    {r.name}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {relatedTools.length > 0 && (
            <div className="mx-auto mt-16 max-w-2xl">
              <h2 className="font-display text-lg font-semibold text-ink">More in {group.title}</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {relatedTools.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/${t.slug}`}
                    className="flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink hover:border-moss/40"
                  >
                    <span>{t.icon}</span>
                    {t.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
