// Tool-specific search content. Every statement is limited to what the tool really does
// (see the descriptions in tools-data.ts). Nothing here invents ratings, user counts or claims.
//   also  = other names people search for the same job (shown on the page and in metadata)
//   uses  = real situations where the tool helps
//   faqs  = questions that are specific to this tool (added in front of the shared ones)

export type ToolSeo = { also: string[]; uses: string[]; faqs: { q: string; a: string }[] };

export const toolSeo: Record<string, ToolSeo> = {
  "merge-pdf": {
    also: ["combine PDF files", "join PDFs", "PDF merger", "merge PDFs into one file"],
    uses: ["Combine scanned pages, receipts and forms into one document", "Join report chapters before sending them", "Put several files into a single email attachment or application upload"],
    faqs: [
      { q: "Can I change the order before merging PDFs?", a: "Yes. Drag the files into the order you want and pick which pages to take from each file, then download the merged PDF." },
      { q: "Is there a limit on how many PDFs I can merge?", a: "You can add several PDFs. The practical limit is your device's memory, because the merging happens inside your browser." },
    ],
  },
  "split-pdf": {
    also: ["extract pages from PDF", "separate PDF pages", "PDF splitter", "cut a PDF into parts"],
    uses: ["Pull one chapter or invoice out of a long PDF", "Turn a scanned batch into smaller files", "Send someone only the pages they need"],
    faqs: [
      { q: "Can I split a PDF into separate pages?", a: "Yes. You can split every page, split every N pages, or enter custom page ranges." },
      { q: "Can I choose pages by looking at them?", a: "Yes. Page previews let you pick the pages visually instead of typing numbers." },
    ],
  },
  "compress-pdf": {
    also: ["reduce PDF size", "shrink a PDF", "make a PDF smaller", "PDF compressor"],
    uses: ["Get a PDF under an email attachment limit", "Meet the file size limit on an upload form", "Save storage space on a phone or drive"],
    faqs: [
      { q: "How much smaller will my PDF get?", a: "It depends on the file. PDFs with large images usually shrink the most, while PDFs that are mostly text may change very little." },
      { q: "Does compressing change how my PDF looks?", a: "Compression can lower image detail to save space, so look at the result before you send it." },
    ],
  },
  "protect-pdf": {
    also: ["password protect a PDF", "encrypt a PDF", "lock a PDF", "add a password to a PDF"],
    uses: ["Protect a contract or payslip before emailing it", "Lock a private document kept on a shared drive", "Share a file only with people who know the password"],
    faqs: [
      { q: "What kind of encryption does Protect PDF use?", a: "It locks the PDF with AES-256 password encryption." },
      { q: "Can I recover a password I forgot?", a: "No. Toolkitties never receives your file or your password, so there is nothing to recover. Keep the password somewhere safe." },
    ],
  },
  "pdf-to-word": {
    also: ["PDF to DOCX", "convert PDF to Word", "extract text from PDF", "PDF to editable text"],
    uses: ["Copy the text of a report into an editable document", "Reuse wording from an article or form", "Start editing from a clean, text-only copy"],
    faqs: [
      { q: "Does PDF to Word keep images and layout?", a: "No. This tool copies the text only. Images and page layout are not kept." },
      { q: "Will it work on a scanned PDF?", a: "A scanned PDF is made of pictures rather than text, so there may be no text to copy. This tool does not read text from images." },
    ],
  },
  "rotate-pdf": {
    also: ["rotate PDF pages", "fix a sideways PDF", "turn a PDF upside down", "PDF rotator"],
    uses: ["Fix pages that were scanned sideways", "Correct a document photographed with a phone", "Turn landscape pages upright before printing"],
    faqs: [{ q: "Is my original PDF changed?", a: "No. You download a new PDF with the rotation applied, and the original file on your device stays as it was." }],
  },
  "delete-pdf-pages": {
    also: ["remove pages from PDF", "delete pages from a PDF", "PDF page remover", "cut pages out of PDF"],
    uses: ["Remove a blank or cover page before sending", "Take out pages with private details", "Trim a long document down to the pages that matter"],
    faqs: [{ q: "Can I get the deleted pages back?", a: "Your original file is not changed. The tool creates a new PDF without the pages you removed, so you can always start again from the original." }],
  },
  "organize-pdf": {
    also: ["reorder PDF pages", "rearrange PDF pages", "sort PDF pages", "change PDF page order"],
    uses: ["Put scanned pages into the right order", "Move an appendix to the end of a report", "Rearrange a presentation exported as PDF"],
    faqs: [{ q: "How do I change the page order?", a: "Type the new order, for example 3, 1, 2 or 5-1. Only the pages you list are kept, in the order you type, then download the new PDF." }],
  },
  "watermark-pdf": {
    also: ["add a watermark to PDF", "stamp text on PDF", "PDF watermark tool", "mark PDF as draft or confidential"],
    uses: ["Mark a document as DRAFT or CONFIDENTIAL", "Put your name or business on shared files", "Discourage reuse of a document you send out"],
    faqs: [{ q: "Can I add an image or logo watermark?", a: "This tool adds a text watermark across every page. For a text mark such as your name or the word DRAFT, it works directly in your browser." }],
  },
  "pdf-page-numbers": {
    also: ["add page numbers to PDF", "number PDF pages", "PDF page numbering", "insert page numbers in PDF"],
    uses: ["Number a long report or thesis", "Add numbers to a scanned bundle of pages", "Make references to pages easy in meetings"],
    faqs: [{ q: "Are page numbers added to every page?", a: "Yes. The tool numbers every page of the PDF automatically." }],
  },
  "unlock-pdf": {
    also: ["remove PDF password", "unlock a protected PDF", "decrypt PDF", "PDF password remover"],
    uses: ["Open a PDF you have the password for without typing it each time", "Remove the password from your own old documents", "Prepare a file for tools that cannot read protected PDFs"],
    faqs: [
      { q: "Can Unlock PDF crack a password I do not know?", a: "No. You need to know the password. The tool only removes a password you can already enter." },
      { q: "Why do the pages become images?", a: "To remove the password, the pages are re-saved as images, so the text in the new file may not be selectable." },
    ],
  },
  "pdf-to-jpg": {
    also: ["convert PDF to image", "PDF to JPEG", "save PDF pages as pictures", "PDF page to JPG"],
    uses: ["Share one PDF page as a picture in a chat", "Use a PDF page in a slide or web page", "Turn a document into images for social media"],
    faqs: [{ q: "Do I get one image per page?", a: "Yes. Each PDF page is exported as its own JPG image." }],
  },
  "image-to-pdf": {
    also: ["JPG to PDF", "PNG to PDF", "convert images to PDF", "photos to PDF"],
    uses: ["Turn phone photos of documents into one PDF", "Combine receipts or ID scans into a single file", "Make a simple photo album PDF"],
    faqs: [
      { q: "Can I put several images in one PDF?", a: "Yes. Add JPG and PNG images and arrange them in the order you want before creating the PDF." },
      { q: "Which image types are supported?", a: "JPG and PNG images. For HEIC photos from an iPhone, convert them with the HEIC to JPG tool first." },
    ],
  },
  "jpg-to-png": {
    also: ["convert JPG to PNG", "JPEG to PNG", "JPG to PNG converter", "make a JPG a PNG"],
    uses: ["Use a photo in a design tool that prefers PNG", "Save an image without further JPG compression", "Prepare an image for editing"],
    faqs: [{ q: "Will a PNG made from a JPG be bigger?", a: "Often yes. PNG files are usually larger than JPG files for photos." }],
  },
  "png-to-jpg": {
    also: ["convert PNG to JPG", "PNG to JPEG", "PNG to JPG converter", "make a PNG smaller as JPG"],
    uses: ["Reduce the size of a screenshot", "Upload an image to a site that only accepts JPG", "Send a lighter image by email"],
    faqs: [{ q: "What happens to transparent areas?", a: "JPG does not support transparency, so transparent areas of a PNG are filled with a solid background colour." }],
  },
  "compress-image": {
    also: ["reduce image size", "compress JPG", "compress PNG", "photo compressor"],
    uses: ["Make photos small enough to email", "Speed up a website by using lighter images", "Meet a file size limit on an application form"],
    faqs: [{ q: "Can I choose the quality?", a: "Yes. You control the quality setting, so you can balance file size against sharpness." }],
  },
  "resize-image": {
    also: ["resize a photo", "change image dimensions", "resize image in pixels", "image resizer"],
    uses: ["Fit a photo to a profile picture or banner size", "Prepare images for a website or shop", "Shrink the dimensions of a large camera photo"],
    faqs: [{ q: "Can I set an exact width and height?", a: "Yes. You enter the width and height in pixels." }],
  },
  "webp-to-jpg": {
    also: ["convert WebP to JPG", "WebP to JPEG", "WebP converter", "open WebP as JPG"],
    uses: ["Open a downloaded WebP in software that only knows JPG", "Upload a WebP image to a form that rejects it", "Share a picture saved from a website"],
    faqs: [{ q: "Why convert WebP to JPG?", a: "JPG opens almost everywhere, while some programs and upload forms do not accept WebP." }],
  },
  "crop-image": {
    also: ["cut a photo", "trim an image", "crop a picture online", "image cropper"],
    uses: ["Cut out the part of a photo you want to keep", "Remove edges or background from a screenshot", "Frame a picture for a profile photo"],
    faqs: [{ q: "Is the original photo changed?", a: "No. You download a new cropped image and your original file stays untouched." }],
  },
  "rotate-image": {
    also: ["rotate a photo", "turn an image", "flip a photo", "fix a sideways picture"],
    uses: ["Fix a photo that opens sideways", "Straighten a scanned image", "Turn a picture before using it in a document"],
    faqs: [{ q: "Which angles can I rotate by?", a: "You can turn the image by 90, 180 or 270 degrees." }],
  },
  "image-to-base64": {
    also: ["convert image to Base64", "image to Base64 string", "image to data URI", "picture to text for code"],
    uses: ["Embed a small image directly in HTML or CSS", "Put an icon inside a JSON file", "Test an API that expects Base64 images"],
    faqs: [{ q: "What is a Base64 image?", a: "It is the picture written as plain text, which you can paste into code, for example as a data URI." }],
  },
  "favicon-generator": {
    also: ["make a favicon", "favicon from image", "create website icon", "favicon.ico maker"],
    uses: ["Add an icon to a new website", "Replace an old tab icon with your logo", "Get several icon sizes from a single image"],
    faqs: [{ q: "Which sizes do I get?", a: "The tool creates the favicon sizes a website needs from one image. Use a square image for the best result." }],
  },
  "svg-to-png": {
    also: ["convert SVG to PNG", "SVG to image", "rasterize SVG", "SVG converter"],
    uses: ["Use a vector logo where only PNG is accepted", "Export an icon at an exact pixel size", "Share a vector graphic as a normal picture"],
    faqs: [{ q: "Can I choose the PNG size?", a: "Yes. The SVG is rasterized into a PNG at the size you choose." }],
  },
  "heic-to-jpg": {
    also: ["convert HEIC to JPG", "iPhone photo to JPG", "HEIC to JPEG", "open HEIC on Windows"],
    uses: ["Open iPhone photos on a Windows PC", "Upload iPhone pictures to a site that rejects HEIC", "Share photos with people who cannot open HEIC"],
    faqs: [{ q: "Why will my iPhone photo not open?", a: "iPhones can save photos as HEIC, which some computers and websites do not support. Converting to JPG makes them open almost anywhere." }],
  },
  "watermark-image": {
    also: ["add a watermark to a photo", "text watermark on image", "stamp a picture", "photo watermark tool"],
    uses: ["Put your name on photos you share online", "Mark product pictures before sending a draft", "Discourage reuse of your images"],
    faqs: [{ q: "What kind of watermark can I add?", a: "A text watermark placed across the photo." }],
  },
  "image-to-webp": {
    also: ["convert JPG to WebP", "PNG to WebP", "WebP converter", "make images smaller for the web"],
    uses: ["Make web pages load faster with lighter images", "Convert a batch of site images one by one", "Prepare pictures for a blog or shop"],
    faqs: [{ q: "Why use WebP?", a: "WebP files are often smaller than JPG or PNG, which helps pages load faster." }],
  },
  "flip-image": {
    also: ["mirror an image", "flip a photo", "black and white photo", "reverse image horizontally"],
    uses: ["Mirror a selfie that was flipped by the camera", "Create a mirrored version of a design", "Make a quick black and white copy of a photo"],
    faqs: [{ q: "Can I make the photo black and white?", a: "Yes. You can optionally turn the flipped image black and white." }],
  },
  "word-counter": {
    also: ["character counter", "word count online", "count words and characters", "reading time calculator"],
    uses: ["Check an essay against a word limit", "Keep a post within a character limit", "Estimate how long a text takes to read"],
    faqs: [{ q: "What does the Word Counter measure?", a: "It counts words, characters, sentences and shows an estimated reading time." }],
  },
  "case-converter": {
    also: ["uppercase to lowercase", "text case converter", "title case converter", "sentence case converter"],
    uses: ["Fix text typed with caps lock on", "Turn a headline into title case", "Make a list all lowercase or UPPERCASE"],
    faqs: [{ q: "Which cases are available?", a: "UPPER CASE, lower case, Title Case and Sentence case." }],
  },
  "json-formatter": {
    also: ["JSON beautifier", "JSON validator", "format JSON online", "pretty print JSON"],
    uses: ["Make a minified API response readable", "Find a missing comma or bracket in JSON", "Tidy configuration data before sharing it"],
    faqs: [{ q: "Does the JSON Formatter validate my JSON?", a: "Yes. It formats valid JSON and reports a problem if the JSON is not valid." }],
  },
  "base64": {
    also: ["Base64 encode", "Base64 decode", "Base64 converter", "decode Base64 text"],
    uses: ["Decode a Base64 string from an API or email header", "Encode text for a config file or URL", "Check what a Base64 value contains"],
    faqs: [{ q: "Is Base64 encryption?", a: "No. Base64 only changes how data is written, and anyone can decode it. Do not use it to hide secrets." }],
  },
  "markdown-renderer": {
    also: ["Markdown preview", "Markdown viewer", "Markdown to HTML preview", "live Markdown editor"],
    uses: ["Preview a README before publishing it", "Check formatting of notes written in Markdown", "Learn Markdown by seeing the result instantly"],
    faqs: [{ q: "Is the preview safe to use with untrusted Markdown?", a: "The preview runs in your browser and the text is escaped before it is shown. Even so, only paste text you trust." }],
  },
  "url-encoder": {
    also: ["URL encode", "URL decode", "percent encoding", "encode a link online"],
    uses: ["Make text with spaces safe to put in a link", "Decode a long percent-encoded URL", "Prepare query parameters for an API call"],
    faqs: [{ q: "What does URL encoding do?", a: "It replaces characters that are not safe in a web address, such as spaces, with percent codes like %20. The decoder reverses it." }],
  },
  "text-diff": {
    also: ["compare two texts", "text compare online", "find differences between texts", "diff checker"],
    uses: ["See what changed between two drafts", "Compare two versions of code or config", "Check a contract revision for edits"],
    faqs: [{ q: "How does the Text Diff Checker show differences?", a: "Paste two blocks of text and it shows exactly what was added, removed or changed between them." }],
  },
  "slug-generator": {
    also: ["URL slug generator", "make a slug from a title", "SEO friendly URL", "permalink generator"],
    uses: ["Turn a blog title into a clean URL", "Create consistent slugs for product pages", "Remove spaces and symbols from a page name"],
    faqs: [{ q: "What is a slug?", a: "A slug is the readable part of a web address, such as my-first-post. It uses lowercase letters, numbers and hyphens." }],
  },
  "csv-to-json": {
    also: ["convert CSV to JSON", "spreadsheet to JSON", "CSV converter", "Excel CSV to JSON"],
    uses: ["Load spreadsheet data into a web app", "Prepare test data for an API", "Turn an exported table into structured JSON"],
    faqs: [{ q: "Does the first row become the keys?", a: "The first row is used as the keys, and each following row becomes a JSON object. Check the output before using it." }],
  },
  "lorem-ipsum": {
    also: ["dummy text generator", "placeholder text", "lorem ipsum paragraphs", "filler text generator"],
    uses: ["Fill a website mockup with text", "Test how a layout handles long paragraphs", "Draft a design before the real copy is ready"],
    faqs: [{ q: "What is Lorem Ipsum?", a: "It is placeholder text used in design and publishing so a layout can be judged before the real words exist." }],
  },
  "duplicate-lines": {
    also: ["remove duplicate lines", "delete repeated lines", "unique lines tool", "clean a list of duplicates"],
    uses: ["Clean an email or keyword list", "Remove repeated entries from exported data", "Tidy a pasted list before using it"],
    faqs: [{ q: "Does it keep the first copy of each line?", a: "It removes repeated lines automatically so each line appears once." }],
  },
  "hash-generator": {
    also: ["MD5 hash generator", "SHA-256 generator", "text to hash", "checksum of text"],
    uses: ["Check that two pieces of text are identical", "Generate a hash for a test or script", "Compare a value against a published checksum"],
    faqs: [
      { q: "Which hashes can I generate?", a: "MD5, SHA-1, SHA-256 and SHA-512." },
      { q: "Is MD5 safe for passwords?", a: "No. MD5 is not suitable for storing passwords. Use it only for checksums and quick comparisons." },
    ],
  },
  "sort-lines": {
    also: ["sort text alphabetically", "alphabetize a list", "reverse lines", "sort a list online"],
    uses: ["Put a list of names in A to Z order", "Reverse the order of lines", "Clean up a list before pasting it elsewhere"],
    faqs: [{ q: "What can Sort Lines do?", a: "It can sort and reverse lines and tidy up a list in one click." }],
  },
  "json-to-csv": {
    also: ["convert JSON to CSV", "JSON to Excel", "JSON to spreadsheet", "export JSON as CSV"],
    uses: ["Open API data in Excel or Google Sheets", "Share JSON records with someone who uses spreadsheets", "Turn log or export data into a table"],
    faqs: [{ q: "Can I open the result in Excel?", a: "Yes. The output is a CSV file that Excel and Google Sheets can open." }],
  },
  "qr-code-generator": {
    also: ["make a QR code", "QR code maker", "link to QR code", "free QR code"],
    uses: ["Put a website link on a poster or menu", "Share Wi-Fi details or text with a quick scan", "Add a QR code to a business card"],
    faqs: [
      { q: "Does the QR code expire?", a: "The QR code holds your link or text directly, so the code itself does not expire. It works as long as the page it points to still exists." },
    ],
  },
  "password-generator": {
    also: ["random password generator", "strong password generator", "secure password maker", "create a password"],
    uses: ["Create a strong password for a new account", "Replace a weak or reused password", "Generate a random code for a shared account"],
    faqs: [{ q: "Are the passwords sent anywhere?", a: "No. Passwords are generated in your browser and are not sent to or stored by Toolkitties." }],
  },
  "uuid-generator": {
    also: ["GUID generator", "random UUID", "UUID v4 generator", "unique ID generator"],
    uses: ["Create unique IDs for database rows", "Generate test data for an app", "Make identifiers for files or records"],
    faqs: [{ q: "What is a UUID?", a: "A UUID is a long random identifier that is extremely unlikely to repeat, commonly used as a unique ID in databases and code." }],
  },
  "unit-converter": {
    also: ["convert units", "length converter", "weight converter", "temperature converter"],
    uses: ["Convert centimetres to inches or kilograms to pounds", "Switch between Celsius and Fahrenheit", "Follow recipes and instructions in other units"],
    faqs: [{ q: "Which units does it cover?", a: "Length, weight, temperature, volume and speed." }],
  },
  "percentage-calculator": {
    also: ["calculate percentage", "percent increase calculator", "discount calculator", "percentage change"],
    uses: ["Work out a sale discount", "Find the percentage change between two numbers", "Calculate a percentage of an amount"],
    faqs: [{ q: "What can I calculate?", a: "Percentages of a number, increases and decreases, and discounts." }],
  },
  "age-calculator": {
    also: ["calculate my age", "age from date of birth", "exact age calculator", "how old am I"],
    uses: ["Find exact age in years, months and days", "Check age for a form or eligibility", "Work out someone's age on a certain date"],
    faqs: [{ q: "How exact is the result?", a: "It shows age in years, months and days from the birthdate you enter." }],
  },
  "color-picker": {
    also: ["colour palette generator", "HEX to RGB", "HSL color picker", "color code finder"],
    uses: ["Get the HEX, RGB and HSL code of a colour", "Build a matching colour set for a design", "Copy colour values into CSS"],
    faqs: [{ q: "Which colour formats do I get?", a: "HEX, RGB and HSL values for the colour you pick." }],
  },
  "timestamp-converter": {
    also: ["Unix timestamp converter", "epoch converter", "timestamp to date", "date to Unix time"],
    uses: ["Read a Unix timestamp from a log or API", "Turn a date into epoch time for code", "Check when a stored time actually was"],
    faqs: [{ q: "What is a Unix timestamp?", a: "It is the number of seconds since 1 January 1970 (UTC), widely used by software to store dates." }],
  },
  "jwt-decoder": {
    also: ["decode JWT", "JSON Web Token decoder", "JWT parser", "read JWT payload"],
    uses: ["Read the claims inside a token while debugging", "Check when a token expires", "Inspect the header and payload of a JWT"],
    faqs: [
      { q: "Does the JWT Decoder verify the signature?", a: "No. It reads the header and payload and shows the expiry. It does not prove that a token is genuine." },
      { q: "Is it safe to paste a token here?", a: "Decoding happens in your browser and the token is not sent to Toolkitties. Still, avoid pasting live production tokens anywhere you do not need to." },
    ],
  },
  "regex-tester": {
    also: ["regular expression tester", "regex checker", "test regex online", "regex match highlighter"],
    uses: ["Check a pattern before using it in code", "See every match highlighted as you type", "Debug a regex that is not matching"],
    faqs: [{ q: "Does it highlight matches live?", a: "Yes. Matches are highlighted as you type the pattern or the test text." }],
  },
  "number-base-converter": {
    also: ["binary to decimal", "decimal to hex", "hex to binary", "base converter"],
    uses: ["Convert binary to decimal for homework", "Read hex values in programming", "Check numbers in different bases quickly"],
    faqs: [{ q: "Which bases are supported?", a: "Binary, octal, decimal, hexadecimal and more." }],
  },
  "color-converter": {
    also: ["HEX to RGB converter", "contrast checker", "WCAG contrast checker", "text contrast accessibility"],
    uses: ["Convert HEX, RGB and HSL colours", "Check whether text is readable on a background", "Test colour choices for accessibility"],
    faqs: [{ q: "What does the contrast checker tell me?", a: "It checks the contrast between text and background colours so you can judge readability for accessibility." }],
  },
  "loan-calculator": {
    also: ["EMI calculator", "monthly payment calculator", "loan interest calculator", "loan repayment calculator"],
    uses: ["Estimate a monthly loan payment", "See total interest before you borrow", "Compare loan amounts and terms"],
    faqs: [{ q: "Is the result a bank offer?", a: "No. It is an estimate from the numbers you enter. Your lender's actual terms and fees may differ." }],
  },
  "bmi-calculator": {
    also: ["body mass index calculator", "calculate BMI", "BMI metric and imperial", "BMI checker"],
    uses: ["Work out BMI from height and weight", "Use metric or imperial units", "Get a quick general reference number"],
    faqs: [{ q: "Is BMI a medical diagnosis?", a: "No. BMI is a general screening number and does not diagnose health. Talk to a doctor about your health." }],
  },
  "days-between-dates": {
    also: ["date difference calculator", "days between two dates", "working days calculator", "how many days until"],
    uses: ["Count days to a deadline or event", "Find working days between two dates", "Work out how long a project or contract lasts"],
    faqs: [{ q: "What does it count?", a: "The days, weeks and working days between two dates." }],
  },
  "invoice-generator": {
    also: ["free invoice maker", "invoice template", "create an invoice online", "invoice PDF generator"],
    uses: ["Bill a client as a freelancer or small business", "Add tax and discount to a bill", "Download a ready PDF invoice"],
    faqs: [
      { q: "Does the invoice have a watermark?", a: "The PDF carries a small \"Created free with Toolkitties.com\" line in the footer." },
      { q: "Can I use Urdu or Arabic text in the PDF?", a: "The PDF uses standard fonts, so only Latin text prints correctly. Urdu or Arabic text appears as question marks." },
    ],
  },
  "quotation-generator": {
    also: ["quote maker", "estimate template", "create a quotation online", "price quote PDF"],
    uses: ["Send a price quote to a customer", "Give an estimate with tax and discount", "Download the quotation as a PDF"],
    faqs: [{ q: "Is the quotation a legal contract?", a: "No. It is a document you create. Ask a legal professional if you need contract wording." }],
  },
  "vat-calculator": {
    also: ["GST calculator", "sales tax calculator", "add VAT to a price", "remove VAT from a price"],
    uses: ["Add VAT, GST or sales tax to a price", "Find the tax inside a price that already includes it", "Check an invoice total"],
    faqs: [{ q: "Which tax rate should I use?", a: "Enter the rate that applies to you. Tax rules differ by country, so confirm the correct rate with your tax authority." }],
  },
  "profit-margin-calculator": {
    also: ["markup calculator", "gross margin calculator", "selling price calculator", "profit percentage"],
    uses: ["Work out profit and margin from cost and price", "Find the price needed for a target margin", "Compare margin and markup"],
    faqs: [{ q: "What is the difference between margin and markup?", a: "Margin is profit as a share of the selling price, while markup is profit as a share of the cost. The tool shows both." }],
  },
  "proposal-generator": {
    also: ["business proposal template", "project proposal maker", "freelance proposal", "proposal PDF"],
    uses: ["Pitch a project to a client", "Set out scope, timeline, price and terms in one page", "Copy the text or download it as a PDF"],
    faqs: [{ q: "Can I download the proposal?", a: "Yes. You can copy the proposal or download it as a PDF." }],
  },
};
