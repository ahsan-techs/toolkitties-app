import type { Metadata } from "next";
import "../globals.css";
import MotionRoot from "@/components/motion/MotionRoot";

export const metadata: Metadata = {
  title: "Toolkitties — 60+ Free Online Tools, No Signup Required",
  description:
    "Compress, convert, and clean up PDFs, images, and text — free, private, and instant. Every tool runs in your browser. No signup, no login.",
  metadataBase: new URL("https://toolkitties.com"),
  openGraph: {
    title: "Toolkitties — 60+ Free Online Tools",
    description: "Every tool runs locally in your browser. No signup. No login. Start instantly.",
    url: "https://toolkitties.com",
    siteName: "Toolkitties",
    type: "website",
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Toolkitties: 60+ free online tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toolkitties — 60+ Free Online Tools",
    description: "Every tool runs locally in your browser. No signup. No login.",
    images: ["/og/home.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=localStorage.getItem("toolkitties-sidebar");var c=s?s==="collapsed":window.innerWidth<1024;if(c)document.documentElement.setAttribute("data-sidebar","collapsed")}catch(e){}`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("tk-theme");if(t&&t!=="default")document.documentElement.setAttribute("data-theme",t)}catch(e){}`,
          }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="font-body antialiased">
        <MotionRoot>{children}</MotionRoot>
      </body>
    </html>
  );
}
