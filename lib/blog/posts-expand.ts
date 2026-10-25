import type { Section } from "./types";

// Extra sections added to the first published guides so the most important tools have deeper pages.
export const expansions: Record<string, { sections: Section[]; faqs?: { q: string; a: string }[] }> = {
  "how-to-merge-pdf-files": {
    sections: [
      {
        id: "examples",
        heading: "Real situations where merging saves time",
        blocks: [
          { list: [
            "**A job application pack:** cover letter, CV and certificates in one file, in the order the employer expects.",
            "**An expense claim:** a form plus every receipt, so the finance team opens one attachment.",
            "**Study notes:** chapters saved as separate PDFs, combined before you print or revise.",
            "**A contract bundle:** the agreement, its appendix and the signed page in a single document.",
            "**A tender or visa file:** all required documents as one PDF when a site accepts only one upload.",
          ] },
          "In each case the aim is the same: one clean, correctly ordered file that is easy for the other person to open. If that file has to stay under a size limit, read [How to compress a PDF for email and applications](/blog/how-to-compress-pdf-for-email-and-applications).",
        ],
      },
      {
        id: "which-tool",
        heading: "Merge, split or organize: which tool do you need?",
        blocks: [
          { table: { head: ["You want to", "Use"], rows: [
            ["Join several files into one", "[Merge PDF](/merge-pdf)"],
            ["Pull some pages out of one file", "[Split PDF](/split-pdf)"],
            ["Put the pages of one file in a different order", "[Organize PDF](/organize-pdf)"],
            ["Remove pages you do not need", "[Delete PDF Pages](/delete-pdf-pages)"],
            ["Fix pages that are sideways", "[Rotate PDF](/rotate-pdf)"],
          ] } },
          "A common workflow is to rotate or delete pages in each file, merge them in order, and finish by compressing the result. On a phone, follow [How to merge PDF files on iPhone and Android](/blog/how-to-merge-pdf-on-iphone-and-android).",
        ],
      },
    ],
    faqs: [
      { q: "Can I merge PDFs on my phone?", a: "Yes. Merge PDF works in a phone browser. Save your files to the phone first, then pick them from the file chooser." },
    ],
  },
  "how-to-reduce-pdf-file-size": {
    sections: [
      {
        id: "checklist",
        heading: "A short checklist before you send a PDF",
        blocks: [
          { steps: [
            "Find the size limit and your file's current size.",
            "Delete pages you do not need with [Delete PDF Pages](/delete-pdf-pages).",
            "Compress with Recommended, then Smaller if needed. Smallest is the last resort.",
            "Open the result and check small print, stamps and signatures.",
            "Name the file clearly before you send it.",
          ] },
          "The full method, with a table of tactics, is in [How to compress a PDF for email and applications](/blog/how-to-compress-pdf-for-email-and-applications).",
        ],
      },
      {
        id: "alternatives",
        heading: "Other ways to get a PDF under a limit",
        blocks: [
          { table: { head: ["Option", "When it helps"], rows: [
            ["Compress PDF", "Large photos or scans inside the file"],
            ["Delete or split pages", "You do not need the whole document"],
            ["Shrink images first", "The PDF is made from phone photos"],
            ["Send in parts", "The portal or email accepts more than one file"],
          ] } },
          "If you build PDFs from photos, shrink them first with [Compress Image](/compress-image), as explained in [How to reduce a photo's file size](/blog/how-to-reduce-photo-size-in-kb).",
        ],
      },
    ],
  },
  "how-to-split-a-pdf": {
    sections: [
      {
        id: "examples",
        heading: "When splitting is the right move",
        blocks: [
          { list: [
            "**Send one page, not the whole file:** a single invoice or form from a long document.",
            "**Cut a report into chapters** and share each part with the right person.",
            "**Separate a scanned batch** into individual receipts or letters.",
            "**Stay under a size limit** by uploading a big PDF in smaller parts.",
          ] },
        ],
      },
      {
        id: "compare",
        heading: "Split, delete or organize: which is quickest?",
        blocks: [
          { table: { head: ["Goal", "Best tool"], rows: [
            ["Keep a few pages from a long file", "[Split PDF](/split-pdf), extract the pages you want"],
            ["Remove a few pages from a file", "[Delete PDF Pages](/delete-pdf-pages)"],
            ["Reorder the pages you keep", "[Organize PDF](/organize-pdf)"],
            ["Join the parts back together", "[Merge PDF](/merge-pdf)"],
          ] } },
          "For a step-by-step on removing pages by number, see [How to delete pages from a PDF](/blog/how-to-delete-pages-from-a-pdf).",
        ],
      },
    ],
  },
  "how-to-copy-text-from-pdf-to-word": {
    sections: [
      {
        id: "no-convert",
        heading: "Sometimes you do not need to convert at all",
        blocks: [
          "If you only need a paragraph, you can often select the text in your PDF viewer, copy it and paste it into Word. Use PDF to Word when you need all the text of a longer file in one go.",
          "To understand why layout, images and tables do not carry over, and which option suits each job, read [PDF to Word: why formatting gets lost and what to do instead](/blog/pdf-to-word-formatting-and-what-to-do-instead).",
        ],
      },
    ],
  },
};
