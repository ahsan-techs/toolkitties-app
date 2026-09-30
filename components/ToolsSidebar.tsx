import Link from "next/link";
import { toolGroups } from "@/lib/tools-data";

export default function ToolsSidebar({ currentSlug }: { currentSlug: string }) {
  return (
    <aside className="hidden w-64 flex-none lg:block">
      <div className="sticky top-24 flex flex-col gap-6">
        {toolGroups.map((group) => (
          <div key={group.id}>
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate">
              <span>{group.icon}</span>
              {group.title}
            </p>
            <ul className="mt-2 flex flex-col gap-0.5">
              {group.tools.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={`/${t.slug}`}
                    className={`block rounded-lg px-2 py-1.5 text-sm transition ${
                      t.slug === currentSlug ? "bg-moss/10 font-medium text-moss" : "text-ink/70 hover:bg-sand/60 hover:text-ink"
                    }`}
                  >
                    {t.icon} {t.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}
