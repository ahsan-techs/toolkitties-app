import type { Post } from "./types";

// Phase 4: "how-to" + "problem-solver" guides for the newest tools (the ones
// with zero existing coverage). Every claim matches what the tool actually
// does — titles and claims from the original spec were adjusted where they
// promised more than the client-side implementation delivers (e.g. "without
// losing formatting", "legally binding" signatures, full-document AI chat).
export const phase4Guides: Post[] = [
  {
    slug: "how-to-sign-a-pdf-free-no-signup",
    title: "How to Sign a PDF for Free, Without an Account",
    seoTitle: "How to Electronically Sign a PDF for Free | Toolkitties",
    description: "Draw a signature, drag it into place and download a signed PDF — works on a laptop, phone or tablet, no account needed.",
    tool: "esign-pdf",
    category: "PDF",
    emoji: "✍️",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "Open eSign PDF, draw your signature with your mouse or finger, drag it onto the page, and download.",
      "Works on Mac, Windows, iPhone and Android — anywhere with a browser and a touchscreen or mouse.",
      "You can apply the same signature to every page at once, useful for initialing a multi-page contract.",
      "The signature and document are never uploaded — everything happens on your device.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Sign a PDF in four steps",
        blocks: [
          "Here's the full process with [eSign PDF](/esign-pdf):",
          {
            steps: [
              "Drop in the PDF you need to sign.",
              "Draw your signature in the signature pad using your mouse, trackpad or finger on a touchscreen.",
              "Drag the signature onto the page where it belongs, and use the size slider to scale it.",
              "Tick \"Apply to every page\" if you need the same signature on each page, then download.",
            ],
          },
          { note: "On a phone, the signature pad responds to touch the same way a mouse works on desktop — there's no separate app to install." },
        ],
      },
      {
        id: "tips",
        heading: "Getting a signature that looks like yours",
        blocks: [
          "A trackpad or touchscreen signature often looks shakier than pen-on-paper — a couple of habits help:",
          {
            list: [
              "**Go slower than feels natural.** Fast trackpad movements produce jagged lines more than a real pen would.",
              "**Use a stylus on a phone or tablet if you have one** — finger signatures are usable but a stylus is noticeably smoother.",
              "**Redraw if it's not legible.** The \"Redraw signature\" button clears the pad instantly — there's no cost to trying again.",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Is my signature saved anywhere for next time?", a: "No — the signature only exists in your browser's memory for this session. If you close the tab, you'll draw it again next time. Nothing is stored on a server." },
      { q: "Can I resize or move the signature after placing it?", a: "Yes — drag it to reposition, and use the size slider before you download. Once downloaded, the signature is burned into the PDF, so further changes need you to start over with the original file." },
    ],
    related: ["pdf-tools-without-uploading-your-file", "how-to-password-protect-a-pdf", "are-online-pdf-tools-safe"],
  },
  {
    slug: "is-a-drawn-pdf-signature-legally-valid",
    title: "Is a Drawn Signature on a PDF Legally Valid?",
    seoTitle: "Is a Drawn PDF Signature Legally Valid? | Toolkitties",
    description: "What actually makes an electronic signature count in most countries, and what a simple drawn signature does and doesn't give you.",
    tool: "esign-pdf",
    category: "Privacy",
    emoji: "⚖️",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "In many countries (including under the US ESIGN Act and the EU's eIDAS regulation), a simple electronic signature can be legally valid for most everyday contracts.",
      "What usually matters legally is proof of intent and identity, not the exact visual style of the signature.",
      "A drawn signature alone has no built-in audit trail (who signed, when, from where) — tools like DocuSign add that as a paid feature.",
      "For high-stakes documents (property sales, wills, some government forms), check your local requirements — some specifically require notarization or a qualified electronic signature, not just any e-signature.",
    ],
    sections: [
      {
        id: "the-short-answer",
        heading: "The honest, non-lawyer answer",
        blocks: [
          "This isn't legal advice — laws differ by country and by document type. But in broad terms, most jurisdictions with e-signature laws (the US ESIGN Act, EU eIDAS, and similar laws elsewhere) focus on whether both sides intended to sign and agree, not on whether the signature was drawn with a mouse, typed, or inked on paper.",
          "That means a signature made with [eSign PDF](/esign-pdf) can be legally meaningful for everyday agreements — a freelance contract, an NDA, a lease addendum — the same way typing your name at the bottom of an email agreement can be, in the right context.",
        ],
      },
      {
        id: "what-youre-missing",
        heading: "What a simple drawn signature doesn't include",
        blocks: [
          "Paid e-signature platforms (DocuSign, Adobe Sign and similar) sell more than the act of signing — they sell proof. A typical paid flow logs the signer's IP address, timestamp, and an audit trail, and sometimes verifies identity. A PDF you sign and download yourself has none of that built in.",
          { note: "If a signature might need to hold up in a dispute later, keep your own records of when and how it was sent and signed — an email thread confirming both parties agreed is often enough for everyday contracts." },
          "For documents where the stakes are high (large financial transactions, property, estate documents), check whether your jurisdiction requires a specific kind of signature — some explicitly exclude simple electronic signatures.",
        ],
      },
    ],
    faqs: [
      { q: "Should I use this for a high-value contract?", a: "For everyday agreements, most people do. For anything with major financial or legal weight, it's worth confirming with a lawyer or checking your local e-signature requirements first — this article is general information, not legal advice for your specific situation." },
      { q: "Does Toolkitties keep a record that I signed something?", a: "No — nothing is stored on any server, which is the whole privacy point of the tool. That also means Toolkitties can't provide you an audit trail later, so keep your own copy of the signed file and any related correspondence." },
    ],
    related: ["how-to-sign-a-pdf-free-no-signup", "pdf-tools-without-uploading-your-file", "are-online-pdf-tools-safe"],
  },
  {
    slug: "how-to-extract-text-from-scanned-pdf",
    title: "How to Extract Text From a Scanned PDF or Photo (Free OCR)",
    seoTitle: "Extract Text From Scanned PDFs Free (OCR) | Toolkitties",
    description: "Turn a scanned document or a photo of a page into text you can copy, search and edit — no software to install.",
    tool: "pdf-ocr",
    category: "PDF",
    emoji: "🔎",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "PDF OCR reads text out of scanned PDFs and photos directly in your browser, then gives you a downloadable .txt file.",
      "The first time you use it, a small language model downloads (once) and is cached by your browser for next time.",
      "Works best on clear, well-lit scans; very blurry or handwritten text will read less accurately.",
      "If a regular 'PDF to Word' or 'copy text' tool gives you nothing, that's a sign the PDF is scanned images rather than real text — this is the tool for that case.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Extract text in two steps",
        blocks: [
          "With [PDF OCR](/pdf-ocr):",
          {
            steps: [
              "Drop in a scanned PDF or a photo (JPG/PNG) of a document.",
              "Press \"Extract text (OCR)\" and wait — multi-page PDFs are read page by page, so larger scans take longer.",
              "Review the text box, then download it as a .txt file if it looks right.",
            ],
          },
          { note: "The first run downloads a small recognition model so your browser can read the image — after that first download, it's cached and later uses are faster." },
        ],
      },
      {
        id: "accuracy-tips",
        heading: "Getting more accurate results",
        blocks: [
          {
            list: [
              "**Scan at a decent resolution.** A blurry low-res photo gives OCR less to work with than a clear 300dpi scan.",
              "**Straighten crooked scans where you can.** Heavily skewed or rotated pages reduce accuracy.",
              "**Expect lower accuracy on handwriting.** This kind of OCR is built for printed text; handwritten notes are read far less reliably.",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Does this work on PDFs that already have selectable text?", a: "It can, but there's no need — if you can already select and copy text in a PDF viewer, use a text-extraction tool or [PDF to Word](/pdf-to-word) instead; it's faster and more accurate than OCR for text that's already digital." },
      { q: "Is my scanned document uploaded anywhere?", a: "No — the recognition model runs inside your browser. The image never leaves your device." },
    ],
    related: ["pdf-to-word-formatting-and-what-to-do-instead", "pdf-tools-without-uploading-your-file", "how-to-copy-text-from-pdf-to-word"],
  },
  {
    slug: "online-ocr-privacy-risks",
    title: "The Privacy Risk of Online OCR Tools (And How Local OCR Avoids It)",
    seoTitle: "Is Online OCR Safe? Privacy Risks Explained | Toolkitties",
    description: "Scanning IDs, medical forms or financial statements through OCR? Here's why where the recognition happens matters.",
    tool: "pdf-ocr",
    category: "Privacy",
    emoji: "🔐",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "Many free OCR tools upload your scanned image to a server to read the text — including, potentially, scans of IDs, medical records or bank statements.",
      "Once uploaded, you're trusting that service's retention policy and security, whatever it is.",
      "Toolkitties' PDF OCR runs the recognition model inside your browser, so the image is never sent anywhere.",
      "This matters most for documents people hesitate to upload at all — the kind that often get photographed and OCR'd precisely because they're sensitive.",
    ],
    sections: [
      {
        id: "the-risk",
        heading: "What you're actually trusting when you upload a scan",
        blocks: [
          "OCR is often used on exactly the documents people are most careful with: a passport for a visa application, a medical form, a bank statement for a loan. Running that image through a server-based OCR tool means a copy of it exists, however briefly, on infrastructure you don't control.",
          "Most services say they delete files after a short window and encrypt data in transit — and many are telling the truth. But that's still a trust assumption layered on top of the task itself, and it's one you don't need to make if the recognition never leaves your device.",
        ],
      },
      {
        id: "how-local-ocr-works",
        heading: "How browser-based OCR avoids this",
        blocks: [
          "[PDF OCR](/pdf-ocr) uses a recognition engine (Tesseract, compiled to run in the browser) that reads pixels directly from the page you're looking at. The only network request involved is downloading the recognition model itself the first time — a one-time, generic file with nothing of yours in it. After that, everything is local.",
          { note: "You can verify this yourself: open your browser's Network tab, run OCR on a file, and you'll see the model files load once but never your actual document." },
        ],
      },
    ],
    faqs: [
      { q: "Is local OCR as accurate as cloud OCR?", a: "For clear, printed text, it's close. Very large cloud AI services can edge it out on messy or stylized documents, but for the common case — a decent scan of a printed page — the difference is small, and the privacy trade-off is usually worth it for sensitive documents." },
      { q: "Does this work without an internet connection?", a: "After the first use (which needs a connection to download the model once), yes — OCR itself runs offline." },
    ],
    related: ["how-to-extract-text-from-scanned-pdf", "pdf-tools-without-uploading-your-file", "are-online-pdf-tools-safe"],
  },
  {
    slug: "how-to-summarize-a-pdf-free-privately",
    title: "How to Summarize a PDF and Ask It Questions — Privately",
    seoTitle: "Summarize a PDF and Ask Questions, Free & Private | Toolkitties",
    description: "Get the key points of a document and ask it direct questions, using a small AI model that runs in your browser instead of a cloud API.",
    tool: "ai-pdf-chat",
    category: "PDF",
    emoji: "🤖",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "AI PDF Chat gives you an instant bullet-point summary and lets you ask direct questions about a document's content.",
      "It's built for quick answers from a document you already have open, not a long back-and-forth conversation like a general chatbot.",
      "The AI model downloads once (a few tens of MB) and then runs locally — your document's text is never sent to a cloud AI service.",
      "Works best on PDFs with real, selectable text; scanned documents need [PDF OCR](/pdf-ocr) first.",
    ],
    sections: [
      {
        id: "what-it-does",
        heading: "What this tool is (and isn't)",
        blocks: [
          "[AI PDF Chat](/ai-pdf-chat) does two things: it picks out the most representative sentences from the document for an instant summary, and it answers direct, specific questions by finding the most relevant part of the text and pulling out the answer.",
          "To be upfront about it: this is a small, focused model built for speed and privacy, not a large conversational AI. It's at its best with direct factual questions (\"What is the total amount due?\", \"Who is the other party in this contract?\") rather than open-ended requests like \"write me a 500-word analysis.\" For that kind of deep analysis, a cloud AI tool will do more — the trade-off is that your document stays on your device.",
        ],
      },
      {
        id: "steps",
        heading: "Using it",
        blocks: [
          {
            steps: [
              "Drop in a PDF with selectable text (not a scan — try PDF OCR first if it is).",
              "Press \"Summarize this PDF\" for an instant bullet-point overview — this part has no download and works immediately.",
              "Type a specific question and press Ask. The first question downloads a small AI model (shown as a percentage); after that, questions answer in a few seconds.",
            ],
          },
          { note: "If the answer comes back uncertain, try rephrasing the question more specifically, or quoting a term that appears in the document — the model searches the document's own wording, not general knowledge." },
        ],
      },
    ],
    faqs: [
      { q: "Does this send my document to OpenAI, Google or any other AI company?", a: "No. The question-answering model runs inside your browser using Transformers.js — there's no API call to an external AI service, and nothing about your document is sent anywhere." },
      { q: "Why does the first question take longer than the rest?", a: "The AI model (around 65MB) downloads the first time you ask a question, then your browser caches it, so later questions in the same browser are much faster." },
    ],
    related: ["pdf-tools-without-uploading-your-file", "how-to-extract-text-from-scanned-pdf", "pdf-to-word-formatting-and-what-to-do-instead"],
  },
  {
    slug: "local-ai-vs-cloud-ai-for-sensitive-documents",
    title: "Local AI vs Cloud AI: Which Should You Trust With a Sensitive Document?",
    seoTitle: "Local AI vs Cloud AI for Sensitive PDFs | Toolkitties",
    description: "If a document has financial, medical or legal details in it, where the AI model runs changes what you're exposing — and to whom.",
    tool: "ai-pdf-chat",
    category: "Privacy",
    emoji: "🧩",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "Pasting a document's text into a cloud AI chatbot usually means that text is sent to, and sometimes retained by, a third-party server.",
      "A model that runs locally in your browser never sends the document's content anywhere — only a generic, one-time model download happens over the network.",
      "The trade-off is capability: local, browser-sized models are smaller and less capable than large cloud models.",
      "For routine questions about an invoice, contract or report, that trade-off is usually worth it when the document is sensitive.",
    ],
    sections: [
      {
        id: "the-trade-off",
        heading: "Capability vs exposure",
        blocks: [
          "Large cloud AI models are genuinely more capable — they can reason across longer documents, write in more depth, and handle vaguer questions better than a small model running on your laptop's CPU. That capability comes from running on powerful remote servers, which means whatever you send them travels over the network and is processed (and often logged, at least briefly) on infrastructure you don't control.",
          "For a grocery list or a blog draft, that's rarely a concern. For a signed contract, a medical report, or an internal financial document, it's a real question worth asking before you paste the contents into a chat box.",
        ],
      },
      {
        id: "where-local-fits",
        heading: "Where a local model like this one fits",
        blocks: [
          "[AI PDF Chat](/ai-pdf-chat) trades some of that capability for the guarantee that nothing leaves your device. It's well suited to the most common real use case — pulling a specific fact or a quick summary out of a document you already have — and less suited to asking it to reason broadly or write something new from the document.",
          { note: "A reasonable rule of thumb: if you'd hesitate to email the document to a stranger, a local tool is the safer choice for working with it, even if a cloud AI could technically do more with it." },
        ],
      },
    ],
    faqs: [
      { q: "Can I use this offline, on a flight or without wifi?", a: "Once the model has downloaded once on a working connection, yes — summarizing and asking questions both work offline after that." },
      { q: "Is a local model ever going to be as good as ChatGPT for this?", a: "Not for open-ended tasks — it's built to be small and fast enough to run in a browser tab, which is a very different design goal from a large cloud model. For direct fact-finding in a document you're looking at, the gap matters less." },
    ],
    related: ["how-to-summarize-a-pdf-free-privately", "pdf-tools-without-uploading-your-file", "are-online-pdf-tools-safe"],
  },
  {
    slug: "convert-excel-to-pdf-without-cutting-off-columns",
    title: "How to Convert Excel to PDF Without Cutting Off Columns",
    seoTitle: "Convert Excel to PDF Without Cut-Off Columns | Toolkitties",
    description: "The most common Excel-to-PDF complaint is columns running off the edge of the page — here's how to avoid it.",
    tool: "excel-to-pdf",
    category: "Business",
    emoji: "📊",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "Excel to PDF automatically switches to landscape for sheets with more than 6 columns, so wide tables fit the page instead of cutting off.",
      "Every sheet becomes its own page(s) in the PDF, with the header row repeated at the top of each new page.",
      "This tool keeps the data and structure — cell colors, merged cells and Excel-specific fonts aren't carried over, only the grid of text.",
      "Best for data-focused printing (reports, rosters, ledgers) rather than a visually designed spreadsheet.",
    ],
    sections: [
      {
        id: "the-problem",
        heading: "Why columns usually get cut off",
        blocks: [
          "Excel's own \"print to PDF\" uses your current page setup, which is usually tuned for viewing on screen, not for a specific number of columns. Add a few extra columns to a wide report and the page break lands in the middle of your table — a familiar, annoying problem for anyone who prints financial or scheduling spreadsheets.",
        ],
      },
      {
        id: "steps",
        heading: "Converting with the columns fitting properly",
        blocks: [
          "Using [Excel to PDF](/excel-to-pdf):",
          {
            steps: [
              "Drop in your .xls or .xlsx file.",
              "Press \"Convert to PDF\" — sheets with more than 6 columns automatically print landscape, so wide tables have more room.",
              "Check the result: each sheet starts a fresh page, and if a sheet runs long, the header row repeats at the top of every new page so you can still read the columns.",
            ],
          },
          { note: "Very long individual cell values are shortened with an ellipsis so columns stay a consistent, readable width — for cells where you need the full text, keep the original spreadsheet alongside the PDF." },
        ],
      },
    ],
    faqs: [
      { q: "Will my cell colors and fonts carry over?", a: "No — this tool focuses on getting the data into a clean, consistently formatted table rather than replicating Excel's visual styling. If you need a pixel-perfect replica of a styled spreadsheet, Excel's own PDF export may suit that specific need better; this tool is built for readable, print-ready data tables." },
      { q: "What happens with very large spreadsheets?", a: "Each sheet paginates automatically as needed — a 500-row sheet becomes several PDF pages with the header repeated on each, rather than being cut off." },
    ],
    related: ["toolkitties-vs-ilovepdf-vs-smallpdf", "how-to-write-an-invoice"],
  },
  {
    slug: "convert-excel-to-pdf-safely-offline",
    title: "Converting Financial Spreadsheets to PDF Without Uploading Them",
    seoTitle: "Convert Excel to PDF Safely, No Upload | Toolkitties",
    description: "Payroll, invoices, cash ledgers — here's why keeping the conversion on your own device matters for financial files.",
    tool: "excel-to-pdf",
    category: "Privacy",
    emoji: "🔒",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "Most free Excel-to-PDF converters upload your spreadsheet to a server to do the conversion.",
      "Excel to PDF reads and converts the file entirely in your browser using SheetJS and pdf-lib — the spreadsheet is never sent anywhere.",
      "This matters most for payroll, client invoices, tax figures and anything with account numbers or salary data in it.",
      "The same applies to the matching [PDF to Excel](/pdf-to-excel) tool for converting the other direction.",
    ],
    sections: [
      {
        id: "why-it-matters",
        heading: "Spreadsheets carry more sensitive data than people notice",
        blocks: [
          "A spreadsheet converted \"just to send as a PDF\" is often one of the more sensitive files someone works with that day — a payroll roster, a client's invoice history, a cash ledger with account details. It's easy to not think of the conversion step itself as a privacy decision, but uploading that file to a server, even briefly, is exactly that.",
          "[Excel to PDF](/excel-to-pdf) parses the spreadsheet locally (using SheetJS) and draws the PDF locally (using pdf-lib) — the two steps that together make up the conversion never involve sending the file anywhere.",
        ],
      },
      {
        id: "practical-use",
        heading: "Where this fits into a normal workflow",
        blocks: [
          {
            list: [
              "**Payroll exports** — convert a roster to PDF for records or signatures without routing salary data through a third party.",
              "**Client invoices kept in a spreadsheet** — turn a batch into clean PDFs for sending, locally.",
              "**Tax and bookkeeping prep** — convert ledgers to PDF for an accountant or filing without an extra upload step.",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Does this work for .xls as well as .xlsx?", a: "Yes, both formats are supported." },
      { q: "Is there a file size limit?", a: "No fixed limit — very large spreadsheets are bound by your device's own memory rather than an artificial cap." },
    ],
    related: ["convert-excel-to-pdf-without-cutting-off-columns", "pdf-tools-without-uploading-your-file", "how-to-write-an-invoice"],
  },
  {
    slug: "extract-tables-from-pdf-to-excel",
    title: "How to Extract a Table From a PDF Into Excel",
    seoTitle: "Extract PDF Tables to Excel for Free | Toolkitties",
    description: "Pull a table out of a bank statement, invoice or report PDF into an editable spreadsheet, without retyping it.",
    tool: "pdf-to-excel",
    category: "PDF",
    emoji: "📥",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "PDF to Excel reads each page's text positions and groups them into rows and columns automatically.",
      "Each page of the PDF becomes its own sheet in the resulting .xlsx file.",
      "Works on PDFs with real, selectable text — scanned statements need OCR first, since there's no text layer to read positions from.",
      "Column detection is based on spacing, so it works best on PDFs with clearly separated columns rather than dense, tightly-packed layouts.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Pulling a table out of a PDF",
        blocks: [
          "With [PDF to Excel](/pdf-to-excel):",
          {
            steps: [
              "Drop in the PDF — a bank statement, invoice, or any document with tabular data.",
              "Press \"Convert to Excel.\"",
              "Download the .xlsx file — open it and check the columns lined up the way you expected; dense or unusually formatted tables may need a little manual tidying.",
            ],
          },
          { note: "This works by measuring the gaps between pieces of text on the page and guessing where one column ends and the next begins — it's a solid starting point for most simple tables, not a guarantee of a perfect result on every layout." },
        ],
      },
      {
        id: "when-it-struggles",
        heading: "When table extraction gets it wrong",
        blocks: [
          {
            list: [
              "**Scanned PDFs (photos of pages)** have no text layer at all to read — run [PDF OCR](/pdf-ocr) first, then work from the resulting text.",
              "**Very tightly spaced columns** can occasionally get merged into one cell, since the gap between them isn't much wider than a normal word space.",
              "**Multi-line cells** (a table cell with wrapped text) may split across more than one row.",
            ],
          },
          "For a simple, cleanly formatted table — the most common case, like a bank statement or invoice line-item list — the automatic extraction usually needs little to no cleanup.",
        ],
      },
    ],
    faqs: [
      { q: "Can it handle a PDF with several tables across many pages?", a: "Yes — each page's content becomes its own sheet, so a multi-page statement turns into a workbook with one sheet per page." },
      { q: "Does it work on scanned bank statements?", a: "Not directly — a scan has no embedded text to read positions from. Run it through [PDF OCR](/pdf-ocr) first, then work with the extracted text." },
    ],
    related: ["convert-excel-to-pdf-without-cutting-off-columns", "how-to-extract-text-from-scanned-pdf"],
  },
  {
    slug: "convert-pdf-invoices-to-excel-safely",
    title: "The Safest Way to Convert PDF Invoices to Excel",
    seoTitle: "Convert PDF Invoices to Excel Safely, Free | Toolkitties",
    description: "Invoices carry client names, amounts and account details — here's a way to get them into Excel without uploading them anywhere.",
    tool: "pdf-to-excel",
    category: "Privacy",
    emoji: "🧾",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "PDF to Excel extracts table data entirely in your browser — invoice contents are never uploaded to a server.",
      "This is especially relevant for invoices and statements, which typically contain client names, amounts and sometimes bank details.",
      "Reviewing the extracted Excel sheet against the original PDF is still worth doing before relying on it for bookkeeping.",
      "For bulk invoice processing, convert them one at a time — each becomes its own downloadable Excel file.",
    ],
    sections: [
      {
        id: "why-it-matters",
        heading: "What's actually in an invoice PDF",
        blocks: [
          "An invoice usually has more sensitive detail in it than people think about when converting it: client or company names, line-item pricing that may be commercially sensitive, sometimes bank or payment details. Running a batch of these through a server-based converter means that information, however briefly, exists on someone else's infrastructure.",
          "[PDF to Excel](/pdf-to-excel) reads the invoice's text positions and reconstructs the table locally, using pdfjs and a plain row/column clustering method — nothing about the invoice is sent over the network.",
        ],
      },
      {
        id: "checklist",
        heading: "A quick check before you trust the result",
        blocks: [
          {
            list: [
              "**Compare totals.** Check that the sum of the extracted line items matches the invoice total — a quick way to catch a row that didn't extract cleanly.",
              "**Check numeric columns stayed numeric.** Occasionally a currency symbol or stray character can end up merged into a number cell.",
              "**Spot-check the client/vendor name fields**, since these are often the first thing used in downstream bookkeeping software.",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Can I batch-convert many invoices at once?", a: "Each conversion is one PDF at a time right now — for a batch, run them one after another; each produces its own Excel file to download." },
      { q: "Does this tool do any accounting calculations?", a: "No — it extracts the table as-is. For invoice creation and running totals, see the [Invoice Generator](/invoice-generator) tool instead." },
    ],
    related: ["extract-tables-from-pdf-to-excel", "how-to-write-an-invoice", "pdf-tools-without-uploading-your-file"],
  },
];
