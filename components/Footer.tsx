import Link from "next/link";
import { allTools, toolGroups } from "@/lib/tools-data";

// The footer lists every tool, grouped like the home page, with its icon. Real links to every
// tool page also help search engines find and understand all of them.
const toolCount = allTools.filter((t) => t.functional).length;

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 bg-white py-14">
      <div className="container-content">
        <div className="max-w-md">
          <div className="flex items-center gap-2">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
              <rect x="15" y="2" width="9" height="9" rx="2" fill="#1F5C4C" />
              <rect x="2" y="15" width="9" height="9" rx="2" fill="#C7862B" />
              <rect x="15" y="15" width="9" height="9" rx="2" stroke="#15171A" strokeWidth="2" />
            </svg>
            <span className="font-display text-lg font-semibold">Toolkitties</span>
          </div>
          <p className="mt-3 text-sm text-slate">
            {toolCount} free everyday tools that run entirely in your browser. No signup, no login, no waiting.
          </p>
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {toolGroups.map((group) => (
            <nav key={group.id} aria-label={group.title}>
              <p className="font-display text-sm font-semibold text-ink">{group.title}</p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {group.tools.map((tool) => (
                  <li key={tool.slug}>
                    <Link href={`/${tool.slug}`} className="group inline-flex items-center gap-2 py-0.5 text-sm text-slate transition hover:text-moss">
                      <span aria-hidden="true" className="flex h-6 w-6 flex-none items-center justify-center rounded-md bg-moss/10 text-sm transition group-hover:bg-moss/20">
                        {tool.icon}
                      </span>
                      <span>{tool.name}</span>
                      {!tool.functional && <span className="rounded bg-sand px-1.5 py-0.5 text-[10px] font-medium text-slate/80">Coming Soon</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="container-content mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink/10 pt-6 text-xs text-slate md:flex-row">
        <p>© {new Date().getFullYear()} Toolkitties. All files are processed locally in your browser.</p>
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <Link href="/#free" className="hover:text-moss">Free forever</Link>
          <Link href="/all-tools" className="hover:text-moss">All tools</Link>
          <Link href="/blog" className="hover:text-moss">Guides</Link>
          <Link href="/about" className="hover:text-moss">About</Link>
          <Link href="/privacy" className="hover:text-moss">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-moss">Terms of Service</Link>
          <Link href="/contact" className="hover:text-moss">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
