"use client";

import { useState } from "react";

// Small "Copy link" button. Falls back to a prompt where the clipboard API is not available.
export default function CopyLink({ url }: { url: string }) {
  const [done, setDone] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  }
  return (
    <button type="button" onClick={copy} className="bl-share-btn" aria-live="polite">
      {done ? "Copied!" : "Copy link"}
    </button>
  );
}
