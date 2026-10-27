"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "tk-install-dismissed";

// Phase 7: a quiet, dismissible banner — never a modal, never blocks the
// tool itself. Only Chromium-based browsers fire this event; Safari/iOS
// users add to home screen via their own share-sheet flow, which this
// component doesn't try to replicate.
export default function InstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  if (!promptEvent || dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border border-ink/10 bg-white px-4 py-3 shadow-lg">
      <span className="text-xl">⚡</span>
      <div className="flex-1 text-sm text-ink">
        <p className="font-medium">Install Toolkitties</p>
        <p className="text-xs text-slate">Instant loading, right from your home screen.</p>
      </div>
      <button
        type="button"
        onClick={async () => {
          await promptEvent.prompt();
          await promptEvent.userChoice;
          setPromptEvent(null);
        }}
        className="rounded-full bg-moss px-3 py-1.5 text-xs font-semibold text-white"
      >
        Install
      </button>
      <button type="button" onClick={dismiss} aria-label="Dismiss" className="text-slate">
        ✕
      </button>
    </div>
  );
}
