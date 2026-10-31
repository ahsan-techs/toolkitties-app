// WCAG 2.4.1 "Bypass Blocks": keyboard and screen-reader users should be able
// to jump straight past the navbar (and, on tool pages, its mega-menus) to
// the actual content without tabbing through every nav link first. Hidden
// off-screen until it receives keyboard focus, then it appears as the very
// first focusable element on the page.
export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-paper"
    >
      Skip to content
    </a>
  );
}
