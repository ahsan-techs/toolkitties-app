const plans = [
  {
    name: "Starter Framework",
    price: "$0",
    period: "/forever",
    tagline: "Everything you need for occasional use.",
    features: ["Standard browser-core tools", "3 daily actions", "Files never leave your device", "No account required"],
    cta: "Use Instantly",
    href: "#tools",
    highlighted: false,
  },
  {
    name: "Ultimate Pro Bundle",
    price: "$6.99",
    period: "/month",
    tagline: "For anyone who lives in these tools daily.",
    features: [
      "Uncapped access to every tool",
      "Multi-thread browser processing engine",
      "Priority operations queue",
      "No file size caps",
    ],
    cta: "Upgrade to Pro",
    href: "https://toolkitties.lemonsqueezy.com/checkout/buy/2ae43375-d5a4-4a8f-af75-2ec53e9127ac",
    highlighted: true,
  },
  {
    name: "Business Matrix",
    price: "$12.99",
    period: "/month",
    tagline: "For teams and studios sharing one workspace.",
    features: ["Everything in Pro", "Multi-seat environment", "Open developer API modules", "Priority support"],
    cta: "Talk to Sales",
    href: "https://toolkitties.lemonsqueezy.com/checkout/buy/5297cdd8-584f-4d8a-a6c3-67217113d80a",
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="container-content py-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">Simple pricing, no surprises</h2>
        <p className="mt-3 text-base text-slate">Start free. Upgrade only when you actually need more.</p>
        <p className="mt-2 text-xs text-slate">Prices are in US dollars — your bank or card provider converts to your local currency at checkout.</p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-3xl border p-8 ${
              plan.highlighted ? "border-moss bg-ink text-paper shadow-xl md:-translate-y-3" : "border-ink/10 bg-white text-ink"
            }`}
          >
            {plan.highlighted && (
              <span className="mb-4 w-fit rounded-full bg-moss px-3 py-1 text-xs font-semibold text-paper">Most popular</span>
            )}
            <h3 className="font-display text-xl font-semibold">{plan.name}</h3>
            <p className={`mt-1 text-sm ${plan.highlighted ? "text-paper/85" : "text-slate"}`}>{plan.tagline}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-semibold">{plan.price}</span>
              <span className={`text-sm ${plan.highlighted ? "text-paper/80" : "text-slate"}`}>{plan.period}</span>
            </div>
            <ul className="mt-6 flex flex-1 flex-col gap-3">
              {plan.features.map((f) => (
                <li key={f} className={`flex items-start gap-2 text-sm ${plan.highlighted ? "text-paper/90" : "text-ink/80"}`}>
                  <span className={plan.highlighted ? "text-gold" : "text-moss"}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={plan.href}
              className={`mt-8 rounded-full px-5 py-3 text-center text-sm font-semibold transition ${
                plan.highlighted ? "bg-paper text-ink hover:bg-sand" : "bg-ink text-paper hover:bg-ink/85"
              }`}
            >
              {plan.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
