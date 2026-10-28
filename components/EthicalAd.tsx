"use client";

import { useEffect } from "react";

// Phase 8, Option A: a single, non-intrusive EthicalAds placement.
// EthicalAds doesn't track visitors, doesn't use cookies for targeting,
// and fits the site's privacy-first positioning far better than a
// typical programmatic ad network would.
//
// Inactive (renders nothing) until NEXT_PUBLIC_ETHICALADS_PUBLISHER_ID is
// set in Vercel's environment variables — safe to ship now, and starts
// showing real ads the moment that one variable is added, with no other
// code change needed.
export default function EthicalAd() {
  const publisherId = process.env.NEXT_PUBLIC_ETHICALADS_PUBLISHER_ID;

  useEffect(() => {
    if (!publisherId) return;
    if (document.querySelector('script[src*="media.ethicalads.io"]')) return;
    const script = document.createElement("script");
    script.src = "https://media.ethicalads.io/media/client/ethicalads.min.js";
    script.async = true;
    document.body.appendChild(script);
  }, [publisherId]);

  if (!publisherId) return null;

  return (
    <div className="mx-auto my-6 max-w-2xl">
      <div data-ea-publisher={publisherId} data-ea-type="image" className="ea-card rounded-xl border border-ink/10 p-3 text-xs" />
    </div>
  );
}
