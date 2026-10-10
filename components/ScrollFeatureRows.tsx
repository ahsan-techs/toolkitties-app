import Reveal from "@/components/motion/Reveal";
import Parallax from "@/components/motion/Parallax";

// The four visuals below use only the site palette (ink, paper, sand, moss, gold)
// and have no looping animation. Text content is unchanged.

function CompressVisual() {
  return (
    <div className="relative flex h-[350px] w-full items-center justify-center overflow-hidden rounded-2xl border border-ink/10 bg-gradient-to-tr from-moss/10 to-gold/10">
      <div className="shape-moss absolute -right-16 -top-16 h-72 w-72 rounded-full" />

      <div className="absolute flex h-64 w-52 -translate-x-12 translate-y-4 -rotate-6 transform flex-col justify-between rounded-xl border border-ink/10 bg-white p-4 shadow-xl">
        <div className="space-y-2">
          <div className="h-4 w-12 rounded bg-moss" />
          <div className="h-2 w-full rounded bg-ink/10" />
          <div className="h-2 w-5/6 rounded bg-ink/10" />
        </div>
        <div className="flex h-8 w-full items-center justify-center rounded-lg bg-moss/10 text-xs font-bold text-moss">🗜️ 75% Compressed</div>
      </div>

      <div className="absolute flex h-64 w-52 -translate-y-4 translate-x-12 rotate-6 transform flex-col justify-between rounded-xl bg-moss p-4 text-paper shadow-2xl">
        <div className="space-y-2">
          <div className="h-4 w-16 rounded bg-paper/20" />
          <div className="h-2 w-full rounded bg-paper/20" />
          <div className="h-2 w-4/5 rounded bg-paper/20" />
        </div>
        <div className="flex h-8 w-full items-center justify-center rounded-lg bg-paper/10 text-xs font-bold text-paper">🔄 Ready to Download</div>
      </div>
    </div>
  );
}

function SignatureVisual() {
  return (
    <div className="relative flex h-[350px] w-full items-center justify-center overflow-hidden rounded-2xl border border-ink/10 bg-gradient-to-br from-moss/10 to-sand">
      <div className="shape-moss absolute -bottom-16 -left-16 h-72 w-72 rounded-full" />

      <div className="relative flex flex-col items-center space-y-4 rounded-2xl border border-ink/10 bg-white/90 p-8 shadow-lg">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-moss shadow-lg shadow-moss/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-paper" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-ink">Crypto-Signed Securely</div>
          <div className="mt-1 text-xs text-slate">100% Tamper Proof Audit</div>
        </div>
        <span className="rounded-full bg-moss/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-moss">E-ID Verified</span>
      </div>
    </div>
  );
}

function FormatVisual() {
  return (
    <div className="relative flex h-[350px] w-full items-center justify-center overflow-hidden rounded-2xl border border-ink/10 bg-gradient-to-tr from-gold/10 to-moss/10">
      <div className="relative z-10 flex items-center space-x-6">
        <div className="flex h-20 w-16 flex-col items-center justify-center rounded-lg border border-ink/10 bg-white text-xs font-bold text-ink shadow-md">
          <span className="text-xl">📄</span>PDF
        </div>

        <div className="flex items-center space-x-1">
          <div className="h-1 w-8 rounded-full bg-moss/60" />
          <div className="h-3 w-3 rounded-full bg-moss" />
          <div className="h-1 w-8 rounded-full bg-moss/60" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex h-16 w-14 flex-col items-center justify-center rounded-md bg-moss text-[10px] font-bold text-paper shadow-md">
            <span>📝</span>DOCX
          </div>
          <div className="flex h-16 w-14 flex-col items-center justify-center rounded-md bg-ink text-[10px] font-bold text-paper shadow-md">
            <span>📊</span>XLSX
          </div>
          <div className="flex h-16 w-14 flex-col items-center justify-center rounded-md bg-gold text-[10px] font-bold text-ink shadow-md">
            <span>🖼️</span>JPG
          </div>
          <div className="flex h-16 w-14 flex-col items-center justify-center rounded-md bg-moss/80 text-[10px] font-bold text-paper shadow-md">
            <span>🔏</span>SIGN
          </div>
        </div>
      </div>
    </div>
  );
}

function SandboxVisual() {
  return (
    <div className="relative flex h-[350px] w-full items-center justify-center overflow-hidden rounded-2xl bg-ink text-paper shadow-inner">
      <div className="w-4/5 overflow-hidden rounded-xl border border-paper/10 bg-ink shadow-2xl">
        <div className="flex items-center space-x-2 border-b border-paper/10 bg-paper/5 px-4 py-2">
          <div className="h-2.5 w-2.5 rounded-full bg-paper/30" />
          <div className="h-2.5 w-2.5 rounded-full bg-paper/30" />
          <div className="h-2.5 w-2.5 rounded-full bg-paper/30" />
          <div className="ml-4 flex items-center space-x-1 rounded-md border border-paper/10 bg-ink px-3 py-0.5 text-[10px] text-paper/70">
            <span>🔒</span>
            <span>your-browser (Sandboxed)</span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center space-y-3 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-moss bg-moss/30 text-xl font-bold text-paper">
            🛡️
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold">Local Client Processing Active</div>
            <div className="mt-0.5 text-[10px] text-paper/70">0 bytes transferred to external cloud servers.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const rows = [
  {
    title: "Work directly on your files",
    copy: "Drop a file into any tool and watch it transform in place — annotate, mark up, and adjust without leaving the page.",
    align: "left" as const,
    Visual: CompressVisual,
  },
  {
    title: "Digital signatures made easy",
    copy: "Turn a paper process into a two-minute task. Place a signature, save, and send — no printer required.",
    align: "right" as const,
    Visual: SignatureVisual,
  },
  {
    title: "Create the perfect document",
    copy: "Reshape a file into whatever format the moment calls for — PDF, image, or plain text — in a couple of clicks.",
    align: "left" as const,
    Visual: FormatVisual,
  },
  {
    title: "Your files stay on your device",
    copy: "Every tool runs inside your browser's own sandbox. Nothing is uploaded, stored, or seen by anyone else.",
    align: "right" as const,
    Visual: SandboxVisual,
  },
];

export default function ScrollFeatureRows() {
  return (
    <section className="container-content py-20">
      <div className="flex flex-col gap-24">
        {rows.map((row) => {
          // Each side slides in from its own edge: text from the text's side, visual from the visual's side.
          const textFrom = row.align === "left" ? -24 : 24;
          return (
            <div
              key={row.title}
              className={`flex flex-col items-center gap-10 md:flex-row ${
                row.align === "right" ? "md:flex-row-reverse" : ""
              }`}
            >
              <Reveal x={textFrom} y={0} className="flex-1">
                <h3 className="font-display text-3xl font-semibold leading-snug text-ink">{row.title}</h3>
                <p className="mt-4 max-w-md text-base text-slate">{row.copy}</p>
              </Reveal>
              <Reveal x={-textFrom} y={0} delay={0.08} className="w-full flex-1">
                <Parallax distance={10}>
                  <row.Visual />
                </Parallax>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}
