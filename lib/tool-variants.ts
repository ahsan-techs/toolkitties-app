// Programmatic SEO: constraint-specific landing pages that reuse an existing
// tool's real functionality, but with their own URL, H1, meta copy, and a
// pre-set default option (e.g. a quality level tuned for the constraint in
// the URL). Each entry becomes its own indexable page at /<slug>.

export type ToolVariant = {
  slug: string; // the URL this page lives at
  toolSlug: string; // which real tool in tools-data.ts powers it
  name: string; // short name, shown as H1 and in nav
  title: string; // full SEO title
  description: string; // meta description + intro copy
  presetOpts: Record<string, string>; // pre-filled ToolWorkspace options
};

export const toolVariants: ToolVariant[] = [
  // ---- Compress Image: constraint-specific quality presets ----
  {
    slug: "compress-jpg-under-100kb",
    toolSlug: "compress-image",
    name: "Compress JPG Under 100KB",
    title: "Compress JPG Under 100KB Online Free | Toolkitties",
    description: "Shrink a JPG photo to under 100KB in seconds — free, private, and runs entirely in your browser. No signup, no upload.",
    presetOpts: { quality: "35" },
  },
  {
    slug: "compress-jpg-under-500kb",
    toolSlug: "compress-image",
    name: "Compress JPG Under 500KB",
    title: "Compress JPG Under 500KB Online Free | Toolkitties",
    description: "Reduce a JPG photo to under 500KB while keeping it sharp — free, private, and instant, right in your browser.",
    presetOpts: { quality: "60" },
  },
  {
    slug: "compress-png-for-mobile",
    toolSlug: "compress-image",
    name: "Compress PNG for Mobile",
    title: "Compress PNG for Mobile Online Free | Toolkitties",
    description: "Shrink a PNG so it loads fast on mobile connections — free, private, and processed entirely on your device.",
    presetOpts: { quality: "55" },
  },
  {
    slug: "compress-image-for-email",
    toolSlug: "compress-image",
    name: "Compress Image for Email",
    title: "Compress Image for Email Attachments Online Free | Toolkitties",
    description: "Get a photo small enough to email without hitting attachment limits — free and instant, right in your browser.",
    presetOpts: { quality: "50" },
  },
  {
    slug: "compress-image-for-whatsapp",
    toolSlug: "compress-image",
    name: "Compress Image for WhatsApp",
    title: "Compress Image for WhatsApp Online Free | Toolkitties",
    description: "Shrink a photo before sending it on WhatsApp, without losing much quality — free and processed on your device.",
    presetOpts: { quality: "65" },
  },

  // ---- Resize Image: platform-specific dimension presets ----
  {
    slug: "resize-image-for-instagram",
    toolSlug: "resize-image",
    name: "Resize Image for Instagram",
    title: "Resize Image for Instagram Online Free (1080×1080) | Toolkitties",
    description: "Resize any photo to Instagram's square 1080×1080 format — free, instant, and processed entirely in your browser.",
    presetOpts: { width: "1080", height: "1080" },
  },
  {
    slug: "resize-image-for-facebook-cover",
    toolSlug: "resize-image",
    name: "Resize Image for Facebook Cover",
    title: "Resize Image for Facebook Cover Photo (820×312) | Toolkitties",
    description: "Get the exact 820×312 size Facebook wants for cover photos — free and instant, right in your browser.",
    presetOpts: { width: "820", height: "312" },
  },
  {
    slug: "resize-image-for-linkedin",
    toolSlug: "resize-image",
    name: "Resize Image for LinkedIn",
    title: "Resize Image for LinkedIn Banner (1584×396) Online Free | Toolkitties",
    description: "Resize a photo to LinkedIn's recommended banner size — free, private, and processed entirely on your device.",
    presetOpts: { width: "1584", height: "396" },
  },
  {
    slug: "resize-image-for-youtube-thumbnail",
    toolSlug: "resize-image",
    name: "Resize Image for YouTube Thumbnail",
    title: "Resize Image for YouTube Thumbnail (1280×720) Online Free | Toolkitties",
    description: "Get the exact 1280×720 size YouTube recommends for thumbnails — free and instant, right in your browser.",
    presetOpts: { width: "1280", height: "720" },
  },
  {
    slug: "resize-image-for-passport-photo",
    toolSlug: "resize-image",
    name: "Resize Image for Passport Photo",
    title: "Resize Image for Passport Photo Online Free (600×600) | Toolkitties",
    description: "Resize a photo to a standard 600×600 passport-photo square — free, private, and processed on your device.",
    presetOpts: { width: "600", height: "600" },
  },

  // ---- Compress PDF: use-case presets (same tool, tailored landing copy) ----
  {
    slug: "compress-pdf-for-email",
    toolSlug: "compress-pdf",
    name: "Compress PDF for Email",
    title: "Compress PDF for Email Attachments Online Free | Toolkitties",
    description: "Shrink a PDF so it fits under email attachment limits — free, private, and processed entirely in your browser.",
    presetOpts: {},
  },
  {
    slug: "compress-pdf-for-upload",
    toolSlug: "compress-pdf",
    name: "Compress PDF for Upload",
    title: "Compress PDF for Website Upload Online Free | Toolkitties",
    description: "Shrink a PDF's file size before uploading it to a form, portal, or website — free and instant.",
    presetOpts: {},
  },

  // ---- Password Generator: use-case presets ----
  {
    slug: "generate-wifi-password",
    toolSlug: "password-generator",
    name: "Generate a WiFi Password",
    title: "WiFi Password Generator Online Free | Toolkitties",
    description: "Generate a strong, random WiFi password instantly — free, private, and processed entirely on your device.",
    presetOpts: { length: "16" },
  },
  {
    slug: "generate-strong-password",
    toolSlug: "password-generator",
    name: "Generate a Strong Password",
    title: "Strong Password Generator Online Free | Toolkitties",
    description: "Create a strong, hard-to-guess password in one click — free and instant, right in your browser.",
    presetOpts: { length: "20" },
  },

  // ---- Unit Converter: specific conversion pairs ----
  {
    slug: "cm-to-inches",
    toolSlug: "unit-converter",
    name: "CM to Inches Converter",
    title: "CM to Inches Converter Online Free | Toolkitties",
    description: "Convert centimeters to inches instantly — free, accurate, and updates as you type.",
    presetOpts: { kind: "length", from: "centimeters", to: "inches" },
  },
  {
    slug: "kg-to-lbs",
    toolSlug: "unit-converter",
    name: "KG to LBS Converter",
    title: "KG to LBS Converter Online Free | Toolkitties",
    description: "Convert kilograms to pounds instantly — free, accurate, and updates as you type.",
    presetOpts: { kind: "weight", from: "kilograms", to: "pounds" },
  },

  // ---- Word Counter: use-case presets ----
  {
    slug: "essay-word-counter",
    toolSlug: "word-counter",
    name: "Essay Word Counter",
    title: "Essay Word Counter Online Free | Toolkitties",
    description: "Count words, characters, and reading time for an essay or assignment — free and instant as you type.",
    presetOpts: {},
  },
  {
    slug: "seo-content-word-counter",
    toolSlug: "word-counter",
    name: "SEO Content Word Counter",
    title: "SEO Content Word Counter Online Free | Toolkitties",
    description: "Check word count and reading time while writing SEO content — free, instant, updates as you type.",
    presetOpts: {},
  },

  // ---- Remaining PDF tools ----
  {
    slug: "merge-pdf-online-free",
    toolSlug: "merge-pdf",
    name: "Merge PDF Online Free",
    title: "Merge PDF Files Online Free — No Signup | Toolkitties",
    description: "Combine multiple PDF files into one, in the order you choose — free, private, no signup, no upload.",
    presetOpts: {},
  },
  {
    slug: "split-pdf-by-pages",
    toolSlug: "split-pdf",
    name: "Split PDF by Pages",
    title: "Split PDF by Pages Online Free | Toolkitties",
    description: "Pull specific pages out of a PDF into their own file — free, private, instant, no signup.",
    presetOpts: {},
  },
  {
    slug: "rotate-pdf-pages-online",
    toolSlug: "rotate-pdf",
    name: "Rotate PDF Pages Online",
    title: "Rotate PDF Pages Online Free | Toolkitties",
    description: "Fix sideways or upside-down PDF pages in seconds — free, private, and processed in your browser.",
    presetOpts: {},
  },
  {
    slug: "delete-pages-from-pdf",
    toolSlug: "delete-pdf-pages",
    name: "Delete Pages From PDF",
    title: "Delete Pages From PDF Online Free | Toolkitties",
    description: "Remove specific pages from a PDF and keep the rest — free, private, no signup needed.",
    presetOpts: {},
  },
  {
    slug: "reorder-pdf-pages",
    toolSlug: "organize-pdf",
    name: "Reorder PDF Pages",
    title: "Reorder PDF Pages Online Free | Toolkitties",
    description: "Rearrange the page order of a PDF into the sequence you want — free and instant, right in your browser.",
    presetOpts: {},
  },
  {
    slug: "add-watermark-to-pdf",
    toolSlug: "watermark-pdf",
    name: "Add Watermark to PDF",
    title: "Add Watermark to PDF Online Free | Toolkitties",
    description: "Stamp a text watermark across every page of a PDF — free, private, no signup needed.",
    presetOpts: {},
  },
  {
    slug: "add-page-numbers-to-pdf",
    toolSlug: "pdf-page-numbers",
    name: "Add Page Numbers to PDF",
    title: "Add Page Numbers to PDF Online Free | Toolkitties",
    description: "Number every page of a PDF automatically — free, private, and instant in your browser.",
    presetOpts: {},
  },

  // ---- Remaining image tools ----
  {
    slug: "crop-image-online-free",
    toolSlug: "crop-image",
    name: "Crop Image Online Free",
    title: "Crop Image Online Free — No Signup | Toolkitties",
    description: "Trim a photo down to the exact part you want to keep — free, private, and instant in your browser.",
    presetOpts: {},
  },
  {
    slug: "rotate-image-90-degrees",
    toolSlug: "rotate-image",
    name: "Rotate Image 90 Degrees",
    title: "Rotate Image 90 Degrees Online Free | Toolkitties",
    description: "Straighten or flip a sideways photo in one click — free, private, and processed on your device.",
    presetOpts: { degrees: "90" },
  },
  {
    slug: "convert-image-to-base64-online",
    toolSlug: "image-to-base64",
    name: "Convert Image to Base64",
    title: "Convert Image to Base64 Online Free | Toolkitties",
    description: "Turn a picture into a Base64 text string you can paste straight into code — free and instant.",
    presetOpts: {},
  },
  {
    slug: "generate-favicon-from-logo",
    toolSlug: "favicon-generator",
    name: "Generate Favicon From Logo",
    title: "Favicon Generator From Logo Online Free | Toolkitties",
    description: "Create every favicon size your website needs from a single logo image — free and instant.",
    presetOpts: {},
  },
  {
    slug: "add-watermark-to-photo",
    toolSlug: "watermark-image",
    name: "Add Watermark to Photo",
    title: "Add Watermark to Photo Online Free | Toolkitties",
    description: "Stamp a text watermark across a photo before sharing it online — free, private, instant.",
    presetOpts: {},
  },

  // ---- Remaining text tools ----
  {
    slug: "uppercase-text-converter",
    toolSlug: "case-converter",
    name: "Uppercase Text Converter",
    title: "Uppercase Text Converter Online Free | Toolkitties",
    description: "Convert text to UPPERCASE instantly — free, updates as you type, no signup needed.",
    presetOpts: { case: "upper" },
  },
  {
    slug: "title-case-converter",
    toolSlug: "case-converter",
    name: "Title Case Converter",
    title: "Title Case Converter Online Free | Toolkitties",
    description: "Convert text to Title Case instantly — free, updates as you type, no signup needed.",
    presetOpts: { case: "title" },
  },
  {
    slug: "json-formatter-and-validator",
    toolSlug: "json-formatter",
    name: "JSON Formatter and Validator",
    title: "JSON Formatter and Validator Online Free | Toolkitties",
    description: "Format, validate, and prettify messy JSON in one click — free, instant, no signup needed.",
    presetOpts: { mode: "format" },
  },
  {
    slug: "json-minifier-online",
    toolSlug: "json-formatter",
    name: "JSON Minifier",
    title: "JSON Minifier Online Free | Toolkitties",
    description: "Minify JSON down to a single compact line — free, instant, no signup needed.",
    presetOpts: { mode: "minify" },
  },
  {
    slug: "base64-encode-online",
    toolSlug: "base64",
    name: "Base64 Encode Online",
    title: "Base64 Encode Online Free | Toolkitties",
    description: "Encode any text to Base64 instantly — free, private, updates as you type.",
    presetOpts: { mode: "encode" },
  },
  {
    slug: "base64-decode-online",
    toolSlug: "base64",
    name: "Base64 Decode Online",
    title: "Base64 Decode Online Free | Toolkitties",
    description: "Decode Base64 text back to plain text instantly — free, private, updates as you type.",
    presetOpts: { mode: "decode" },
  },
  {
    slug: "markdown-to-html-preview",
    toolSlug: "markdown-renderer",
    name: "Markdown to HTML Preview",
    title: "Markdown to HTML Preview Online Free | Toolkitties",
    description: "Preview Markdown as formatted, ready-to-read text instantly — free, updates as you type.",
    presetOpts: {},
  },
  {
    slug: "url-encode-online",
    toolSlug: "url-encoder",
    name: "URL Encode Online",
    title: "URL Encoder Online Free | Toolkitties",
    description: "Make text safe to use inside a web address, instantly — free, private, no signup.",
    presetOpts: { mode: "encode" },
  },
  {
    slug: "url-decode-online",
    toolSlug: "url-encoder",
    name: "URL Decode Online",
    title: "URL Decoder Online Free | Toolkitties",
    description: "Decode a URL-encoded string back to plain text — free, private, no signup.",
    presetOpts: { mode: "decode" },
  },
  {
    slug: "compare-two-text-files",
    toolSlug: "text-diff",
    name: "Compare Two Text Files",
    title: "Text Diff Checker Online Free — Compare Two Texts | Toolkitties",
    description: "See exactly what changed between two blocks of text, side by side — free, instant, no signup.",
    presetOpts: {},
  },
  {
    slug: "url-slug-generator-online",
    toolSlug: "slug-generator",
    name: "URL Slug Generator",
    title: "URL Slug Generator Online Free | Toolkitties",
    description: "Turn any title into a clean, URL-friendly slug instantly — free, updates as you type.",
    presetOpts: {},
  },
  {
    slug: "convert-csv-to-json-online",
    toolSlug: "csv-to-json",
    name: "Convert CSV to JSON",
    title: "Convert CSV to JSON Online Free | Toolkitties",
    description: "Turn spreadsheet rows into structured JSON data instantly — free, private, no signup.",
    presetOpts: {},
  },
  {
    slug: "lorem-ipsum-generator-online",
    toolSlug: "lorem-ipsum",
    name: "Lorem Ipsum Generator",
    title: "Lorem Ipsum Generator Online Free | Toolkitties",
    description: "Generate placeholder paragraphs for mockups and drafts instantly — free, no signup needed.",
    presetOpts: { paragraphs: "3" },
  },
  {
    slug: "remove-duplicate-lines-online",
    toolSlug: "duplicate-lines",
    name: "Remove Duplicate Lines",
    title: "Remove Duplicate Lines Online Free | Toolkitties",
    description: "Clean a list by deleting repeated lines automatically — free, instant, updates as you type.",
    presetOpts: {},
  },

  // ---- Remaining developer & calculator tools ----
  {
    slug: "qr-code-generator-for-business-card",
    toolSlug: "qr-code-generator",
    name: "QR Code Generator for Business Card",
    title: "QR Code Generator for Business Cards Online Free | Toolkitties",
    description: "Turn a link, phone number, or text into a scannable QR code for your business card — free, instant.",
    presetOpts: {},
  },
  {
    slug: "qr-code-generator-for-wifi",
    toolSlug: "qr-code-generator",
    name: "QR Code Generator for WiFi",
    title: "QR Code Generator for WiFi Online Free | Toolkitties",
    description: "Turn text or a link into a scannable QR code instantly — free, private, no signup needed.",
    presetOpts: {},
  },
  {
    slug: "uuid-generator-for-database",
    toolSlug: "uuid-generator",
    name: "UUID Generator for Database",
    title: "UUID Generator Online Free — For Databases & Code | Toolkitties",
    description: "Generate unique IDs (UUID v4) for databases and code instantly — free, instant, no signup.",
    presetOpts: {},
  },
  {
    slug: "percentage-increase-calculator",
    toolSlug: "percentage-calculator",
    name: "Percentage Increase Calculator",
    title: "Percentage Increase Calculator Online Free | Toolkitties",
    description: "Work out a percentage increase, discount, or change instantly — free and accurate.",
    presetOpts: {},
  },
  {
    slug: "age-calculator-by-birthdate",
    toolSlug: "age-calculator",
    name: "Age Calculator by Birthdate",
    title: "Age Calculator by Birthdate Online Free | Toolkitties",
    description: "Find your exact age in years, months, and days from a birthdate — free and instant.",
    presetOpts: {},
  },
  {
    slug: "hex-to-rgb-converter",
    toolSlug: "color-picker",
    name: "HEX to RGB Converter",
    title: "HEX to RGB Converter Online Free | Toolkitties",
    description: "Convert a HEX color code to RGB and HSL instantly — free, accurate, updates as you type.",
    presetOpts: {},
  },
  {
    slug: "unix-timestamp-converter-online",
    toolSlug: "timestamp-converter",
    name: "Unix Timestamp Converter",
    title: "Unix Timestamp Converter Online Free | Toolkitties",
    description: "Convert between Unix timestamps and readable dates instantly — free and accurate.",
    presetOpts: {},
  },

  // ---- Conversion tools: long-tail phrasing of the base conversion ----
  {
    slug: "convert-jpg-to-png-free",
    toolSlug: "jpg-to-png",
    name: "Convert JPG to PNG Free",
    title: "Convert JPG to PNG Online Free — No Signup | Toolkitties",
    description: "Convert a JPG photo to a transparent-ready PNG instantly — free, private, no signup, no upload.",
    presetOpts: {},
  },
  {
    slug: "convert-png-to-jpg-free",
    toolSlug: "png-to-jpg",
    name: "Convert PNG to JPG Free",
    title: "Convert PNG to JPG Online Free — No Signup | Toolkitties",
    description: "Convert a PNG image into a smaller JPG file instantly — free, private, no signup, no upload.",
    presetOpts: {},
  },
  {
    slug: "convert-webp-to-jpg-free",
    toolSlug: "webp-to-jpg",
    name: "Convert WebP to JPG Free",
    title: "Convert WebP to JPG Online Free — No Signup | Toolkitties",
    description: "Turn a WebP image into a widely-supported JPG instantly — free, private, no signup, no upload.",
    presetOpts: {},
  },
  {
    slug: "convert-heic-to-jpg-free",
    toolSlug: "heic-to-jpg",
    name: "Convert HEIC to JPG Free",
    title: "Convert HEIC to JPG Online Free — iPhone Photos | Toolkitties",
    description: "Turn an iPhone HEIC photo into a widely-supported JPG instantly — free, private, no signup, no upload.",
    presetOpts: {},
  },
];

export function findVariant(slug: string): ToolVariant | null {
  return toolVariants.find((v) => v.slug === slug) ?? null;
}

// Every variant page must be reachable by at least one internal link, or
// search engines have a much harder time discovering it. This returns the
// variants that point back to a given base tool, so its page can link out
// to them (and each variant page can also link back).
export function variantsForTool(toolSlug: string): ToolVariant[] {
  return toolVariants.filter((v) => v.toolSlug === toolSlug);
}
