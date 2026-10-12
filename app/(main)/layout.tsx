import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Toolkitties — 50+ Free Online Tools, No Signup Required",
  description:
    "Compress, convert, and clean up PDFs, images, and text — free, private, and instant. Every tool runs in your browser. No signup, no login.",
  metadataBase: new URL("https://toolkitties.com"),
  openGraph: {
    title: "Toolkitties — 50+ Free Online Tools",
    description: "Every tool runs locally in your browser. No signup. No login. Start instantly.",
    url: "https://toolkitties.com",
    siteName: "Toolkitties",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toolkitties — 50+ Free Online Tools",
    description: "Every tool runs locally in your browser. No signup. No login.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
