import type { CSSProperties, ReactNode } from "react";

// Illustrations for the home page feature rows. Each one shows something the tool really does
// (no invented numbers, ratings or user counts). All motion is CSS, see .fx-* in globals.css.

const ICONS: Record<string, ReactNode> = {
  scissors: (
    <>
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M8.1 8.1 20 20M8.1 15.9 20 4" />
    </>
  ),
  compress: <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" />,
  rotate: <path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6" />,
  download: <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  file: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M21 16l-5-5-8 9" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12l9-9M16 7l3 3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z" />
      <path d="M8.5 12l2.5 2.5L15.5 10" />
    </>
  ),
  server: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </>
  ),
  arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
  layers: <path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5" />,
};

function Ic({ name, className = "fx-ic" }: { name: keyof typeof ICONS | string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {ICONS[name]}
    </svg>
  );
}

const pos = (o: CSSProperties): CSSProperties => o;

function Backdrop() {
  return (
    <>
      <div className="fx-bg fx-bg-a" />
      <div className="fx-bg fx-bg-b" />
    </>
  );
}

function Tile({ icon, color, style, delay = 0 }: { icon: string; color: string; style: CSSProperties; delay?: number }) {
  return (
    <div className="fx-tile" style={{ ...style, background: color, ["--d" as string]: `${delay}s` }}>
      <Ic name={icon} />
    </div>
  );
}

function Ring({ style, color = "#C7862B" }: { style: CSSProperties; color?: string }) {
  return <span className="fx-ring" style={{ ...style, ["--c" as string]: color }} />;
}

function Cross({ style, color = "#1F5C4C" }: { style: CSSProperties; color?: string }) {
  return (
    <svg className="fx-cross" viewBox="0 0 10 10" style={{ ...style, color }} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" />
    </svg>
  );
}

function Header({ children }: { children: ReactNode }) {
  return (
    <div className="fx-win-h">
      <span className="fx-logo">
        <i style={{ background: "transparent", border: ".22em solid #15171A" }} />
        <i style={{ background: "#1F5C4C" }} />
        <i style={{ background: "#C7862B" }} />
        <i style={{ background: "transparent", border: ".22em solid #15171A" }} />
      </span>
      {children}
    </div>
  );
}

function Page({ w, h, style, tint = "#1F5C4C" }: { w: number; h: number; style?: CSSProperties; tint?: string }) {
  return (
    <div className="fx-page" style={{ width: `${w}em`, height: `${h}em`, ...style }}>
      <i style={{ width: "42%", height: ".9em", background: tint, opacity: 0.9 }} />
      <i style={{ width: "100%" }} />
      <i style={{ width: "82%" }} />
    </div>
  );
}

/* 1. PDF tools: reorder files, then merge */
export function PdfToolsVisual() {
  const files = [
    { name: "report.pdf", top: 5.4, cls: "" },
    { name: "invoice.pdf", top: 11.4, cls: "fx-down" },
    { name: "notes.pdf", top: 17.4, cls: "fx-up" },
  ];
  return (
    <>
      <Backdrop />
      <div className="fx-win" style={pos({ left: "5em", top: "5em", width: "36em", height: "31em" })}>
        <Header>
          <span className="fx-t fx-t-b">Merge PDF</span>
        </Header>
        {files.map((f) => (
          <div key={f.name} className={`fx-row ${f.cls}`} style={{ top: `${f.top}em` }}>
            <Page w={3} h={3.8} />
            <span className="fx-t">{f.name}</span>
            <span className="fx-chip">PDF</span>
            <span className="fx-grip">
              <i /><i /><i /><i /><i /><i />
            </span>
          </div>
        ))}
        <div className="fx-btn fx-press" style={{ left: "1.6em", right: "1.6em", top: "24.4em" }}>
          <Ic name="layers" className="fx-ic-sm" />
          <span className="fx-t fx-t-b">Merge PDF</span>
        </div>
      </div>

      <div className="fx-card fx-pop" style={pos({ right: "1em", top: "32.5em", width: "23em", height: "6.4em" })}>
        <span className="fx-badge" style={{ background: "#1F5C4C" }}>
          <Ic name="check" className="fx-ic-sm" />
        </span>
        <span className="fx-col">
          <span className="fx-t fx-t-b">merged.pdf</span>
          <span className="fx-t fx-t-s">Ready to download</span>
        </span>
        <span className="fx-badge" style={{ background: "#C7862B", marginLeft: "auto" }}>
          <Ic name="download" className="fx-ic-sm" />
        </span>
      </div>

      <Tile icon="scissors" color="#C7862B" style={{ left: "1em", top: "1.6em" }} delay={0.2} />
      <Tile icon="rotate" color="#1F5C4C" style={{ right: "2.4em", top: "2.4em" }} delay={1.4} />
      <Tile icon="compress" color="#15171A" style={{ left: "1.4em", top: "31em" }} delay={2.6} />
      <Ring style={{ right: "9em", top: "1em" }} />
      <Cross style={{ left: "13em", top: "1.4em", width: "1.6em", height: "1.6em" }} />
    </>
  );
}

/* 2. Protect then unlock */
export function LockVisual() {
  return (
    <>
      <Backdrop />
      <div className="fx-win" style={pos({ left: "6em", top: "5.4em", width: "40em", height: "28.6em" })}>
        <Header>
          <span className="fx-swap">
            <span className="fx-t fx-t-b fx-swap-a">Protect PDF</span>
            <span className="fx-t fx-t-b fx-swap-b">Unlock PDF</span>
          </span>
        </Header>

        <div className="fx-page fx-locked" style={{ left: "2.2em", top: "6.2em", width: "14em", height: "18em" }}>
          <i style={{ width: "42%", height: ".9em", background: "#1F5C4C" }} />
          <i style={{ width: "100%" }} />
          <i style={{ width: "88%" }} />
          <i style={{ width: "94%" }} />
          <i style={{ width: "70%" }} />
          <i style={{ width: "100%" }} />
        </div>

        <div className="fx-lockbadge" style={{ left: "11em", top: "19.4em" }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="fx-ic-lock">
            <rect x="5" y="11" width="14" height="9.5" rx="2.2" />
            <path className="fx-shackle" d="M8 11V8a4 4 0 018 0v3" />
          </svg>
        </div>

        <div style={{ position: "absolute", left: "19.4em", top: "6.2em" }}><span className="fx-t fx-t-s">Password</span></div>
        <div className="fx-input" style={{ left: "19.4em", top: "9em", width: "18.2em" }}>
          <span className="fx-dots">
            {Array.from({ length: 8 }).map((_, i) => (
              <i key={i} />
            ))}
          </span>
        </div>

        <div className="fx-btn fx-press2" style={{ left: "19.4em", width: "18.2em", top: "15em" }}>
          <span className="fx-swap" style={{ height: "1.8em" }}>
            <span className="fx-t fx-t-b fx-swap-a">Protect PDF</span>
            <span className="fx-t fx-t-b fx-swap-b">Unlock PDF</span>
          </span>
        </div>

        <div className="fx-status" style={{ left: "19.4em", width: "18.2em", top: "21.4em" }}>
          <span className="fx-stat fx-stat-a">
            <Ic name="shield" className="fx-ic-sm" />
            <span className="fx-t fx-t-b">AES-256 encryption</span>
          </span>
          <span className="fx-stat fx-stat-b">
            <Ic name="check" className="fx-ic-sm" />
            <span className="fx-t fx-t-b">Password removed</span>
          </span>
        </div>
      </div>

      <Tile icon="key" color="#C7862B" style={{ left: "1.6em", top: "3em" }} delay={0.6} />
      <Tile icon="shield" color="#1F5C4C" style={{ right: "1.8em", top: "30.8em" }} delay={2} />
      <Ring style={{ right: "4em", top: "2.6em" }} color="#1F5C4C" />
      <Cross style={{ left: "3em", top: "35em", width: "1.6em", height: "1.6em" }} color="#C7862B" />
    </>
  );
}

/* 3. Convert: real tool pairs, one after another */
const PAIRS = [
  { from: "PDF", to: "JPG", name: "PDF to JPG", note: "Every page becomes an image", s: "#1F5C4C", t: "#C7862B", tt: "#15171A" },
  { from: "JPG", to: "PDF", name: "Image to PDF", note: "JPG and PNG photos in one file", s: "#C7862B", t: "#1F5C4C", tt: "#F5F6F3" },
  { from: "HEIC", to: "JPG", name: "HEIC to JPG", note: "iPhone photos, made shareable", s: "#15171A", t: "#C7862B", tt: "#15171A" },
  { from: "WEBP", to: "JPG", name: "WebP to JPG", note: "A format every app opens", s: "#4A8A77", t: "#C7862B", tt: "#15171A" },
  { from: "PDF", to: "DOCX", name: "PDF to Word", note: "Text only, layout is not kept", s: "#1F5C4C", t: "#17463A", tt: "#F5F6F3" },
];

export function ConvertVisual() {
  return (
    <>
      <Backdrop />
      <div className="fx-win" style={pos({ left: "4em", top: "5.4em", width: "44em", height: "30.4em" })}>
        <Header>
          <span className="fx-t fx-t-b">Convert files</span>
        </Header>
        <div className="fx-body">
          {PAIRS.map((p, i) => (
            <div key={p.name} className="fx-pair" data-first={i === 0 ? "" : undefined} style={{ ["--i" as string]: i }}>
              <div className="fx-src" style={{ ["--s" as string]: p.s }}>
                <Ic name="file" className="fx-ic-md" />
                <span className="fx-fmt">{p.from}</span>
              </div>
              <div className="fx-link">
                <span className="fx-link-line" />
                <span className="fx-link-dot" />
                <Ic name="arrow" className="fx-ic-sm fx-link-arrow" />
              </div>
              <div className="fx-tgt" style={{ ["--t" as string]: p.t, ["--tt" as string]: p.tt }}>
                <Ic name="file" className="fx-ic-md" />
                <span className="fx-fmt">{p.to}</span>
                <span className="fx-tick">
                  <Ic name="check" className="fx-ic-xs" />
                </span>
              </div>
              <div className="fx-cap">
                <span className="fx-t fx-t-b" style={{ fontSize: "1.7em" }}>{p.name}</span>
                <span className="fx-t fx-t-s">{p.note}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="fx-track">
          <span className="fx-fill" />
        </div>
      </div>

      <Tile icon="image" color="#C7862B" style={{ right: "1.2em", top: "1.8em" }} delay={0.3} />
      <Tile icon="file" color="#1F5C4C" style={{ left: "1.2em", top: "32em" }} delay={1.8} />
      <Ring style={{ left: "9em", top: "1.8em" }} color="#1F5C4C" />
      <Cross style={{ right: "6em", top: "37.6em", width: "1.6em", height: "1.6em" }} color="#C7862B" />
    </>
  );
}

/* 4. Privacy: the file never leaves the browser */
export function PrivacyVisual() {
  return (
    <>
      <Backdrop />
      <div className="fx-win" style={pos({ left: "4em", top: "3.6em", width: "44em", height: "26.4em" })}>
        <div className="fx-win-h">
          <span className="fx-lights"><i /><i /><i /></span>
          <span className="fx-addr">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="fx-ic-xs">
              <rect x="5" y="11" width="14" height="9.5" rx="2.2" />
              <path d="M8 11V8a4 4 0 018 0v3" />
            </svg>
            <span className="fx-t" style={{ fontSize: "1.25em" }}>your browser</span>
          </span>
        </div>

        <div className="fx-node fx-file" style={{ left: "4.6em", top: "6.4em" }}>
          <Ic name="file" className="fx-ic-md" />
          <span className="fx-t fx-t-s" style={{ fontSize: "1.1em" }}>Your file</span>
        </div>

        <div className="fx-shield" style={{ left: "17.4em", top: "5.6em" }}>
          <Ic name="shield" className="fx-ic-lg" />
        </div>

        <div className="fx-node fx-result" style={{ left: "32.2em", top: "6.4em", borderColor: "#1F5C4C" }}>
          <Ic name="download" className="fx-ic-md" />
          <span className="fx-t fx-t-s" style={{ fontSize: "1.1em" }}>Result</span>
        </div>

        <div style={{ position: "absolute", left: 0, right: 0, top: "19.6em", textAlign: "center" }}>
          <span className="fx-t fx-t-b" style={{ fontSize: "1.8em" }}>Processed on your device</span>
        </div>
        <span className="fx-conn" style={{ left: "13.6em", width: "3.4em" }} />
        <span className="fx-conn" style={{ left: "28.6em", width: "3.2em" }} />
      </div>

      <div className="fx-dash" style={{ left: "35.6em", top: "30em", height: "2.6em" }}>
        <span className="fx-nox">
          <Cross style={{ width: "1em", height: "1em", animation: "none" }} color="#C7862B" />
        </span>
      </div>
      <div className="fx-card" style={pos({ right: "3.6em", top: "32.4em", width: "21em", height: "7em" })}>
        <span className="fx-badge" style={{ background: "#E9E7DF", color: "#5B5D63" }}>
          <Ic name="server" className="fx-ic-sm" />
        </span>
        <span className="fx-col">
          <span className="fx-t fx-t-b">Our servers</span>
          <span className="fx-t fx-t-s">Never receive your file</span>
        </span>
      </div>

      <Tile icon="shield" color="#1F5C4C" style={{ left: "1.2em", top: "26em" }} delay={0.4} />
      <Tile icon="check" color="#C7862B" style={{ right: "1.4em", top: "1.2em" }} delay={1.9} />
      <Ring style={{ left: "10em", top: "0.8em" }} color="#1F5C4C" />
      <Cross style={{ left: "6em", top: "36.6em", width: "1.6em", height: "1.6em" }} color="#C7862B" />
    </>
  );
}
