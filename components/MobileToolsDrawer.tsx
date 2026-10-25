"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toolGroups } from "@/lib/tools-data";

// Phones have no room for a side menu, so the full tools list opens as a drawer from the left.
// It is only shown on small screens (see .tk-mobile-only in globals.css).
export default function MobileToolsDrawer({ currentSlug }: { currentSlug: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  // Start with an empty search every time the drawer is opened.
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // the page behind the drawer should not scroll
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const term = query.trim().toLowerCase();
  const groups = toolGroups
    .map((g) => ({ ...g, tools: g.tools.filter((t) => !term || t.name.toLowerCase().includes(term)) }))
    .filter((g) => g.tools.length > 0);

  return (
    <div className="tk-mobile-only">
      <button type="button" className="tk-drawer-open" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>
        <span aria-hidden="true">☰</span> All tools
      </button>
      {open && (
        <div className="tk-drawer-root" role="dialog" aria-modal="true" aria-label="All tools">
          <button type="button" className="tk-drawer-backdrop" aria-label="Close the tools list" onClick={() => setOpen(false)} />
          <div className="tk-drawer-panel">
            <div className="tk-drawer-head">
              <strong>All tools</strong>
              <button ref={closeRef} type="button" className="tk-drawer-close" aria-label="Close the tools list" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>
            <input
              type="search"
              className="tk-drawer-search"
              placeholder="Search tools"
              aria-label="Search tools"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <nav className="tk-drawer-list" aria-label="Tools">
              {groups.length === 0 && <p className="tk-drawer-empty">No tool matches that search.</p>}
              {groups.map((g) => (
                <div key={g.id}>
                  <p className="tk-drawer-group">
                    {g.icon} {g.title}
                  </p>
                  {g.tools.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/${t.slug}`}
                      className="tk-drawer-link"
                      aria-current={t.slug === currentSlug ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      <span aria-hidden="true">{t.icon}</span>
                      {t.name}
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
