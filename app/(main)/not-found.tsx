import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="container-content flex flex-col items-center gap-4 py-28 text-center">
        <span className="text-4xl">🧭</span>
        <h1 className="font-display text-2xl font-semibold text-ink">We couldn't find that tool</h1>
        <p className="max-w-sm text-sm text-slate">It may have moved, or the link might be off. Browse the full catalog instead.</p>
        <Link href="/#tools" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-ink/85">
          View all tools
        </Link>
      </main>
    </>
  );
}
