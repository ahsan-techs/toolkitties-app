// Blog content model. Paragraphs are plain strings and may contain **bold** and [text](/path) links.
export type Block =
  | string
  | { steps: string[] }
  | { list: string[] }
  | { note: string }
  | { table: { head: string[]; rows: string[][] } };

export type Section = { id: string; heading: string; blocks: Block[] };

export type PostCategory = "PDF" | "Images" | "Writing" | "Business" | "Privacy";

export type Post = {
  slug: string;
  /** H1 on the article page. */
  title: string;
  /** <title> text, kept to about 60 characters. */
  seoTitle: string;
  /** Meta description, up to 160 characters. */
  description: string;
  /** Slug of the Toolkitties tool this article helps with (drives the Try it now card and the tutorials on that tool page). */
  tool: string;
  category: PostCategory;
  emoji: string;
  published: string; // YYYY-MM-DD
  updated: string; // YYYY-MM-DD
  /** Short answers shown at the top: good for readers and for answer engines. */
  takeaways: string[];
  sections: Section[];
  faqs: { q: string; a: string }[];
  /** Slugs of related posts. */
  related: string[];
};
