"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// Language switcher that opens on tap or click (the old version only opened on mouse hover,
// which does not work reliably on phones and tablets).
export default function LanguageMenu({ current, items }: { current: string; items: { href: string; label: string; active?: boolean }[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink/80 hover:bg-sand"
      >
        {current} ▾
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 flex w-44 flex-col rounded-xl border border-ink/10 bg-white py-1 shadow-lg">
          {items.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`px-4 py-2 text-sm hover:bg-sand ${item.active ? "font-semibold text-moss" : "text-ink/80"}`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
