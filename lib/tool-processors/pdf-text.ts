// Turns the text items pdf.js reports for one page into readable paragraphs.

export type TextItem = { str?: string; transform?: number[]; width?: number; height?: number };

type Line = { y: number; size: number; items: { x: number; w: number; str: string }[]; text: string; left: number; right: number };

export function pageToParagraphs(rawItems: TextItem[]): string[] {
  return pageToStructuredParagraphs(rawItems).map((p) => p.text);
}

// Same paragraph grouping as pageToParagraphs, but also reports each
// paragraph's average font size — used to tell headings from body text.
export function pageToStructuredParagraphs(rawItems: TextItem[]): { text: string; size: number }[] {
  const items = rawItems.filter(
    (i): i is Required<Pick<TextItem, "str" | "transform">> & TextItem =>
      typeof i.str === "string" && i.str.trim() !== "" && Array.isArray(i.transform) && i.transform.length >= 6
  );
  if (items.length === 0) return [];

  const sorted = [...items].sort((a, b) => b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4]);
  const lines: Line[] = [];
  for (const it of sorted) {
    const y = it.transform[5];
    const size = Math.abs(it.transform[3]) || it.height || 10;
    const line = lines.find((l) => Math.abs(l.y - y) <= Math.max(l.size, size) * 0.5);
    const entry = { x: it.transform[4], w: it.width ?? 0, str: it.str };
    if (line) line.items.push(entry);
    else lines.push({ y, size, items: [entry], text: "", left: 0, right: 0 });
  }
  lines.sort((a, b) => b.y - a.y);

  for (const line of lines) {
    line.items.sort((a, b) => a.x - b.x);
    let text = "";
    let prevEnd: number | null = null;
    for (const it of line.items) {
      if (prevEnd !== null && it.x - prevEnd > line.size * 0.2 && !text.endsWith(" ") && !it.str.startsWith(" ")) text += " ";
      text += it.str;
      prevEnd = it.x + it.w;
    }
    line.text = text.replace(/\s+/g, " ").trim();
    line.left = line.items[0].x;
    line.right = Math.max(...line.items.map((i) => i.x + i.w));
  }
  const kept = lines.filter((l) => l.text !== "");
  if (kept.length === 0) return [];

  const widest = Math.max(...kept.map((l) => l.right - l.left));
  const gaps = kept.slice(1).map((l, i) => kept[i].y - l.y).filter((g) => g > 0).sort((a, b) => a - b);
  const median = gaps.length ? gaps[Math.floor(gaps.length / 2)] : 0;

  const paragraphs: { text: string; size: number }[] = [];
  let current = kept[0].text;
  let sizes = [kept[0].size];
  for (let i = 1; i < kept.length; i++) {
    const prev = kept[i - 1];
    const gap = prev.y - kept[i].y;
    const flows =
      median > 0 && gap > 0 && gap <= median * 1.35 && prev.right - prev.left >= Math.max(widest * 0.8, 180) && !/[.!?:;]$/.test(prev.text);
    if (flows) {
      current += " " + kept[i].text;
      sizes.push(kept[i].size);
    } else {
      paragraphs.push({ text: current, size: sizes.reduce((a, b) => a + b, 0) / sizes.length });
      current = kept[i].text;
      sizes = [kept[i].size];
    }
  }
  paragraphs.push({ text: current, size: sizes.reduce((a, b) => a + b, 0) / sizes.length });
  return paragraphs;
}
