import type { Metadata, Viewport } from "next";
import "../globals.css";
import MotionRoot from "@/components/motion/MotionRoot";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import ThemeScript from "@/components/ThemeScript";

// This is the actual root layout for every English (main) page: it's the
// only place in this route group that may declare <html>/<body>. It used to
// duplicate app/layout.tsx's <html>/<body> as well — two root layouts both
// wrapping the same tree, which produces nested <html>/<body> markup that's
// invalid HTML. Browsers silently repair that while parsing, but React's
// hydration then has to reconcile its virtual DOM against a repaired tree
// that doesn't match what it rendered on the server — a mismatch serious
// enough that React can bail out of hydrating large parts of the page,
// which is almost certainly what made the hero text (and potentially other
// content) disappear intermittently. app/layout.tsx is now just a plain
// pass-through with no <html>/<body> of its own, so this is the one place
// that owns the document shell for every /(main) route.
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
    images: [{ url: "/og/home.png", width: 1200, height: 630, alt: "Toolkitties: 67+ free online tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toolkitties — 67+ Free Online Tools",
    description: "Every tool runs locally in your browser. No signup. No login.",
    images: ["/og/home.png"],
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=localStorage.getItem("toolkitties-sidebar");var c=s?s==="collapsed":window.innerWidth<1024;if(c)document.documentElement.setAttribute("data-sidebar","collapsed")}catch(e){}`,
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
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
