"use client";

import { useEffect, useRef } from "react";
import { animate, m, useInView, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { easeOutExpo } from "./ease";

type CountUpProps = { to: number; suffix?: string; duration?: number };

// Counts up to `to` when scrolled into view. The server renders the final
// number, so crawlers and no-JS visitors always see the real value.
export default function CountUp({ to, suffix = "", duration = 1.6 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const value = useMotionValue(to);
  const text = useTransform(value, (v) => `${Math.round(v)}${suffix}`);
  const armed = useRef(false);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  // Only arm the animation if the number is still below the fold.
  useEffect(() => {
    if (reduce || to === 0) return;
    const el = ref.current;
    if (!el) return;
    if (el.getBoundingClientRect().top > window.innerHeight) {
      value.set(0);
      armed.current = true;
    }
  }, [reduce, to, value]);

  useEffect(() => {
    if (!inView || !armed.current) return;
    const controls = animate(value, to, { duration, ease: easeOutExpo });
    return () => controls.stop();
  }, [inView, to, duration, value]);

  return <m.span ref={ref}>{text}</m.span>;
}
