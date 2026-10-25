import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import PostCard from "@/components/blog/PostCard";
import { postsForTool } from "@/lib/blog";

// "Tutorials" row at the bottom of a tool page. Shows nothing when the tool has no articles.
export default function TutorialCards({ toolSlug, name }: { toolSlug: string; name: string }) {
  const posts = postsForTool(toolSlug, 6);
  if (posts.length === 0) return null;
  return (
    <section className="mx-auto mt-20 max-w-6xl px-1" aria-labelledby="tut-title">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 id="tut-title" className="font-display text-3xl font-bold text-ink">Tutorials on {name}</h2>
        <p className="mt-3 text-base text-slate">Short, practical guides that go with this tool.</p>
      </Reveal>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08} y={20}>
            <PostCard post={p} />
          </Reveal>
        ))}
      </div>
      <p className="mt-6 text-center">
        <Link href="/blog" className="bl-link text-sm font-semibold">See all guides →</Link>
      </p>
    </section>
  );
}
