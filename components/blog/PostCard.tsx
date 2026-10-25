import Link from "next/link";
import { readingMinutes, type Post } from "@/lib/blog";

// A card with a generated cover (no image file to download, so it costs nothing to load).
// The shapes only move on hover or keyboard focus.
export default function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const mins = readingMinutes(post);
  return (
    <Link href={`/blog/${post.slug}`} className={`bl-card ${featured ? "bl-card-featured" : ""}`} data-cat={post.category}>
      <div className="bl-cover" aria-hidden="true">
        <span className="bl-orb bl-orb-a" />
        <span className="bl-orb bl-orb-b" />
        <span className="bl-orb bl-orb-c" />
        <span className="bl-emoji">{post.emoji}</span>
        <span className="bl-chip">{post.category}</span>
      </div>
      <div className="bl-card-body">
        <h3 className={`font-display font-bold text-ink ${featured ? "text-2xl md:text-3xl" : "text-lg"}`}>{post.title}</h3>
        <p className={`mt-2 text-slate ${featured ? "text-base leading-7" : "text-sm leading-6"}`}>{post.description}</p>
        <p className="bl-meta">
          <span>{mins} min read</span>
          <span aria-hidden="true">·</span>
          <span className="bl-read">Read article <span aria-hidden="true">→</span></span>
        </p>
      </div>
    </Link>
  );
}
