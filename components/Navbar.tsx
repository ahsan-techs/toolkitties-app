"use client";

import { useState } from "react";

type MenuItem = { label: string; href: string };

const catalogGroups: { label: string; items: MenuItem[] }[] = [
  {
    label: "Tools Catalog",
    items: [
      { label: "Document & PDF Suite", href: "/#tools" },
      { label: "Image & Media", href: "/#tools" },
      { label: "Text & Data", href: "/#tools" },
      { label: "Calculators", href: "/#tools" },
    ],
  },
  {
    label: "Pro Features",
    items: [
      { label: "Unlimited daily actions", href: "/#pricing" },
      { label: "Priority processing queue", href: "/#pricing" },
      { label: "No file size caps", href: "/#pricing" },
    ],
  },
  {
    label: "Privacy & Security",
    items: [
      { label: "Runs 100% in your browser", href: "/#tools" },
      { label: "Files never touch a server", href: "/#tools" },
      { label: "GDPR-friendly by design", href: "/#tools" },
    ],
  },
];

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-white/60 bg-paper/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="container-content flex h-16 items-center justify-between">
        <a href="/" className="group flex items-center gap-2">
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            className="transition-transform duration-500 group-hover:rotate-90"
          >
            <rect x="2" y="2" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
            <rect x="15" y="2" width="9" height="9" rx="2" fill="#1F5C4C" />
            <rect x="2" y="15" width="9" height="9" rx="2" fill="#C7862B" />
            <rect x="15" y="15" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
          </svg>
          <span className="font-display text-lg font-semibold tracking-tight">Toolkitties</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {catalogGroups.map((group) => (
            <div
              key={group.label}
              className="relative"
              onMouseEnter={() => setOpenMenu(group.label)}
              onMouseLeave={() => setOpenMenu(null)}
              onFocus={() => setOpenMenu(group.label)}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenMenu(null);
              }}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={openMenu === group.label}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink/80 transition hover:bg-white/70 hover:text-ink"
              >
                {group.label}
              </button>
              {openMenu === group.label && (
                <div className="glass absolute left-0 top-full w-64 rounded-2xl p-2">
                  {group.items.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block rounded-xl px-3 py-2 text-sm text-slate transition hover:bg-moss/10 hover:text-ink"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <a
          href="/#tools"
          className="btn-premium flex items-center gap-1.5 rounded-full border border-moss/30 bg-moss/10 px-3.5 py-1.5 text-xs font-semibold text-moss md:text-sm"
        >
          <span>⚡</span>
          <span>No Signup. No Login. Start Instantly.</span>
        </a>
      </div>
    </header>
  );
}
