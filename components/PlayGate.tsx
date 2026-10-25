"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// One IntersectionObserver for a whole section. The animations inside only run while the section
// is on screen (see .sc-root in globals.css), which keeps the page light on phones.
export default function PlayGate({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setPlay(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => setPlay(e.isIntersecting), { rootMargin: "80px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`sc-root ${className ?? ""}`} data-play={play}>
      {children}
    </div>
  );
}
