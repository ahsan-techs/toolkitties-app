import type { Post } from "./types";

// In-depth guides for the tools people ask for most. Each statement about a Toolkitties tool matches what the tool does.
export const guidePosts: Post[] = [
  {
    slug: "how-to-compress-pdf-for-email-and-applications",
    title: "How to Compress a PDF for Email, Job Applications and Online Forms",
    seoTitle: "Compress a PDF for Email and Online Forms | Toolkitties",
    description: "A practical way to shrink a PDF that is over a size limit: what to try first, what to remove, and how to check the result. Free and private.",
    tool: "compress-pdf",
    category: "PDF",
    emoji: "🗜️",
    published: "2026-10-24",
    updated: "2026-10-24",
    takeaways: [
      "Check the exact size limit first, then shrink in small steps: Recommended, then Smaller, then Smallest only if you must.",
      "Removing pages you do not need and shrinking big photos before they go into the PDF often saves more than compression alone.",
      "Smallest turns pages into pictures, so keep your original and do not use it when the text must stay selectable.",
      "Compress PDF runs in your browser, so a private document is not uploaded.",
    ],
    sections: [
      {
        id: "limits",
        heading: "Why PDFs get rejected for size",
        blocks: [
          "Email services, job portals, scholarship forms and government sites often set a maximum size for attachments. Phone cameras and scanner apps create large pictures, and a PDF made from them can be many times bigger than the limit. The fix is not to retype anything. You make the file lighter without changing what it says.",
          "Before you do anything, find the real limit. It is usually written next to the upload button or in the instructions. Then check the size of your file in its properties so you know how far you have to go.",
        ],
      },
      {
        id: "ladder",
        heading: "The step-by-step method: shrink in small steps",
        blocks: [
          "Do not jump straight to the strongest setting. Each step costs some quality, so stop as soon as you are under the limit.",
          { steps: [
            "Open [Compress PDF](/compress-pdf) and add your file.",
            "Start with **Recommended**. It makes the file smaller and keeps text sharp.",
            "Check the size of the result. If it is still too big, run the original again with **Smaller**, which compresses the pictures harder while keeping text sharp.",
            "Only if you are still over the limit, use **Smallest**. It turns every page into a picture for the lowest size, so the text can no longer be selected or searched.",
            "Open the final file and scroll through it before you upload it.",
          ] },
          { note: "Always run each level on your original file, not on a file you already compressed. Compressing a compressed file again loses quality faster for little extra saving." },
        ],
      },
      {
        id: "before",
        heading: "What to do before you compress",
        blocks: [
          "The biggest savings often come from changing what goes into the PDF, not from the compression step itself.",
          { list: [
            "**Remove pages you do not need.** A blank back page or a cover sheet still takes space. Use [Delete PDF Pages](/delete-pdf-pages).",
            "**Shrink photos before making the PDF.** If the PDF is built from phone photos, reduce them first with [Compress Image](/compress-image) and then combine them with [Image to PDF](/image-to-pdf).",
            "**Send only the pages that are asked for.** [Split PDF](/split-pdf) pulls out just those pages.",
            "**Scan sensibly.** A scan at a very high resolution makes a heavy file. A moderate resolution is enough for reading on screen.",
          ] },
        ],
      },
      {
        id: "tactics",
        heading: "Which tactic helps most",
        blocks: [
          { table: { head: ["Situation", "Best first move"], rows: [
            ["PDF made of phone photos", "Shrink the photos, then rebuild the PDF"],
            ["Long scanned document", "Compress with Smaller, delete blank pages"],
            ["Mostly text, already small", "Little to gain. Check whether it really is over the limit"],
            ["Portal allows several files", "Split into parts and upload each one"],
            ["Over the limit by a small amount", "Recommended or Smaller is often enough"],
          ] } },
          "A PDF that is mostly text is already compact, so compression may barely change it. Large pictures and scans are where the savings are.",
        ],
      },
      {
        id: "mistakes",
        heading: "Mistakes that cost people time",
        blocks: [
          { list: [
            "Choosing the strongest level first and ending up with blurry pages.",
            "Compressing the same file again and again.",
            "Deleting the original, then needing selectable text later.",
            "Uploading without opening the final file, and sending a page in the wrong order.",
          ] },
          "If you are working with sensitive papers such as ID copies or contracts, also read [Are online PDF tools safe?](/blog/are-online-pdf-tools-safe) so you know how to check that a tool does not upload your file.",
        ],
      },
      {
        id: "check",
        heading: "Check the result before you send it",
        blocks: [
          "Open the compressed file. Zoom in on small print, stamps and signatures. Confirm the page count and order. Look at the file size once more. If everything is readable and under the limit, you are done. If the text became too soft, go back one level and try other ways to reduce the size, such as deleting pages.",
        ],
      },
    ],
    faqs: [
      { q: "Which compression level should I choose?", a: "Start with Recommended. If the file is still too large, try Smaller. Use Smallest only when size matters more than selectable text." },
      { q: "Can I choose an exact file size?", a: "No. The tool offers three levels, not a target size. Try the levels in order and check the result." },
      { q: "Why is my compressed PDF still too big?", a: "PDFs full of large photos or scans may need more than one step. Delete pages you do not need, shrink the photos first, or split the file into parts." },
      { q: "Will compressing change the way my PDF looks?", a: "On Recommended and Smaller, text stays sharp and only pictures are compressed more. On Smallest, pages become pictures." },
      { q: "Is it safe to compress an ID copy or a contract here?", a: "The work happens in your browser and the file is not uploaded to Toolkitties, so it suits private documents." },
    ],
    related: ["how-to-reduce-pdf-file-size", "how-to-turn-photos-into-a-pdf", "are-online-pdf-tools-safe"],
  },
  {
    slug: "how-to-merge-pdf-on-iphone-and-android",
    title: "How to Merge PDF Files on iPhone and Android (No App Needed)",
    seoTitle: "How to Merge PDFs on iPhone and Android | Toolkitties",
    description: "Combine PDFs into one file straight from your phone browser. Add files, arrange them, choose pages and download. Free, with no app and no signup.",
    tool: "merge-pdf",
    category: "PDF",
    emoji: "📱",
    published: "2026-10-24",
    updated: "2026-10-24",
    takeaways: [
      "Open Merge PDF in your phone browser, add your PDFs, arrange them and press merge. There is nothing to install.",
      "Save your files to the phone first, so you can pick them from the file chooser.",
      "You can choose which pages to take from each file before merging.",
      "Merging happens on your phone, so the files are not uploaded.",
    ],
    sections: [
      {
        id: "why",
        heading: "Why use the browser instead of an app",
        blocks: [
          "Many people need to merge PDFs on the go: forms for a visa or a job, receipts for an expense claim, class notes before an exam. Installing an app for one small task is slow, and some apps ask you to sign up or show a lot of ads. A browser tool needs only a few taps.",
        ],
      },
      {
        id: "steps",
        heading: "Merge PDFs on your phone in six steps",
        blocks: [
          { steps: [
            "**Save the PDFs to your phone.** If they arrived in a chat or an email, download them so they are stored on the device.",
            "Open **[Merge PDF](/merge-pdf)** in your phone browser.",
            "Tap to add files and choose your PDFs from the file chooser. You can add more than one.",
            "Check the preview of each file so you know which is which, and arrange them in the order you want.",
            "If you only need some pages, choose the pages to keep from each file.",
            "Press merge and download the combined PDF.",
          ] },
          "After downloading, find the file in your phone's Downloads or Files area and open it to check it.",
        ],
      },
      {
        id: "iphone",
        heading: "On an iPhone",
        blocks: [
          "Use Safari or another browser. Downloaded files usually go to the Files app. When the tool asks you to pick files, choose from Files, and look in Downloads. If your PDFs are in iCloud Drive, make sure they are downloaded to the device before you pick them.",
        ],
      },
      {
        id: "android",
        heading: "On an Android phone",
        blocks: [
          "Use Chrome or another browser. When the file chooser opens, look in Downloads or in the folder where your chat app saves documents. If you cannot see your files, open the menu in the chooser and switch to the Documents or Downloads view.",
        ],
      },
      {
        id: "tips",
        heading: "Tips for a clean result on a small screen",
        blocks: [
          { list: [
            "Rename files with 01, 02, 03 first so the order is obvious.",
            "Merge in the final order so you do not have to do it twice.",
            "If the merged file is too big to send, shrink it with [Compress PDF](/compress-pdf). The size guide is in [How to compress a PDF for email and applications](/blog/how-to-compress-pdf-for-email-and-applications).",
            "If one PDF needs a password to open, remove the password first with [Unlock PDF](/unlock-pdf).",
          ] },
        ],
      },
      {
        id: "problems",
        heading: "If something goes wrong",
        blocks: [
          { table: { head: ["Problem", "Try this"], rows: [
            ["I cannot find my files in the chooser", "Check the Downloads folder, or download the file again first"],
            ["A file will not open for merging", "It may be password protected. Unlock it first"],
            ["The pages are in the wrong order", "Reorder the files and merge again from the originals"],
            ["The merged file is huge", "Compress it, or remove pages you do not need"],
          ] } },
        ],
      },
    ],
    faqs: [
      { q: "Do I need to install an app to merge PDFs on my phone?", a: "No. Merge PDF works in your phone browser." },
      { q: "Does it work on both iPhone and Android?", a: "Yes. It runs in the browser on both. Use the file chooser to pick PDFs saved on your phone." },
      { q: "Are my PDFs uploaded?", a: "No. The merging happens on your phone and the files are not uploaded." },
      { q: "Can I merge only some pages of a PDF?", a: "Yes. Choose the pages to include from each file before you merge." },
      { q: "How do I find the merged file afterwards?", a: "Look in your phone's Downloads folder or the Files app, depending on your phone." },
    ],
    related: ["how-to-merge-pdf-files", "how-to-compress-pdf-for-email-and-applications", "how-to-split-a-pdf"],
  },
  {
    slug: "how-to-scan-documents-with-your-phone-into-one-pdf",
    title: "How to Scan Documents with Your Phone and Save Them as One PDF",
    seoTitle: "Scan Documents with Your Phone into One PDF | Toolkitties",
    description: "Take clean photos of documents, put them in order and turn them into a single PDF for applications and forms. No scanner and no app needed.",
    tool: "image-to-pdf",
    category: "PDF",
    emoji: "📷",
    published: "2026-10-24",
    updated: "2026-10-24",
    takeaways: [
      "Take one photo per page in good, even light, holding the phone straight above the page.",
      "Crop away the background, shrink big photos if needed, then combine the photos with Image to PDF.",
      "iPhone HEIC photos should be converted to JPG first.",
      "The PDF is built in your browser, so your documents are not uploaded.",
    ],
    sections: [
      {
        id: "why",
        heading: "When a phone scan is enough",
        blocks: [
          "Forms for jobs, schools, banks and offices often ask for a PDF of your certificates, ID copy or bills. You do not need a scanner. A phone camera, good light and a few minutes are enough, as long as the result is easy to read.",
        ],
      },
      {
        id: "photo",
        heading: "Take photos that read well",
        blocks: [
          { list: [
            "**Use daylight or bright, even light.** Avoid shadows across the page, including your own.",
            "**Place the page on a plain, flat surface.** A dark table behind a white page makes the edges clear.",
            "**Hold the phone straight above the page,** not at an angle, so the page does not look slanted.",
            "**Fill the frame and keep the text sharp.** Tap the screen to focus before you take the photo.",
            "**One photo per page,** taken in the order you want them to appear.",
          ] },
        ],
      },
      {
        id: "prepare",
        heading: "Prepare the photos",
        blocks: [
          { steps: [
            "Crop the background away with [Crop Image](/crop-image), which takes the exact pixel area you want to keep.",
            "If a photo is sideways, turn it with [Rotate Image](/rotate-image).",
            "If your iPhone saved photos as HEIC, convert them to JPG with [HEIC to JPG](/heic-to-jpg). The guide is in [How to convert HEIC to JPG](/blog/how-to-convert-heic-to-jpg).",
            "If the photos are large, reduce them with [Compress Image](/compress-image).",
          ] },
        ],
      },
      {
        id: "make-pdf",
        heading: "Make the PDF",
        blocks: [
          { steps: [
            "Open [Image to PDF](/image-to-pdf) and add your photos. JPG and PNG are supported.",
            "Arrange them so the pages are in the correct order.",
            "Create the PDF and download it.",
            "Open it and scroll through every page before you send it.",
          ] },
          { note: "Give the file a clear name, such as your-name-certificates.pdf. A clear name helps the person who receives it." },
        ],
      },
      {
        id: "size",
        heading: "If the PDF is too big",
        blocks: [
          "Photos make heavy PDFs. If a form has a size limit, shrink the photos before you build the PDF, or compress the finished PDF with [Compress PDF](/compress-pdf). The full method is in [How to compress a PDF for email and applications](/blog/how-to-compress-pdf-for-email-and-applications).",
        ],
      },
      {
        id: "privacy",
        heading: "Keep your documents private",
        blocks: [
          "ID copies and certificates are sensitive. Image to PDF builds the PDF in your browser, so your photos stay on your device. After you have sent the file, delete extra copies you no longer need. For more on checking how a tool treats your files, read [Are online PDF tools safe?](/blog/are-online-pdf-tools-safe).",
        ],
      },
    ],
    faqs: [
      { q: "Which photo types can I use?", a: "JPG and PNG. For HEIC photos from an iPhone, convert them with HEIC to JPG first." },
      { q: "Can I put many photos in one PDF?", a: "Yes. Add the photos, arrange them in order and create the PDF." },
      { q: "How do I make the photos look more like a scan?", a: "Use good light, shoot straight from above, crop the background and keep one page per photo." },
      { q: "Are my photos uploaded?", a: "No. The PDF is created in your browser and your photos stay on your device." },
      { q: "Can I change the page order later?", a: "You can rearrange the photos before you create the PDF. If you need to change the order of a finished PDF, use Organize PDF." },
    ],
    related: ["how-to-turn-photos-into-a-pdf", "how-to-convert-heic-to-jpg", "how-to-compress-pdf-for-email-and-applications"],
  },
  {
    slug: "pdf-to-word-formatting-and-what-to-do-instead",
    title: "PDF to Word: Why Formatting Gets Lost and What to Do Instead",
    seoTitle: "PDF to Word: Why Formatting Is Lost | Toolkitties",
    description: "Understand why converting a PDF to Word rarely keeps the layout, what a text-only conversion gives you, and better options for each situation.",
    tool: "pdf-to-word",
    category: "PDF",
    emoji: "📄",
    published: "2026-10-24",
    updated: "2026-10-24",
    takeaways: [
      "A PDF stores where each piece of text sits on the page, not how a Word document is structured, so layout is hard to recover.",
      "PDF to Word on Toolkitties copies the text only. Images, tables and layout are not kept.",
      "A scanned PDF is pictures, so there may be no text to copy.",
      "For the look of the pages, export them as pictures. For the words, copy the text.",
    ],
    sections: [
      {
        id: "why",
        heading: "Why layout is hard to recover",
        blocks: [
          "A Word file describes a document: paragraphs, headings, tables and styles. A PDF describes a picture of a page: it says where each line of text sits. When you turn a PDF back into Word, a program has to guess where paragraphs begin, where columns are and what is a table. Even good converters get this wrong sometimes, which is why converted documents often look a little broken.",
          "We would rather be clear about this than promise a perfect copy. The [PDF to Word](/pdf-to-word) tool is built to do one thing reliably: get the text out.",
        ],
      },
      {
        id: "what-you-get",
        heading: "What a text-only conversion gives you",
        blocks: [
          { table: { head: ["In the PDF", "What you get"], rows: [
            ["Paragraph text", "Copied as editable text"],
            ["Images and logos", "Not kept"],
            ["Tables", "Structure not kept, so check any figures"],
            ["Columns and page layout", "Not kept"],
            ["Scanned pages", "No text to copy, because a scan is a picture"],
          ] } },
          "That is enough for many jobs: reusing wording from a report, quoting a paragraph, correcting a letter, or starting a new document from old text.",
        ],
      },
      {
        id: "choose",
        heading: "Which option fits your situation",
        blocks: [
          { list: [
            "**You need the words.** Use PDF to Word, then format the text in your word processor.",
            "**You need the page to look the same.** Export pages as pictures with [PDF to JPG](/pdf-to-jpg) and place them in your document.",
            "**You only need some pages.** Extract them first with [Split PDF](/split-pdf), then copy the text.",
            "**You have the original.** If you or a colleague still have the original Word file, edit that. It will always be better than any conversion.",
            "**You need to change a few words in a PDF.** Ask the author for the source file if you can.",
          ] },
        ],
      },
      {
        id: "scanned",
        heading: "Is my PDF a scan?",
        blocks: [
          "Open the PDF and try to highlight a single word with your mouse or finger. If you can, the PDF contains real text. If the whole page highlights as one block, or nothing highlights, it is probably a scan. A scan has no text to copy, and PDF to Word does not read text from pictures.",
        ],
      },
      {
        id: "after",
        heading: "After converting: a quick checklist",
        blocks: [
          { steps: [
            "Read the first and last paragraphs to check nothing is missing.",
            "Check numbers that came from tables, because table structure is not kept.",
            "Fix headings and spacing in your word processor.",
            "Compare against the PDF for any special characters.",
          ] },
        ],
      },
    ],
    faqs: [
      { q: "Does PDF to Word keep images and formatting?", a: "No. It copies text only. Images, tables and page layout are not kept." },
      { q: "Why is a scanned PDF empty after converting?", a: "A scan is made of pictures rather than text, so there is nothing to copy. The tool does not read text from images." },
      { q: "How do I keep the layout of a PDF page?", a: "Export the pages as pictures with PDF to JPG, or keep the PDF as it is." },
      { q: "Is my PDF uploaded?", a: "No. The text is read in your browser and the file stays on your device." },
      { q: "Can I convert only some pages?", a: "Yes. Extract the pages you need with Split PDF first, then convert that file." },
    ],
    related: ["how-to-copy-text-from-pdf-to-word", "how-to-convert-pdf-to-jpg", "how-to-split-a-pdf"],
  },
  {
    slug: "how-to-delete-pages-from-a-pdf",
    title: "How to Delete Pages from a PDF (and Keep Only What You Need)",
    seoTitle: "How to Delete Pages from a PDF for Free | Toolkitties",
    description: "Remove unwanted pages from a PDF by typing the page numbers. Learn the page-range format, when to extract instead and how to check the result.",
    tool: "delete-pdf-pages",
    category: "PDF",
    emoji: "🗑️",
    published: "2026-10-24",
    updated: "2026-10-24",
    takeaways: [
      "Type the pages to remove, such as 2, 4-6, 9, and download a new PDF with the rest.",
      "Your original file is never changed.",
      "To keep only a few pages, extracting them with Split PDF can be easier than deleting many.",
      "The tool always leaves at least one page, and everything runs in your browser.",
    ],
    sections: [
      {
        id: "why",
        heading: "Common reasons to delete pages",
        blocks: [
          { list: [
            "A blank page or a cover sheet that came with a scan.",
            "Pages with private details that should not be shared.",
            "Extra pages that push a file over a size limit.",
            "An attachment page that is no longer needed.",
          ] },
        ],
      },
      {
        id: "steps",
        heading: "Delete pages step by step",
        blocks: [
          { steps: [
            "Open the PDF and write down the page numbers you want to remove. Numbers count from the first page.",
            "Open [Delete PDF Pages](/delete-pdf-pages) and add your file.",
            "Type the pages to delete in the box.",
            "Process the file. You will see how many pages were removed and how many are left.",
            "Download the new PDF and open it to check.",
          ] },
        ],
      },
      {
        id: "format",
        heading: "How to write the page list",
        blocks: [
          { table: { head: ["You type", "Pages removed"], rows: [
            ["3", "Page 3 only"],
            ["2, 5", "Pages 2 and 5"],
            ["4-6", "Pages 4, 5 and 6"],
            ["2, 4-6, 9", "Page 2, pages 4 to 6 and page 9"],
          ] } },
          "Use commas between items and a dash for a run of pages. The tool will not delete every page, because a PDF needs at least one page.",
        ],
      },
      {
        id: "extract",
        heading: "Delete or extract: which is easier?",
        blocks: [
          "If you want to remove two pages from a 50-page file, deleting is quick. If you only want to keep three pages from a 50-page file, extracting is quicker, because you name three pages instead of forty-seven. [Split PDF](/split-pdf) lets you choose pages from previews. If you also want to change the order of the remaining pages, use [Organize PDF](/organize-pdf).",
        ],
      },
      {
        id: "after",
        heading: "After you delete pages",
        blocks: [
          "Open the new file and check that the right pages are gone. If it is still too large, shrink it with [Compress PDF](/compress-pdf). The method is in [How to compress a PDF for email and applications](/blog/how-to-compress-pdf-for-email-and-applications). If you removed pages because they contained private information, remember that the original file still has them, so do not share the original by mistake.",
        ],
      },
    ],
    faqs: [
      { q: "How do I write the pages to delete?", a: "Separate pages with commas and use a dash for a run, for example 2, 4-6, 9." },
      { q: "Can I undo the deletion?", a: "Your original is never changed. The tool creates a new file, so you can always start again from the original." },
      { q: "Can I delete every page?", a: "No. The tool needs at least one page left." },
      { q: "Can I pick the pages by looking at them?", a: "This tool uses page numbers. To choose pages visually, use Split PDF." },
      { q: "Is the PDF uploaded?", a: "No. The file is edited in your browser." },
    ],
    related: ["how-to-split-a-pdf", "how-to-merge-pdf-files", "how-to-compress-pdf-for-email-and-applications"],
  },
  {
    slug: "how-to-rotate-pdf-pages",
    title: "How to Rotate PDF Pages (All Pages or Just Some)",
    seoTitle: "How to Rotate PDF Pages Online for Free | Toolkitties",
    description: "Fix sideways or upside-down PDF pages. Rotate every page or only the pages you choose, by 90 or 180 degrees, in your browser.",
    tool: "rotate-pdf",
    category: "PDF",
    emoji: "🔄",
    published: "2026-10-24",
    updated: "2026-10-24",
    takeaways: [
      "Choose 90 degrees clockwise, 180 degrees or 90 degrees anticlockwise.",
      "The first run turns every page. To turn only some, type their numbers and process again.",
      "Pages are rotated, not turned into pictures, so text stays selectable.",
      "Your original is unchanged and nothing is uploaded.",
    ],
    sections: [
      {
        id: "why",
        heading: "Why PDF pages end up sideways",
        blocks: [
          "Scanners and phone scanning apps sometimes save a page turned by 90 degrees, especially when a paper is fed in sideways or a phone is held in landscape. The PDF looks fine in the scanning app but opens sideways on a computer. Rotating fixes it without rescanning.",
        ],
      },
      {
        id: "all",
        heading: "Rotate every page",
        blocks: [
          { steps: [
            "Open [Rotate PDF](/rotate-pdf) and add your file.",
            "Choose the rotation: 90 degrees clockwise, 180 degrees, or 90 degrees anticlockwise.",
            "Leave the pages box empty to rotate every page.",
            "Download the new PDF and open it to check the pages are upright.",
          ] },
          { note: "The tool starts as soon as you add the file, using the settings shown. If the result is not what you wanted, change the rotation and process again." },
        ],
      },
      {
        id: "some",
        heading: "Rotate only some pages",
        blocks: [
          "Often only a few pages are wrong. Type the page numbers in the pages box, for example 2, 4-6, then press Process PDF again. Only those pages are turned and the rest stay as they were.",
        ],
      },
      {
        id: "direction",
        heading: "Which direction should I pick?",
        blocks: [
          { table: { head: ["What you see", "Choose"], rows: [
            ["Page turned to the left (top of the page on the left)", "90 degrees clockwise"],
            ["Page turned to the right (top of the page on the right)", "90 degrees anticlockwise"],
            ["Page upside down", "180 degrees"],
          ] } },
          "A page that is already turned will be turned further, because the rotation is added to the current angle. If the result looks wrong, try the opposite direction.",
        ],
      },
      {
        id: "next",
        heading: "What to do next",
        blocks: [
          "After the pages are upright, you may want to remove blank scans with [Delete PDF Pages](/delete-pdf-pages), number the pages with [Add Page Numbers](/pdf-page-numbers), or join several files with [Merge PDF](/merge-pdf). If a photo rather than a PDF is sideways, use [Rotate Image](/rotate-image).",
        ],
      },
    ],
    faqs: [
      { q: "Can I rotate just one page?", a: "Yes. Type the page number in the pages box and process again. Leave it empty to rotate every page." },
      { q: "Does rotating lower the quality?", a: "No. Pages are turned, not re-drawn as pictures, so text and images stay as they were." },
      { q: "How do I write several pages?", a: "Separate them with commas and use a dash for a run, for example 2, 4-6, 9." },
      { q: "Is my original PDF changed?", a: "No. You download a new rotated file and the original stays as it was." },
      { q: "Does it work on my phone?", a: "Yes. It works in a phone browser." },
    ],
    related: ["how-to-delete-pages-from-a-pdf", "how-to-merge-pdf-files", "how-to-split-a-pdf"],
  },
  {
    slug: "how-to-password-protect-a-pdf",
    title: "How to Password Protect a PDF Before You Send It",
    seoTitle: "How to Password Protect a PDF (AES-256) | Toolkitties",
    description: "Lock a PDF with a password so only the right person can open it. Learn how to choose a strong password and share it safely.",
    tool: "protect-pdf",
    category: "Privacy",
    emoji: "🔐",
    published: "2026-10-24",
    updated: "2026-10-24",
    takeaways: [
      "Protect PDF locks a PDF with AES-256 password encryption, and it works in your browser.",
      "You type the password twice, so a typing mistake does not lock you out.",
      "A strong, unique password matters more than anything else. Share it by a different route than the file.",
      "Toolkitties never receives your password, so it cannot recover a forgotten one.",
    ],
    sections: [
      {
        id: "why",
        heading: "When a PDF should have a password",
        blocks: [
          "Email and messaging apps pass files through many systems, and files are easy to forward by mistake. A password makes sure that only people who know it can open the document. It is a good idea for contracts, payslips, bank statements, medical papers and anything with ID numbers.",
        ],
      },
      {
        id: "steps",
        heading: "Protect a PDF in four steps",
        blocks: [
          { steps: [
            "Open [Protect PDF](/protect-pdf) and add your file.",
            "Type a password, then type it again to confirm. If the two do not match, the tool tells you.",
            "Press the button to protect the file.",
            "Download the new protected PDF and open it once to confirm that it asks for the password.",
          ] },
          { note: "You download a new protected copy. Your original file is not changed, so keep it somewhere safe, or delete it if you no longer need it." },
        ],
      },
      {
        id: "password",
        heading: "Choose a password that is hard to guess",
        blocks: [
          { list: [
            "Make it **long**. Sixteen characters or more is a good habit for important files.",
            "Make it **unique**. Do not reuse a password from your email or bank.",
            "Avoid names, birthdays and simple patterns.",
            "Use the [Password Generator](/password-generator) to make a random one, and keep it in a password manager.",
          ] },
        ],
      },
      {
        id: "share",
        heading: "Share the password safely",
        blocks: [
          "Never put the password in the same email as the file. Send it another way, such as a message or a phone call. If both travel together, the password adds very little.",
        ],
      },
      {
        id: "limits",
        heading: "What a password does and does not do",
        blocks: [
          "The password stops people from opening the file without it. Anyone who knows the password can open the PDF, copy it and forward it. A weak password can be guessed. And if you forget the password, nobody can recover it for you, including us, because the password and the file never leave your browser.",
          "If you later need to remove the password from a file that you own and whose password you know, use [Unlock PDF](/unlock-pdf). The steps and limits are in [How to remove a password from a PDF](/blog/how-to-remove-a-password-from-a-pdf).",
        ],
      },
    ],
    faqs: [
      { q: "What kind of encryption does Protect PDF use?", a: "It locks the PDF with AES-256 password encryption." },
      { q: "Can I recover a password I forgot?", a: "No. Toolkitties never sees your password or your file, so there is nothing to recover." },
      { q: "Will the protected PDF open in normal PDF readers?", a: "Most modern PDF readers can open password-protected PDFs and will ask for the password." },
      { q: "Is my password or file uploaded?", a: "No. The protection is applied in your browser." },
      { q: "Is my original file changed?", a: "No. You download a new protected file and the original stays as it was." },
    ],
    related: ["are-online-pdf-tools-safe", "how-to-remove-a-password-from-a-pdf", "how-to-merge-pdf-files"],
  },
  {
    slug: "how-to-remove-a-password-from-a-pdf",
    title: "How to Remove a Password from a PDF You Own",
    seoTitle: "How to Remove a PDF Password You Know | Toolkitties",
    description: "Remove the password from a PDF when you know it. Learn how Unlock PDF works, why pages become images and how to pick the sharpness.",
    tool: "unlock-pdf",
    category: "Privacy",
    emoji: "🔓",
    published: "2026-10-24",
    updated: "2026-10-24",
    takeaways: [
      "You must know the password. Unlock PDF does not guess or crack passwords.",
      "The tool opens the PDF with your password and saves a copy that opens without one.",
      "Pages are saved as pictures, so the text in the new file may not be selectable.",
      "Choose Small file, Standard or Sharp depending on size or clarity. Everything runs in your browser.",
    ],
    sections: [
      {
        id: "when",
        heading: "When removing a password makes sense",
        blocks: [
          "You may have protected your own documents long ago and now open them often. Or a bank or office sent you a locked statement and you want your own copy to read or store without typing the password each time. In these cases you know the password and own the document, and removing the lock saves time.",
          { note: "Only unlock files that belong to you or that you have permission to unlock." },
        ],
      },
      {
        id: "steps",
        heading: "Remove the password step by step",
        blocks: [
          { steps: [
            "Open [Unlock PDF](/unlock-pdf) and add the protected file.",
            "Type the password. If the file opens without one, leave the password box empty.",
            "Choose the sharpness: Small file (100 dpi), Standard (150 dpi) or Sharp (200 dpi).",
            "Start the process. You will see which page is being processed.",
            "Download the new PDF. It opens without a password.",
          ] },
        ],
      },
      {
        id: "images",
        heading: "Why the pages become pictures",
        blocks: [
          "To produce a copy without a password, the tool opens each page with your password and saves it as an image in a new PDF. This works reliably, but it has a cost: pictures do not contain selectable text. If you need the words, copy them from the original while it is open with the password, or keep the original as well.",
        ],
      },
      {
        id: "sharpness",
        heading: "Which sharpness should I choose?",
        blocks: [
          { table: { head: ["Setting", "Best for"], rows: [
            ["Small file (100 dpi)", "A lighter file where size matters more than fine detail"],
            ["Standard (150 dpi)", "Most documents. A good starting point"],
            ["Sharp (200 dpi)", "Small print that looks blurry at Standard"],
          ] } },
          "Sharper settings make bigger files. If the result is too large, shrink it with [Compress PDF](/compress-pdf).",
        ],
      },
      {
        id: "forgot",
        heading: "What if I do not know the password?",
        blocks: [
          "Then this tool cannot help. It only removes a password you can already enter. If the file is yours, try to remember where you saved the password, check your password manager, or ask the person or organisation who sent the file. To lock a file again later, use [Protect PDF](/protect-pdf), which is explained in [How to password protect a PDF](/blog/how-to-password-protect-a-pdf).",
        ],
      },
    ],
    faqs: [
      { q: "Can Unlock PDF crack a password I do not know?", a: "No. You need to know the password. The tool only removes a password you can already enter." },
      { q: "Why is the text not selectable in the new PDF?", a: "The pages are saved as images to remove the password, and images do not contain selectable text." },
      { q: "Which sharpness should I choose?", a: "Standard (150 dpi) works for most documents. Use Small file for a lighter result or Sharp for small print." },
      { q: "What if my PDF opens without a password?", a: "Leave the password box empty. The tool can still create a copy." },
      { q: "Is my file or password uploaded?", a: "No. Everything happens in your browser." },
    ],
    related: ["how-to-password-protect-a-pdf", "how-to-compress-pdf-for-email-and-applications", "are-online-pdf-tools-safe"],
  },
  {
    slug: "how-to-convert-heic-to-jpg",
    title: "How to Convert HEIC to JPG on iPhone, Windows and Android",
    seoTitle: "How to Convert HEIC to JPG for Free | Toolkitties",
    description: "Make iPhone HEIC photos open anywhere by converting them to JPG. Free, private, and no app to install. Plus how to stop saving photos as HEIC.",
    tool: "heic-to-jpg",
    category: "Images",
    emoji: "🍎",
    published: "2026-10-24",
    updated: "2026-10-24",
    takeaways: [
      "HEIC is the format many iPhones use to save photos in less space. Some computers and websites cannot open it.",
      "Add the HEIC photo to HEIC to JPG, check the preview and download a standard JPG.",
      "The conversion runs in your browser, so your photos are not uploaded.",
      "To save new iPhone photos as JPG, choose the Most Compatible camera format.",
    ],
    sections: [
      {
        id: "what",
        heading: "What is a HEIC photo?",
        blocks: [
          "HEIC is an image format that stores a photo in less space than JPG for similar quality. Many iPhones save photos this way by default, and some other phones can too. The trade-off is compatibility: older programs, some versions of Windows, and many websites and upload forms do not accept HEIC.",
        ],
      },
      {
        id: "steps",
        heading: "Convert HEIC to JPG in your browser",
        blocks: [
          { steps: [
            "Open [HEIC to JPG](/heic-to-jpg) on your phone or computer.",
            "Add your HEIC photo.",
            "Check the preview of the converted picture.",
            "Download the JPG.",
          ] },
          "There are no settings to learn. The tool turns the photo into a standard JPG that opens almost everywhere.",
        ],
      },
      {
        id: "windows",
        heading: "If you are on Windows",
        blocks: [
          "Windows can need an extra component to open HEIC photos, and even then not every program will accept them. Converting to JPG avoids the problem completely, and you can then edit, print or upload the picture as normal.",
        ],
      },
      {
        id: "stop",
        heading: "Make your iPhone save JPG from now on",
        blocks: [
          "If you regularly share photos with people on other devices, change the setting. Open Settings, then Camera, then Formats, and choose **Most Compatible**. New photos will be saved as JPG. Photos you took before the change stay as they were, so convert those when you need them.",
        ],
      },
      {
        id: "after",
        heading: "After converting",
        blocks: [
          { list: [
            "The JPG may be larger than the HEIC, because HEIC is designed to be compact. Reduce it with [Compress Image](/compress-image) if needed.",
            "To change the dimensions, use [Resize Photo](/resize-image).",
            "To turn several photos into one document, use [Image to PDF](/image-to-pdf), as described in [How to scan documents with your phone into one PDF](/blog/how-to-scan-documents-with-your-phone-into-one-pdf).",
          ] },
        ],
      },
    ],
    faqs: [
      { q: "Why will my iPhone photo not open on my computer?", a: "Your computer may not support HEIC. Converting the photo to JPG makes it open almost anywhere." },
      { q: "Will the JPG look the same?", a: "It will look very close. JPG uses a different kind of compression, so tiny differences are possible." },
      { q: "Will the JPG file be bigger?", a: "Often yes, because HEIC is designed to be more compact. Use Compress Image if you need it smaller." },
      { q: "Are my photos uploaded?", a: "No. The conversion runs in your browser." },
      { q: "How do I stop my iPhone saving HEIC?", a: "In Settings, Camera, Formats, choose Most Compatible. New photos will save as JPG." },
    ],
    related: ["how-to-scan-documents-with-your-phone-into-one-pdf", "how-to-reduce-photo-size-in-kb", "jpg-vs-png-which-to-use"],
  },
  {
    slug: "how-to-reduce-photo-size-in-kb",
    title: "How to Reduce a Photo's File Size (KB or MB) for Forms and Email",
    seoTitle: "How to Reduce Photo File Size for Forms | Toolkitties",
    description: "Make a photo small enough for an upload limit. Use the quality slider and largest-side option step by step, and check the result.",
    tool: "compress-image",
    category: "Images",
    emoji: "📉",
    published: "2026-10-24",
    updated: "2026-10-24",
    takeaways: [
      "Two settings control size: the quality slider (10 to 95 percent) and the largest side in pixels.",
      "Lower the largest side first for big camera photos, then adjust quality in small steps.",
      "You cannot enter an exact file size, so try a setting, check the size and adjust.",
      "If a photo is already small, the tool returns the original and tells you.",
    ],
    sections: [
      {
        id: "why",
        heading: "Why photos are so large",
        blocks: [
          "Phone cameras take pictures with many millions of pixels, far more than a form, an email or a screen needs. A single photo can be several megabytes. Many upload forms ask for small files, so you need to bring the size down without making the photo unreadable.",
        ],
      },
      {
        id: "two-levers",
        heading: "Two settings, and what each one does",
        blocks: [
          { table: { head: ["Setting", "What it changes", "Effect on size"], rows: [
            ["Largest side (pixels)", "Reduces the width and height of the picture", "Large. Often the biggest saving"],
            ["Quality (10 to 95%)", "Reduces how much detail is kept", "Medium. Lower numbers give smaller files and softer detail"],
          ] } },
          "Reducing the largest side removes pixels you would never see on a screen. Lowering quality then trims what is left.",
        ],
      },
      {
        id: "steps",
        heading: "Step by step: get under a limit",
        blocks: [
          { steps: [
            "Check the limit on the form and the current size of your photo.",
            "Open [Compress Image](/compress-image) and add the photo.",
            "Set the **largest side**. For a form photo, a value such as 1200 or 1600 pixels is often plenty. Keep a larger value if the photo must stay detailed.",
            "Set the **quality**. Start around 80 percent.",
            "Download the result and check its size. If it is still too big, lower the largest side or the quality a little and try again from the original.",
          ] },
          { note: "There is no exact-size setting. Because every photo is different, the reliable way is to try a setting, look at the file size, and adjust." },
        ],
      },
      {
        id: "specific",
        heading: "If the form needs exact dimensions",
        blocks: [
          "Some forms ask for a photo of a particular width and height. Use [Resize Photo](/resize-image) to set exact pixel dimensions, and [Crop Image](/crop-image) first if you need to cut the picture to the right shape. Then run it through Compress Image if the file is still too large.",
        ],
      },
      {
        id: "already-small",
        heading: "When the photo will not get smaller",
        blocks: [
          "If a photo is already small or well compressed, compressing it again may not save anything. In that case, the tool returns your original file and says so. Try a smaller largest side instead.",
        ],
      },
      {
        id: "formats",
        heading: "Pick the right file type",
        blocks: [
          "JPG is usually the lightest choice for photos. PNG files are often much larger for photographs, so convert them with [PNG to JPG](/png-to-jpg) if size matters. If you are preparing images for a website, [Image to WebP](/image-to-webp) can make them lighter still. Read more in [JPG vs PNG](/blog/jpg-vs-png-which-to-use).",
        ],
      },
    ],
    faqs: [
      { q: "Can I choose an exact file size such as 100 KB?", a: "No. You set the quality and the largest side, then check the result. Try a setting, look at the size and adjust." },
      { q: "What quality setting should I use?", a: "Around 70 to 80 percent is a good starting point." },
      { q: "What does the largest side option do?", a: "It limits the longest edge of the image in pixels, which makes large photos smaller as well as lighter." },
      { q: "Why was my image not made smaller?", a: "If an image is already small, compressing it again may not help. You get the original back with a note." },
      { q: "Are my photos uploaded?", a: "No. Compression runs in your browser and the photo stays on your device." },
    ],
    related: ["how-to-compress-images", "how-to-resize-a-photo", "how-to-convert-heic-to-jpg"],
  },
];
