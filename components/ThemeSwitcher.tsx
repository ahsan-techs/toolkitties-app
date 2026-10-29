"use client";

import { useEffect, useRef, useState } from "react";

const THEMES = [
  { id: "default", name: "Default Clean", swatch: "#1F5C4C" },
  { id: "cyberpunk", name: "Cyberpunk Neon", swatch: "#00D4FF" },
  { id: "dracula", name: "Dracula", swatch: "#BD93F9" },
  { id: "coffee", name: "Coffee Shop", swatch: "#6F4E37" },
  { id: "rosegold", name: "Rose Gold Pastel", swatch: "#D88C9A" },
] as const;

const STORAGE_KEY = "tk-theme";

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("default");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "default");
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const applyTheme = (id: string) => {
    setTheme(id);
    setOpen(false);
    if (id === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", id);
    }
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Private browsing or storage disabled — the theme still applies for this visit, just won't persist.
    }
  };

  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Change workspace theme"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-white transition hover:border-moss/50"
      >
        <span className="h-4 w-4 rounded-full" style={{ backgroundColor: current.swatch }} />
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-56 rounded-2xl border border-ink/10 bg-white p-2 shadow-lg">
          <p className="px-2 py-1 text-xs font-medium text-slate">Workspace theme</p>
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTheme(t.id)}
              className={`flex w-full items-center gap-2.5 rounded-xl px-2 py-2 text-left text-sm transition hover:bg-sand/40 ${
                theme === t.id ? "bg-sand/50 font-semibold text-ink" : "text-ink/80"
              }`}
            >
              <span className="h-4 w-4 flex-shrink-0 rounded-full border border-ink/10" style={{ backgroundColor: t.swatch }} />
              {t.name}
              {theme === t.id && <span className="ml-auto text-moss">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
