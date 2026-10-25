import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedbackForm from "@/components/FeedbackForm";
import { CONTACT_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact and Feedback | Toolkitties",
  description:
    "Contact Toolkitties: report a broken tool, suggest a new one, or send feedback. We read every message.",
  alternates: { canonical: "https://toolkitties.com/contact" },
};

const reasons = [
  { icon: "🛠️", title: "Report a problem", copy: "Tell us which tool, what you did and what went wrong. The browser you use helps us a lot." },
  { icon: "💡", title: "Suggest a tool", copy: "Missing something you use every day? Tell us the tool and how you would use it." },
  { icon: "👋", title: "Say hello", copy: "Questions about privacy, the terms or anything else are welcome too." },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="container-content py-14 md:py-20">
        <header className="max-w-3xl">
          <p className="inline-block rounded-full border border-moss/20 bg-white/60 px-4 py-1.5 text-sm font-medium text-moss">
            Contact and feedback
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl">
            We would love to hear from you
          </h1>
          <p className="mt-4 text-base text-slate md:text-lg">
            Toolkitties gets better with your feedback. Found a bug, want a new tool, or just have a question? Write to us.
          </p>
        </header>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-2xl border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-moss/10 to-gold/20 text-2xl" aria-hidden="true">
                {r.icon}
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-ink">{r.title}</h2>
              <p className="mt-1.5 text-sm leading-6 text-slate">{r.copy}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <section id="feedback" aria-labelledby="feedback-title" className="scroll-mt-24 rounded-3xl border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur md:p-9">
            <h2 id="feedback-title" className="font-display text-2xl font-semibold text-ink">
              Send us a message
            </h2>
            <p className="mb-6 mt-2 text-sm text-slate">
              Pressing the button opens your email app with everything filled in, so you can check it before it is sent.
            </p>
            <FeedbackForm />
          </section>

          <aside className="grid content-start gap-5">
            <div className="rounded-3xl bg-ink p-7 text-paper">
              <h2 className="font-display text-lg font-semibold">Email us directly</h2>
              <a href={`mailto:${CONTACT_EMAIL}`} className="mt-3 block break-all text-base font-semibold text-[#6FD1B0] underline">
                {CONTACT_EMAIL}
              </a>
              <p className="mt-3 text-sm text-paper/75">We read every message and reply as soon as we can.</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/70 p-7 shadow-sm backdrop-blur">
              <h2 className="font-display text-lg font-semibold text-ink">Please keep files private</h2>
              <p className="mt-2 text-sm leading-6 text-slate">
                You never need to send us a file to get help. Describe the problem in words, and never include passwords or
                personal documents.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
