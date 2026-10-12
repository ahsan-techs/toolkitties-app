function CompressVisual() {
  return (
    <div className="relative w-full h-[350px] bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-100/50 flex items-center justify-center overflow-hidden">
      <div className="absolute w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl -top-10 -right-10 animate-pulse" />

      <div className="absolute transform -rotate-6 -translate-x-12 translate-y-4 w-52 h-64 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/50 flex flex-col justify-between transition-transform hover:scale-105 duration-300">
        <div className="space-y-2">
          <div className="h-4 w-12 bg-indigo-500 rounded" />
          <div className="h-2 w-full bg-slate-200 rounded" />
          <div className="h-2 w-5/6 bg-slate-200 rounded" />
        </div>
        <div className="h-8 w-full bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-500 font-bold text-xs">🗜️ 75% Compressed</div>
      </div>

      <div className="absolute transform rotate-6 translate-x-12 -translate-y-4 w-52 h-64 bg-indigo-600 p-4 rounded-xl shadow-2xl flex flex-col justify-between text-white transition-transform hover:scale-105 duration-300">
        <div className="space-y-2">
          <div className="h-4 w-16 bg-white/20 rounded" />
          <div className="h-2 w-full bg-white/20 rounded" />
          <div className="h-2 w-4/5 bg-white/20 rounded" />
        </div>
        <div className="h-8 w-full bg-white/10 rounded-lg flex items-center justify-center font-bold text-xs text-white">🔄 Ready to Download</div>
      </div>
    </div>
  );
}

function SignatureVisual() {
  return (
    <div className="relative w-full h-[350px] bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-100/50 flex items-center justify-center overflow-hidden">
      <div className="absolute w-56 h-56 bg-emerald-400/20 rounded-full blur-3xl -bottom-10 -left-10" />

      <div className="relative flex flex-col items-center space-y-4 bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/80">
        <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 transform hover:scale-110 transition-transform duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-slate-800">Crypto-Signed Securely</div>
          <div className="text-xs text-slate-500 mt-1">100% Tamper Proof Audit</div>
        </div>
        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">E-ID Verified</span>
      </div>
    </div>
  );
}

function FormatVisual() {
  return (
    <div className="relative w-full h-[350px] bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 rounded-2xl border border-blue-100/50 flex items-center justify-center overflow-hidden">
      <div className="flex items-center space-x-6 relative z-10">
        <div className="w-16 h-20 bg-white shadow-md rounded-lg border border-slate-200 flex flex-col items-center justify-center font-bold text-xs text-red-500">
          <span className="text-xl">📄</span>PDF
        </div>

        <div className="flex items-center space-x-1">
          <div className="h-1 w-8 bg-blue-500 rounded-full animate-pulse" />
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping" />
          <div className="h-1 w-8 bg-blue-500 rounded-full animate-pulse" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="w-14 h-16 bg-blue-600 text-white shadow-md rounded-md flex flex-col items-center justify-center font-bold text-[10px] transform hover:-translate-y-1 transition-transform">
            <span>📝</span>DOCX
          </div>
          <div className="w-14 h-16 bg-green-600 text-white shadow-md rounded-md flex flex-col items-center justify-center font-bold text-[10px] transform hover:-translate-y-1 transition-transform">
            <span>📊</span>XLSX
          </div>
          <div className="w-14 h-16 bg-yellow-600 text-white shadow-md rounded-md flex flex-col items-center justify-center font-bold text-[10px] transform hover:-translate-y-1 transition-transform">
            <span>🖼️</span>JPG
          </div>
          <div className="w-14 h-16 bg-purple-600 text-white shadow-md rounded-md flex flex-col items-center justify-center font-bold text-[10px] transform hover:-translate-y-1 transition-transform">
            <span>🔏</span>SIGN
          </div>
        </div>
      </div>
    </div>
  );
}

function SandboxVisual() {
  return (
    <div className="relative w-full h-[350px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl flex items-center justify-center overflow-hidden text-white shadow-inner">
      <div className="w-4/5 bg-slate-950 rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden">
        <div className="bg-slate-900 px-4 py-2 flex items-center space-x-2 border-b border-slate-800">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <div className="bg-slate-950 text-[10px] text-slate-400 px-3 py-0.5 rounded-md flex items-center space-x-1 ml-4 border border-slate-800">
            <span className="text-emerald-500">🔒</span>
            <span>your-browser (Sandboxed)</span>
          </div>
        </div>
        <div className="p-6 flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 text-xl font-bold animate-pulse">
            🛡️
          </div>
          <div className="text-center">
            <div className="text-xs font-semibold">Local Client Processing Active</div>
            <div className="text-[10px] text-slate-400 mt-0.5">0 bytes transferred to external cloud servers.</div>
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
        {rows.map((row) => (
          <div
            key={row.title}
            className={`flex flex-col items-center gap-10 md:flex-row ${
              row.align === "right" ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="flex-1">
              <h3 className="font-display text-3xl font-semibold leading-snug text-ink">{row.title}</h3>
              <p className="mt-4 max-w-md text-base text-slate">{row.copy}</p>
            </div>
            <div className="flex-1">
              <row.Visual />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
