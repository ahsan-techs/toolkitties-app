"use client";

import { Fragment } from "react";
import { LazyMotion, domAnimation, m } from "framer-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type RevealWordsProps = {
  text: string;
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
};

// Headline reveal: each word rises out of a mask, one after another. Replays whenever
// the heading scrolls back into view. Screen readers get the full text once.
export default function RevealWords({ text, className, delay = 0 }: RevealWordsProps) {
  const words = text.split(" ");

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
                  initial={{ y: "115%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: false, amount: "some", margin: "0px 0px -10% 0px" }}
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
