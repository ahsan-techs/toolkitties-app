import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Toolkitties — 50+ Free Online Tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5F6F3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 26 26" fill="none">
            <rect x="2" y="2" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
            <rect x="15" y="2" width="9" height="9" rx="2" fill="#1F5C4C" />
            <rect x="2" y="15" width="9" height="9" rx="2" fill="#C7862B" />
            <rect x="15" y="15" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
          </svg>
          <div style={{ fontSize: 64, fontWeight: 700, color: "#15171A" }}>Toolkitties</div>
        </div>
        <div style={{ fontSize: 32, color: "#5B5D63", marginTop: 24 }}>
          50+ free tools. No signup. Runs in your browser.
        </div>
      </div>
    ),
    { ...size }
  );
}
