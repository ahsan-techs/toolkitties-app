import type { PostCategory } from "./types";

export type Pillar = {
  category: PostCategory;
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  emoji: string;
  /** Short, quotable direct answer for the category — shown at the top of the pillar page. */
  directAnswer: string;
  /** Tool group id this category maps to, for the "Tools in this guide" list. */
  toolGroupId: string;
};

export const pillars: Pillar[] = [
  {
    category: "PDF",
    slug: "pdf",
    title: "The PDF Guide",
    seoTitle: "PDF Guide: Merge, Compress, Convert and Edit PDFs Free | Toolkitties",
    description: "Every Toolkitties guide and tool for working with PDFs — merging, splitting, compressing, converting and signing — all free and processed in your own browser.",
    emoji: "📄",
    directAnswer: "This is the hub for everything PDF on Toolkitties: the free browser-based tools (merge, split, compress, convert, e-sign, OCR) and the step-by-step guides that go with each one, so you can find the right tool and the right explanation in one place.",
    toolGroupId: "documents",
  },
  {
    category: "Images",
    slug: "images",
    title: "The Image Tools Guide",
    seoTitle: "Image Tools Guide: Convert, Resize and Compress Photos Free | Toolkitties",
    description: "Every Toolkitties guide and tool for photos and images — converting formats, resizing, compressing and cropping — all free and processed on your own device.",
    emoji: "🖼️",
    directAnswer: "This is the hub for everything image-related on Toolkitties: free tools for converting, compressing, resizing and cropping photos, plus the guides explaining when and how to use each one — with your photo never leaving your device.",
    toolGroupId: "images",
  },
  {
    category: "Business",
    slug: "business",
    title: "The Business Documents Guide",
    seoTitle: "Business Document Tools Guide: Invoices, Quotes & Proposals | Toolkitties",
    description: "Every Toolkitties guide and tool for everyday business paperwork — invoices, quotations and proposals — built free, with no account and no software to install.",
    emoji: "💼",
    directAnswer: "This is the hub for Toolkitties' business document tools: free invoice, quotation and proposal generators, plus guides on pricing, tax, late fees and getting paid faster, all usable without an account.",
    toolGroupId: "business",
  },
  {
    category: "Writing",
    slug: "writing",
    title: "The Writing & Text Tools Guide",
    seoTitle: "Text and Developer Tools Guide: Word Count, JSON, Regex & More | Toolkitties",
    description: "Every Toolkitties guide and tool for text, writing and small developer tasks — word counting, formatting, generators and converters — free with no signup.",
    emoji: "✍️",
    directAnswer: "This is the hub for Toolkitties' text, writing and small developer tools — word counters, generators, formatters and converters — plus the guides that explain how and when to use each one.",
    toolGroupId: "text",
  },
  {
    category: "Privacy",
    slug: "privacy",
    title: "The Privacy & Comparisons Guide",
    seoTitle: "Privacy-First Tools: How Toolkitties Compares | Toolkitties",
    description: "Guides on how Toolkitties protects your files, how it compares to other free tools, and what \"processed in your browser\" actually means for your privacy.",
    emoji: "🔒",
    directAnswer: "This is the hub for Toolkitties' privacy and comparison guides — honest, sourced looks at how browser-based processing differs from uploading your file to a server, and how Toolkitties' free plan compares to other tools.",
    toolGroupId: "documents",
  },
];

export function findPillar(slug: string): Pillar | undefined {
  return pillars.find((p) => p.slug === slug);
}
