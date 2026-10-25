"use client";

import { useRef, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { allTools } from "@/lib/tools-data";
import Reveal from "./motion/Reveal";

const toolCount = allTools.filter((t) => t.functional).length;

const layer = (z: number, d = 0): CSSProperties => ({ ["--z" as string]: `${z}px`, ["--d" as string]: `${d}s` });

// Tilts toward the mouse (mouse only; touch screens and "reduce motion" stay flat).
function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-active");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.classList.add("is-active");
    el.style.setProperty("--ry", `${((px - 0.5) * 14).toFixed(2)}deg`);
    el.style.setProperty("--rx", `${((0.5 - py) * 14).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
  };

  return (
    <div className="tilt-scene">
      <div ref={ref} className="tilt-card" onPointerMove={move} onPointerLeave={reset}>
        <span aria-hidden="true" className="tilt-shine" />
        {children}
      </div>
    </div>
  );
}

function Ticks({ items }: { items: string[] }) {
  return (
    <ul className="f3d-points">
      {items.map((item) => (
        <li key={item}>
          <span aria-hidden="true" className="f3d-tick">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

function FreeArt() {
  return (
    <div className="f3d-art" aria-hidden="true">
      <div className="f3d-layer" style={{ left: "14%", right: "14%", top: "2.2rem", height: "5.6rem", background: "rgba(31,92,76,0.14)", border: "1px solid rgba(31,92,76,0.2)", ...layer(0) }} />
      <div className="f3d-layer" style={{ left: "8%", right: "8%", top: "1.2rem", height: "5.6rem", background: "rgba(255,255,255,0.95)", border: "1px solid rgba(21,23,26,0.1)", boxShadow: "0 10px 24px -14px rgba(21,23,26,0.35)", ...layer(26) }} />
      <div className="f3d-layer f3d-float" style={{ left: "2%", right: "2%", top: "0.2rem", height: "5.6rem", flexDirection: "column", background: "linear-gradient(135deg,#1f5c4c,#2c7a65)", color: "#f5f6f3", boxShadow: "0 18px 30px -14px rgba(31,92,76,0.65)", ...layer(54) }}>
        <span style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 600, lineHeight: 1 }}>Free</span>
        <span style={{ marginTop: 4, fontSize: "0.75rem", opacity: 0.85 }}>no plans, no limits</span>
      </div>
    </div>
  );
}

function PrivacyArt() {
  return (
    <div className="f3d-art" aria-hidden="true">
      <div className="f3d-layer" style={{ left: "2%", right: "2%", top: "0.4rem", height: "7rem", alignItems: "flex-start", justifyContent: "flex-start", background: "#15171a", boxShadow: "0 14px 28px -16px rgba(21,23,26,0.6)", ...layer(0) }}>
        <span style={{ display: "flex", gap: 5, padding: "10px 12px" }}>
          <i style={{ width: 8, height: 8, borderRadius: 9, background: "rgba(245,246,243,0.3)" }} />
          <i style={{ width: 8, height: 8, borderRadius: 9, background: "rgba(245,246,243,0.3)" }} />
          <i style={{ width: 8, height: 8, borderRadius: 9, background: "rgba(245,246,243,0.3)" }} />
        </span>
      </div>
      <div className="f3d-layer f3d-float" style={{ left: "50%", top: "1.5rem", width: "4.2rem", height: "4.2rem", marginLeft: "-2.1rem", borderRadius: 999, fontSize: "1.7rem", background: "linear-gradient(135deg,#1f5c4c,#3fbf98)", boxShadow: "0 16px 28px -12px rgba(63,191,152,0.7)", ...layer(46) }}>
        🔒
      </div>
      <div className="f3d-layer f3d-float" style={{ left: "50%", bottom: "0.2rem", marginLeft: "-5rem", width: "10rem", height: "1.9rem", borderRadius: 999, fontSize: "0.72rem", fontWeight: 700, color: "#15171a", background: "#e9b04f", boxShadow: "0 10px 20px -10px rgba(199,134,43,0.8)", ...layer(70, 0.8) }}>
        Stays on your device
      </div>
    </div>
  );
}

function ToolsArt() {
  const tiles = [
    { icon: "📄", left: "6%", top: "0.3rem", z: 30, d: 0 },
    { icon: "🖼️", left: "36%", top: "1.6rem", z: 56, d: 0.6 },
    { icon: "🔤", left: "66%", top: "0.3rem", z: 36, d: 1.2 },
    { icon: "🧮", left: "20%", top: "5.1rem", z: 64, d: 1.8 },
    { icon: "🔑", left: "52%", top: "5.1rem", z: 28, d: 2.4 },
  ];
  return (
    <div className="f3d-art" aria-hidden="true">
      {tiles.map((t) => (
        <div
          key={t.icon}
          className="f3d-layer f3d-float"
          style={{ left: t.left, top: t.top, width: "3.7rem", height: "3.7rem", fontSize: "1.6rem", background: "rgba(255,255,255,0.95)", border: "1px solid rgba(21,23,26,0.08)", boxShadow: "0 14px 24px -12px rgba(21,23,26,0.4)", ...layer(t.z, t.d) }}
        >
          {t.icon}
        </div>
      ))}
    </div>
  );
}

export default function FeatureCards3D() {
  return (
    <section id="why" aria-labelledby="why-title" className="container-content py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="inline-block rounded-full border border-moss/20 bg-white/60 px-4 py-1.5 font-display text-sm font-medium text-moss">
          Why people use Toolkitties
        </p>
        <h2 id="why-title" className="mt-4 font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">
          Free, private and ready when you are
        </h2>
        <p className="mt-3 text-base text-slate">No account to create and nothing to install. Open a tool and get the job done.</p>
      </Reveal>

      <div className="f3d-grid mt-12">
        <Reveal y={36} delay={0}>
          <TiltCard>
            <FreeArt />
            <h3 className="f3d-title">Free, start to finish</h3>
            <p className="f3d-copy">Every tool is free to use. There is no paywall waiting at the end of your task.</p>
            <Ticks items={["No signup or login", "No daily limits", "No paid plans"]} />
          </TiltCard>
        </Reveal>
        <Reveal y={36} delay={0.1}>
          <TiltCard>
            <PrivacyArt />
            <h3 className="f3d-title">Private by design</h3>
            <p className="f3d-copy">Your files are processed inside your browser, so they stay on your device.</p>
            <Ticks items={["Files are not sent to our servers", "Nothing to install", "AES-256 password protection for PDFs"]} />
          </TiltCard>
        </Reveal>
        <Reveal y={36} delay={0.2}>
          <TiltCard>
            <ToolsArt />
            <h3 className="f3d-title">Tools that really work</h3>
            <p className="f3d-copy">Pick a tool, drop your file or text, and download the result in seconds.</p>
            <Ticks items={[`${toolCount} working tools`, "PDF, image, text and calculators", "Available in 9 languages"]} />
          </TiltCard>
        </Reveal>
      </div>
    </section>
  );
}
