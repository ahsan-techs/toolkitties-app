import Reveal from "@/components/motion/Reveal";
import DeviceCard from "@/components/apps/DeviceCard";

// Order matches /apps: the primary surface (desktop/laptop) first, then the two
// mobile platforms. Each card opens its own dedicated page with a live install
// button and a QR code — built once in /apps/[device] and reused here.
const devices = [
  { href: "/apps/desktop", icon: "💻", title: "Desktop & Laptop", text: "Windows, Mac, Linux or Chromebook — pin it to your taskbar or dock." },
  { href: "/apps/android", icon: "🤖", title: "Android", text: "Add it to your home screen from Chrome in a couple of taps." },
  { href: "/apps/ios", icon: "🍏", title: "iPhone & iPad", text: "Add it to your home screen from Safari’s Share menu." },
];

export default function HomeDeviceSection() {
  return (
    <section className="container-content py-20" aria-labelledby="get-the-app">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="mx-auto inline-block rounded-full border border-moss/20 bg-white/60 px-4 py-1.5 text-sm font-medium text-moss">
          Works on everything
        </p>
        <h2 id="get-the-app" className="mt-4 font-display text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Get Toolkitties on your device
        </h2>
        <p className="mt-3 text-base text-slate">
          No app store, no download, no signup — install it straight from your browser on whatever you’re using.
        </p>
      </Reveal>

      <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
        {devices.map((d, i) => (
          <Reveal key={d.href} delay={i * 0.08} y={20}>
            <DeviceCard {...d} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
