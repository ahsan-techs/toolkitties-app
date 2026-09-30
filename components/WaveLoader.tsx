export default function WaveLoader({ label = "Processing your file…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <div className="flex h-10 items-end gap-1.5">
        <span className="w-1.5 rounded-full bg-moss animate-wave1 h-6" />
        <span className="w-1.5 rounded-full bg-moss animate-wave2 h-10" />
        <span className="w-1.5 rounded-full bg-moss animate-wave3 h-5" />
        <span className="w-1.5 rounded-full bg-moss animate-wave4 h-9" />
        <span className="w-1.5 rounded-full bg-moss animate-wave1 h-6" />
      </div>
      <p className="text-sm text-slate">{label}</p>
    </div>
  );
}
