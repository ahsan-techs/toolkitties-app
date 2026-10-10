"use client";

import { LazyMotion, domAnimation, m, useScroll, useTransform } from "framer-motion";

// A fixed layer of soft moss and gold colour that stays behind the page while it scrolls,
// so every glass surface always has something to blur. The shapes move at different
// speeds as you scroll (parallax) and slowly drift on their own. Transform only.
export default function BackgroundShapes() {
  const { scrollYProgress } = useScroll();
  const up = useTransform(scrollYProgress, [0, 1], ["0vh", "-30vh"]);
  const down = useTransform(scrollYProgress, [0, 1], ["0vh", "26vh"]);
  const upSlow = useTransform(scrollYProgress, [0, 1], ["0vh", "-16vh"]);

  return (
    <LazyMotion features={domAnimation}>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <m.div data-motion style={{ y: up }} className="absolute -left-[16vmax] -top-[10vmax] will-change-transform">
          <div className="shape-moss drift-a h-[62vmax] w-[62vmax] rounded-full" />
        </m.div>
        <m.div data-motion style={{ y: down }} className="absolute -right-[14vmax] top-[6vh] will-change-transform">
          <div className="shape-gold drift-b h-[52vmax] w-[52vmax] rounded-full" />
        </m.div>
        <m.div data-motion style={{ y: upSlow }} className="absolute -right-[8vmax] top-[62vh] will-change-transform">
          <div className="shape-moss drift-b h-[50vmax] w-[50vmax] rounded-full" />
        </m.div>
        <m.div data-motion style={{ y: down }} className="absolute -left-[12vmax] top-[70vh] will-change-transform">
          <div className="shape-gold drift-a h-[46vmax] w-[46vmax] rounded-full" />
        </m.div>
      </div>
    </LazyMotion>
  );
}
