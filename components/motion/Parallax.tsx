"use client";

import { useRef, type ReactNode } from "react";
import { LazyMotion, domAnimation, m, useScroll, useTransform } from "framer-motion";

type ParallaxProps = {
  children: ReactNode;
  className?: string;
  /** Total drift in px each way while the element crosses the screen. Keep it small. */
  distance?: number;
};

// A tiny vertical drift tied to scroll. The outer div stays still (it is measured);
// only the inner one moves, and only via transform.
export default function Parallax({ children, className, distance = 12 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);

  return (
    <LazyMotion features={domAnimation}>
      <div ref={ref} className={className}>
        <m.div data-motion style={{ y }} className="will-change-transform">
          {children}
        </m.div>
      </div>
    </LazyMotion>
  );
}
