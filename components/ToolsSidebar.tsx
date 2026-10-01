import Link from "next/link";
import { toolGroups } from "@/lib/tools-data";
import SidebarToggle from "@/components/SidebarToggle";

// Collapsible tools sidebar. Expanded = icons + names; collapsed = a slim icon rail.
// The look of each state is pure CSS driven by <html data-sidebar="collapsed"> (see globals.css),
// so there is no layout jump on page load and this component can stay a server component.
export default function ToolsSidebar({ currentSlug }: { currentSlug: string }) {
  return (
    <aside id="tools-sidebar" className="tk-sidebar hidden flex-none lg:block">
      <div className="sticky top-24">
        <div className="tk-sb-head mb-4 flex items-center justify-between">
          <span className="tk-sb-label text-xs font-semibold uppercase tracking-wide text-slate">All tools</span>
          <SidebarToggle />
        </div>

        <nav aria-label="Tools" className="tk-sb-scroll flex max-h-[calc(100vh-11rem)] flex-col gap-6 overflow-y-auto pr-1">
          {toolGroups.map((group) => (
            <div key={group.id} className="tk-sb-group">
              <p className="tk-sb-grouptitle flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate">
                <span>{group.icon}</span>
                {group.title}
              </p>
              <ul className="mt-2 flex flex-col gap-0.5">
                {group.tools.map((t) => (
                  <li key={t.slug}>
                    <Link
                      href={`/${t.slug}`}
                      title={t.name}
                      aria-label={t.name}
                      aria-current={t.slug === currentSlug ? "page" : undefined}
                      className={`tk-sb-link flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition ${
                        t.slug === currentSlug ? "bg-moss/10 font-medium text-moss" : "text-ink/70 hover:bg-sand/60 hover:text-ink"
                      }`}
                    >
                      <span className="tk-sb-icon w-5 flex-none text-center">{t.icon}</span>
                      <span className="tk-sb-label min-w-0 truncate">{t.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
