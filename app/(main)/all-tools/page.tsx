import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackgroundShapes from "@/components/BackgroundShapes";
import AllToolsSearch from "@/components/AllToolsSearch";
import { allTools } from "@/lib/tools-data";

const url = "https://toolkitties.com/all-tools";
const title = "All Free Online Tools: PDF, Image, Text | Toolkitties";
const description = "Browse every Toolkitties tool in one place. Search PDF, image, text, developer and business tools. Free, no signup, runs in your browser.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, siteName: "Toolkitties", type: "website", images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Toolkitties: all free online tools" }] },
  twitter: { card: "summary_large_image", title, description, images: ["/og/home.png"] },
};

export default function AllToolsPage() {
  const count = allTools.filter((t) => t.functional).length;
  return (
    <>
      <Navbar />
      <div className="relative isolate overflow-x-clip">
        <BackgroundShapes />
        <main className="container-content py-12 md:py-16">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h1 className="font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">All tools</h1>
            <p className="mt-4 text-base text-slate md:text-lg">
              {count} free tools in one place. Pick one, or search by name.
            </p>
          </div>
          <AllToolsSearch />
        </main>
      </div>
      <Footer />
    </>
  );
}
