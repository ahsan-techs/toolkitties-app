import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import FxStage from "@/components/FxStage";
import { PdfToolsVisual, LockVisual, ConvertVisual, PrivacyVisual } from "@/components/FeatureVisuals";
import { allTools } from "@/lib/tools-data";

// Four rows that describe things the site really does. Each illustration shows a real tool
// (no made-up numbers or ratings) and each row links to the tools behind it.

const rows = [
  {
    title: "Work directly on your PDFs",
    copy: "Merge, split, compress, rotate, reorder and watermark PDFs. Drop a file in, pick the tool and download the result.",
    align: "left" as const,
    Visual: PdfToolsVisual,
    label: "Illustration: reordering PDF files and merging them into one",
    primary: { slug: "merge-pdf", text: "Merge PDFs now" },
    more: ["split-pdf", "compress-pdf", "rotate-pdf"],
  },
  {
    title: "Lock and unlock PDFs with a password",
    copy: "Protect a PDF with AES-256 password encryption, or remove the password from a file you already have the password for.",
    align: "right" as const,
    Visual: LockVisual,
    label: "Illustration: protecting a PDF with a password, then unlocking it",
    primary: { slug: "protect-pdf", text: "Protect a PDF" },
    more: ["unlock-pdf"],
  },
  {
    title: "Convert files in a couple of clicks",
    copy: "Turn PDFs into images or text, photos into PDFs, and HEIC or WebP pictures into JPG. Pick a tool and drop your file.",
    align: "left" as const,
    Visual: ConvertVisual,
    label: "Illustration: converting between PDF, JPG, HEIC, WebP and Word",
    primary: { slug: "pdf-to-jpg", text: "Convert a file" },
    more: ["image-to-pdf", "heic-to-jpg", "webp-to-jpg"],
  },
  {
    title: "Your files stay on your device",
    copy: "Every tool runs inside your browser. Your files are not uploaded to our servers, and there is nothing to install.",
    align: "right" as const,
    Visual: PrivacyVisual,
    label: "Illustration: a file processed inside the browser and never sent to a server",
    primary: { slug: "all-tools", text: "Browse all tools" },
    more: ["compress-image", "password-generator", "qr-code-generator"],
  },
];

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

function RowLinks({ primary, more }: { primary: { slug: string; text: string }; more: string[] }) {
  const tools = more
    .map((slug) => allTools.find((t) => t.slug === slug && t.functional))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));
  const href = primary.slug === "all-tools" ? "/all-tools" : `/${primary.slug}`;
  return (
    <>
      <Link href={href} className="group mt-7 inline-flex items-center gap-2 text-base font-semibold text-moss hover:text-ink">
        {primary.text}
        <Arrow />
      </Link>
      {tools.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="rounded-full border border-ink/10 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-ink/80 transition hover:border-moss/40 hover:text-moss"
            >
              {tool.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default function ScrollFeatureRows() {
  return (
    <section className="container-content py-20">
      <div className="flex flex-col gap-20 md:gap-28">
        {rows.map((row) => {
          const textFrom = row.align === "left" ? -24 : 24;
          return (
            <div
              key={row.title}
              className={`flex flex-col items-center gap-10 md:flex-row md:gap-14 ${row.align === "right" ? "md:flex-row-reverse" : ""}`}
            >
              <Reveal x={textFrom} y={16} className="w-full flex-1">
                <h3 className="font-display text-3xl font-bold leading-tight text-ink md:text-4xl">{row.title}</h3>
                <p className="mt-4 max-w-md text-base leading-7 text-slate md:text-lg md:leading-8">{row.copy}</p>
                <RowLinks primary={row.primary} more={row.more} />
              </Reveal>
              <Reveal x={-textFrom} y={16} delay={0.1} className="w-full flex-1">
                <FxStage label={row.label}>
                  <row.Visual />
                </FxStage>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
