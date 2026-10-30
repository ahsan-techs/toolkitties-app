// Genuine serverless P2P file transfer over WebRTC (via PeerJS's free public
// signaling broker — only used to help the two browsers find each other;
// the file itself streams directly between them, encrypted by WebRTC's
// mandatory DTLS, and never touches a Toolkitties server).
//
// Real constraint, stated plainly rather than glossed over: the SENDER's
// tab must stay open for the transfer to happen. There is no server
// holding the file in between — that's the whole point, but it does mean
// this is "share while you're both online," not a durable download link.

const CHUNK_SIZE = 16 * 1024; // 16KB — a safe, widely-supported WebRTC data channel message size

type Header = { kind: "header"; name: string; size: number; mime: string };
type Progress = { sent: number; total: number };

export type ShareSession = {
  peerId: Promise<string>;
  onConnected: (cb: () => void) => void;
  onProgress: (cb: (p: Progress) => void) => void;
  onDelivered: (cb: () => void) => void;
  onError: (cb: (e: string) => void) => void;
  close: () => void;
};

export function startShare(blob: Blob, filename: string): ShareSession {
  // Lazy import: PeerJS touches browser globals (RTCPeerConnection etc.) that
  // don't exist during server-side rendering, so it must only load in the browser.
  let connectedCb: () => void = () => {};
  let progressCb: (p: Progress) => void = () => {};
  let deliveredCb: () => void = () => {};
  let errorCb: (e: string) => void = () => {};
  let closed = false;
  let peerRef: import("peerjs").default | null = null;

  const peerId = import("peerjs").then(({ default: Peer }) => {
    return new Promise<string>((resolve, reject) => {
      const peer = new Peer();
      peerRef = peer;
      peer.on("open", (id) => resolve(id));
      peer.on("error", (e) => {
        errorCb(e.type === "browser-incompatible" ? "Your browser doesn't support peer-to-peer sharing." : "Connection error — try again.");
        reject(e);
      });
      peer.on("connection", (conn) => {
        conn.on("open", async () => {
          if (closed) return;
          connectedCb();
          const header: Header = { kind: "header", name: filename, size: blob.size, mime: blob.type || "application/octet-stream" };
          conn.send(header);
          const buf = await blob.arrayBuffer();
          let sent = 0;
          while (sent < buf.byteLength && !closed) {
            // Simple backpressure: don't queue more than ~1MB ahead of what's actually sent.
            while (conn.dataChannel && conn.dataChannel.bufferedAmount > 1_000_000) {
              await new Promise((r) => setTimeout(r, 50));
            }
            const chunk = buf.slice(sent, sent + CHUNK_SIZE);
            conn.send(chunk);
            sent += chunk.byteLength;
            progressCb({ sent, total: buf.byteLength });
          }
          conn.send({ kind: "eof" });
          deliveredCb();
        });
      });
    });
  });

  return {
    peerId,
    onConnected: (cb) => (connectedCb = cb),
    onProgress: (cb) => (progressCb = cb),
    onDelivered: (cb) => (deliveredCb = cb),
    onError: (cb) => (errorCb = cb),
    close: () => {
      closed = true;
      peerRef?.destroy();
    },
  };
}

export type ReceiveSession = {
  onProgress: (cb: (p: Progress) => void) => void;
  onComplete: (cb: (file: { blob: Blob; name: string }) => void) => void;
  onError: (cb: (e: string) => void) => void;
  close: () => void;
};

export function receiveShare(senderPeerId: string): ReceiveSession {
  let progressCb: (p: Progress) => void = () => {};
  let completeCb: (f: { blob: Blob; name: string }) => void = () => {};
  let errorCb: (e: string) => void = () => {};
  let peerRef: import("peerjs").default | null = null;

  import("peerjs").then(({ default: Peer }) => {
    const peer = new Peer();
    peerRef = peer;
    peer.on("open", () => {
      const conn = peer.connect(senderPeerId, { reliable: true });
      let meta: Header | null = null;
      const chunks: ArrayBuffer[] = [];
      let received = 0;

      conn.on("data", (data) => {
        if (data && typeof data === "object" && "kind" in (data as Record<string, unknown>)) {
          const d = data as Header | { kind: "eof" };
          if (d.kind === "header") {
            meta = d;
          } else if (d.kind === "eof" && meta) {
            const blob = new Blob(chunks, { type: meta.mime });
            completeCb({ blob, name: meta.name });
          }
          return;
        }
        const chunk = data as ArrayBuffer;
        chunks.push(chunk);
        received += chunk.byteLength;
        if (meta) progressCb({ sent: received, total: meta.size });
      });
      conn.on("error", () => errorCb("Lost the connection to the sender. Ask them to resend the link."));
    });
    peer.on("error", () => errorCb("Couldn't connect — the sender may have closed their tab, or the link has expired."));
  });

  return {
    onProgress: (cb) => (progressCb = cb),
    onComplete: (cb) => (completeCb = cb),
    onError: (cb) => (errorCb = cb),
    close: () => peerRef?.destroy(),
  };
}
