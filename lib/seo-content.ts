import type { Tool, ToolGroup } from "@/lib/tools-data";

type Kind = "pdf" | "image" | "text" | "calculator" | "generator" | "document" | "generic";

function detectKind(tool: Tool, group: ToolGroup): Kind {
  if (group.id === "business") return "document";
  if (group.id === "documents") return "pdf";
  if (group.id === "images") return "image";
  if (["unit-converter", "percentage-calculator", "age-calculator", "color-picker", "timestamp-converter"].includes(tool.slug)) return "calculator";
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
    "Completely free, with no daily limit on the Starter plan for light use.",
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
      a: `Yes. ${name} is free on the Starter plan. Upgrading to Pro removes the daily action limit and speeds up processing for larger files.`,
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

  return common;
}

export function generatePrivacyNote(tool: Tool): string {
  return `${tool.name} runs as client-side JavaScript inside your own browser tab. Your file or text is read, processed, and turned into a result on your device — it is never sent to, stored on, or seen by Toolkitties' servers. Closing or refreshing the page clears everything.`;
}

// Long-tail, search-intent-matched title + description for each tool, instead of one
// generic pattern repeated across all 44 pages. Modifiers reflect how people actually
// phrase these searches (e.g. "compress pdf online free" not just "PDF compressor").
export function generateSeoTitle(tool: Tool, group: ToolGroup): string {
  const kind = detectKind(tool, group);
  if (kind === "pdf") return `${tool.name} Online Free — No Signup, Instant Download | Toolkitties`;
  if (kind === "image") return `${tool.name} Online Free — Fast, Private, No Quality Loss | Toolkitties`;
  if (kind === "text") return `${tool.name} Online — Free, Instant Results, No Signup | Toolkitties`;
  if (kind === "document") return `${tool.name} Online Free — Create & Download PDF, No Signup | Toolkitties`;
  if (kind === "calculator") return `${tool.name} Online Free — Instant, Accurate Results | Toolkitties`;
  return `${tool.name} Online Free — Generate Instantly, No Signup | Toolkitties`;
}

export function generateSeoDescription(tool: Tool, group: ToolGroup): string {
  const kind = detectKind(tool, group);
  const base = tool.description;
  if (kind === "pdf") return `${base} Works entirely in your browser — free, private, and instant, with no file size upload limit on Pro.`;
  if (kind === "image") return `${base} Adjust quality and size yourself, then download instantly — nothing is uploaded to a server.`;
  if (kind === "text") return `${base} Updates instantly as you type — free, private, no signup needed.`;
  return `${base} Free, instant, and private — runs entirely in your browser.`;
}
