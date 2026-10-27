"use client";

import { useEffect, useState } from "react";

// Phase 5: shown on every functional tool page. The badge is always on;
// the offline line only appears once the browser actually goes offline,
// proving in real time that the tool still works with no connection —
// which it can, because nothing about it depends on a server.
export default function PrivacyBadge() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setOffline(!navigator.onLine);
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  return (
    <div className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-moss/25 bg-moss/10 px-3 py-1 text-xs font-medium text-moss">
        🔒 Enterprise privacy — 100% client-side, no server uploads
      </span>
      {offline && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 bg-sand/60 px-3 py-1 text-xs font-medium text-ink">
          📡 You&apos;re offline — this tool still works, since it runs entirely on your device
        </span>
      )}
    </div>
  );
}
