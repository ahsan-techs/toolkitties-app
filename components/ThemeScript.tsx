// Phase 11: runs synchronously before paint so the saved theme applies
// immediately — no flash of the default palette on reload.
const THEME_SCRIPT = `
(function () {
  try {
    var t = localStorage.getItem("tk-theme");
    if (t && t !== "default") document.documentElement.setAttribute("data-theme", t);
  } catch (e) {}
})();
`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
