"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const catalogGroups = [
  { label: "Tools Catalog", href: "/#tools", items: ["Document & PDF Suite", "Image & Media", "Text & Data", "Calculators"] },
  { label: "Always Free", href: "/#free", items: ["Every tool is free", "No signup or login", "No daily limits", "No subscriptions"] },
  { label: "Privacy & Security", href: "/#tools", items: ["Runs 100% in your browser", "Files never touch a server", "GDPR-friendly by design"] },
];

const mobileLinks = [
  { href: "/all-tools", label: "All Tools" },
  { href: "/blog", label: "Guides and tutorials" },
  { href: "/#free", label: "Always free" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/contact", label: "Contact and feedback" },
];

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Navbar glass gets a little more solid once you start scrolling.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header data-scrolled={scrolled} className="glass-nav sticky top-0 z-50">
      <div className="container-content flex h-16 items-center justify-between">
        <a href="/" aria-label="Toolkitties home" className="flex items-center gap-2.5">
          <svg width="34" height="34" viewBox="0 0 26 26" fill="none" aria-hidden="true">
            <rect x="2" y="2" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
            <rect x="15" y="2" width="9" height="9" rx="2" fill="#1F5C4C" />
            <rect x="2" y="15" width="9" height="9" rx="2" fill="#C7862B" />
            <rect x="15" y="15" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
          </svg>
          <span className="font-display text-2xl font-bold tracking-tight text-ink md:text-[1.7rem]">Toolkitties</span>
        </a>

        <nav className="hidden items-center gap-2.5 lg:flex" aria-label="Main">
          <Link href="/all-tools" className="nav-pill">
            All Tools
          </Link>
          <Link href="/blog" className="nav-pill">
            Guides
          </Link>
          {catalogGroups.map((group) => (
            <div
              key={group.label}
              className="relative"
              onMouseEnter={() => setOpenMenu(group.label)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <button type="button" className="nav-pill" aria-haspopup="true" aria-expanded={openMenu === group.label}>
                {group.label}
              </button>
              {openMenu === group.label && (
                <div className="absolute left-0 top-full w-64 pt-2">
                  <div className="rounded-2xl border border-white/70 bg-white/90 p-2 shadow-lg backdrop-blur-xl">
                    {group.items.map((item) => (
                      <a key={item} href={group.href} className="block rounded-xl px-3 py-2 text-sm text-slate transition hover:bg-moss/10 hover:text-ink">
                        {item}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/#tools"
            className="btn-premium flex items-center gap-1.5 rounded-full border border-moss/30 bg-moss/10 px-3.5 py-1.5 text-xs font-semibold text-moss md:text-sm"
          >
            <span>⚡</span>
            <span className="hidden xl:inline">100% Free. No Signup. Start Instantly.</span>
            <span className="xl:hidden">100% Free</span>
          </a>
          <button
            type="button"
            aria-label={mobileOpen ? "Close the menu" : "Open the menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white/70 text-lg text-ink lg:hidden"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav id="mobile-menu" aria-label="Menu" className="border-t border-white/60 bg-paper/95 px-6 py-3 lg:hidden">
          {mobileLinks.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="block rounded-xl px-3 py-3 text-base font-medium text-ink hover:bg-white/70">
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
