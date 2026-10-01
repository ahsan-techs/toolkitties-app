"use client";

import { useEffect, useState } from "react";

// The collapsed state lives on <html data-sidebar="collapsed"> so the CSS can react to it
// before React loads (an inline script in the layout sets it from localStorage on first paint).
// This button only flips that attribute and saves the choice.
const KEY = "toolkitties-sidebar";

export default function SidebarToggle() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(document.documentElement.getAttribute("data-sidebar") === "collapsed");
  }, []);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    if (next) document.documentElement.setAttribute("data-sidebar", "collapsed");
    else document.documentElement.removeAttribute("data-sidebar");
    try {
      localStorage.setItem(KEY, next ? "collapsed" : "expanded");
    } catch {
      // Private mode / blocked storage: the toggle still works for this visit.
    }
  };

  const label = collapsed ? "Expand tools sidebar" : "Collapse tools sidebar";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-expanded={!collapsed}
      aria-controls="tools-sidebar"
      aria-label={label}
      title={label}
      className="tk-sb-toggle flex h-8 w-8 flex-none items-center justify-center rounded-lg border border-ink/10 bg-white text-ink/70 transition hover:bg-sand/60 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-moss"
    >
      <svg className="tk-sb-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 17l-5-5 5-5" />
        <path d="M18 17l-5-5 5-5" />
      </svg>
    </button>
  );
}
