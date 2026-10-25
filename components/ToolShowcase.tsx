import type { CSSProperties } from "react";
import Reveal from "@/components/motion/Reveal";
import PlayGate from "@/components/PlayGate";
import { toolShowcase, type SceneKind } from "@/lib/tool-showcase";

// Small CSS-animated pictures. Only transform and opacity change, so nothing shifts the layout and
// the work stays on the GPU. They pause when off screen and stop for reduced-motion visitors.
function Scene({ kind }: { kind: SceneKind }) {
  const common = { viewBox: "0 0 120 80", "aria-hidden": true as const, className: `sc-svg sc-${kind}` };
  switch (kind) {
    case "speed":
      return (
        <svg {...common}>
          <rect x="14" y="48" width="92" height="10" rx="5" fill="#1F5C4C" opacity=".14" />
          <rect className="sc-fill" x="14" y="48" width="92" height="10" rx="5" fill="#1F5C4C" />
          <path className="sc-bolt" d="M64 10 46 38h13l-4 22 20-30H62z" fill="#C7862B" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <circle className="sc-ring" cx="60" cy="40" r="22" fill="none" stroke="#1F5C4C" strokeWidth="2" />
          <circle className="sc-ring sc-ring2" cx="60" cy="40" r="22" fill="none" stroke="#1F5C4C" strokeWidth="2" />
          <path d="M60 14 82 22v18c0 14-9 23-22 28-13-5-22-14-22-28V22z" fill="#1F5C4C" />
          <path className="sc-check" d="m49 40 8 8 15-16" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "layers":
      return (
        <svg {...common}>
          <rect className="sc-l sc-l3" x="30" y="40" width="60" height="22" rx="6" fill="#C7862B" opacity=".55" />
          <rect className="sc-l sc-l2" x="30" y="30" width="60" height="22" rx="6" fill="#1F5C4C" opacity=".6" />
          <rect className="sc-l sc-l1" x="30" y="18" width="60" height="22" rx="6" fill="#1F5C4C" />
        </svg>
      );
    case "device":
      return (
        <svg {...common}>
          <g className="sc-dev-a">
            <rect x="14" y="16" width="62" height="40" rx="5" fill="#fff" stroke="#1F5C4C" strokeWidth="3" />
            <rect x="8" y="58" width="74" height="5" rx="2.5" fill="#1F5C4C" />
            <rect x="24" y="26" width="30" height="4" rx="2" fill="#C7862B" />
            <rect x="24" y="35" width="42" height="4" rx="2" fill="#1F5C4C" opacity=".3" />
          </g>
          <g className="sc-dev-b">
            <rect x="84" y="24" width="24" height="42" rx="6" fill="#fff" stroke="#C7862B" strokeWidth="3" />
            <rect x="91" y="32" width="10" height="4" rx="2" fill="#1F5C4C" />
          </g>
        </svg>
      );
    case "sparkle":
      return (
        <svg {...common}>
          <path className="sc-star sc-s1" d="M60 14l6 18 18 6-18 6-6 18-6-18-18-6 18-6z" fill="#1F5C4C" />
          <path className="sc-star sc-s2" d="M94 14l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#C7862B" />
          <path className="sc-star sc-s3" d="M28 50l3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#C7862B" />
        </svg>
      );
    case "flow":
      return (
        <svg {...common}>
          <rect x="10" y="22" width="28" height="36" rx="4" fill="#fff" stroke="#1F5C4C" strokeWidth="3" />
          <rect x="82" y="22" width="28" height="36" rx="4" fill="#1F5C4C" />
          <path d="M16 32h16M16 40h16M16 48h10" stroke="#1F5C4C" strokeWidth="3" strokeLinecap="round" opacity=".4" />
          <path d="M88 32h16M88 40h16M88 48h10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          <circle className="sc-dot" cx="44" cy="40" r="5" fill="#C7862B" />
        </svg>
      );
    case "tick":
      return (
        <svg {...common}>
          <circle className="sc-tickc" cx="60" cy="40" r="24" fill="#1F5C4C" opacity=".12" />
          <circle cx="60" cy="40" r="24" fill="none" stroke="#1F5C4C" strokeWidth="4" />
          <path className="sc-check" d="m48 41 9 9 17-19" fill="none" stroke="#C7862B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "free":
      return (
        <svg {...common}>
          <g className="sc-coin">
            <circle cx="60" cy="40" r="25" fill="#C7862B" />
            <circle cx="60" cy="40" r="19" fill="none" stroke="#fff" strokeWidth="3" opacity=".7" />
            <text x="60" y="49" textAnchor="middle" fontSize="26" fontWeight="700" fill="#fff" fontFamily="Georgia, serif">0</text>
          </g>
        </svg>
      );
  }
}

export default function ToolShowcase({ slug, name }: { slug: string; name: string }) {
  const s = toolShowcase[slug];
  if (!s) return null;

  return (
    <PlayGate className="sc-wrap mx-auto mt-20 max-w-6xl px-1">
      <section aria-labelledby="sc-title">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">{name}</p>
          <h2 id="sc-title" className="mt-3 font-display text-3xl font-bold text-ink md:text-4xl">{s.headline}</h2>
          <p className="mt-4 text-base leading-7 text-slate">{s.intro}</p>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {s.features.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.08} y={22}>
              <article className="sc-card h-full">
                <div className="sc-scene">
                  <Scene kind={f.scene} />
                </div>
                <h3 className="font-display text-lg font-bold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate">{f.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-5" aria-labelledby="sc-need">
        <Reveal className="lg:col-span-3">
          <div className="sc-panel">
            <h2 id="sc-need" className="font-display text-2xl font-bold text-ink">Everything you need in {name}</h2>
            <ul className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {s.checklist.map((c, i) => (
                <li key={c} className="flex items-start gap-3 text-sm text-ink/85">
                  <svg className="sc-tick mt-0.5 flex-none" style={{ "--i": i } as CSSProperties} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="11" fill="#1F5C4C" opacity=".12" />
                    <path d="m7 12.5 3.2 3.2L17 9" stroke="#1F5C4C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-2" delay={0.1}>
          <div className="sc-panel sc-panel-dark">
            <h2 className="font-display text-2xl font-bold text-paper">Tips for better results</h2>
            <ol className="mt-5 flex flex-col gap-5">
              {s.tips.map((t, i) => (
                <li key={t.title} className="flex gap-3">
                  <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-gold text-xs font-bold text-ink">{i + 1}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-paper">{t.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-paper/75">{t.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </section>

      <Reveal className="mt-10">
        <div className="sc-strip" role="list" aria-label="What you get">
          {[
            ["0", "files uploaded"],
            ["0", "signups needed"],
            ["0", "cost to use"],
          ].map(([n, l]) => (
            <div key={l} role="listitem" className="sc-strip-item">
              <span className="font-display text-3xl font-bold text-moss">{n}</span>
              <span className="text-sm text-slate">{l}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </PlayGate>
  );
}
