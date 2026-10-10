"use client";

import { m, useScroll, useSpring } from "framer-motion";

// Thin reading-progress bar pinned to the very top of the page.
// Driven by a motion value, so scrolling never triggers a React re-render.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 220, damping: 32, mass: 0.4 });

  return (
    <m.div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-moss via-moss to-gold"
      style={{ scaleX }}
    />
  );
}
