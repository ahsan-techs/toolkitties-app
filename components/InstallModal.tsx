"use client";

import { useEffect, useState } from "react";
import { generateQrDataUrl } from "@/lib/tool-processors/dev-tools";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Phase: a real, always-reachable "Install" entry point (button lives in the
// navbar) instead of relying only on the browser's own beforeinstallprompt
// banner, which never fires at all on Safari/iOS and is easy to miss on
// Chromium. This modal adapts to whichever install path the visitor's
// browser actually supports, and adds a QR code so a desktop visitor can
// hand the install off to their phone in one scan.
export default function InstallModal() {
  const [open, setOpen] = useState(false);
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [qrSrc, setQrSrc] = useState<string | null>(null);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !("MSStream" in window));
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setPromptEvent(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    if (!open || qrSrc) return;
    generateQrDataUrl(window.location.origin, {
      size: 220,
      dark: "#15171A",
      light: "#F5F6F3",
    })
      .then(setQrSrc)
      .catch(() => setQrSrc(null));
  }, [open, qrSrc]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Already running as an installed app — nothing to offer.
  if (isStandalone) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-premium flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 bg-white/70 text-base text-ink transition hover:border-moss/40 hover:text-moss lg:h-auto lg:w-auto lg:gap-1.5 lg:rounded-full lg:border-moss/30 lg:bg-moss/10 lg:px-3.5 lg:py-1.5 lg:text-xs lg:font-semibold lg:text-moss lg:md:text-sm"
        aria-haspopup="dialog"
        aria-label="Install Toolkitties"
      >
        <span aria-hidden="true">⬇</span>
        <span className="hidden lg:inline">Install</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-modal-title"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/40 px-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="glass-card relative w-full max-w-sm rounded-3xl border border-white/70 bg-white/95 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate hover:bg-ink/5 hover:text-ink"
            >
              ✕
            </button>

            <h2 id="install-modal-title" className="font-display text-xl font-bold text-ink">
              Install Toolkitties
            </h2>
            <p className="mt-1 text-sm text-slate">Instant loading, right from your home screen. No app store, no signup.</p>

            {installed ? (
              <p className="mt-5 rounded-2xl bg-moss/10 px-4 py-3 text-sm font-medium text-moss">✓ Installed — look for it on your home screen.</p>
            ) : promptEvent ? (
              <button
                type="button"
                onClick={async () => {
                  await promptEvent.prompt();
                  const choice = await promptEvent.userChoice;
                  if (choice.outcome === "accepted") setInstalled(true);
                  setPromptEvent(null);
                }}
                className="mt-5 w-full rounded-full bg-moss px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-moss/90"
              >
                Install now
              </button>
            ) : isIOS ? (
              <ol className="mt-5 space-y-2 text-sm text-ink">
                <li className="flex gap-2">
                  <span className="font-semibold text-moss">1.</span> Tap the <strong>Share</strong> icon <span aria-hidden="true">⬆️</span> in Safari's toolbar.
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-moss">2.</span> Scroll down and tap <strong>Add to Home Screen</strong>.
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold text-moss">3.</span> Tap <strong>Add</strong> — Toolkitties is on your home screen.
                </li>
              </ol>
            ) : (
              <p className="mt-5 rounded-2xl bg-sand/40 px-4 py-3 text-sm text-ink">
                Look for the install icon <span aria-hidden="true">⊕</span> in your browser's address bar, or use your browser's menu → <strong>Install app</strong>.
              </p>
            )}

            <div className="mt-6 flex items-center gap-4 border-t border-ink/10 pt-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-ink/10 bg-paper">
                {qrSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrSrc} alt="QR code to open Toolkitties on your phone" width={96} height={96} />
                ) : (
                  <span className="text-[10px] text-slate">Loading…</span>
                )}
              </div>
              <p className="text-sm text-slate">
                On a different device? <span className="font-medium text-ink">Scan with your phone's camera</span> to open Toolkitties there and install it the same way.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
