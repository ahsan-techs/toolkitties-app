"use client";

import { useEffect, useState } from "react";

// Phase 12: lets someone rate a tool. This stores only their own rating,
// locally, so Toolkitties can remember it next time they visit — it is
// NOT wired to any aggregate/public rating count or search-result stars,
// because there's no real backend collecting ratings across visitors yet.
// Faking that number in search results would be misleading, so this stays
// an honest, personal "thanks for the feedback" widget until real
// server-side aggregation exists.
export default function RatingWidget({ toolSlug }: { toolSlug: string }) {
  const key = `tk-rating-${toolSlug}`;
  const [rating, setRating] = useState<number | null>(null);
  const [hover, setHover] = useState(0);
  const [justRated, setJustRated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setRating(Number(saved));
    } catch {
      // Storage unavailable — rating just won't persist across visits.
    }
  }, [key]);

  const rate = (n: number) => {
    setRating(n);
    setJustRated(true);
    try {
      localStorage.setItem(key, String(n));
    } catch {
      // Ignore — the rating still shows for this visit.
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5 py-1">
      <p className="text-xs font-medium text-slate">{justRated ? "Thanks for the feedback!" : "How was this tool?"}</p>
      <div className="flex gap-1" role="radiogroup" aria-label="Rate this tool">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => rate(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="text-xl leading-none transition hover:scale-110"
          >
            <span className={(hover || rating || 0) >= n ? "text-gold" : "text-ink/15"}>★</span>
          </button>
        ))}
      </div>
    </div>
  );
}
