import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LAST_UPDATED } from "@/lib/site-config";
import type { LegalSection } from "@/lib/legal-content";

export default function LegalLayout({
  title,
  lead,
  sections,
}: {
  title: string;
  lead: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <Navbar />
      <main className="container-content py-14 md:py-20">
        <header className="max-w-3xl">
          <p className="inline-block rounded-full border border-moss/20 bg-white/60 px-4 py-1.5 text-sm font-medium text-moss">
            Last updated: {LAST_UPDATED}
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">{title}</h1>
          <p className="mt-4 text-base text-slate md:text-lg">{lead}</p>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <nav aria-label="On this page" className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-white/70 bg-white/70 p-4 shadow-sm backdrop-blur">
              <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-slate">On this page</p>
              <ol className="flex flex-col">
                {sections.map((section, i) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block rounded-lg px-2 py-1.5 text-sm text-slate transition hover:bg-moss/10 hover:text-ink"
                    >
                      {i + 1}. {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="max-w-3xl space-y-10">
            {sections.map((section, i) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="font-display text-2xl font-semibold text-ink">
                  {i + 1}. {section.title}
                </h2>
                {section.paragraphs?.map((text) => (
                  <p key={text} className="mt-3 text-base leading-7 text-slate">
                    {text}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-3 list-disc space-y-2 pl-6 text-base leading-7 text-slate marker:text-moss">
                    {section.bullets.map((text) => (
                      <li key={text}>{text}</li>
                    ))}
                  </ul>
                )}
                {section.closing?.map((text) => (
                  <p key={text} className="mt-3 text-base leading-7 text-slate">
                    {text}
                  </p>
                ))}
              </section>
            ))}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
