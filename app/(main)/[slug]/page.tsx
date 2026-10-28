import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToolWorkspace from "@/components/ToolWorkspace";
import ToolsSidebar from "@/components/ToolsSidebar";
import MobileToolsDrawer from "@/components/MobileToolsDrawer";
import MiniTool from "@/components/tools/MiniTool";
import PrivacyBadge from "@/components/PrivacyBadge";
import EthicalAd from "@/components/EthicalAd";
import { MINI_TOOL_SLUGS } from "@/components/tools/registry";
import { allTools, findTool, toolGroups } from "@/lib/tools-data";
import { toolVariants, findVariant, variantsForTool } from "@/lib/tool-variants";
import { generateHowTo, generateBenefits, generateFaqs, generatePrivacyNote, generateSeoTitle, generateSeoDescription, generateDirectAnswer, generateQuickFacts, detectKind, fitVariantTitle, fitVariantDescription } from "@/lib/seo-content";
import { toolSeo } from "@/lib/tool-seo";
import ToolShowcase from "@/components/ToolShowcase";
import TutorialCards from "@/components/TutorialCards";
import { locales } from "@/lib/i18n/config";
import { toolTranslations } from "@/lib/i18n/tool-translations";

const InvoiceGenerator = dynamic(() => import("@/components/InvoiceGenerator"));
const ProposalGenerator = dynamic(() => import("@/components/ProposalGenerator"));

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

    const seo = toolSeo[tool.slug];
    return {
      title,
      description,
      keywords: [tool.name, ...(seo?.also ?? []), "free online tool", "no signup"],
      alternates: { canonical: url, languages: languageAlternates },
      openGraph: { title, description, url, siteName: "Toolkitties", type: "website", images: [{ url: `/og/${tool.slug}.png`, width: 1200, height: 630, alt: title }] },
      twitter: { card: "summary_large_image", title, description, images: [`/og/${tool.slug}.png`] },
    };
  }

  const variant = findVariant(params.slug);
  if (variant) {
    const url = `https://toolkitties.com/${variant.slug}`;
    const title = fitVariantTitle(variant.title);
    const description = fitVariantDescription(variant.description);
    const vseo = toolSeo[variant.toolSlug];
    return {
      title,
      description,
      keywords: [variant.name, ...(vseo?.also ?? []), "free online tool", "no signup"],
      alternates: { canonical: url },
      openGraph: { title, description, url, siteName: "Toolkitties", type: "website", images: [{ url: `/og/${variant.toolSlug}.png`, width: 1200, height: 630, alt: title }] },
      twitter: { card: "summary_large_image", title, description, images: [`/og/${variant.toolSlug}.png`] },
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

  const wide = !!tool.wide;
  const relatedTools = group.tools.filter((t) => t.slug !== tool.slug).slice(0, 4);
  const POPULAR_SLUGS = ["merge-pdf", "compress-pdf", "pdf-to-jpg", "jpg-to-png", "word-counter", "qr-code-generator", "invoice-generator", "password-generator"];
  const alsoUseful = POPULAR_SLUGS.filter((slug) => slug !== tool.slug && !relatedTools.some((t) => t.slug === slug))
    .map((slug) => findTool(slug)?.tool)
    .filter((t): t is NonNullable<typeof t> => Boolean(t))
    .slice(0, 4);
  const siblingVariants = variantsForTool(tool.slug).filter((v) => v.slug !== canonicalSlug);
  // On a variant page, always link back to the base tool it's powered by.
  const relatedSearches = variant ? [{ slug: tool.slug, name: tool.name }, ...siblingVariants.map((v) => ({ slug: v.slug, name: v.name }))] : siblingVariants.map((v) => ({ slug: v.slug, name: v.name }));
  const howTo = generateHowTo(tool, group);
  const benefits = generateBenefits(tool, group);
  const faqs = generateFaqs(tool, group);
  const privacyNote = generatePrivacyNote(tool);
  const seo = toolSeo[tool.slug];

  const kind = detectKind(tool, group);
  const directAnswer = generateDirectAnswer(displayName, displayDescription, kind);
  const quickFacts = generateQuickFacts(group, kind);
  const pageUrl = `https://toolkitties.com/${canonicalSlug}`;

  // Only facts that are true are published here: no ratings or review counts are invented.
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: displayName,
    url: pageUrl,
    description: displayDescription,
    applicationCategory: group.id === "business" ? "BusinessApplication" : "UtilitiesApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript and a modern web browser",
    isAccessibleForFree: true,
    inLanguage: "en",
    ...(seo ? { alternateName: seo.also } : {}),
    featureList: benefits,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "Toolkitties", url: "https://toolkitties.com" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://toolkitties.com" },
      { "@type": "ListItem", position: 2, name: group.title, item: "https://toolkitties.com/#tools" },
      { "@type": "ListItem", position: 3, name: displayName, item: pageUrl },
    ],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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

          <div className="mb-5">
            <MobileToolsDrawer currentSlug={tool.slug} />
          </div>

          <div className="mx-auto max-w-2xl text-center">
            <span className="text-4xl">{displayIcon}</span>
            <h1 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">{displayName}</h1>
            <p className="mt-3 text-base text-slate">{displayDescription}</p>
          </div>

          {tool.functional && <PrivacyBadge />}

          <div className={wide ? "tk-workspace-wide" : "tk-workspace"}>
            {tool.functional ? (
              tool.slug === "invoice-generator" ? (
                <InvoiceGenerator />
              ) : tool.slug === "quotation-generator" ? (
                <InvoiceGenerator mode="quote" />
              ) : tool.slug === "proposal-generator" ? (
                <ProposalGenerator />
              ) : (MINI_TOOL_SLUGS as readonly string[]).includes(tool.slug) ? (
                <MiniTool slug={tool.slug} />
              ) : (
                <ToolWorkspace key={tool.slug} tool={tool} initialOpts={variant?.presetOpts} />
              )
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

          {tool.functional && <EthicalAd />}

          {/* Direct answer: a short, quotable definition for search and AI answer engines */}
          <section className="mx-auto mt-14 max-w-2xl">
            <h2 className="font-display text-xl font-semibold text-ink">What is {displayName}?</h2>
            <p className="mt-3 text-base leading-7 text-ink/85">{directAnswer}</p>
            {seo && (
              <p className="mt-3 text-sm text-slate">
                Also searched as: {seo.also.join(", ")}.
              </p>
            )}
          </section>

          <section className="mx-auto mt-12 max-w-2xl">
            <h2 className="font-display text-xl font-semibold text-ink">{displayName} at a glance</h2>
            <dl className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 sm:grid-cols-2">
              {quickFacts.map((f) => (
                <div key={f.label} className="bg-white p-4">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate">{f.label}</dt>
                  <dd className="mt-1 text-sm text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {seo && (
            <section className="mx-auto mt-14 max-w-2xl">
              <h2 className="font-display text-xl font-semibold text-ink">When to use {displayName}</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {seo.uses.map((u) => (
                  <li key={u} className="flex items-start gap-3 text-sm text-ink/85">
                    <span className="mt-0.5 text-moss">→</span>
                    {u}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* How to use */}
          <section className="mx-auto mt-14 max-w-2xl">
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

          <ToolShowcase slug={tool.slug} name={displayName} />
          <TutorialCards toolSlug={tool.slug} name={displayName} />

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

          {alsoUseful.length > 0 && (
            <section className="mx-auto mt-14 max-w-2xl">
              <h2 className="font-display text-lg font-semibold text-ink">Popular free tools</h2>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {alsoUseful.map((t) => (
                  <Link key={t.slug} href={`/${t.slug}`} className="flex items-center gap-2 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink hover:border-moss/40">
                    <span>{t.icon}</span>
                    {t.name}
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
