# Toolkitties: project hand-over for another AI or developer (code version v25)

Read this first. It describes the live site, the code layout, what was added after v11, what is unfinished, and the owner's rules. This replaces AI-HANDOFF-v11.md and v21.

## 1. What this is
- **toolkitties.com**: a free website of 61 online tools (PDF, images, text, developer, business). Everything runs in the visitor's browser. Files are not uploaded.
- Owner runs it alone and writes in **Roman Urdu** (Urdu in English letters). Reply in the same style, short and practical. Code, comments and site text stay in English.
- No business model yet: no paid plans, no ads, no analytics, no cookies.
- Contact email (set in `lib/site-config.ts`): ahsanaliclaude@gmail.com

## 2. Tech stack
Next.js 14.2 (App Router), React 18, TypeScript, Tailwind CSS 3, framer-motion (hero and reveals only), pdf-lib, pdf.js (from `public/pdfjs`), qrcode, heic2any. No server code or database. Deployed on Vercel from a local folder with `vercel` (preview) and `vercel --prod`. GitHub repo: ahsan-techs/toolkitties-app. No secrets or `.env` files.
Run: `npm install`, `npm run dev`, `npm run build`.

## 3. Where things are
- `lib/tools-data.ts`: the single list of the 61 tools (slug, name, description, icon, `functional`, `wide`) in 5 groups.
- `app/(main)/[slug]/page.tsx`: template for every tool page and the 55 variant landing pages (`lib/tool-variants.ts`). Contains metadata, JSON-LD, direct answer, quick facts, "Also searched as", "When to use", how-to, benefits, `ToolShowcase`, `TutorialCards`, privacy note, FAQ, related tools.
- Tool implementations: `components/ToolWorkspace.tsx` (about 40 simple tools, logic in `lib/tool-processors/*`), `components/tools/*` + `registry.ts` + `MiniTool.tsx` (20 tools with their own screens), `InvoiceGenerator.tsx` (also quote mode), `ProposalGenerator.tsx`.
- Home page: `app/(main)/page.tsx` composes `HeroSearch`, `FreeBanner`, `ToolMarquee`, tool groups, `ScrollFeatureRows` (+ `FeatureVisuals.tsx`, `FxStage.tsx`), `ScaleTracker`, `FeatureCards3D`, `FeedbackCta`, `HomeGeo` (FAQ + schema), `WhyChoose`.
- Navigation: `Navbar.tsx` (pills: All Tools, Guides, Tools Catalog, Always Free, Privacy & Security), `ToolsSidebar.tsx`, `MobileToolsDrawer.tsx`, `Footer.tsx` (lists all tools with icons, plus Free forever / All tools / Guides / Privacy / Terms / Contact).
- `/all-tools` (`app/(main)/all-tools/page.tsx` + `components/AllToolsSearch.tsx`): searchable list of every tool.
- Trust pages: `/privacy`, `/terms` (`lib/legal-content.ts`), `/contact` (feedback form opens the visitor's email app).
- Languages: English plus es, pt, de, fr, hi, id, ja, ar under `app/<locale>/` (strings in `lib/i18n/*`). Only older tools are translated.
- SEO: `lib/seo-content.ts` (titles, descriptions, direct answers, quick facts, FAQs), `app/sitemap.ts` (tools, variants, locales, blog), `app/robots.ts` (AI crawlers allowed), `app/llms.txt/route.ts` (tools + guides), share images `public/og/<slug>.png` (1200x630, static, plus `home.png`).
- Bing verification file: `public/BingSiteAuth.xml`.
- Security headers and `/tools/:slug` redirect: `next.config.js`. No Content-Security-Policy yet.
- Styles: `app/globals.css` (tokens, glass cards, hero, `fx-*` feature animations, `sc-*` tool showcase, `bl-*` blog). Tailwind config in `tailwind.config.ts`.

## 4. Added after v11 (v14 to v21)
- **v14:** `/all-tools` page; bigger navbar with pill buttons and an All Tools button; hamburger menu up to 1024px; hero search with icon and Search button (Enter opens the first match, "No tool found" message), fainter orbs, more spacing.
- **v15:** home feature rows rebuilt with CSS-animated illustrations (play only when visible, respect reduced motion).
- **v16:** `components/WhyChoose.tsx` ("Why choose Toolkitties?", six true points, below the home FAQ).
- **v17:** full-tool footer with icons; contact email set; `lib/tool-seo.ts` (for every one of the 61 tools: "also searched as" synonyms, 3 use cases, 1 to 2 tool-specific FAQs; used in metadata keywords, schema `alternateName`, `llms.txt`, page text); home title says 60+ tools.
- **v18:** leftovers removed (old `proposal-generator` page, `tool-config-snippet.ts`); legal "last updated" date; Unit Converter description corrected (length, weight, temperature, volume, speed).
- **v19:** `BingSiteAuth.xml` added to `public/`.
- **v20:** tool showcase for the first 12 tools (`lib/tool-showcase.ts`, `components/ToolShowcase.tsx`, `PlayGate.tsx`): six animated feature cards, "Everything you need" checklist, tips panel, 0/0/0 strip, six extra FAQs (also added to FAQ schema; they replace the shorter `tool-seo` FAQs on those tools). Tools: merge-pdf, compress-pdf, split-pdf, pdf-to-word, pdf-to-jpg, image-to-pdf, jpg-to-png, compress-image, resize-image, qr-code-generator, word-counter, invoice-generator. Animations use only transform/opacity, pause off screen, stop for reduced motion.
- **v25:** trust pages and 404. New `/about` page (`app/(main)/about/page.tsx`, AboutPage + Organization schema, honest content, no invented names or numbers). `next.config.js` now permanently redirects common alternative URLs: /about-us, /aboutus, /about-toolkitties to /about; /privacy-policy, /privacypolicy to /privacy; /terms-and-conditions, /terms-of-service, /terms-of-use, /tos to /terms; /contact-us, /contactus, /feedback to /contact; /tools to /all-tools; /sitemap to /sitemap.xml; /faq to /#faq; /blogs to /blog. `app/(main)/not-found.tsx` now says "We couldn't find that page" (it used to say "tool") with links to tools, guides, contact and popular tools. Footer has an About link; sitemap includes /about. Note: there is no root `app/layout.tsx` (each route group has its own root layout), so do not add a root `app/not-found.tsx` without a root layout.
- **v24:** blog expanded from 13 to 23 articles. New in-depth guides (`lib/blog/posts-guides.ts`, 700 to 900 words each) for the most demanded tools: compress PDF for email/applications, merge PDF on iPhone and Android, scan documents with a phone into one PDF, PDF to Word formatting limits, delete PDF pages, rotate PDF pages, password protect a PDF, remove a PDF password, HEIC to JPG, reduce photo size. The first four existing guides got extra sections via `lib/blog/posts-expand.ts`. Guides link to each other and to tools (cluster linking). Share bar under the title and at the end of each article (`components/blog/ShareBar.tsx`: WhatsApp, X, LinkedIn, Facebook, Email, Copy link; plain links, no social scripts). Tool pages now show up to 6 tutorials. Tools with tutorials: 17 of 61.
- **v23:** showcase added to ALL remaining tools: all 61 tools now have the long-form showcase (6 animated cards, checklist, tips, 6 FAQs; about 340 words each, written from each tool's real options). Fixed along the way: Organize PDF description said "drag" but the tool takes a typed page order (description and FAQ corrected); Proposal PDF has no footer credit (only Invoice and Quotation PDFs carry "Created free with Toolkitties.com").
- **v22:** showcase added to 12 more tools (24 in total): password-generator, json-formatter, uuid-generator, base64, hash-generator, rotate-pdf, delete-pdf-pages, protect-pdf, unlock-pdf, watermark-pdf, image-to-webp, heic-to-jpg. Written from the real options of each tool.
- **v21:** blog. `lib/blog/*` (types, 13 articles in `posts-pdf.ts` and `posts-more.ts`, helpers), `app/(main)/blog/page.tsx` and `blog/[slug]/page.tsx`, `components/blog/*` (cards, article body, Try-it card), `components/TutorialCards.tsx` (shown on tool pages), Article/FAQ/Breadcrumb schema, sitemap and `llms.txt` entries, Navbar and Footer links.

To add an article: add an object to `lib/blog/posts-*.ts` (extra sections for an existing article go in `posts-expand.ts`) (fields in `lib/blog/types.ts`). Paragraph strings accept `**bold**` and `[text](/path)`. The `tool` field must be a real tool slug.

## 5. Design
Earthy palette: moss `#1F5C4C`, gold `#C7862B`, ink `#15171A`, paper `#F5F6F3`, slate `#5B5D63`. Fonts: Fraunces (headings), Inter (body). Animation rules: CSS first, no WebGL or heavy libraries, respect `prefers-reduced-motion`, pause off screen, keep the page fast. A 3D sphere hero and bento redesign were rejected. The logo change (cat paw) is still the owner's pending decision; nothing applied.

## 6. Honesty rules (important)
- Never invent ratings, reviews, user counts, certifications (ISO, GDPR), support promises or statistics. Do not copy competitor claims. Any sample number must be labelled "Example".
- Do not claim "no watermark" for invoices: the PDF has a small "Created free with Toolkitties.com" footer.
- Only say "files are not uploaded" for tools that run locally (all current tools do).
- Generated PDFs use standard fonts: only Latin text prints. Urdu or Arabic becomes "?" (the invoice form already warns).
- PDF to Word copies text only (no images, tables, layout, no OCR). Unlock PDF cannot crack unknown passwords and turns pages into images.
- No promise of search ranking. Content must be written per tool, never the same text pasted on many pages.

## 7. Known gaps and to-do (in suggested order)
Notes found during the v23 audit: the tool named "Color Palette Generator" (slug color-picker) only converts one chosen colour to HEX/RGB/HSL and does not make palettes (consider renaming); Invoice and Quotation request the list of currencies from a rates service for the currency preview (no invoice data is sent), so avoid the blanket claim "nothing is ever sent anywhere" for those two tools and keep it in mind before adding a Content-Security-Policy; Crop Image works with typed pixel values only (no drag box); Rotate PDF auto-runs on file add.

1. **Run `npm install` and `npm run build`.** The AI that wrote v12 to v21 had no network, so the full build has never been run. Checked instead: syntax and logic of text, developer and business tools in Node; the showcase and blog markup rendered in headless Chromium at 390, 768 and 1280 px (no horizontal overflow); link, slug and OG-image consistency scripts. Deploy a Vercel preview first.
2. Browser-test PDF tools (note: Rotate PDF auto-runs on file add with all pages; typing pages needs a second Process PDF press), HEIC to JPG, QR code image and Split PDF "every page separately" (never verified).
3. Submit `https://toolkitties.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools (Bing verification file is already in `public/`).
4. Showcase is done for all 61 tools. Blog has 23 articles covering 17 tools; the other 44 tool pages show no "Tutorials" cards yet. Keep writing articles for the most searched tools. Backlinks cannot be created from this repo: they come from other sites linking to the guides, so the guides are written to be useful and shareable.
5. More blog articles (current 13 are about 500 to 650 words each) and the planned "Phase 3": a longer introduction and "how to use" section inside each tool page.
6. Add a Content-Security-Policy header (test that PDF tools still work).
7. Tools not built: Translate with AI (decision pending), EXIF remover, colour extractor, text to speech.
8. New tools and the showcase/blog content have no translated pages.
9. Logo decision.

## 8. How the owner likes to work
- Ask permission before a new task and do only what he asks; explain the plan first when he says so.
- Give one full project zip after each change.
- Explain in simple Roman Urdu, say honestly what was and was not tested, keep replies short.
- Test in a real browser where possible and show screenshots.
