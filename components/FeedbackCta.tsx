import Link from "next/link";

// Home-page invitation to send feedback. The form itself lives on /contact.
export default function FeedbackCta() {
  return (
    <section aria-labelledby="feedback-cta-title" className="container-content py-6">
      <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/70 bg-white/70 px-6 py-8 shadow-sm backdrop-blur md:flex-row md:items-center md:px-10">
        <div className="max-w-xl">
          <h2 id="feedback-cta-title" className="font-display text-2xl font-semibold text-ink">
            Found a bug or need a new tool?
          </h2>
          <p className="mt-2 text-sm text-slate md:text-base">
            Tell us what is broken or what you would like to see. We read every message and use it to improve the tools.
          </p>
        </div>
        <Link
          href="/contact#feedback"
          className="btn-premium whitespace-nowrap rounded-full bg-moss px-7 py-3 text-sm font-semibold text-paper hover:bg-moss/90"
        >
          Send feedback
        </Link>
      </div>
    </section>
  );
}
