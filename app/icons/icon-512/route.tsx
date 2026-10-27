import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const s = 512;
  return new ImageResponse(
    (
      <div
        style={{
          width: s,
          height: s,
          background: "#F5F6F3",
          borderRadius: 112,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={352} height={352} viewBox="0 0 26 26" fill="none">
          <rect x="2" y="2" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
          <rect x="15" y="2" width="9" height="9" rx="2" fill="#1F5C4C" />
          <rect x="2" y="15" width="9" height="9" rx="2" fill="#C7862B" />
          <rect x="15" y="15" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
        </svg>
      </div>
    ),
    { width: s, height: s }
  );
}
