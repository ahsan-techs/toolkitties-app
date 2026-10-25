import type { Post } from "./types";

// Image, writing, business and privacy articles.
export const morePosts: Post[] = [
  {
    slug: "jpg-vs-png-which-to-use",
    title: "JPG vs PNG: Which Should You Use (and How to Convert)",
    seoTitle: "JPG vs PNG: Which One Should You Use? | Toolkitties",
    description: "Understand the difference between JPG and PNG, when each is the better choice, and how to convert JPG to PNG for free in your browser.",
    tool: "jpg-to-png",
    category: "Images",
    emoji: "🎨",
    published: "2026-10-22",
    updated: "2026-10-22",
    takeaways: [
      "JPG is usually best for photos because the files are small. PNG is better for sharp graphics and transparency.",
      "Converting JPG to PNG does not add back detail that the JPG already lost.",
      "PNG files from photos are usually bigger than JPG files.",
      "Both conversions run in your browser, so your pictures are not uploaded.",
    ],
    sections: [
      {
        id: "difference",
        heading: "The difference in one table",
        blocks: [
          { table: { head: ["", "JPG", "PNG"], rows: [
            ["Best for", "Photos", "Logos, icons, screenshots, graphics with text"],
            ["Compression", "Lossy: smaller files, some detail is discarded", "Lossless: keeps all detail"],
            ["Transparency", "Not supported", "Supported"],
            ["File size for a photo", "Small", "Usually much larger"],
            ["Repeated saving", "Can lose a little quality each time", "Does not degrade"],
          ] } },
        ],
      },
      {
        id: "when-png",
        heading: "When you should convert JPG to PNG",
        blocks: [
          { list: [
            "You want to **edit** the picture and avoid more quality loss on every save.",
            "You need a format that can hold **transparent areas** for a design or presentation.",
            "A tool or form asks for **PNG** specifically.",
          ] },
          "Be realistic about the result. A PNG made from a JPG looks the same as the JPG. The format stops further loss, but it cannot recover detail that was already thrown away.",
        ],
      },
      {
        id: "steps",
        heading: "How to convert JPG to PNG",
        blocks: [
          { steps: [
            "Open [JPG to PNG](/jpg-to-png) and add your photo.",
            "Let the conversion run, then download the PNG.",
            "If the PNG is too heavy, reduce it with [Compress Image](/compress-image) or change its dimensions with [Resize Photo](/resize-image).",
          ] },
          "Going the other way, [PNG to JPG](/png-to-jpg) makes a lighter file. Transparent areas are filled with a solid background colour because JPG cannot hold transparency.",
        ],
      },
      {
        id: "webp",
        heading: "What about WebP?",
        blocks: [
          "WebP files are often smaller than JPG or PNG, which helps web pages load faster. If you are preparing images for a site, try [Image to WebP](/image-to-webp). If someone sends you a WebP that will not open in your software, [WebP to JPG](/webp-to-jpg) converts it.",
        ],
      },
    ],
    faqs: [
      { q: "Does converting JPG to PNG improve quality?", a: "No. The picture stays the same. It does not restore detail already lost in the JPG." },
      { q: "Why is my PNG file bigger than the JPG?", a: "PNG keeps all detail without lossy compression, so photos usually make larger files." },
      { q: "Is it safe to convert my photos online?", a: "With Toolkitties the conversion happens in your browser and the photo is not uploaded." },
    ],
    related: ["how-to-compress-images", "how-to-resize-a-photo", "how-to-turn-photos-into-a-pdf"],
  },
  {
    slug: "how-to-compress-images",
    title: "How to Compress Images Without Losing Quality",
    seoTitle: "How to Compress Images Without Losing Quality | Toolkitties",
    description: "Shrink photos for email, forms and websites. Learn which quality setting to use and how limiting the largest side saves even more space.",
    tool: "compress-image",
    category: "Images",
    emoji: "📉",
    published: "2026-10-22",
    updated: "2026-10-22",
    takeaways: [
      "A quality setting of roughly 70 to 80 percent often looks the same on screen while making the file much smaller.",
      "Limiting the largest side shrinks big camera photos far more than quality alone.",
      "If an image is already small, Compress Image tells you and returns the original.",
      "Compression runs in your browser, so photos are not uploaded.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Compress an image in your browser",
        blocks: [
          { steps: [
            "Open [Compress Image](/compress-image) and add your photo.",
            "Set the **Quality** slider. It goes from 10 to 95 percent.",
            "Optionally set the **largest side** to limit the longest edge of the image.",
            "Download the result and compare it with the original.",
          ] },
        ],
      },
      {
        id: "quality",
        heading: "Choosing the quality setting",
        blocks: [
          "Quality is a trade-off between size and detail. Lower numbers save more space but discard more detail.",
          { table: { head: ["Quality", "What to expect"], rows: [
            ["90 to 95%", "Very close to the original, only a modest saving"],
            ["70 to 80%", "A good starting point for most photos"],
            ["Below 50%", "Small files, but softness and blocky areas can appear"],
          ] } },
          "Start around 80 percent and lower it a little at a time until you can just see a difference, then go one step back.",
        ],
      },
      {
        id: "largest-side",
        heading: "The bigger win: reduce the largest side",
        blocks: [
          "Modern phone cameras take very large pictures, much bigger than any screen needs. Setting a smaller largest side removes pixels you will never see. For many uses, such as email or a form upload, this saves more than lowering quality ever will.",
          "If you need an exact width and height instead, use [Resize Photo](/resize-image).",
        ],
      },
      {
        id: "already-small",
        heading: "When an image will not get smaller",
        blocks: [
          "If an image is already small or well compressed, compressing again may not save anything. In that case Compress Image returns your original file and tells you. Try a lower quality or a smaller largest side.",
        ],
      },
    ],
    faqs: [
      { q: "What quality setting should I use?", a: "Around 70 to 80 percent is a good starting point. Lower numbers make smaller files with more visible loss." },
      { q: "Is my original image changed?", a: "No. You download a new compressed copy." },
      { q: "Can I compress photos on my phone?", a: "Yes. It works in your phone browser." },
    ],
    related: ["how-to-resize-a-photo", "jpg-vs-png-which-to-use", "how-to-turn-photos-into-a-pdf"],
  },
  {
    slug: "how-to-resize-a-photo",
    title: "How to Resize a Photo to an Exact Size in Pixels",
    seoTitle: "How to Resize a Photo to an Exact Size | Toolkitties",
    description: "Set the exact width and height of any photo in pixels for forms, shops and profiles. Free, private and works on phone and computer.",
    tool: "resize-image",
    category: "Images",
    emoji: "📐",
    published: "2026-10-22",
    updated: "2026-10-22",
    takeaways: [
      "Enter the width and height you need in pixels, then download the resized picture.",
      "Keep the same proportions as the original to avoid a stretched look.",
      "Fewer pixels also means a smaller file.",
      "Resizing runs in your browser, so the photo is not uploaded.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Resize a photo in four steps",
        blocks: [
          { steps: [
            "Open [Resize Photo](/resize-image) and add your picture.",
            "Type the **width** and **height** you need, in pixels.",
            "Resize and check the preview.",
            "Download the new image.",
          ] },
        ],
      },
      {
        id: "proportions",
        heading: "Avoid a stretched picture",
        blocks: [
          "Every image has a ratio between its width and height. If you set a new size with a different ratio, the picture will look squashed or stretched. To keep it natural, change the width and height by the same proportion. For example, halving both keeps the shape.",
          "If a form demands a size with a different ratio, crop first so the right part of the picture is kept, using [Crop Image](/crop-image), then resize.",
        ],
      },
      {
        id: "bigger",
        heading: "Making an image bigger",
        blocks: [
          "You can set a larger size, but resizing cannot invent detail that was never captured. An enlarged picture can look soft. It is better to start from the largest original you have.",
        ],
      },
      {
        id: "file-size",
        heading: "Resizing and file size",
        blocks: [
          "Fewer pixels usually means a lighter file, so resizing is one of the fastest ways to shrink a big photo. If it is still too large for an upload limit, follow up with [Compress Image](/compress-image).",
        ],
      },
    ],
    faqs: [
      { q: "How do I resize a photo to a specific size?", a: "Add the image, enter the width and height in pixels and download the result." },
      { q: "Will resizing make my photo look stretched?", a: "It can if the new proportions differ from the original. Keep the same ratio to avoid it." },
      { q: "Is my photo uploaded?", a: "No. Resizing runs in your browser." },
    ],
    related: ["how-to-compress-images", "jpg-vs-png-which-to-use", "how-to-turn-photos-into-a-pdf"],
  },
  {
    slug: "how-to-create-a-qr-code",
    title: "How to Create a QR Code for a Link, Menu or Business Card",
    seoTitle: "How to Create a QR Code for Free | Toolkitties",
    description: "Make a QR code from a link or text in seconds and save it as an image. Tips for scanning reliably on posters, menus and business cards.",
    tool: "qr-code-generator",
    category: "Business",
    emoji: "🔳",
    published: "2026-10-22",
    updated: "2026-10-22",
    takeaways: [
      "Paste a link or short text into QR Code Generator and save the code as a PNG image.",
      "The code holds your link directly, so it does not expire, but it only works while the page exists.",
      "Always test the code with a phone before printing.",
      "Your link is not sent to Toolkitties. The code is made in your browser.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Create a QR code",
        blocks: [
          { steps: [
            "Open [QR Code Generator](/qr-code-generator).",
            "Paste the link or text you want the code to open.",
            "Generate the code and save it as an image.",
            "Scan it with your phone camera to confirm it opens the right page.",
          ] },
        ],
      },
      {
        id: "uses",
        heading: "Where QR codes help",
        blocks: [
          { list: [
            "**Restaurant menus** that link to an online menu.",
            "**Business cards** that open your website or portfolio.",
            "**Posters and flyers** that send people to a sign-up or event page.",
            "**Product packaging** that points to instructions.",
          ] },
        ],
      },
      {
        id: "scan",
        heading: "Make sure it scans every time",
        blocks: [
          { list: [
            "**Use dark code on a light background.** Low contrast makes scanning harder.",
            "**Leave a clear white margin** around the code so scanners can find its edges.",
            "**Keep the link short.** Shorter links create simpler, easier-to-scan codes.",
            "**Print it big enough** for the distance it will be scanned from, and test the printed version.",
          ] },
          { note: "A QR code cannot be changed after you print it. Double-check the link first, because a typo means reprinting." },
        ],
      },
      {
        id: "expire",
        heading: "Does a QR code expire?",
        blocks: [
          "The code itself does not expire, because it contains your link directly. What can stop working is the page it points to. If you move or delete that page, the code will lead nowhere, so keep the destination live for as long as the code is in use.",
        ],
      },
    ],
    faqs: [
      { q: "Can I put plain text in a QR code?", a: "Yes. You can enter a link or any short text." },
      { q: "In what format do I get the QR code?", a: "As a PNG image you can use in documents, designs and print files." },
      { q: "Is the link stored anywhere?", a: "No. The QR code is generated in your browser and Toolkitties does not receive your link." },
    ],
    related: ["how-to-write-an-invoice", "how-to-resize-a-photo", "are-online-pdf-tools-safe"],
  },
  {
    slug: "word-count-and-character-limits",
    title: "Word Count and Character Limits: A Practical Guide",
    seoTitle: "Word Count and Character Limits Guide | Toolkitties",
    description: "How to check word count, characters and reading time, and how to stay inside limits for essays, posts, captions and meta descriptions.",
    tool: "word-counter",
    category: "Writing",
    emoji: "🔢",
    published: "2026-10-22",
    updated: "2026-10-22",
    takeaways: [
      "Paste your text into Word Counter to see words, characters, sentences and reading time as you type.",
      "Limits differ between platforms and change over time, so check the current rule before you publish.",
      "Reading time is an estimate based on an average reading speed.",
      "Your text stays in your browser and is not uploaded.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Check your word count",
        blocks: [
          { steps: [
            "Open [Word Counter](/word-counter).",
            "Type or paste your text. The numbers update as you write.",
            "Compare the words or characters with the limit you have to meet.",
          ] },
        ],
      },
      {
        id: "words-vs-characters",
        heading: "Words or characters?",
        blocks: [
          "Essays, articles and reports are usually measured in **words**. Social posts, SMS messages, headlines and search snippets are usually measured in **characters**. Spaces and punctuation normally count as characters, so a short sentence can use more than you expect.",
        ],
      },
      {
        id: "common-limits",
        heading: "Some common limits",
        blocks: [
          "Platforms change their rules, so treat these as examples and confirm the current limit before you publish.",
          { table: { head: ["Where", "Typical limit"], rows: [
            ["X (standard post)", "280 characters"],
            ["Instagram caption", "2,200 characters"],
            ["Single SMS (basic characters)", "160 characters"],
            ["Search result description", "About 155 to 160 characters before it may be cut"],
          ] } },
        ],
      },
      {
        id: "reading-time",
        heading: "What reading time means",
        blocks: [
          "Reading time is worked out from the word count and an average reading speed. Adults commonly read somewhere around 200 to 250 words per minute, so treat the number as a guide. Technical text or text on a small screen usually takes longer.",
        ],
      },
      {
        id: "trim",
        heading: "How to cut a text down",
        blocks: [
          { list: [
            "Remove filler words such as very, really and just.",
            "Replace long phrases with one word where you can.",
            "Split very long sentences. They are easier to read.",
            "Remove repeated points. Say each thing once.",
          ] },
          "After editing, change the case of headings with [Case Transformer](/case-converter) or remove repeated lines from a list with [Remove Duplicate Lines](/duplicate-lines).",
        ],
      },
    ],
    faqs: [
      { q: "What does the Word Counter measure?", a: "It counts words, characters and sentences and shows an estimated reading time." },
      { q: "Is my text saved or sent anywhere?", a: "No. Counting happens in your browser and your text is not uploaded." },
      { q: "Do spaces count as characters?", a: "In most character limits they do. Check the rule of the platform you are writing for." },
    ],
    related: ["how-to-create-a-qr-code", "how-to-write-an-invoice", "are-online-pdf-tools-safe"],
  },
  {
    slug: "how-to-write-an-invoice",
    title: "How to Write a Professional Invoice: What to Include",
    seoTitle: "How to Write a Professional Invoice (Free Maker)",
    description: "What every invoice should contain, how to add tax and payment terms, and how to create a clean PDF invoice for free in your browser.",
    tool: "invoice-generator",
    category: "Business",
    emoji: "🧾",
    published: "2026-10-22",
    updated: "2026-10-22",
    takeaways: [
      "A clear invoice shows who is billing whom, what for, how much, and how and when to pay.",
      "Invoice Generator works out totals and tax, and lets you download a PDF.",
      "The PDF has a small Created free with Toolkitties.com line in the footer.",
      "Rules about invoices differ by country, so check what applies to you.",
    ],
    sections: [
      {
        id: "include",
        heading: "What an invoice should include",
        blocks: [
          { list: [
            "**Your details:** name or business name, address and contact information.",
            "**Client details:** who you are billing.",
            "**Invoice number and dates:** a unique number, the issue date and the due date.",
            "**Items:** a clear description, quantity and rate for each line.",
            "**Tax and total:** any tax, then the total amount due.",
            "**Payment details:** how to pay, such as bank details or a payment link, and your payment terms.",
          ] },
          { note: "This is general guidance, not legal or tax advice. Requirements such as tax numbers or specific wording depend on your country and business type." },
        ],
      },
      {
        id: "steps",
        heading: "Create an invoice with Invoice Generator",
        blocks: [
          { steps: [
            "Open [Invoice Generator](/invoice-generator).",
            "Fill in your details and your client's details.",
            "Add each item with its quantity and rate. Totals are worked out for you.",
            "Add tax and any notes, such as payment instructions.",
            "Choose an accent colour, then download the PDF.",
          ] },
          "Need a price offer before the work starts? [Quotation Generator](/quotation-generator) works the same way.",
        ],
      },
      {
        id: "late-fees",
        heading: "Late payments and the late-fee simulator",
        blocks: [
          "Clear payment terms help you get paid on time. The tool includes a late-fee simulator that shows how a fee would grow over time, so you can choose terms you are comfortable stating on the invoice. Only include terms you are allowed and willing to apply.",
        ],
      },
      {
        id: "tax",
        heading: "Working out tax",
        blocks: [
          "To check a price with VAT, GST or sales tax added or removed, try the [VAT and Sales Tax Calculator](/vat-calculator). Use the rate that applies to you and confirm it with your tax authority.",
        ],
      },
      {
        id: "language",
        heading: "A note about languages",
        blocks: [
          "The PDF uses standard fonts, so only Latin letters print correctly. Urdu or Arabic text appears as question marks in the PDF.",
        ],
      },
    ],
    faqs: [
      { q: "Is the invoice watermarked?", a: "The PDF has a small Created free with Toolkitties.com line in the footer. There is no other watermark." },
      { q: "Are my client details stored?", a: "No. The invoice is built in your browser and Toolkitties does not store what you type." },
      { q: "Can I add tax?", a: "Yes. You can include tax and the invoice works out the totals." },
    ],
    related: ["how-to-create-a-qr-code", "word-count-and-character-limits", "how-to-reduce-pdf-file-size"],
  },
  {
    slug: "are-online-pdf-tools-safe",
    title: "Are Online PDF Tools Safe? How Browser-Based Tools Protect Your Files",
    seoTitle: "Are Online PDF Tools Safe? Browser vs Upload | Toolkitties",
    description: "Learn the difference between tools that upload your files and tools that process them in your browser, and how to check which kind you are using.",
    tool: "compress-pdf",
    category: "Privacy",
    emoji: "🔒",
    published: "2026-10-22",
    updated: "2026-10-22",
    takeaways: [
      "Some online tools upload your file to a server. Others process it inside your browser.",
      "Browser-based tools keep the file on your device, which is the safest option for private documents.",
      "You can check what a site does by watching network activity in your browser's developer tools.",
      "Toolkitties is built so that its tools process files locally.",
    ],
    sections: [
      {
        id: "two-kinds",
        heading: "Two very different kinds of online tool",
        blocks: [
          "When you use an online PDF or image tool, one of two things happens to your file.",
          { table: { head: ["", "Upload-based tools", "Browser-based tools"], rows: [
            ["Where the work happens", "On the company's server", "On your own device, in the browser"],
            ["Does your file travel?", "Yes, it is sent over the internet", "No, it stays on your device"],
            ["Who handles the file?", "The service and its infrastructure", "Only you"],
            ["Good for private documents?", "Depends on trust in the service", "Better by design"],
          ] } },
        ],
      },
      {
        id: "why-it-matters",
        heading: "Why it matters for PDFs",
        blocks: [
          "PDFs often hold contracts, ID scans, bank statements and medical papers. The less often a document leaves your device, the fewer places it can be seen, stored or leaked. Browser-based processing removes the upload step entirely.",
        ],
      },
      {
        id: "check",
        heading: "How to check what a tool does",
        blocks: [
          "You do not have to take anyone's word for it, including ours. On a computer you can check it yourself:",
          { steps: [
            "Open the tool in your browser and press F12 to open the developer tools.",
            "Go to the **Network** tab.",
            "Add a file and run the tool.",
            "Look at the requests. A tool that processes locally will not send your file to a server.",
          ] },
          "Other signs worth looking for are a clear privacy policy, a site address that starts with https, and plain language about what happens to files.",
        ],
      },
      {
        id: "toolkitties",
        heading: "How Toolkitties handles your files",
        blocks: [
          "Toolkitties tools such as [Compress PDF](/compress-pdf), [Merge PDF](/merge-pdf) and [Protect PDF](/protect-pdf) run in your browser. Your files are not uploaded, there are no accounts and there are no tracking cookies. You can read the details in the [Privacy Policy](/privacy).",
        ],
      },
      {
        id: "habits",
        heading: "Good habits for any document",
        blocks: [
          { list: [
            "Keep an untouched original of every important file.",
            "Protect sensitive PDFs with a password before sharing them. [Protect PDF](/protect-pdf) can do this.",
            "Share files only with the people who need them.",
            "Do not reuse the same password for different documents.",
          ] },
        ],
      },
    ],
    faqs: [
      { q: "What is a browser-based tool?", a: "It is a tool that runs its code inside your web browser, so your file is processed on your own device instead of being sent to a server." },
      { q: "Does Toolkitties upload my files?", a: "No. Toolkitties tools process files in your browser." },
      { q: "How can I check that a tool is not uploading my file?", a: "Open the Network tab in your browser developer tools, run the tool and look at the requests it makes." },
    ],
    related: ["how-to-reduce-pdf-file-size", "how-to-merge-pdf-files", "how-to-split-a-pdf"],
  },
];
