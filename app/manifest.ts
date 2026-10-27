import type { MetadataRoute } from "next";

// Phase 7: lets people install Toolkitties to their phone or desktop home
// screen for zero-latency app-like loading next time.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Toolkitties — Free Online Tools",
    short_name: "Toolkitties",
    description: "67+ free, private PDF, image, and developer tools that run entirely in your browser — no uploads, no signup.",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F6F3",
    theme_color: "#F5F6F3",
    icons: [
      { src: "/icons/icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
