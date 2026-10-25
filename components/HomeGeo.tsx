import Reveal from "@/components/motion/Reveal";

// Homepage content aimed at both search engines and AI answer engines:
// a plain-language privacy explanation, a FAQ that answers the questions
// people actually ask, and matching structured data (Organization, WebSite,
// FAQPage) so the answers can be understood and cited accurately.

const faqs = [
  {
    q: "Is Toolkitties really free?",
    a: "Yes. Every tool on Toolkitties is 100% free to use, with no account, no daily limit and no paid plans.",
  },
  {
    q: "Do my files get uploaded to a server?",
    a: "No. Toolkitties tools run inside your own browser, so your PDFs, images, and text are processed on your device and are never sent to or stored on our servers.",
  },
  {
    q: "Do I need to create an account or sign in?",
    a: "No. There is no signup or login. Open a tool and start using it right away.",
  },
  {
    q: "Is Toolkitties GDPR-friendly?",
    a: "Toolkitties is built to be privacy-first: because files are processed locally and are not uploaded, we don't collect or store the contents of your files. If you need formal compliance documentation for your organization, please check with your own legal or compliance team.",
  },
  {
    q: "Which tools are available?",
    a: "Toolkitties includes PDF tools (merge, split, compress, rotate, watermark), image tools (convert, compress, resize, crop), text and data tools (word counter, JSON formatter, Base64, Markdown), and developer utilities and calculators (QR codes, password and UUID generators, unit and percentage calculators).",
  },
  {
    q: "Which languages does Toolkitties support?",
    a: "The site is available in English, Spanish, Portuguese, German, French, Hindi, Indonesian, Japanese, and Arabic.",
  },
  {
    q: "Are there any hidden charges or subscriptions?",
    a: "No. Toolkitties has no subscriptions, no trials and no hidden fees. Every tool is free, and we never ask for card details.",
  },
];

export function HomeSchema() {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Toolkitties",
      url: "https://toolkitties.com",
      logo: "https://toolkitties.com/icon",
      description: "Free browser-based file, image, PDF and text tools that run entirely on the user's device.",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Toolkitties",
      url: "https://toolkitties.com",
      inLanguage: ["en", "es", "pt", "de", "fr", "hi", "id", "ja", "ar"],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}

export default function HomeGeo() {
  return (
    <>
      <section className="container-content py-16">
        <Reveal className="mx-auto max-w-3xl">
        <div className="glass rounded-3xl bg-white/80 p-8 md:p-10">
          <h2 className="font-display text-2xl font-semibold text-ink">Privacy by design, not by promise</h2>
          <p className="mt-3 text-base text-slate">
            Most online file tools upload your document to a server before doing anything with it. Toolkitties works the other way around: the tool is delivered to your browser and does the work there. Your file never leaves your device, so there is no copy of it for us to store, share, or lose — which is why the platform is GDPR-friendly by design.
          </p>
        </div>
        </Reveal>
      </section>

      <section id="faq" className="container-content pb-20">
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-ink md:text-3xl">Frequently asked questions</h2>
          <div className="glass mt-6 flex flex-col divide-y divide-ink/10 rounded-2xl bg-white/80">
            {faqs.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink outline-none focus-visible:text-moss [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-slate transition-transform duration-300 group-open:rotate-180"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </summary>
                <p className="mt-2 text-sm text-ink/75">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
