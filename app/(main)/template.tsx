"use client";

import { LazyMotion, domAnimation, m } from "framer-motion";

// Next.js's template.tsx convention (distinct from layout.tsx) re-mounts on every
// navigation within this route group, which is exactly what a one-shot "page enters"
// animation needs. This is the safe way to get a smooth, fluid cross-route feel in the
// App Router: a true AnimatePresence exit-animation setup (old page fading out while
// the new one fades in) needs the route tree, scroll restoration and Suspense
// boundaries to all cooperate, and is easy to get subtly wrong in ways that only show
// up on some navigations. A template-driven enter animation has no such failure mode —
// it can only ever run on mount, for the page that's actually there.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      {/* Opacity-only, deliberately: a transform here would move every descendant's
          geometry for the first ~0.3s, and this wraps literally every page, so any
          edge case in that interaction would be site-wide rather than local to one
          component. Opacity alone still reads as a smooth arrival and carries zero
          layout/positioning risk. */}
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: "easeOut" }}>
        {children}
      </m.div>
    </LazyMotion>
  );
}
