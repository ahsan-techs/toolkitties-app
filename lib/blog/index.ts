import type { Post } from "./types";
import { pdfPosts } from "./posts-pdf";
import { morePosts } from "./posts-more";
import { guidePosts } from "./posts-guides";
import { comparisonPosts } from "./posts-comparisons";
import { phase4Guides } from "./posts-phase4-guides";
import { phase4Batch2 } from "./posts-phase4-batch2";
import { expansions } from "./posts-expand";

export type { Post, Block, Section, PostCategory } from "./types";

// Newest first. Posts with the same date keep the order they are written in (a stable sort),
// so the first post in posts-pdf.ts is the featured one on the blog page.
const merged: Post[] = [...pdfPosts, ...morePosts, ...guidePosts, ...comparisonPosts, ...phase4Guides, ...phase4Batch2].map((p) => {
  const extra = expansions[p.slug];
  return extra ? { ...p, sections: [...p.sections, ...extra.sections], faqs: [...p.faqs, ...(extra.faqs ?? [])] } : p;
});

export const allPosts: Post[] = merged.sort((a, b) => b.published.localeCompare(a.published));

export function findPost(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export function postsForTool(toolSlug: string, limit = 3): Post[] {
  return allPosts.filter((p) => p.tool === toolSlug).slice(0, limit);
}

export function relatedPosts(post: Post): Post[] {
  const picked = post.related.map(findPost).filter((p): p is Post => Boolean(p));
  return picked.length ? picked : allPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
}

export function readingMinutes(post: Post): number {
  const text: string[] = [post.title, ...post.takeaways];
  for (const s of post.sections) {
    text.push(s.heading);
    for (const b of s.blocks) {
      if (typeof b === "string") text.push(b);
      else if ("steps" in b) text.push(...b.steps);
      else if ("list" in b) text.push(...b.list);
      else if ("note" in b) text.push(b.note);
      else text.push(...b.table.head, ...b.table.rows.flat());
    }
  }
  for (const f of post.faqs) text.push(f.q, f.a);
  const words = text.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 220));
}
