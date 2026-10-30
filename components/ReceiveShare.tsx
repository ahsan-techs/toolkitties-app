"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { receiveShare, type ReceiveSession } from "@/lib/p2p-share";

type Status = "connecting" | "receiving" | "done" | "error";

export default function ReceiveShare({ peerId, expectedName }: { peerId: string; expectedName?: string }) {
  const [status, setStatus] = useState<Status>("connecting");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ url: string; name: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const sessionRef = useRef<ReceiveSession | null>(null);

  useEffect(() => {
    const session = receiveShare(peerId);
    sessionRef.current = session;
    session.onProgress((p) => {
      setStatus("receiving");
      setProgress(p.total ? Math.round((p.sent / p.total) * 100) : 0);
    });
    session.onComplete(({ blob, name }) => {
      setResult({ url: URL.createObjectURL(blob), name });
      setStatus("done");
    });
    session.onError((e) => {
      setErrorMsg(e);
      setStatus("error");
    });
    return () => session.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerId]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-5 rounded-3xl border border-ink/10 bg-white p-8 text-center shadow-sm">
      {status === "connecting" && (
        <>
          <p className="text-4xl">🔗</p>
          <p className="font-display text-xl font-semibold text-ink">Connecting to the sender…</p>
          <p className="text-sm text-slate">{expectedName ? `Receiving "${expectedName}"` : "Setting up a secure connection"} — this only works while the sender keeps their tab open.</p>
        </>
      )}

      {status === "receiving" && (
        <>
          <p className="text-4xl">📥</p>
          <p className="font-display text-xl font-semibold text-ink">Receiving — {progress}%</p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-sand">
            <div className="h-full bg-moss transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-slate">Streaming directly from their browser to yours.</p>
        </>
      )}

      {status === "done" && result && (
        <>
          <p className="text-4xl">✅</p>
          <p className="font-display text-xl font-semibold text-ink">Delivered</p>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-moss/25 bg-moss/10 px-3 py-1 text-xs font-medium text-moss">
            🔒 Encrypted peer-to-peer transfer — never touched a server
          </p>
          <a href={result.url} download={result.name} className="rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white hover:bg-moss/90">
            Download {result.name}
          </a>

          <div className="mt-4 w-full rounded-2xl border border-ink/10 bg-sand/30 p-5 text-left">
            <p className="text-sm font-medium text-ink">Tired of uploading files to someone else&apos;s server?</p>
            <p className="mt-1 text-sm text-slate">
              Toolkitties has 67+ free tools — compress, convert, sign, and edit files — that run entirely in your own browser, just like
              the transfer you just received.
            </p>
            <Link href="/all-tools" className="mt-3 inline-block rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-white hover:bg-ink/85">
              Try a tool yourself →
            </Link>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <p className="text-4xl">⚠️</p>
          <p className="font-display text-xl font-semibold text-ink">Couldn&apos;t connect</p>
          <p className="text-sm text-slate">{errorMsg}</p>
          <Link href="/" className="rounded-full border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink">
            Go to Toolkitties
          </Link>
        </>
      )}
    </div>
  );
}
