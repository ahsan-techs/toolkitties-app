"use client";

import { useEffect, useState } from "react";
import { generateQrDataUrl } from "@/lib/tool-processors/dev-tools";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// Toolkitties has no native app in any app store — it's a Progressive Web App, installed
// straight from the browser. This panel is the honest, inline version of that install
// flow for the /apps device pages: a live "Install now" button where the browser
// actually supports it, accurate steps where it doesn't (iOS Safari has no install
// prompt API at all), and a QR code so a desktop visitor can hand the install off to
// their phone. Nothing here claims an app-store listing that doesn't exist.
export default function InstallPanel({ platform }: { platform: "desktop" | "android" | "ios" }) {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  // Detected from the visitor's own browser, not just the `platform` prop — the
  // /apps/ios page passes platform="ios" because that page IS about iOS, but the
  // generic /apps "scan this on whatever you're holding" panel passes a fixed prop
  // that won't match everyone looking at it, so real detection takes priority.
  const [detectedIOS, setDetectedIOS] = useState(platform === "ios");

  useEffect(() => {
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
    setDetectedIOS(/iPad|iPhone|iPod/.test(window.navigator.userAgent) && !("MSStream" in window));
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
    generateQrDataUrl(window.location.origin, { size: 260, dark: "#15171A", light: "#F5F6F3" })
      .then(setQrSrc)
      .catch(() => setQrSrc(null));
  }, []);

  return (
    <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-center">
      <div>
        {isStandalone || installed ? (
          <p className="rounded-2xl bg-moss/10 px-5 py-4 text-sm font-medium text-moss">
            ✓ You already have Toolkitties installed on this device.
          </p>
        ) : promptEvent ? (
          <button
            type="button"
            onClick={async () => {
              await promptEvent.prompt();
              const choice = await promptEvent.userChoice;
              if (choice.outcome === "accepted") setInstalled(true);
              setPromptEvent(null);
            }}
            className="btn-premium rounded-full bg-moss px-7 py-3.5 text-sm font-semibold text-white hover:bg-moss/90 md:text-base"
          >
            Install now — it takes 2 seconds
          </button>
        ) : detectedIOS ? (
          <ol className="space-y-3 text-sm text-ink md:text-base">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-moss text-xs font-bold text-white">1</span>
              Open <strong>toolkitties.com</strong> in Safari (the install button only works in Safari on iOS).
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-moss text-xs font-bold text-white">2</span>
              Tap the <strong>Share</strong> icon <span aria-hidden="true">⬆️</span> in the toolbar.
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-moss text-xs font-bold text-white">3</span>
              Scroll down and tap <strong>Add to Home Screen</strong>, then <strong>Add</strong>.
            </li>
          </ol>
        ) : (
          <p className="rounded-2xl bg-sand/40 px-5 py-4 text-sm text-ink md:text-base">
            Open <strong>toolkitties.com</strong> here, then look for the install icon <span aria-hidden="true">⊕</span> in your
            browser’s address bar — or open the browser menu and choose <strong>Install app</strong>.
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 rounded-3xl border border-ink/10 bg-white/70 p-6 text-center">
        <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-2xl border border-ink/10 bg-paper">
          {qrSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrSrc} alt="QR code that opens toolkitties.com" width={160} height={160} />
          ) : (
            <span className="text-xs text-slate">Loading…</span>
          )}
        </div>
        <p className="text-xs text-slate">Scan with your phone’s camera to open Toolkitties there and install it the same way.</p>
      </div>
    </div>
  );
}
