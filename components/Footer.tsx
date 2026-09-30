import Link from "next/link";
import { toolGroups } from "@/lib/tools-data";

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white py-14">
      <div className="container-content grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 26 26" fill="none">
              <rect x="2" y="2" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
              <rect x="15" y="2" width="9" height="9" rx="2" fill="#1F5C4C" />
              <rect x="2" y="15" width="9" height="9" rx="2" fill="#C7862B" />
              <rect x="15" y="15" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
            </svg>
            <span className="font-display text-base font-semibold">Toolkitties</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate">
            50+ everyday file tools that run entirely in your browser. No signup, no login, no waiting.
          </p>
        </div>

        {toolGroups.map((group) => (
          <div key={group.id}>
            <h4 className="font-display text-sm font-semibold text-ink">{group.title}</h4>
            <ul className="mt-3 flex flex-col gap-2">
              {group.tools.slice(0, 5).map((tool) => (
                <li key={tool.slug}>
                  <Link href={`/${tool.slug}`} className="inline-flex items-center gap-1.5 text-sm text-slate hover:text-moss">
                    {tool.name}
                    {!tool.functional && (
                      <span className="rounded bg-sand px-1.5 py-0.5 text-[10px] font-medium text-slate/80">Coming Soon</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container-content mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink/10 pt-6 text-xs text-slate md:flex-row">
        <p>© {new Date().getFullYear()} Toolkitties. All files are processed locally in your browser.</p>
        <div className="flex gap-4">
          <a href="#pricing" className="hover:text-moss">Pricing</a>
          <a href="#tools" className="hover:text-moss">All tools</a>
        </div>
      </div>
    </footer>
  );
}
