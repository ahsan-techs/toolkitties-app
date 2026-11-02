"use client";

import type { PointerEvent } from "react";
import Link from "next/link";

export default function DeviceCard({ href, icon, title, text }: { href: string; icon: string; title: string; text: string }) {
  function handlePointerMove(e: PointerEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <Link href={href} onPointerMove={handlePointerMove} className="glass-card group flex h-full flex-col gap-4 rounded-3xl p-7">
      <span aria-hidden="true" className="card-glow">
        <span className="card-glow-ring" />
      </span>
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-moss/10 to-gold/15 text-3xl transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
        {icon}
      </span>
      <div>
        <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
        <p className="mt-1.5 text-sm text-slate">{text}</p>
      </div>
      <span className="mt-auto flex items-center gap-1.5 text-sm font-semibold text-moss">
        See how
        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}
