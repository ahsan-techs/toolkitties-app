export type Tool = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  functional: boolean; // true = fully working in-browser today
};

export type ToolGroup = {
  id: string;
  title: string;
  icon: string;
  blurb: string;
  tools: Tool[];
};

export const toolGroups: ToolGroup[] = [
  {
    id: "documents",
    title: "Document & PDF Suite",
    icon: "📂",
    blurb: "Merge, split, and clean up PDFs without installing anything.",
    tools: [
      { slug: "merge-pdf", name: "Merge PDF", description: "Combine several PDFs into a single file, in the order you choose.", icon: "🧩", functional: true },
      { slug: "split-pdf", name: "Split PDF", description: "Pull specific pages out of a PDF into their own file.", icon: "✂️", functional: true },
      { slug: "compress-pdf", name: "Compress PDF", description: "Shrink a PDF's file size for easier sharing and uploading.", icon: "🗜️", functional: true },
      { slug: "protect-pdf", name: "Protect PDF", description: "Lock a PDF with a password before you send it out.", icon: "🔒", functional: false },
      { slug: "pdf-to-word", name: "PDF to Word", description: "Turn a PDF into an editable Word document.", icon: "📝", functional: false },
      { slug: "rotate-pdf", name: "Rotate PDF", description: "Fix sideways or upside-down pages in seconds.", icon: "🔄", functional: true },
      { slug: "delete-pdf-pages", name: "Delete PDF Pages", description: "Remove the pages you don't need and keep the rest.", icon: "🗑️", functional: true },
      { slug: "organize-pdf", name: "Organize PDF", description: "Reorder pages by dragging them into the sequence you want.", icon: "📑", functional: true },
      { slug: "watermark-pdf", name: "Watermark PDF", description: "Stamp your PDF with a text watermark across every page.", icon: "💧", functional: true },
      { slug: "pdf-page-numbers", name: "Add Page Numbers", description: "Number every page of a PDF automatically.", icon: "🔢", functional: true },
      { slug: "unlock-pdf", name: "Unlock PDF", description: "Remove a password from a PDF you have the rights to open.", icon: "🔓", functional: false },
      { slug: "pdf-to-jpg", name: "PDF to JPG", description: "Export each PDF page as a standalone JPG image.", icon: "🖼️", functional: false },
    ],
  },
  {
    id: "images",
    title: "Image & Media Network",
    icon: "🖼️",
    blurb: "Convert, resize, and compress photos right in your browser.",
    tools: [
      { slug: "jpg-to-png", name: "JPG to PNG", description: "Convert a JPG photo to a transparent-ready PNG.", icon: "🎨", functional: true },
      { slug: "png-to-jpg", name: "PNG to JPG", description: "Convert a PNG image into a smaller JPG file.", icon: "🎨", functional: true },
      { slug: "compress-image", name: "Compress Image", description: "Reduce a photo's file size while keeping it sharp.", icon: "🗜️", functional: true },
      { slug: "resize-image", name: "Resize Photo", description: "Set an exact width and height for any image.", icon: "📐", functional: true },
      { slug: "webp-to-jpg", name: "WebP to JPG", description: "Turn a WebP image into a widely-supported JPG.", icon: "🔁", functional: true },
      { slug: "crop-image", name: "Crop Image", description: "Trim a photo down to the part you want to keep.", icon: "✂️", functional: true },
      { slug: "rotate-image", name: "Rotate Image", description: "Straighten or flip a photo in a click.", icon: "🔄", functional: true },
      { slug: "image-to-base64", name: "Image to Base64", description: "Turn a picture into text you can paste into code.", icon: "🔤", functional: true },
      { slug: "favicon-generator", name: "Favicon Generator", description: "Create every favicon size a website needs from one image.", icon: "⭐", functional: true },
      { slug: "svg-to-png", name: "SVG Vector Converter", description: "Rasterize an SVG icon into a PNG at any size.", icon: "🧿", functional: true },
      { slug: "heic-to-jpg", name: "HEIC to JPG", description: "Convert iPhone HEIC photos into standard JPGs.", icon: "📱", functional: true },
      { slug: "watermark-image", name: "Watermark Image", description: "Add a text watermark across a photo before sharing it.", icon: "💧", functional: true },
    ],
  },
  {
    id: "text",
    title: "Clean Text & Structure Data",
    icon: "📝",
    blurb: "Format, count, and convert text and structured data instantly.",
    tools: [
      { slug: "word-counter", name: "Word Counter", description: "Count words, characters, sentences, and reading time.", icon: "🔢", functional: true },
      { slug: "case-converter", name: "Case Transformer", description: "Switch text between UPPER, lower, Title, and Sentence case.", icon: "🔠", functional: true },
      { slug: "json-formatter", name: "JSON Formatter", description: "Clean up and validate messy JSON in one click.", icon: "🧾", functional: true },
      { slug: "base64", name: "Base64 Decoder", description: "Encode text to Base64 or decode it straight back.", icon: "🔐", functional: true },
      { slug: "markdown-renderer", name: "Markdown Renderer", description: "Preview Markdown as formatted, ready-to-read text.", icon: "📄", functional: true },
      { slug: "url-encoder", name: "URL Encoder / Decoder", description: "Make text safe to use inside a web address, or reverse it.", icon: "🔗", functional: true },
      { slug: "text-diff", name: "Text Diff Checker", description: "See exactly what changed between two blocks of text.", icon: "🔍", functional: true },
      { slug: "slug-generator", name: "Slug Generator", description: "Turn a title into a clean, URL-friendly slug.", icon: "🏷️", functional: true },
      { slug: "csv-to-json", name: "CSV to JSON", description: "Convert spreadsheet rows into structured JSON data.", icon: "📊", functional: true },
      { slug: "lorem-ipsum", name: "Lorem Ipsum Generator", description: "Generate placeholder paragraphs for mockups and drafts.", icon: "🧵", functional: true },
      { slug: "duplicate-lines", name: "Remove Duplicate Lines", description: "Clean a list by deleting repeated lines automatically.", icon: "🧹", functional: true },
      { slug: "hash-generator", name: "Text to Hash", description: "Generate an MD5 or SHA-256 hash from any text.", icon: "🔗", functional: true },
    ],
  },
  {
    id: "developer",
    title: "Developer & Everyday Calculators",
    icon: "🧮",
    blurb: "Quick generators and calculators for daily tasks.",
    tools: [
      { slug: "qr-code-generator", name: "QR Code Generator", description: "Turn any link or text into a scannable QR code.", icon: "🔳", functional: true },
      { slug: "password-generator", name: "Password Generator", description: "Create a strong, random password in one click.", icon: "🔑", functional: true },
      { slug: "uuid-generator", name: "UUID Generator", description: "Generate unique IDs for databases and code.", icon: "🆔", functional: true },
      { slug: "unit-converter", name: "Unit Converter", description: "Convert length, weight, and temperature instantly.", icon: "📏", functional: true },
      { slug: "percentage-calculator", name: "Percentage Calculator", description: "Work out percentages, increases, and discounts fast.", icon: "💯", functional: true },
      { slug: "age-calculator", name: "Age Calculator", description: "Find exact age in years, months, and days from a birthdate.", icon: "🎂", functional: true },
      { slug: "color-picker", name: "Color Palette Generator", description: "Pick a color and get matching HEX, RGB, and HSL values.", icon: "🎨", functional: true },
      { slug: "timestamp-converter", name: "Timestamp Converter", description: "Convert between Unix timestamps and readable dates.", icon: "⏱️", functional: true },
    ],
  },
];

export const allTools: Tool[] = toolGroups.flatMap((g) => g.tools);

export function findTool(slug: string): { tool: Tool; group: ToolGroup } | null {
  for (const group of toolGroups) {
    const tool = group.tools.find((t) => t.slug === slug);
    if (tool) return { tool, group };
  }
  return null;
}
