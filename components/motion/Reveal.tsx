"use client";

import type { ReactNode } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before the reveal starts (use for gentle staggering). */
  delay?: number;
  /** Upward travel in px (starts this far below its final position). */
  y?: number;
  /** Sideways travel in px (positive = starts to the right). */
  x?: number;
  /** Starting scale (1 = no scale). */
  scale?: number;
  /** Play on page load instead of waiting to scroll into view (for content at the top of a page). */
  eager?: boolean;
  /** Play only the first time it appears. Default: replays every time it scrolls back into view. */
  once?: boolean;
  /** Tolerate any extra props passed by older callers. */
  [key: string]: unknown;
};

// Fades in and settles into place whenever it scrolls into view (and again each time
// it comes back). Only opacity + transform are animated. Reduced motion is handled in
// globals.css via [data-motion], so server and client always render the same HTML.
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  x = 0,
  scale = 1,
  eager = false,
  once = false,
}: RevealProps) {
  const shown = { opacity: 1, y: 0, x: 0, scale: 1 };

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        data-motion
        className={className}
        initial={{ opacity: 0, y, x, scale }}
        animate={eager ? shown : undefined}
        whileInView={eager ? undefined : shown}
        viewport={{ once, amount: "some", margin: "0px 0px -80px 0px" }}
        transition={{ duration: 0.75, delay, ease: EASE }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
