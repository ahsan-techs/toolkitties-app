"use client";

import { LazyMotion, domAnimation, m, useScroll, useSpring } from "framer-motion";

// Thin moss-to-gold progress line at the very top of the page. Scales with transform
// only, smoothed with a spring. Hidden for reduced-motion users (.scroll-progress rule).
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        aria-hidden="true"
        className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-moss to-gold"
        style={{ scaleX, transformOrigin: "0% 50%" }}
      />
    </LazyMotion>
  );
}
