// Which guides explain how to use which tool. Slugs must exist in lib/blog (checked at render time:
// anything missing is skipped), so a typo here can never produce a broken link.
export const toolGuides: Record<string, string[]> = {
  "merge-pdf": ["how-to-merge-pdf-files", "are-online-pdf-tools-safe"],
  "compress-pdf": ["how-to-reduce-pdf-file-size", "how-to-compress-pdf-for-email-and-applications"],
  "split-pdf": ["how-to-split-a-pdf"],
  "word-counter": ["word-count-and-character-limits"],
  "invoice-generator": ["how-to-write-an-invoice"],
  "quotation-generator": ["how-to-write-a-quotation-or-estimate"],
  "vat-calculator": ["how-to-add-vat-or-sales-tax"],
};
