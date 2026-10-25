import CopyLink from "./CopyLink";

// Plain share links (no scripts or trackers from social sites).
export default function ShareBar({ url, title }: { url: string; title: string }) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${t}%20${u}` },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${t}&url=${u}` },
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { label: "Email", href: `mailto:?subject=${t}&body=${u}` },
  ];
  return (
    <div className="bl-share" role="group" aria-label="Share this guide">
      <span className="bl-share-label">Share this guide</span>
      {links.map((l) => (
        <a key={l.label} href={l.href} target={l.label === "Email" ? undefined : "_blank"} rel="noopener noreferrer" className="bl-share-btn">
          {l.label}
        </a>
      ))}
      <CopyLink url={url} />
    </div>
  );
}
