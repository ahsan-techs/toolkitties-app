import type { Post } from "./types";

// Articles about PDF tools. Every statement about Toolkitties tools matches what the tools do.
export const pdfPosts: Post[] = [
  {
    slug: "how-to-merge-pdf-files",
    title: "How to Merge PDF Files Online for Free (No Upload, No Signup)",
    seoTitle: "How to Merge PDF Files Online for Free | Toolkitties",
    description: "Combine several PDFs into one file in your browser. Reorder files, pick the pages you want and download, with no upload and no signup.",
    tool: "merge-pdf",
    category: "PDF",
    emoji: "📎",
    published: "2026-10-22",
    updated: "2026-10-22",
    takeaways: [
      "Open Merge PDF, add your files, drag them into order and download one combined PDF.",
      "You can choose which pages to take from each file, so cover pages and blanks can be left out.",
      "Merging runs in your browser. Your files are not uploaded.",
      "If a PDF is password protected, remove the password first with Unlock PDF.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Merge PDFs in five steps",
        blocks: [
          "Putting several documents into one PDF is the easiest way to send a contract pack, a set of receipts or a report with its appendices. You do not need to install anything. Here is the full process with [Merge PDF](/merge-pdf):",
          { steps: [
            "Open **Merge PDF** and add your files. You can pick them from your device, and you can add more than one at a time.",
            "Check the first-page previews so you know which file is which.",
            "Drag the files up or down until the order is exactly what you want.",
            "If you only need some pages from a file, choose those pages and leave the rest out.",
            "Press merge, then download the combined PDF.",
          ] },
          { note: "Your PDFs are merged inside your own browser. They are never sent to a Toolkitties server, which makes this a good fit for private documents." },
        ],
      },
      {
        id: "order-and-pages",
        heading: "Get the order and the pages right",
        blocks: [
          "Most mistakes happen before the merge, not during it. A few habits save a lot of re-doing:",
          { list: [
            "**Name files so they sort naturally.** Adding 01, 02, 03 to the start of each file name makes the order obvious.",
            "**Remove pages you do not need.** If a scan has a blank back page or a fax cover sheet, leave it out when you pick pages.",
            "**Merge in the final order.** It is faster to arrange files once than to merge twice.",
          ] },
          "If you realise afterwards that one file should come earlier, you can simply run the merge again from the original files. Your originals are never changed.",
        ],
      },
      {
        id: "phone",
        heading: "Merge PDFs on your phone",
        blocks: [
          "The tool works in a normal phone browser. Open the page, tap to add your PDFs, arrange them and merge. There is no app to install, so it works on both Android and iPhone browsers.",
          "If your files are in a messaging app or email, save them to your phone first so you can pick them from the file chooser.",
        ],
      },
      {
        id: "problems",
        heading: "Common problems and quick fixes",
        blocks: [
          { table: { head: ["Problem", "What to do"], rows: [
            ["A file will not open for merging", "It may be password protected. Remove the password with [Unlock PDF](/unlock-pdf), then try again."],
            ["The merged file is too big to email", "Run it through [Compress PDF](/compress-pdf) after merging."],
            ["Pages are in the wrong order", "Reorder the files and merge again, or fix the page order with [Organize PDF](/organize-pdf)."],
            ["You want to send only part of the result", "Use [Split PDF](/split-pdf) to extract just those pages."],
          ] } },
          "Bookmarks and fillable form fields from the original files may not carry over to a merged document, so check the result if you rely on them.",
        ],
      },
    ],
    faqs: [
      { q: "Is it safe to merge PDFs online?", a: "With Merge PDF the merging happens in your browser and the files are not uploaded, so they stay on your device." },
      { q: "Does merging lower the quality of my PDF?", a: "No. Pages are copied into the new file instead of being turned into pictures, so text stays sharp and selectable." },
      { q: "How many PDFs can I merge at once?", a: "Toolkitties does not set an account limit. The practical limit is your device memory, because the work is done in your browser." },
    ],
    related: ["how-to-split-a-pdf", "how-to-reduce-pdf-file-size", "are-online-pdf-tools-safe"],
  },
  {
    slug: "how-to-reduce-pdf-file-size",
    title: "How to Reduce PDF File Size for Email and Online Forms",
    seoTitle: "How to Reduce PDF File Size (Free, in Your Browser)",
    description: "Make a PDF smaller for email and upload limits. Learn which compression level to choose and why some PDFs shrink more than others.",
    tool: "compress-pdf",
    category: "PDF",
    emoji: "🗜️",
    published: "2026-10-22",
    updated: "2026-10-22",
    takeaways: [
      "Start with the Recommended level. It makes the file smaller and keeps text sharp.",
      "Use Smaller if the file is still too big. Use Smallest only as a last resort, because it turns pages into pictures.",
      "PDFs full of photos and scans shrink the most. Mostly-text PDFs are already small.",
      "Compression runs in your browser, so your file is not uploaded.",
    ],
    sections: [
      {
        id: "steps",
        heading: "How to compress a PDF",
        blocks: [
          "Email services and online forms often limit attachment size. When a PDF is over the limit, you do not need special software. Use [Compress PDF](/compress-pdf):",
          { steps: [
            "Open the tool and add your PDF.",
            "Choose how much to compress. If you are unsure, keep **Recommended**.",
            "Start the compression. For longer files you will see progress, such as how many pages are done.",
            "Download the smaller PDF and open it once to check that it looks right.",
          ] },
        ],
      },
      {
        id: "levels",
        heading: "Which compression level should you pick?",
        blocks: [
          { table: { head: ["Level", "What it does", "Best for"], rows: [
            ["Recommended", "Smaller file, text stays sharp", "Most documents. Try this first."],
            ["Smaller", "Stronger picture compression, text stays sharp", "Files that are still too big after Recommended."],
            ["Smallest", "Pages become pictures, so text is not selectable", "When size matters more than searchable text."],
          ] } },
          { note: "Always keep your original file. Smallest changes pages into pictures, so you cannot get the selectable text back from the compressed copy." },
        ],
      },
      {
        id: "why-small",
        heading: "Why did my PDF barely shrink?",
        blocks: [
          "How much a PDF can shrink depends on what is inside it. Photos and scanned pages are large, so there is a lot to save. A PDF made from a text document is already compact, so there may be very little to gain.",
          "If you started with a big scan, it also helps to shrink the pictures before they go into a PDF. [Compress Image](/compress-image) lets you set the quality and the largest side, and [Image to PDF](/image-to-pdf) will put them into one file.",
        ],
      },
      {
        id: "tips",
        heading: "Tips for hitting an upload limit",
        blocks: [
          { list: [
            "Check the exact limit on the form or email service before you start.",
            "Compress, then look at the size of the result. If it is still too big, run the original again with a stronger level.",
            "Split a very large PDF into parts with [Split PDF](/split-pdf) if the form accepts several files.",
            "Remove pages you do not need with [Delete PDF Pages](/delete-pdf-pages). Fewer pages means a smaller file.",
          ] },
        ],
      },
    ],
    faqs: [
      { q: "Will compressing change how my PDF looks?", a: "On Recommended and Smaller, text stays sharp and only pictures are compressed more. On Smallest the pages become pictures." },
      { q: "Can I compress a PDF without uploading it?", a: "Yes. Compress PDF runs in your browser, so the file stays on your device." },
      { q: "Is my original PDF changed?", a: "No. You download a new, smaller file, and the original stays as it was." },
    ],
    related: ["how-to-merge-pdf-files", "how-to-compress-images", "are-online-pdf-tools-safe"],
  },
  {
    slug: "how-to-split-a-pdf",
    title: "How to Split a PDF and Extract Pages Online",
    seoTitle: "How to Split a PDF and Extract Pages (Free) | Toolkitties",
    description: "Split a PDF into single pages, every N pages or custom ranges like 1-3, 7. Pick pages visually and download. No upload, no signup.",
    tool: "split-pdf",
    category: "PDF",
    emoji: "✂️",
    published: "2026-10-22",
    updated: "2026-10-22",
    takeaways: [
      "Use Split PDF to extract chosen pages, split every page, split every N pages or cut by ranges.",
      "Write ranges with commas and dashes, for example 1-3, 7, 10-12.",
      "Page previews let you pick pages by looking at them.",
      "Splitting runs in your browser, so the PDF is not uploaded.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Split a PDF step by step",
        blocks: [
          "Sometimes you only need one invoice from a long document, or you need to cut a scanned bundle into separate files. [Split PDF](/split-pdf) handles both:",
          { steps: [
            "Open Split PDF and add your file.",
            "Choose how to split: extract pages, split every page, split every N pages or use custom ranges.",
            "If you picked pages, use the previews to select them visually.",
            "Confirm and download your new PDF files.",
          ] },
        ],
      },
      {
        id: "ranges",
        heading: "How to write page ranges",
        blocks: [
          "Ranges are written with commas between parts and dashes for runs of pages. A few examples:",
          { table: { head: ["You type", "You get"], rows: [
            ["1-3", "Pages 1, 2 and 3"],
            ["7", "Only page 7"],
            ["1-3, 7, 10-12", "Pages 1 to 3, page 7 and pages 10 to 12"],
          ] } },
          "If you want to cut a long report into chapters, write one range per chapter, for example 1-10 and 11-25.",
        ],
      },
      {
        id: "which-mode",
        heading: "Which splitting option should you use?",
        blocks: [
          { list: [
            "**Extract pages** when you only need a few pages from a big file.",
            "**Split every page** when you want each page as its own PDF, such as a batch of scanned receipts.",
            "**Split every N pages** when the document repeats in blocks, for example every 5 pages.",
            "**Custom ranges** when sections have different lengths, such as chapters.",
          ] },
        ],
      },
      {
        id: "after",
        heading: "What to do after splitting",
        blocks: [
          "Pages are copied as they are, so text stays selectable and pictures are not recompressed. If you need the parts back together in a new order, use [Merge PDF](/merge-pdf). If you want to delete a few pages instead of extracting some, [Delete PDF Pages](/delete-pdf-pages) is quicker.",
        ],
      },
    ],
    faqs: [
      { q: "Can I split a PDF into single pages?", a: "Yes. Choose the option to split every page and each page becomes its own PDF." },
      { q: "How do I extract only some pages from a PDF?", a: "Select the pages in the previews or type them as a range, then download the extract." },
      { q: "Is my PDF uploaded when I split it?", a: "No. The splitting happens in your browser and the file stays on your device." },
    ],
    related: ["how-to-merge-pdf-files", "how-to-reduce-pdf-file-size", "how-to-convert-pdf-to-jpg"],
  },
  {
    slug: "how-to-copy-text-from-pdf-to-word",
    title: "How to Copy Text from a PDF into Word (and What Will Not Convert)",
    seoTitle: "PDF to Word: Copy PDF Text into a Word File | Toolkitties",
    description: "Turn the text of a PDF into an editable Word document. Learn what is kept, what is not, and what to do with scanned PDFs.",
    tool: "pdf-to-word",
    category: "PDF",
    emoji: "📝",
    published: "2026-10-22",
    updated: "2026-10-22",
    takeaways: [
      "PDF to Word copies the text of your PDF into an editable Word document.",
      "Images, tables and page layout are not kept. This is a text-only tool.",
      "Scanned PDFs are pictures, so there may be no text to copy.",
      "The PDF is read in your browser and is not uploaded.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Copy PDF text into Word",
        blocks: [
          "When you need to reuse the wording of a report, form or article, you do not have to retype it. [PDF to Word](/pdf-to-word) pulls out the text for you:",
          { steps: [
            "Open the tool and add your PDF.",
            "Start the conversion.",
            "Download the Word document and open it in Word or any word processor.",
            "Check the text, especially numbers, then edit as you like.",
          ] },
        ],
      },
      {
        id: "limits",
        heading: "What is kept and what is not",
        blocks: [
          "We think you should know before you try. This tool is built for text only.",
          { table: { head: ["In the PDF", "In the Word file"], rows: [
            ["Paragraph text", "Copied as editable text"],
            ["Images and logos", "Not kept"],
            ["Tables", "Structure not kept. Check figures afterwards."],
            ["Page layout and columns", "Not kept"],
          ] } },
        ],
      },
      {
        id: "scanned",
        heading: "Why a scanned PDF gives no text",
        blocks: [
          "A scanned PDF is a set of pictures of pages. There is no text inside it, only pixels that look like text. A tool that reads text cannot copy something that is not there, and this tool does not read text from pictures.",
          { note: "A quick test: open the PDF and try to select a word with your mouse or finger. If you cannot highlight individual words, it is probably a scan." },
        ],
      },
      {
        id: "alternatives",
        heading: "If you need the look of the pages",
        blocks: [
          "If you need pages to look the same, export them as pictures with [PDF to JPG](/pdf-to-jpg). If you need only some pages first, extract them with [Split PDF](/split-pdf) and then copy the text.",
        ],
      },
    ],
    faqs: [
      { q: "Does PDF to Word keep images and formatting?", a: "No. It copies text only. Images, tables and page layout are not kept." },
      { q: "Will it work on a scanned PDF?", a: "A scan is made of pictures, so there may be no text to copy. This tool does not read text from images." },
      { q: "Is my PDF uploaded?", a: "No. The text is read in your browser and the file stays on your device." },
    ],
    related: ["how-to-convert-pdf-to-jpg", "how-to-split-a-pdf", "are-online-pdf-tools-safe"],
  },
  {
    slug: "how-to-convert-pdf-to-jpg",
    title: "How to Convert PDF Pages to JPG Images",
    seoTitle: "How to Convert PDF to JPG Images (Free) | Toolkitties",
    description: "Export each page of a PDF as a JPG picture for chats, slides and websites. Free, private and no signup. Works on phone and computer.",
    tool: "pdf-to-jpg",
    category: "PDF",
    emoji: "🖼️",
    published: "2026-10-22",
    updated: "2026-10-22",
    takeaways: [
      "PDF to JPG exports every page of a PDF as its own JPG image.",
      "A JPG is a picture of the page, so its text cannot be selected or searched.",
      "Use Compress Image or Resize Photo afterwards if the images are too large.",
      "The conversion happens in your browser, so your PDF is not uploaded.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Convert a PDF to JPG",
        blocks: [
          "Turning a PDF page into a picture is handy when you want to share one page in a chat, add it to a slide or put it on a web page. With [PDF to JPG](/pdf-to-jpg):",
          { steps: [
            "Open the tool and add your PDF.",
            "Start the conversion. Each page is drawn the way it looks in a PDF viewer.",
            "Download the JPG images and use the ones you need.",
          ] },
        ],
      },
      {
        id: "when",
        heading: "When a picture is better than a PDF",
        blocks: [
          { list: [
            "**Sharing one page** in a messaging app where PDFs are awkward to open.",
            "**Slides and documents** where you want to place a page as an image.",
            "**Websites and social posts** that accept pictures but not PDFs.",
          ] },
          "If you need the words rather than the look, a picture is the wrong choice. Use [PDF to Word](/pdf-to-word) to copy the text.",
        ],
      },
      {
        id: "size",
        heading: "Make the images smaller",
        blocks: [
          "Pages saved as pictures can be big. To reduce them, lower the quality with [Compress Image](/compress-image) or set a smaller width and height with [Resize Photo](/resize-image). If you need to go back to a single document later, [Image to PDF](/image-to-pdf) combines JPG images into one PDF.",
        ],
      },
    ],
    faqs: [
      { q: "Do I get one image per page?", a: "Yes. Each page of your PDF becomes its own JPG." },
      { q: "Can I search the text in the JPG?", a: "No. A JPG is a picture, so the text cannot be selected or searched." },
      { q: "Does it work on my phone?", a: "Yes. It works in a phone browser the same way as on a computer." },
    ],
    related: ["how-to-turn-photos-into-a-pdf", "how-to-compress-images", "how-to-copy-text-from-pdf-to-word"],
  },
  {
    slug: "how-to-turn-photos-into-a-pdf",
    title: "How to Turn Photos and Scans into a PDF on Your Phone",
    seoTitle: "How to Turn Photos into a PDF on Your Phone | Toolkitties",
    description: "Combine JPG and PNG photos into one PDF in the order you choose. Perfect for documents photographed with a phone. Free, no upload.",
    tool: "image-to-pdf",
    category: "PDF",
    emoji: "📸",
    published: "2026-10-22",
    updated: "2026-10-22",
    takeaways: [
      "Image to PDF combines JPG and PNG images into one PDF, in the order you choose.",
      "iPhone HEIC photos should be converted to JPG first with HEIC to JPG.",
      "Shrink large photos first, or compress the finished PDF, if you need a small file.",
      "The PDF is built in your browser, so your photos are not uploaded.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Make a PDF from photos",
        blocks: [
          "Many applications ask for a single PDF, but your documents are a pile of phone photos. [Image to PDF](/image-to-pdf) fixes that in a minute:",
          { steps: [
            "Open the tool in your browser and add the photos. JPG and PNG are supported.",
            "Arrange them so the pages are in the right order.",
            "Create the PDF and download it.",
          ] },
        ],
      },
      {
        id: "photo-tips",
        heading: "Take better photos of documents",
        blocks: [
          { list: [
            "**Use daylight or bright, even light** so there are no shadows across the page.",
            "**Hold the phone straight above the page** to avoid slanted edges.",
            "**Fill the frame** with the page, then crop away extra background with [Crop Image](/crop-image).",
            "**Take one photo per page** and keep them in order.",
          ] },
        ],
      },
      {
        id: "iphone",
        heading: "iPhone photos (HEIC)",
        blocks: [
          "iPhones can save photos as HEIC, which this tool does not take directly. Convert them to JPG first with [HEIC to JPG](/heic-to-jpg), then add the JPG files to Image to PDF.",
        ],
      },
      {
        id: "size",
        heading: "Keep the PDF small enough to send",
        blocks: [
          "Phone photos are large, so a PDF of ten pages can be heavy. Shrink the photos first with [Compress Image](/compress-image), or compress the finished PDF with [Compress PDF](/compress-pdf).",
        ],
      },
    ],
    faqs: [
      { q: "Which image formats can I use?", a: "JPG and PNG. For HEIC photos from an iPhone, convert them with HEIC to JPG first." },
      { q: "Can I change the order of the pages?", a: "Yes. Arrange the images before you create the PDF." },
      { q: "Are my photos uploaded?", a: "No. The PDF is created in your browser and your photos stay on your device." },
    ],
    related: ["how-to-compress-images", "how-to-reduce-pdf-file-size", "how-to-convert-pdf-to-jpg"],
  },
];
