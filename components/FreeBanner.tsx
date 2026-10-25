const points = ["No signup or login", "No daily limits", "No subscriptions", "No hidden fees"];

// One card that replaces the old pricing section: it tells every visitor right away
// that the whole site is free.
export default function FreeBanner() {
  return (
    <section id="free" aria-labelledby="free-title" className="container-content py-6">
      <div className="glass-dark rounded-3xl px-6 py-8 text-paper md:px-10 md:py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <span className="inline-block rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink">100% free</span>
            <h2 id="free-title" className="mt-4 font-display text-3xl font-semibold leading-tight md:text-4xl">
              Every tool here is free. Forever.
            </h2>
            <p className="mt-3 text-sm text-paper/80 md:text-base">
              There are no paid plans, no trials and no card details to enter. Open a tool and use it.
            </p>
            <a
              href="#tools"
              className="btn-premium mt-6 inline-block rounded-full bg-paper px-6 py-3 text-sm font-semibold text-ink"
            >
              Browse all tools
            </a>
          </div>

          <ul className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 md:min-w-[22rem] md:grid-cols-1">
            {points.map((point) => (
              <li key={point} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#6FD1B0]/20 text-[#6FD1B0]"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <span className="font-medium">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
