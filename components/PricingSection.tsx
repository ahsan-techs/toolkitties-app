// Toolkitties is free for everyone, with no caps and no account — that's true for every
// visitor, not just a "free tier." This section is a genuinely optional way to chip in
// and help cover hosting, so the same honest line about the tools stays true going
// forward: nothing here is gated behind a payment, and nothing on this page claims
// otherwise. The two paid links are real Lemon Squeezy checkout pages for people who
// want to support the project monthly — not a feature unlock.
const tiers = [
  {
    name: "Supporter",
    price: "$6.99",
    period: "/month",
    tagline: "A monthly thank-you that helps cover hosting.",
    href: "https://toolkitties.lemonsqueezy.com/checkout/buy/2ae43375-d5a4-4a8f-af75-2ec53e9127ac",
    cta: "Become a supporter",
    highlighted: true,
  },
  {
    name: "Business supporter",
    price: "$12.99",
    period: "/month",
    tagline: "For a team that relies on these tools and wants to give back more.",
    href: "https://toolkitties.lemonsqueezy.com/checkout/buy/5297cdd8-584f-4d8a-a6c3-67217113d80a",
    cta: "Become a business supporter",
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section id="support" className="container-content py-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">Support Toolkitties</h2>
        <p className="mt-3 text-base text-slate">
          Every tool here is free, for everyone, with no caps and no account — that doesn’t change. If Toolkitties has saved you time
          and you’d like to help keep it running, you can chip in below. It’s entirely optional.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`flex flex-col rounded-3xl border p-8 ${
              tier.highlighted ? "border-moss bg-ink text-paper shadow-xl" : "border-ink/10 bg-white text-ink"
            }`}
          >
            <h3 className="font-display text-xl font-semibold">{tier.name}</h3>
            <p className={`mt-1 text-sm ${tier.highlighted ? "text-paper/85" : "text-slate"}`}>{tier.tagline}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold">{tier.price}</span>
              <span className={`text-sm ${tier.highlighted ? "text-paper/80" : "text-slate"}`}>{tier.period}</span>
            </div>
            <p className={`mt-4 text-sm ${tier.highlighted ? "text-paper/80" : "text-slate"}`}>
              You’re not unlocking anything extra — every tool is already fully open to you. This just helps pay for hosting so it
              stays that way. Cancel anytime.
            </p>
            <a
              href={tier.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-8 rounded-full px-5 py-3 text-center text-sm font-semibold transition ${
                tier.highlighted ? "bg-paper text-ink hover:bg-sand" : "bg-ink text-paper hover:bg-ink/85"
              }`}
            >
              {tier.cta}
            </a>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-xl text-center text-xs text-slate">
        Prices are in US dollars — your bank or card provider converts to your local currency at checkout. Payments are processed by Lemon
        Squeezy, our merchant of record.
      </p>
    </section>
  );
}
