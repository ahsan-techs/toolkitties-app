"use client";

import { LazyMotion, domAnimation, m, useScroll } from "framer-motion";

// Thin moss progress line at the very top of the page. Scales with transform only.
// Hidden for reduced-motion users via the .scroll-progress rule in globals.css.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        aria-hidden="true"
        className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-0.5 bg-moss"
        style={{ scaleX: scrollYProgress, transformOrigin: "0% 50%" }}
      />
    </LazyMotion>
  );
}
