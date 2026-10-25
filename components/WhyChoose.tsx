import type { ReactNode } from "react";
import Reveal from "@/components/motion/Reveal";
import { allTools } from "@/lib/tools-data";

// "Why choose Toolkitties?" block. Every point below is something the site really does
// (no user counts, ratings, certifications or support promises that we cannot back up).

const icons: Record<string, ReactNode> = {
  free: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </>
  ),
  bolt: <path d="M13 3L5 13h6l-1 8 8-10h-6z" />,
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  device: (
    <>
      <rect x="3" y="5" width="14" height="10" rx="2" />
      <path d="M8 19h4M10 15v4" />
      <rect x="15" y="9" width="6" height="11" rx="1.5" />
    </>
  ),
  eye: (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.1A9.6 9.6 0 0112 6c5 0 8.5 4.5 9.5 6a14 14 0 01-2.7 3.1M6.5 7.6A14 14 0 002.5 12c1 1.5 4.5 6 9.5 6 1.5 0 2.9-.4 4.1-1M9.9 9.9a3 3 0 004.2 4.2" />
    </>
  ),
};

export default function WhyChoose() {
  const count = allTools.filter((t) => t.functional).length;
  const points = [
    { icon: "free", title: "Free, really", text: "Every tool is free to use. There is no account, no daily limit, no trial and no paid plan." },
    { icon: "lock", title: "Files stay on your device", text: "Tools run inside your browser, so your PDFs, images and text are not uploaded to our servers." },
    { icon: "bolt", title: "No signup, no install", text: "Open a tool and use it right away. There is nothing to download and no login to remember." },
    { icon: "grid", title: `${count} tools in one place`, text: "PDF, image, text, developer and business tools sit together, so you do not need a new site for each job." },
    { icon: "device", title: "Works on any device", text: "Use it on a phone, tablet or computer. It runs in the browser you already have." },
    { icon: "eye", title: "No ads, no cookies", text: "We do not show ads, and the site does not use tracking cookies or analytics." },
  ];

  return (
    <section id="why" className="container-content pb-20" aria-labelledby="why-title">
      <Reveal className="mx-auto max-w-5xl">
        <h2 id="why-title" className="text-center font-display text-3xl font-bold text-ink md:text-4xl">
          Why choose Toolkitties?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-base text-slate">
          A free online toolbox for PDF, image and text work, built to be simple and private.
        </p>
        <div className="mt-10 grid gap-x-12 gap-y-9 sm:grid-cols-2">
          {points.map((p) => (
            <div key={p.title} className="flex gap-4">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-moss/10 text-moss">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {icons[p.icon]}
                </svg>
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-ink">{p.title}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-slate">{p.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
