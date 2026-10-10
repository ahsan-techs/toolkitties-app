"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";
import { easeOutExpo } from "./ease";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  // Above-the-fold content must never start hidden (protects LCP): pass eager.
  eager?: boolean;
};

// Fades + lifts content into place once, the first time it scrolls into view.
export default function Reveal({ children, className, delay = 0, y = 24, eager = false }: RevealProps) {
  if (eager) return <div className={className}>{children}</div>;

  return (
    <m.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.7, delay, ease: easeOutExpo }}
    >
      {children}
    </m.div>
  );
}
