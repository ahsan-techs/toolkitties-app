import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#F5F6F3",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
          <rect x="2" y="2" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
          <rect x="15" y="2" width="9" height="9" rx="2" fill="#1F5C4C" />
          <rect x="2" y="15" width="9" height="9" rx="2" fill="#C7862B" />
          <rect x="15" y="15" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
