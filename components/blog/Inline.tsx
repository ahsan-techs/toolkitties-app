import Link from "next/link";
import type { ReactNode } from "react";

// Renders **bold** and [text](/path) inside blog text. Internal links use next/link.
export default function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  const out: ReactNode[] = parts.map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) return <strong key={i} className="font-semibold text-ink">{bold[1]}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const href = link[2];
      return href.startsWith("/") ? (
        <Link key={i} href={href} className="bl-link">{link[1]}</Link>
      ) : (
        <a key={i} href={href} className="bl-link" rel="noopener noreferrer">{link[1]}</a>
      );
    }
    return <span key={i}>{part}</span>;
  });
  return <>{out}</>;
}
