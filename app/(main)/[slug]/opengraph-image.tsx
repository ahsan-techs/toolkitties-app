import { ImageResponse } from "next/og";
import { findTool } from "@/lib/tools-data";
import { findVariant } from "@/lib/tool-variants";

export const runtime = "edge";
export const alt = "Toolkitties tool preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image({ params }: { params: { slug: string } }) {
  const found = findTool(params.slug);
  const variant = found ? null : findVariant(params.slug);
  const underlyingIcon = found?.tool.icon ?? (variant ? findTool(variant.toolSlug)?.tool.icon : undefined);
  const name = found?.tool.name ?? variant?.name ?? "Toolkitties";
  const icon = underlyingIcon ?? "🛠️";

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
        <div style={{ fontSize: 100 }}>{icon}</div>
        <div style={{ fontSize: 56, fontWeight: 700, color: "#15171A", marginTop: 20 }}>{name}</div>
        <div style={{ fontSize: 28, color: "#5B5D63", marginTop: 16 }}>
          Free · No signup · Runs in your browser — Toolkitties
        </div>
      </div>
    ),
    { ...size }
  );
}
