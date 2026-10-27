import type { Post } from "./types";

// Phase 4, batch 2: two guides each for 15 more tools with previously zero
// coverage — developer utilities and everyday calculators. Kept tighter
// than the first batch (one how-to, one deeper/privacy or tips angle) so
// quality stays consistent across a larger batch.
export const phase4Batch2: Post[] = [
  {
    slug: "how-to-generate-a-strong-password",
    title: "How to Generate a Strong, Random Password",
    seoTitle: "Strong Random Password Generator | Toolkitties",
    description: "Create a genuinely random password in one click, with options for length and character types.",
    tool: "password-generator",
    category: "Privacy",
    emoji: "🔑",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "A strong password is long and random — not a word with a few characters swapped out.",
      "Password Generator creates one instantly in your browser; nothing is sent anywhere or logged.",
      "Aim for at least 16 characters when the site allows it, mixing letters, numbers and symbols.",
      "A password manager to store it matters as much as the password's strength — don't reuse generated passwords across sites.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Generate one in seconds",
        blocks: [
          "Open [Password Generator](/password-generator), set the length and which character types to include, and a new password appears instantly — press generate again for a different one, as many times as you like.",
          { note: "Each password is generated fresh in your browser using the Web Crypto API's random number generator — nothing is transmitted, stored, or reused across visits." },
        ],
      },
      {
        id: "why-random-matters",
        heading: "Why 'random' is the part that matters",
        blocks: [
          "Humans are bad at picking random-looking passwords — patterns like capitalizing the first letter or swapping 'a' for '@' are common enough that attackers' tools already check for them. A password generator avoids that by not starting from a word at all.",
          "The trade-off is that a fully random password is hard to remember — which is fine, because it's meant to live in a password manager, not your memory.",
        ],
      },
    ],
    faqs: [
      { q: "Is it safe to generate a password for my bank account this way?", a: "Yes — the password is created locally in your browser and never leaves your device, so there's nothing to intercept." },
      { q: "Should I avoid symbols if a site doesn't allow them?", a: "Untick the symbol option and generate again — some sites still restrict special characters, so a letters-and-numbers-only password is still far stronger than a short, memorable one." },
    ],
    related: ["pdf-tools-without-uploading-your-file"],
  },
  {
    slug: "what-is-a-uuid-and-when-to-use-one",
    title: "What Is a UUID, and When Do You Actually Need One?",
    seoTitle: "What Is a UUID? Generator & Use Cases | Toolkitties",
    description: "A quick explanation of UUIDs and a one-click generator for database keys, API IDs and test data.",
    tool: "uuid-generator",
    category: "Writing",
    emoji: "🆔",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "A UUID (universally unique identifier) is a 128-bit value, usually shown as 32 hex characters, designed to be unique without a central registry.",
      "Common uses: database primary keys, API request IDs, session tokens, and placeholder IDs in test data.",
      "UUID Generator creates version-4 (random) UUIDs instantly, with no account or install needed.",
      "Collisions are astronomically unlikely — you don't need to check a generated UUID against anything.",
    ],
    sections: [
      {
        id: "when-to-use",
        heading: "When a UUID is the right choice",
        blocks: [
          {
            list: [
              "**Distributed systems** — when multiple services generate IDs independently, UUIDs avoid them colliding, unlike auto-incrementing numbers.",
              "**Public-facing IDs** — a UUID in a URL doesn't reveal how many records exist (an ID like `/orders/4821` does).",
              "**Test and mock data** — quickly generate placeholder IDs for a dataset without wiring up a real database.",
            ],
          },
        ],
      },
      {
        id: "steps",
        heading: "Generating one",
        blocks: ["Open [UUID Generator](/uuid-generator) and copy the generated value — press generate again for a new one each time, including generating several at once if you need a batch."],
      },
    ],
    faqs: [
      { q: "Are these UUIDs guaranteed unique?", a: "Version-4 UUIDs are generated from 122 random bits — the odds of a collision are so small (roughly 1 in 2.7 quintillion for two to collide) that they're treated as unique in practice." },
      { q: "Can I use a UUID as a database primary key?", a: "Yes, commonly done — just note UUIDs take more storage space than a simple integer and don't sort chronologically, which matters for some database performance patterns." },
    ],
    related: ["how-to-generate-a-strong-password"],
  },
  {
    slug: "md5-vs-sha256-which-hash-to-use",
    title: "MD5 vs SHA-256: Which Hash Should You Use?",
    seoTitle: "MD5 vs SHA-256 Hash Comparison | Toolkitties",
    description: "Generate an MD5 or SHA-256 hash from any text, and understand when each one is (and isn't) the right choice.",
    tool: "hash-generator",
    category: "Writing",
    emoji: "🔗",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "A hash turns any text into a fixed-length string — the same input always produces the same hash.",
      "MD5 is fast but cryptographically broken; don't use it to protect anything sensitive, like passwords.",
      "SHA-256 is the current standard for security-relevant hashing (checksums, password storage with proper salting, data integrity checks).",
      "Text to Hash generates both instantly from any text you paste in, entirely in your browser.",
    ],
    sections: [
      {
        id: "the-difference",
        heading: "What actually differs between them",
        blocks: [
          "Both MD5 and SHA-256 take an input and produce a fixed-size fingerprint of it. The difference is collision resistance — how hard it is to find two different inputs that produce the same hash. MD5's collision resistance was broken years ago, meaning it's unsuitable anywhere security matters, even though it's still common for quick, non-security checksums (verifying a file downloaded correctly, for instance).",
          "SHA-256 doesn't have that weakness and is the standard choice when a hash needs to actually resist tampering — verifying file integrity for security purposes, or as one ingredient in password hashing (alongside proper salting, which this tool doesn't do on its own).",
        ],
      },
      {
        id: "steps",
        heading: "Generating a hash",
        blocks: ["Open [Text to Hash](/hash-generator), paste or type your text, and both the MD5 and SHA-256 results appear instantly — useful for comparing a file's reported checksum, or generating one for your own data."],
      },
    ],
    faqs: [
      { q: "Can I hash a password here and store it in my database?", a: "This tool hashes plain text for general use — for real password storage, use a purpose-built algorithm like bcrypt or Argon2, which add salting and are deliberately slow to resist brute-force attacks. A raw SHA-256 hash alone isn't the right tool for that specific job." },
      { q: "Is my text sent anywhere to generate the hash?", a: "No — the hashing runs in your browser using the Web Crypto API." },
    ],
    related: ["how-to-generate-a-strong-password", "what-is-a-uuid-and-when-to-use-one"],
  },
  {
    slug: "what-is-base64-encoding-for",
    title: "What Is Base64 Encoding Actually For?",
    seoTitle: "Base64 Encoding Explained + Decoder | Toolkitties",
    description: "Base64 isn't encryption — here's what it's actually for, and a one-click way to encode or decode text.",
    tool: "base64",
    category: "Writing",
    emoji: "🔐",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "Base64 converts binary or text data into a string of letters, numbers and a few symbols — it's an encoding, not encryption.",
      "It's commonly used to embed images in CSS/HTML, send binary data over text-only protocols like email (MIME), and in some API tokens.",
      "Anyone can decode Base64 instantly — it provides no security or privacy on its own.",
      "Base64 Decoder encodes and decodes text in your browser, with no upload involved.",
    ],
    sections: [
      {
        id: "common-misconception",
        heading: "The most common mix-up",
        blocks: [
          "Base64 text looks scrambled, which leads people to assume it's some form of security — it isn't. It's a reversible encoding scheme designed to represent binary data using only printable characters, nothing more. Anything encoded in Base64 can be decoded instantly by anyone with a decoder like this one.",
          "If you need to actually protect data, that's encryption (a password-protected PDF, for instance) — not Base64.",
        ],
      },
      {
        id: "steps",
        heading: "Encoding or decoding text",
        blocks: ["Open [Base64 Decoder](/base64), paste your text, and switch between encode and decode — the result updates instantly as you type."],
      },
    ],
    faqs: [
      { q: "Why does Base64 text end with = signs sometimes?", a: "Those are padding characters, added when the input length isn't a clean multiple of 3 bytes — it's normal and part of the standard, not an error." },
      { q: "Can I Base64-encode an image here?", a: "This tool is built for text — for encoding image files specifically, see [Image to Base64](/image-to-base64)." },
    ],
    related: ["md5-vs-sha256-which-hash-to-use"],
  },
  {
    slug: "how-to-read-a-jwt-token",
    title: "How to Read a JWT and Check When It Expires",
    seoTitle: "Decode a JWT Token Online, Free | Toolkitties",
    description: "See the header and payload inside a JSON Web Token, and check its expiry, without pasting it into a server you don't control.",
    tool: "jwt-decoder",
    category: "Writing",
    emoji: "🪪",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "A JWT has three parts — header, payload and signature — separated by dots; the first two are readable JSON once decoded.",
      "JWT Decoder shows you the header and payload, and highlights the expiry (exp) claim if the token has one.",
      "Decoding a JWT doesn't verify its signature — it just reads the (unencrypted) content, which anyone holding the token can already see.",
      "Because JWTs often carry session or auth data, decoding them locally instead of on a random website matters.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Decoding a token",
        blocks: ["Paste a JWT into [JWT Decoder](/jwt-decoder) and it splits out the header and payload as readable JSON, including converting the expiry timestamp into a normal date so you can see at a glance whether the token is still valid."],
      },
      {
        id: "why-local-matters",
        heading: "Why this is worth doing locally",
        blocks: [
          "A JWT's payload is base64-encoded, not encrypted — anyone who has the token can already read its contents without a secret key. That's by design. But the token itself is often a live session credential, and pasting an active auth token into a random online decoder means trusting that site with it, even briefly.",
          { note: "Decoding happens entirely in your browser here — the token is never sent anywhere, which matters if it's a live credential for a system you care about." },
          "If you're decoding JWTs inside your own code rather than in a browser tab, the same logic this tool uses is also available as a small open-source package: [tiny-jwt-decode](https://github.com/ahsan-techs/tiny-jwt-decode) on GitHub — zero dependencies, about 500 bytes gzipped.",
        ],
      },
    ],
    faqs: [
      { q: "Can this tool verify the token's signature?", a: "No — it decodes and displays the header and payload only. Verifying the signature requires the issuing server's secret or public key, which this tool intentionally doesn't ask for." },
      { q: "Is it safe to decode a production auth token here?", a: "The decoding itself never leaves your browser, so it's safe from a network-exposure standpoint — just treat any live token carefully regardless of the tool, since its contents are already readable by design." },
    ],
    related: ["what-is-base64-encoding-for", "pdf-tools-without-uploading-your-file"],
  },
  {
    slug: "how-to-test-a-regex-pattern",
    title: "How to Test a Regex Pattern Without Guessing",
    seoTitle: "Online Regex Tester, Live Highlighting | Toolkitties",
    description: "See every match highlighted as you type your pattern, instead of running your code over and over to check it.",
    tool: "regex-tester",
    category: "Writing",
    emoji: "🧪",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "Regex Tester highlights every match in your sample text live, as you edit the pattern.",
      "Testing a pattern against real sample text before dropping it into code catches mistakes faster than trial-and-error in your editor.",
      "Useful for validating input formats (emails, phone numbers), extracting data, and understanding someone else's regex.",
      "Everything runs in your browser using standard JavaScript regex syntax.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Testing a pattern",
        blocks: [
          "Open [Regex Tester](/regex-tester), paste in sample text that represents what you're matching against, then type your pattern — matches highlight live as you adjust it, so you can see immediately whether a tweak made things better or worse.",
        ],
      },
      {
        id: "tips",
        heading: "Getting useful test coverage",
        blocks: [
          {
            list: [
              "**Include edge cases in your sample text**, not just the obvious match — an email with a plus sign, a phone number with dashes, whatever variation you expect to actually see.",
              "**Add a case your pattern should reject**, to confirm it's not matching too broadly.",
              "**Build it up gradually** — start with the simplest version of the pattern and add complexity piece by piece, checking the highlights after each change.",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Does it support capture groups?", a: "Yes — standard JavaScript regex syntax, including groups, is supported." },
      { q: "Why does my pattern work here but not in my code?", a: "Regex flavors differ slightly between languages (Python, PHP, JavaScript). This tool uses JavaScript's regex engine, so a pattern using syntax specific to another language may behave differently there." },
    ],
    related: ["how-to-read-a-jwt-token"],
  },
  {
    slug: "how-to-validate-and-format-json",
    title: "How to Validate and Clean Up Messy JSON",
    seoTitle: "JSON Formatter & Validator, Free | Toolkitties",
    description: "Find the syntax error in broken JSON and get it formatted and readable, in one click.",
    tool: "json-formatter",
    category: "Writing",
    emoji: "🧾",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "JSON Formatter validates your JSON and points out exactly where it's broken, instead of a cryptic parser error.",
      "Minified, single-line JSON from an API response gets reformatted into readable, indented structure.",
      "Useful for debugging API responses, config files, or anything copy-pasted that lost its formatting.",
      "Runs entirely in your browser — handy for JSON you'd rather not paste into a random website, like API responses with account data.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Formatting and validating",
        blocks: ["Paste your JSON into [JSON Formatter](/json-formatter) — valid JSON gets reformatted and indented instantly; invalid JSON shows where the syntax breaks, usually a missing comma, an unescaped quote, or a trailing comma a stricter parser won't accept."],
      },
      {
        id: "common-errors",
        heading: "The usual suspects when JSON won't parse",
        blocks: [
          {
            list: [
              "**Trailing commas** — valid in JavaScript objects, not valid in JSON.",
              "**Single quotes instead of double quotes** — JSON requires double quotes around keys and string values.",
              "**Unescaped quotes inside a string** — a stray `\"` inside text breaks the structure unless it's escaped as `\\\"`.",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Can it convert JSON to CSV too?", a: "For that, use [JSON to CSV](/json-to-csv) — this tool is focused on formatting and validating, not converting formats." },
      { q: "Is my JSON uploaded anywhere?", a: "No — formatting and validation both happen in your browser." },
    ],
    related: ["how-to-test-a-regex-pattern"],
  },
  {
    slug: "convert-spreadsheet-rows-to-json",
    title: "How to Convert a Spreadsheet (CSV) Into JSON",
    seoTitle: "Convert CSV to JSON Online Free | Toolkitties",
    description: "Turn spreadsheet rows into structured JSON data for an API, a config file, or a script.",
    tool: "csv-to-json",
    category: "Writing",
    emoji: "📊",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "CSV to JSON turns each row of a spreadsheet into a JSON object, using the header row as the field names.",
      "Useful for feeding spreadsheet data into an API, a script, or a JSON-based config file.",
      "Works from a pasted CSV or an uploaded file — the structure is generated instantly.",
      "The reverse direction (JSON back to CSV) is a separate tool if you need to go the other way.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Converting a CSV",
        blocks: ["Open [CSV to JSON](/csv-to-json), paste your CSV data or upload a file — the first row is treated as column headers, and each following row becomes one JSON object with those headers as keys."],
      },
      {
        id: "tip",
        heading: "One thing to check afterward",
        blocks: ["If a column contains numbers you want treated as numbers (not text) in the resulting JSON, check the output — spreadsheet exports sometimes store numeric-looking values as text, which carries through unless you clean the source data first."],
      },
    ],
    faqs: [
      { q: "Does it handle commas inside a quoted field?", a: "Yes — standard CSV quoting (a comma inside double quotes) is handled correctly, not treated as a column break." },
      { q: "Can I go from JSON back to CSV?", a: "Yes, use [JSON to CSV](/json-to-csv) for the reverse direction." },
    ],
    related: ["how-to-validate-and-format-json"],
  },
  {
    slug: "convert-json-to-csv-for-excel",
    title: "How to Turn JSON Data Into a CSV You Can Open in Excel",
    seoTitle: "Convert JSON to CSV for Excel, Free | Toolkitties",
    description: "API responses and exported JSON data, turned into a spreadsheet you can actually open and sort.",
    tool: "json-to-csv",
    category: "Writing",
    emoji: "📈",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "JSON to CSV flattens an array of JSON objects into spreadsheet rows, using each object's keys as column headers.",
      "Useful for taking an API response or exported JSON data and actually working with it in Excel or Google Sheets.",
      "Works best on a flat or fairly simple JSON structure — deeply nested objects need some thought about how they should become columns.",
      "Everything converts in your browser; no upload to a conversion server.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Converting JSON to a spreadsheet",
        blocks: ["Open [JSON to CSV](/json-to-csv), paste in a JSON array of objects, and download the resulting CSV — open it directly in Excel or Google Sheets."],
      },
      {
        id: "nested-data-note",
        heading: "If your JSON is deeply nested",
        blocks: ["A simple array of flat objects (each with the same keys) converts cleanly into rows and columns. If your JSON has nested objects or arrays inside each record, consider flattening the structure first (or deciding which nested fields you actually need), since a spreadsheet row can't naturally represent arbitrary nesting the way JSON can."],
      },
    ],
    faqs: [
      { q: "What if different objects have different keys?", a: "The resulting CSV includes all the keys seen across the objects as columns, leaving a cell blank for objects that didn't have that key." },
      { q: "Can I go from CSV to JSON instead?", a: "Yes, use [CSV to JSON](/csv-to-json) for that direction." },
    ],
    related: ["convert-spreadsheet-rows-to-json"],
  },
  {
    slug: "convert-measurements-between-units",
    title: "Converting Length, Weight and Temperature Without a Calculator App",
    seoTitle: "Unit Converter: Length, Weight, Temperature | Toolkitties",
    description: "Length, weight, temperature, volume and speed — convert instantly without hunting for a formula.",
    tool: "unit-converter",
    category: "Writing",
    emoji: "📏",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "Unit Converter covers length, weight, temperature, volume and speed, converting instantly as you type.",
      "Useful for recipe conversions, DIY measurements, shipping weights, or just not remembering the Celsius-to-Fahrenheit formula.",
      "No app install or account — works the same on a phone browser as on a laptop.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Converting a measurement",
        blocks: ["Open [Unit Converter](/unit-converter), pick the category (length, weight, temperature, volume or speed), type a value, and every common unit in that category updates at once — no need to pick a 'from' and 'to' unit first."],
      },
    ],
    faqs: [
      { q: "Does it handle cooking measurements like cups and tablespoons?", a: "Volume conversions cover common cooking units alongside metric and imperial — check the volume category for the full list." },
      { q: "Is it accurate enough for engineering or scientific use?", a: "It uses standard conversion factors and is accurate for everyday and most professional use — for high-precision scientific work, always double-check against an authoritative source for your specific field." },
    ],
    related: ["how-to-convert-a-timestamp-to-a-date"],
  },
  {
    slug: "how-to-calculate-a-loan-or-emi-payment",
    title: "How to Calculate Your Monthly Loan Payment (EMI)",
    seoTitle: "Loan / EMI Calculator with Breakdown | Toolkitties",
    description: "Work out your monthly payment, total interest, and a full yearly breakdown before you commit to a loan.",
    tool: "loan-calculator",
    category: "Business",
    emoji: "🏦",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "Loan Calculator works out your monthly payment (EMI) from the loan amount, interest rate, and term.",
      "It also shows total interest paid over the life of the loan — often a bigger number than people expect.",
      "A yearly breakdown shows how much of each payment goes to principal vs interest, which shifts over time.",
      "Useful for comparing loan offers before signing, not just checking an offer you've already accepted.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Working out a payment",
        blocks: ["Open [Loan / EMI Calculator](/loan-calculator), enter the loan amount, annual interest rate and term, and the monthly payment, total interest, and yearly breakdown appear instantly — adjust any of the three inputs to see how the payment changes."],
      },
      {
        id: "why-total-interest-matters",
        heading: "Why the total interest number is worth checking",
        blocks: ["It's easy to focus only on the monthly payment when comparing loans, since that's the number that affects your budget day to day. But a longer term with a lower monthly payment often means paying significantly more in total interest over the life of the loan — the total interest figure makes that trade-off visible before you commit."],
      },
    ],
    faqs: [
      { q: "Does this account for fees or insurance added to a loan?", a: "No — it calculates the core principal-and-interest payment. Add any fees or required insurance separately when comparing offers, since lenders often quote those apart from the base EMI." },
      { q: "Can I use it for a mortgage?", a: "Yes, the same principal/rate/term calculation applies to mortgages as well as personal or auto loans." },
    ],
    related: ["how-to-add-vat-or-sales-tax", "how-to-calculate-profit-margin"],
  },
  {
    slug: "how-to-calculate-bmi-correctly",
    title: "How to Calculate BMI (and What It Doesn't Tell You)",
    seoTitle: "BMI Calculator, Metric & Imperial | Toolkitties",
    description: "Calculate your body mass index in either unit system, and a quick note on what BMI is and isn't useful for.",
    tool: "bmi-calculator",
    category: "Writing",
    emoji: "⚖️",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "BMI Calculator works in both metric (kg/cm) and imperial (lb/in) units.",
      "BMI is a simple ratio of weight to height — it doesn't account for muscle mass, body composition, age, or sex.",
      "It's a widely used population-level screening tool, not an individual diagnosis.",
      "For a personal health assessment, BMI is a starting point to discuss with a doctor, not a complete picture on its own.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Calculating it",
        blocks: ["Open [BMI Calculator](/bmi-calculator), pick metric or imperial, enter your height and weight, and your BMI and category appear instantly."],
      },
    ],
    faqs: [
      { q: "Is BMI accurate for athletes?", a: "Not particularly — BMI doesn't distinguish muscle from fat, so people with high muscle mass often show a higher BMI than their actual body fat percentage would suggest." },
      { q: "Should I make health decisions based on BMI alone?", a: "BMI is one data point among many that a doctor would consider — it's useful as a quick, standardized reference, not a substitute for a fuller assessment." },
    ],
    related: ["convert-measurements-between-units"],
  },
  {
    slug: "percentage-increase-decrease-discount-calculator",
    title: "How to Calculate a Percentage Increase, Decrease or Discount",
    seoTitle: "Percentage Calculator: Discounts, Increases | Toolkitties",
    description: "Work out a discount, a price increase, or what percentage one number is of another, without doing the algebra by hand.",
    tool: "percentage-calculator",
    category: "Business",
    emoji: "💯",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "Percentage Calculator covers the common cases: what's X% of Y, percentage increase/decrease, and discount pricing.",
      "Handy for checking a sale discount is actually what it claims to be, or working out a tip or tax quickly.",
      "No formulas to remember — enter the numbers you have and it works out the rest.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Using it",
        blocks: [
          "Open [Percentage Calculator](/percentage-calculator) and pick the calculation that matches what you're trying to work out:",
          {
            list: [
              "**What is X% of Y?** — for tips, commissions, or a cut of a total.",
              "**Percentage change** — for comparing two numbers (this month's sales vs last month's, for instance).",
              "**Discount price** — enter the original price and discount percentage to see the final price and amount saved.",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Can it calculate a reverse discount (find the original price before a sale)?", a: "Yes — enter the sale price and discount percentage, and it works backward to the original price." },
      { q: "Does it handle negative percentages for a loss?", a: "Yes, a percentage decrease (a price drop, a loss between two numbers) is calculated the same way, just with a negative result shown." },
    ],
    related: ["how-to-calculate-a-loan-or-emi-payment"],
  },
  {
    slug: "calculate-exact-age-in-years-months-days",
    title: "How to Calculate Exact Age in Years, Months and Days",
    seoTitle: "Age Calculator: Exact Years, Months, Days | Toolkitties",
    description: "Find someone's exact age — or how long ago a date was — down to the day.",
    tool: "age-calculator",
    category: "Writing",
    emoji: "🎂",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "Age Calculator works out exact age in years, months and days from a birthdate, accounting for leap years correctly.",
      "Useful for official forms, eligibility checks (age requirements), or just settling an argument about someone's exact age.",
      "You can calculate age as of today, or as of any other date — useful for 'how old will they be on X date' questions.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Using it",
        blocks: ["Open [Age Calculator](/age-calculator), enter a birthdate, and the exact age in years, months and days appears — change the \"as of\" date if you need the age on a specific future or past date rather than today."],
      },
    ],
    faqs: [
      { q: "Does it handle leap years correctly?", a: "Yes — the calculation accounts for leap years and varying month lengths, so the day count is exact rather than a rough estimate." },
      { q: "Can I use it to count days until a future date, not just age?", a: "For a general day-count between two dates (not specifically age from a birthdate), [Days Between Dates](/days-between-dates) is built for that." },
    ],
    related: ["percentage-increase-decrease-discount-calculator"],
  },
  {
    slug: "how-to-convert-a-timestamp-to-a-date",
    title: "How to Convert a Unix Timestamp to a Readable Date",
    seoTitle: "Unix Timestamp Converter, Free | Toolkitties",
    description: "Turn a Unix timestamp from a log file, database or API response into a date you can actually read, and back again.",
    tool: "timestamp-converter",
    category: "Writing",
    emoji: "⏱️",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "Timestamp Converter turns a Unix timestamp (seconds or milliseconds since 1970) into a readable date, and converts a date back into a timestamp.",
      "Common need when reading raw log files, database records, or API responses that store times as timestamps.",
      "Handles both the current time and any timestamp you paste in, including converting across time zones.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Converting a timestamp",
        blocks: ["Paste a Unix timestamp into [Timestamp Converter](/timestamp-converter) and it displays the equivalent date and time — or enter a date to get the timestamp, useful when building an API request or a database query that expects one."],
      },
    ],
    faqs: [
      { q: "Does it know whether my timestamp is in seconds or milliseconds?", a: "The tool detects the likely format based on the number's length (10 digits is typically seconds, 13 is typically milliseconds) — double-check the result against a date you know if the source format is unusual." },
      { q: "Does it support different time zones?", a: "Yes — you can view the converted date in your local time zone or UTC." },
    ],
    related: ["convert-measurements-between-units"],
  },
  {
    slug: "convert-binary-hex-decimal-numbers",
    title: "How to Convert Between Binary, Hex, Octal and Decimal",
    seoTitle: "Number Base Converter: Binary, Hex, Decimal | Toolkitties",
    description: "Convert a number between binary, octal, decimal and hexadecimal instantly — useful for programming and networking work.",
    tool: "number-base-converter",
    category: "Writing",
    emoji: "🔟",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "Number Base Converter switches a number between binary, octal, decimal and hexadecimal as you type.",
      "Common in programming (bitwise work, color codes, memory addresses) and networking (subnet masks, MAC addresses).",
      "No need to remember the manual conversion steps — enter a number in any base and see it in all the others at once.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Converting a number",
        blocks: ["Open [Number Base Converter](/number-base-converter), type a number into any one of the base fields (binary, octal, decimal, or hex), and the others update automatically."],
      },
    ],
    faqs: [
      { q: "Can it handle negative numbers?", a: "Yes, standard signed conversions are supported across the bases." },
      { q: "Is this the same as the color HEX codes used in design?", a: "Related but not identical — hex color codes are a specific 6-digit hex format for RGB values. For that specific case, [Color Converter](/color-converter) is purpose-built." },
    ],
    related: ["how-to-convert-a-timestamp-to-a-date"],
  },
  {
    slug: "how-to-add-vat-or-sales-tax",
    title: "How to Add (or Reverse) VAT and Sales Tax on a Price",
    seoTitle: "VAT & Sales Tax Calculator | Toolkitties",
    description: "Add tax to a price, or find out how much tax is already included in a price that has it baked in.",
    tool: "vat-calculator",
    category: "Business",
    emoji: "🏷️",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "VAT & Sales Tax Calculator works both directions: add tax to a pre-tax price, or extract how much tax is already inside a tax-included price.",
      "Useful for invoicing, checking a receipt, or pricing a product for different tax regions.",
      "Enter whatever tax rate applies to you — the calculator doesn't assume a fixed rate, since VAT and sales tax vary by country and region.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Using it",
        blocks: [
          "Open [VAT & Sales Tax Calculator](/vat-calculator) and pick the direction:",
          {
            list: [
              "**Add tax** — enter a pre-tax price and rate, get the tax amount and total.",
              "**Extract tax** — enter a tax-included price and rate, get the pre-tax amount and the tax portion broken out.",
            ],
          },
        ],
      },
    ],
    faqs: [
      { q: "Does it know my country's tax rate automatically?", a: "No — enter whatever rate applies to your region, since VAT and sales tax rates vary by country, and often by product category within a country." },
      { q: "Is this useful for invoicing?", a: "Yes — many people use it alongside [Invoice Generator](/invoice-generator) to double-check tax figures on an invoice." },
    ],
    related: ["how-to-calculate-a-loan-or-emi-payment", "how-to-calculate-profit-margin"],
  },
  {
    slug: "how-to-calculate-profit-margin",
    title: "How to Calculate Profit Margin (and the Price You Need for a Target Margin)",
    seoTitle: "Profit Margin & Markup Calculator | Toolkitties",
    description: "Work out your margin from cost and price, or work backward to find the price you need for a target margin.",
    tool: "profit-margin-calculator",
    category: "Business",
    emoji: "📈",
    published: "2026-10-26",
    updated: "2026-10-26",
    takeaways: [
      "Profit Margin Calculator works out profit, margin percentage and markup percentage from your cost and selling price.",
      "It also works backward: tell it your cost and target margin, and it tells you what price to charge.",
      "Margin and markup are often confused — margin is profit as a percentage of the selling price; markup is profit as a percentage of the cost. They give different numbers for the same sale.",
    ],
    sections: [
      {
        id: "steps",
        heading: "Using it",
        blocks: ["Open [Profit Margin Calculator](/profit-margin-calculator), enter your cost and either your selling price (to see the resulting margin) or your target margin (to see the price you'd need to charge)."],
      },
      {
        id: "margin-vs-markup",
        heading: "Margin vs markup — the mix-up that costs people money",
        blocks: ["A 50% markup on a $100 cost gives a $150 price — but that's a 33% margin, not 50%, because margin is calculated against the selling price ($50 profit / $150 price), not the cost. Pricing based on the wrong one of these two numbers is a common, easy-to-make mistake, and this tool shows both at once so you can check which figure you actually meant."],
      },
    ],
    faqs: [
      { q: "Which one should I use for pricing decisions?", a: "Margin is generally the more useful figure for understanding actual profitability relative to revenue, since it's calculated against the selling price — but which matters more depends on how your industry typically talks about pricing." },
      { q: "Does it account for other costs like shipping or fees?", a: "Include those in the 'cost' figure you enter if you want them reflected in the margin — the calculator works from whatever cost number you provide." },
    ],
    related: ["how-to-add-vat-or-sales-tax", "how-to-write-an-invoice"],
  },
];
