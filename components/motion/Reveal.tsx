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
};

// Fades in and moves a few pixels into place once, when it scrolls into view.
// Only opacity + transform are animated. Reduced motion is handled in
// globals.css via [data-motion], so server and client always render the same HTML.
export default function Reveal({ children, className, delay = 0, y = 20, x = 0 }: RevealProps) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        data-motion
        className={className}
        initial={{ opacity: 0, y, x }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay, ease: EASE }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
