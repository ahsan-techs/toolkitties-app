"use client";

import { useEffect, useRef, useState } from "react";
import { startShare, type ShareSession } from "@/lib/p2p-share";

type Status = "idle" | "connecting" | "waiting" | "connected" | "sending" | "done" | "error";

// A result's "Share securely (P2P)" option: generates a one-time link that
// streams the file directly to whoever opens it, browser to browser, for
// as long as this tab stays open — no upload, no server copy.
export default function P2PShare({ blob, filename }: { blob: Blob; filename: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [link, setLink] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const sessionRef = useRef<ShareSession | null>(null);

  useEffect(() => () => sessionRef.current?.close(), []);

  const start = async () => {
    setStatus("connecting");
    const session = startShare(blob, filename);
    sessionRef.current = session;
    session.onError((e) => {
      setErrorMsg(e);
      setStatus("error");
    });
    session.onConnected(() => setStatus("connected"));
    session.onProgress((p) => {
      setStatus("sending");
      setProgress(Math.round((p.sent / p.total) * 100));
    });
    session.onDelivered(() => setStatus("done"));
    try {
      const id = await session.peerId;
      setLink(`${window.location.origin}/shared?peer=${id}&name=${encodeURIComponent(filename)}`);
      setStatus("waiting");
    } catch {
      // onError already handled messaging
    }
  };

  const copy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (status === "idle") {
    return (
      <button
        type="button"
        onClick={start}
        className="w-full rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-moss/40"
      >
        🔗 Share securely, browser-to-browser
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-ink/10 bg-sand/30 p-4 text-sm">
      {status === "connecting" && <p className="text-slate">Setting up a secure connection…</p>}

      {(status === "waiting" || status === "connected" || status === "sending") && link && (
        <>
          <p className="font-medium text-ink">Share this link — keep this tab open until they've opened it:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 truncate rounded-lg bg-white px-3 py-2 text-xs text-ink">{link}</code>
            <button type="button" onClick={copy} className="rounded-full bg-moss px-3 py-2 text-xs font-semibold text-white">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          {status === "waiting" && <p className="text-xs text-slate">⏳ Waiting for them to open the link…</p>}
          {status === "connected" && <p className="text-xs text-slate">🔗 Connected — starting transfer…</p>}
          {status === "sending" && <p className="text-xs text-slate">📤 Sending — {progress}%</p>}
        </>
      )}

      {status === "done" && <p className="font-medium text-moss">✅ Delivered — the file went straight to their browser.</p>}
      {status === "error" && <p className="text-[#b3473c]">{errorMsg}</p>}

      <p className="text-[11px] text-slate">
        The file streams directly between browsers over an encrypted connection — it is never uploaded to or stored on a Toolkitties
        server. This only works while this tab stays open; it&apos;s not a permanent download link.
      </p>
    </div>
  );
}
