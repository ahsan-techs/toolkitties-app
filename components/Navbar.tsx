"use client";

import { useState } from "react";

const catalogGroups = [
  { label: "50+ Premium Tools", items: ["Document & PDF Suite", "Image & Media", "Text & Data", "Calculators"] },
  { label: "100% Free Forever", items: ["Unlimited daily actions", "Priority processing queue", "No file size caps"] },
];

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect x="2" y="2" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
            <rect x="15" y="2" width="9" height="9" rx="2" fill="#1F5C4C" />
            <rect x="2" y="15" width="9" height="9" rx="2" fill="#C7862B" />
            <rect x="15" y="15" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
          </svg>
          <span className="font-display text-lg font-semibold tracking-tight">Toolkitties</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {catalogGroups.map((group) => (
            <div
              key={group.label}
              className="relative"
              onMouseEnter={() => setOpenMenu(group.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button className="rounded-full px-4 py-2 text-sm font-medium text-ink/80 transition hover:bg-sand hover:text-ink">
                {group.label}
              </button>
              {openMenu === group.label && (
                <div className="absolute left-0 top-full w-64 rounded-2xl border border-ink/10 bg-white p-2 shadow-lg">
                  {group.items.map((item) => (
                    <div key={item} className="rounded-xl px-3 py-2 text-sm text-slate hover:bg-sand hover:text-ink">
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <a
          href="#tools"
          className="flex items-center gap-1.5 rounded-full border border-moss/30 bg-moss/10 px-3.5 py-1.5 text-xs font-semibold text-moss md:text-sm"
        >
          <span>⚡</span>
          <span>No Signup. No Login. Start Instantly.</span>
        </a>
      </div>
    </header>
  );
}
