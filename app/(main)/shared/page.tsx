import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReceiveShare from "@/components/ReceiveShare";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Receiving a shared file | Toolkitties",
  robots: { index: false, follow: true }, // every link here is single-use and tied to one sender's open tab — nothing to index
};

export default function SharedPage({ searchParams }: { searchParams: { peer?: string; name?: string } }) {
  const peerId = searchParams?.peer;

  return (
    <>
      <Navbar />
      <main className="container-content flex min-h-[60vh] flex-col items-center justify-center py-16">
        {peerId ? (
          <ReceiveShare peerId={peerId} expectedName={searchParams?.name} />
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="font-display text-xl font-semibold text-ink">No file link provided</p>
            <p className="text-sm text-slate">This page is for opening a file someone shared with you via Toolkitties.</p>
            <Link href="/" className="mt-2 rounded-full bg-moss px-5 py-2.5 text-sm font-semibold text-white">Go to Toolkitties</Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
