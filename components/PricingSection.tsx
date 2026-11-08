"use client";

import type { PointerEvent } from "react";
import Reveal from "@/components/motion/Reveal";

// Toolkitties is free for everyone, with no caps and no account — that's true for every
// visitor, not just a "free tier." This section is a genuinely optional way to chip in
// and help cover hosting, so the same honest line about the tools stays true going
// forward: nothing here is gated behind a payment, and nothing on this page claims
// otherwise. The two paid links are real Lemon Squeezy checkout pages for people who
// want to support the project monthly — not a feature unlock.
const tiers = [
  {
    name: "Supporter",
    icon: "💚",
    price: "6.99",
    period: "/month",
    tagline: "A monthly thank-you that helps cover hosting.",
    href: "https://toolkitties.lemonsqueezy.com/checkout/buy/2ae43375-d5a4-4a8f-af75-2ec53e9127ac",
    cta: "Become a supporter",
    highlighted: true,
  },
  {
    name: "Business supporter",
    icon: "🏢",
    price: "12.99",
    period: "/month",
    tagline: "For a team that relies on these tools and wants to give back more.",
    href: "https://toolkitties.lemonsqueezy.com/checkout/buy/5297cdd8-584f-4d8a-a6c3-67217113d80a",
    cta: "Become a business supporter",
    highlighted: false,
  },
];

function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

export default function PricingSection() {
  return (
    <section id="support" className="container-content py-20">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="mx-auto inline-block rounded-full border border-moss/20 bg-white/60 px-4 py-1.5 text-sm font-medium text-moss">
          Entirely optional
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold text-ink md:text-4xl">Support Toolkitties</h2>
        <p className="mt-3 text-base text-slate">
          Every tool here is free, for everyone, with no caps and no account — that doesn’t change. If Toolkitties has saved you
          time and you’d like to help keep it running, you can chip in below.
        </p>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
        {tiers.map((tier, i) => (
          <Reveal key={tier.name} delay={i * 0.1} y={20}>
            <div
              onPointerMove={!tier.highlighted ? handlePointerMove : undefined}
              className={
                tier.highlighted
                  ? // .glass-card paints its own light, translucent gradient background and a
                    // border tuned for a WHITE card — stacking that under bg-ink here is what
                    // produced the muddy grey card with the stray yellow/green border glow.
                    // This tier gets its own plain, solid-dark treatment instead.
                    "relative flex h-full flex-col rounded-3xl border border-moss/40 bg-ink p-8 text-paper shadow-xl shadow-ink/20 transition-transform duration-300 hover:-translate-y-1"
                  : "glass-card relative flex h-full flex-col rounded-3xl border border-ink/10 bg-white p-8 text-ink"
              }
            >
              {!tier.highlighted && (
                <span aria-hidden="true" className="card-glow">
                  <span className="card-glow-ring" />
                </span>
              )}

              <div className="flex items-center justify-between">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${
                    tier.highlighted ? "bg-paper/15" : "bg-moss/10"
                  }`}
                >
                  {tier.icon}
                </span>
                {tier.highlighted && (
                  <span className="rounded-full bg-paper/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-paper/90">
                    Most chosen
                  </span>
                )}
              </div>

              <h3 className="mt-5 font-display text-xl font-semibold">{tier.name}</h3>
              <p className={`mt-1 text-sm ${tier.highlighted ? "text-paper/85" : "text-slate"}`}>{tier.tagline}</p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-sm font-semibold tracking-wide">USD</span>
                <span className="font-display text-5xl font-bold tabular-nums">{tier.price}</span>
                <span className={`text-sm ${tier.highlighted ? "text-paper/80" : "text-slate"}`}>{tier.period}</span>
              </div>
              <p className={`mt-1 text-xs ${tier.highlighted ? "text-paper/70" : "text-slate/80"}`}>Billed monthly, cancel anytime</p>

              <p className={`mt-5 text-sm ${tier.highlighted ? "text-paper/80" : "text-slate"}`}>
                You’re not unlocking anything extra — every tool is already fully open to you. This just helps pay for hosting so
                it stays that way.
              </p>

              <a
                href={tier.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-premium mt-8 rounded-full px-5 py-3 text-center text-sm font-semibold transition ${
                  tier.highlighted ? "bg-paper text-ink hover:bg-sand" : "bg-ink text-paper hover:bg-ink/85"
                }`}
              >
                {tier.cta}
              </a>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-xl text-center text-xs text-slate">
        Prices are in US dollars — your bank or card provider converts to your local currency at checkout. Payments are processed by
        Lemon Squeezy, our merchant of record. Cancel anytime — see our{" "}
        <a href="/refund" className="underline hover:no-underline">
          refund policy
        </a>
        .
      </p>
    </section>
  );
}
