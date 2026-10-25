import type { Tool, ToolGroup } from "@/lib/tools-data";
import { toolSeo } from "@/lib/tool-seo";
import { toolShowcase } from "@/lib/tool-showcase";

type Kind = "pdf" | "image" | "text" | "calculator" | "generator" | "document" | "generic";

export function detectKind(tool: Tool, group: ToolGroup): Kind {
  if (tool.slug === "image-to-pdf") return "image";
  if (["vat-calculator", "profit-margin-calculator"].includes(tool.slug)) return "calculator";
  if (["jwt-decoder", "regex-tester"].includes(tool.slug)) return "text";
  if (group.id === "business") return "document";
  if (group.id === "documents") return "pdf";
  if (group.id === "images") return "image";
  if (["unit-converter", "percentage-calculator", "age-calculator", "color-picker", "timestamp-converter", "loan-calculator", "bmi-calculator", "days-between-dates", "number-base-converter", "color-converter"].includes(tool.slug)) return "calculator";
  if (["qr-code-generator", "password-generator", "uuid-generator", "lorem-ipsum"].includes(tool.slug)) return "generator";
  if (group.id === "text") return "text";
  return "generic";
}

export function generateHowTo(tool: Tool, group: ToolGroup): string[] {
  const kind = detectKind(tool, group);

  if (kind === "pdf") {
    return [
      `Open the ${tool.name} page and drop your PDF into the upload box, or click it to browse your device.`,
      `Adjust any options this tool needs — page numbers, rotation angle, or watermark text, depending on the tool.`,
      `Click the process button and watch the on-screen progress as your file is handled entirely in your browser.`,
      `Download the finished PDF straight to your device — nothing is kept on a server afterward.`,
    ];
  }
  if (kind === "image") {
    return [
      `Go to the ${tool.name} page and drop in your image, or click the box to pick a file from your device.`,
      `Set the options this tool needs, such as quality, width and height, or rotation degrees.`,
      `Click "Process image" — the conversion happens instantly on your own device.`,
      `Preview the result and download it in one tap.`,
    ];
  }
  if (kind === "text") {
    return [
      `Open ${tool.name} and paste or type your text into the input box.`,
      `Your result updates instantly as you type — no button to click.`,
      `Adjust any mode or format options shown above the result, if the tool offers them.`,
      `Copy the output with one click, or leave it in place to keep editing.`,
    ];
  }
  if (kind === "document") {
    return [
      `Open ${tool.name} and fill in your details, your client's details, the invoice number, and the date.`,
      `Add each line item with a quantity and rate, then set tax and discount. Totals update instantly.`,
      `Optionally set a late-fee policy and toggle currencies to preview your total in other currencies.`,
      `Choose page size and accent colour, then click Download PDF. Everything happens in your browser.`,
    ];
  }
  if (kind === "calculator") {
    return [
      `Open ${tool.name} and fill in the values it asks for.`,
      `The result appears and updates instantly as you change any field.`,
      `Copy the result if you need to paste it elsewhere.`,
    ];
  }
  return [
    `Open ${tool.name} and enter the details it needs (text, a link, or a length/setting).`,
    `Click "Generate" to create your result on the spot.`,
    `Download or copy the result — it's ready to use immediately.`,
  ];
}

export function generateBenefits(tool: Tool, group: ToolGroup): string[] {
  const kind = detectKind(tool, group);
  const base = [
    "Runs entirely in your browser — your file is never uploaded to a server.",
    "No account, signup, or email address required to use it.",
    "Completely free, with no daily limit and no signup.",
  ];
  if (kind === "pdf") return [...base, "Works the same on Windows, Mac, Linux, and Chromebooks — anything with a modern browser."];
  if (kind === "image") return [...base, "Keeps your original photo quality intact unless you choose to compress it."];
  if (kind === "text") return [...base, "Updates the result instantly as you type, so you can see changes in real time."];
  if (kind === "document") return [...base, "Includes a late-fee simulator and live multi-currency previews, with a clean, print-ready PDF."];
  if (kind === "calculator") return [...base, "Gives an instant, accurate result without opening a spreadsheet."];
  return [...base, "Generates a fresh, unique result every time you run it."];
}

export function generateFaqs(tool: Tool, group: ToolGroup): { q: string; a: string }[] {
  const kind = detectKind(tool, group);
  const name = tool.name;

  const common: { q: string; a: string }[] = [
    {
      q: `Is ${name} free to use?`,
      a: `Yes. ${name} is 100% free, with no signup, no daily limit and no paid plans.`,
    },
    {
      q: `Do I need to create an account to use ${name}?`,
      a: `No signup or login is required. Open the page and start using ${name} immediately.`,
    },
    {
      q: `Is it safe to use ${name} with private or sensitive files?`,
      a: `Yes. ${name} processes your file locally in your browser using client-side code. The file itself is never uploaded to Toolkitties' servers.`,
    },
  ];

  if (kind === "pdf") {
    common.push({
      q: `Will ${name} work on a large PDF?`,
      a: `Most PDFs process in a few seconds. Very large files (100+ MB) depend on your device's memory, since everything happens in your browser rather than on a remote server.`,
    });
  }
  if (kind === "image") {
    common.push({
      q: `Does ${name} reduce image quality?`,
      a: `Tools that resize or compress let you control the quality or dimensions yourself, so you can balance file size against sharpness.`,
    });
  }
  if (kind === "text") {
    common.push({
      q: `Does ${name} store the text I enter?`,
      a: `No. Your text is processed in memory in your browser tab and is cleared as soon as you close or refresh the page.`,
    });
  }

  if (kind === "document") {
    common.push(
      { q: `Does ${name} add late fees automatically?`, a: `No. The Late Fee Matrix simulates what a late payment would cost and can print your late-payment terms on the invoice, but you decide the policy. Check your local rules on late fees and interest.` },
      { q: `Are the currency conversions exact?`, a: `They are previews based on live exchange rates when available (or clearly labelled estimates if offline). Use your bank's rate for the final amount you invoice.` }
    );
  }

  // Questions written for this specific tool come first, then the shared ones.
  // Tools with long-form content use those FAQs; the others use the shorter tool-specific ones.
  const specific = toolShowcase[tool.slug]?.faqs ?? toolSeo[tool.slug]?.faqs ?? [];
  const seen = new Set(specific.map((f: { q: string }) => f.q.toLowerCase()));
  return [...specific, ...common.filter((f: { q: string }) => !seen.has(f.q.toLowerCase()))];
}

export function generatePrivacyNote(tool: Tool): string {
  return `${tool.name} runs as client-side JavaScript inside your own browser tab. Your file or text is read, processed, and turned into a result on your device — it is never sent to, stored on, or seen by Toolkitties' servers. Closing or refreshing the page clears everything.`;
}

// Search-result friendly titles and descriptions. Google shows roughly 60 characters of a
// title and 160 of a description, so each one is picked from a list (longest first) and the
// first version that fits is used. The tool name always comes first because it is the
// phrase people search for, and the brand always stays at the end.
const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;

function fitTitle(name: string, options: string[]): string {
  const fit = options.find((t) => t.length <= TITLE_LIMIT);
  if (fit) return fit;
  const brand = " | Toolkitties";
  return `${name.slice(0, TITLE_LIMIT - brand.length - 1).trimEnd()}…${brand}`;
}

function fitDescription(base: string, suffixes: string[]): string {
  const whole = suffixes.map((suffix) => `${base} ${suffix}`).find((d) => d.length <= DESCRIPTION_LIMIT);
  if (whole) return whole;
  // The tool's own description is long: keep as many full sentences as fit beside the shortest ending.
  const suffix = suffixes[suffixes.length - 1];
  const room = DESCRIPTION_LIMIT - suffix.length - 1;
  let kept = "";
  for (const sentence of base.split(/(?<=[.!?])\s+/)) {
    const next = kept ? `${kept} ${sentence}` : sentence;
    if (next.length > room) break;
    kept = next;
  }
  if (!kept) {
    const cut = base.slice(0, room - 1);
    kept = `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "")}.`;
  }
  return `${kept} ${suffix}`;
}

export function generateSeoTitle(tool: Tool, group: ToolGroup): string {
  const kind = detectKind(tool, group);
  const n = tool.name;
  if (kind === "pdf") return fitTitle(n, [`${n} Online Free, No Signup | Toolkitties`, `${n} Online Free | Toolkitties`]);
  if (kind === "image") return fitTitle(n, [`${n} Online Free, Private | Toolkitties`, `${n} Online Free | Toolkitties`]);
  if (kind === "text") return fitTitle(n, [`${n} Online, Free and Instant | Toolkitties`, `${n} Online Free | Toolkitties`]);
  if (kind === "document") return fitTitle(n, [`${n} Free, Download as PDF | Toolkitties`, `${n} Free | Toolkitties`]);
  if (kind === "calculator") return fitTitle(n, [`${n} Online Free, Instant Results | Toolkitties`, `${n} Online Free | Toolkitties`]);
  return fitTitle(n, [`${n} Online Free, Instant | Toolkitties`, `${n} Online Free | Toolkitties`]);
}

export function generateSeoDescription(tool: Tool, group: ToolGroup): string {
  const kind = detectKind(tool, group);
  const base = tool.description;
  if (kind === "pdf") {
    return fitDescription(base, ["Works entirely in your browser: free, private and instant, with no signup and no upload.", "Runs in your browser: free, private, no signup.", "Free and private."]);
  }
  if (kind === "image") {
    return fitDescription(base, ["Adjust the settings yourself, then download instantly. Nothing is uploaded to a server.", "Free, private and instant. Nothing is uploaded.", "Free and private."]);
  }
  if (kind === "text") {
    return fitDescription(base, ["Updates instantly as you type: free, private and no signup needed.", "Free, instant and private.", "Free and private."]);
  }
  return fitDescription(base, ["Free, instant and private. Runs entirely in your browser.", "Free, instant and private.", "Free and private."]);
}

// The landing pages for specific searches (for example "Resize Image for Instagram") have their own
// hand-written titles. This trims any that would be cut off in search results, dropping the least
// useful words first, and lengthens descriptions that are too short to be useful.
export function fitVariantTitle(title: string): string {
  const options = [
    title,
    title.replace(" Online Free", " Free"),
    title.replace(" Online Free", ""),
    title.replace(/ \([^)]*\)/, ""),
    title.replace(" Online Free", "").replace(/ \([^)]*\)/, ""),
  ];
  const fit = options.find((t) => t.length <= TITLE_LIMIT);
  if (fit) return fit;
  const brand = " | Toolkitties";
  const name = title.replace(brand, "");
  return `${name.slice(0, TITLE_LIMIT - brand.length - 1).trimEnd()}…${brand}`;
}

export function fitVariantDescription(description: string): string {
  let out = description;
  const lower = description.toLowerCase();
  const additions = [
    lower.includes("upload") ? "" : "Nothing is uploaded to a server.",
    lower.includes("signup") || lower.includes("sign up") ? "" : "Free to use, with no signup.",
    lower.includes("browser") ? "" : "Runs in your browser.",
  ].filter(Boolean);
  for (const add of additions) {
    if (out.length >= 120) break;
    if (out.length + add.length + 1 <= DESCRIPTION_LIMIT) out = `${out} ${add}`;
  }
  return out;
}

// ---------------------------------------------------------------------------
// Answer-first content for search engines and AI answer engines (ChatGPT, Perplexity, Gemini, Claude).
// Every sentence here is true for every tool: it is free, needs no account, and runs in the browser.
// ---------------------------------------------------------------------------

function lowerFirst(text: string) {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// A 40 to 50 word definition that answers "what is this tool?", written so it can be quoted on its own.
export function generateDirectAnswer(name: string, description: string, kind: string): string {
  const what = lowerFirst(description.trim().replace(/[.!]+$/, ""));
  const how =
    kind === "pdf"
      ? "Add your PDF, choose your options and download the result. Your files stay on your device and are never uploaded."
      : kind === "image"
        ? "Add your image, adjust the settings and download the result. Your files stay on your device and are never uploaded."
        : kind === "document"
          ? "Fill in your details and download the PDF. Everything you type stays in your browser and is never uploaded."
          : "Enter your text or numbers and see the result instantly. Everything you type stays in your browser.";
  const opening = `${name} is a free online tool that lets you ${what}.`;
  const middle = "It works in your web browser with no signup.";
  const candidates = [`${opening} ${middle} ${how}`, `${opening} ${how}`, `${opening} ${middle}`];
  // Prefer the fullest version that stays inside 50 words, and never go under 40.
  const fit = candidates.find((c) => wordCount(c) >= 40 && wordCount(c) <= 50);
  if (fit) return fit;
  const fallback = candidates.find((c) => wordCount(c) <= 50) ?? opening;
  if (wordCount(fallback) >= 40) return fallback;
  const pad = " It is free to use, has no paid plans, and works on any modern browser on desktop and mobile.";
  const padded = fallback + pad;
  return wordCount(padded) <= 50 ? padded : fallback;
}

// Short, factual statements that are easy to quote.
export function generateQuickFacts(group: ToolGroup, kind: string): { label: string; value: string }[] {
  return [
    { label: "Price", value: "Free, with no paid plans" },
    { label: "Account", value: "No signup or login needed" },
    { label: "Where it runs", value: "In your web browser" },
    {
      label: "Your data",
      value: kind === "pdf" || kind === "image" ? "Files are not uploaded to a server" : "Nothing you type is sent to a server",
    },
    { label: "Works on", value: "Any modern browser, on desktop and mobile" },
    { label: "Category", value: group.title },
  ];
}
