"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Wraps an illustration. Everything inside is sized in "em" from the stage width (see .fx-* in
// globals.css), so it scales on every screen. Animations only run while the stage is on screen.
export default function FxStage({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setPlay(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setPlay(entry.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="fx-stage" data-play={play} role="img" aria-label={label}>
      <div className="fx-canvas" aria-hidden="true">
        {children}
      </div>
    </div>
  );
}
