"use client";

import { useRef, type ReactNode } from "react";
import { LazyMotion, domAnimation, m, useScroll, useSpring, useTransform } from "framer-motion";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Drift in px each way while the element crosses the screen. */
  distance?: number;
  /** Degrees of tilt as it enters and leaves (0 = flat). */
  tilt?: number;
};

// Scroll-linked depth: the element drifts, tilts toward you as it rises into the middle
// of the screen, and settles flat. Tied directly to scroll (so it plays backwards when
// you scroll up) and smoothed with a spring. The outer div stays still because it is
// the thing being measured; only the inner one moves, via transform.
export default function Parallax({ children, className, distance = 16, tilt = 10 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.6 });

  const y = useTransform(p, [0, 1], [distance, -distance]);
  const rotateX = useTransform(p, [0, 0.35, 0.65, 1], [tilt, 0, 0, -tilt * 0.6]);
  const scale = useTransform(p, [0, 0.3, 0.7, 1], [0.92, 1, 1, 0.97]);

  return (
    <LazyMotion features={domAnimation}>
      <div ref={ref} className={className} style={{ perspective: 1200 }}>
        <m.div data-motion style={{ y, rotateX, scale, transformOrigin: "50% 60%" }} className="will-change-transform">
          {children}
        </m.div>
      </div>
    </LazyMotion>
  );
}
