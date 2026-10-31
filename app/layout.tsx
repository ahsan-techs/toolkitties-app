import type { Metadata, Viewport } from "next";
import "./globals.css";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ThemeScript from "@/components/ThemeScript";

export const metadata: Metadata = {
  title: "Toolkitties — 67+ Free Online Tools, No Signup Required",
  description:
    "Compress, convert, and clean up PDFs, images, and text — free, private, and instant. Every tool runs in your browser. No signup, no login.",
  metadataBase: new URL("https://toolkitties.com"),
  openGraph: {
    title: "Toolkitties — 67+ Free Online Tools",
    description: "Every tool runs locally in your browser. No signup. No login. Start instantly.",
    url: "https://toolkitties.com",
    siteName: "Toolkitties",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Toolkitties — 67+ Free Online Tools",
    description: "Every tool runs locally in your browser. No signup. No login.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Toolkitties",
  },
};

export const viewport: Viewport = {
  themeColor: "#F5F6F3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <ThemeScript />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
