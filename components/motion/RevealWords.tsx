"use client";

import { Fragment } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type RevealWordsProps = {
  text: string;
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  /**
   * "view" (default): animates in via whileInView, and replays whenever the
   * heading scrolls back into view — meant for headings further down the page.
   * "mount": animates in immediately once on mount via `animate`, no
   * viewport/IntersectionObserver involved at all. Use this for anything
   * above the fold (e.g. the hero H1): whileInView depends on the element's
   * position relative to a shrunk viewport box, which for a tall hero can
   * fail to ever fire on short viewports or slow hydration — leaving the
   * text stuck at its "initial" (invisible, translated out of its clipped
   * box) state forever. "mount" can't have that failure mode.
   */
  triggerOn?: "view" | "mount";
};

// Headline reveal: each word rises out of a mask, one after another. Screen
// readers get the full text once regardless of mode.
export default function RevealWords({ text, className, delay = 0, triggerOn = "view" }: RevealWordsProps) {
  const words = text.split(" ");
  const motionProps =
    triggerOn === "mount"
      ? { initial: { y: "115%" }, animate: { y: "0%" } }
      : { initial: { y: "115%" }, whileInView: { y: "0%" }, viewport: { once: false, amount: "some" as const, margin: "0px 0px -10% 0px" } };

  return (
    <LazyMotion features={domAnimation}>
      <span className={className}>
        <span className="sr-only">{text}</span>
        <span aria-hidden="true">
          {words.map((word, i) => (
            <Fragment key={`${word}-${i}`}>
              <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                <m.span
                  data-motion
                  className="inline-block"
                  {...motionProps}
                  transition={{ duration: 0.8, delay: delay + i * 0.06, ease: EASE }}
                >
                  {word}
                </m.span>
              </span>
              {i < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </span>
      </span>
    </LazyMotion>
  );
}
