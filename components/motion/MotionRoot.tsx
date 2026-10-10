"use client";

import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import ScrollProgress from "./ScrollProgress";

// One provider for the whole site:
// - LazyMotion + domAnimation keeps the animation bundle small.
// - reducedMotion="user" respects the visitor's OS "reduce motion" setting.
export default function MotionRoot({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <ScrollProgress />
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
