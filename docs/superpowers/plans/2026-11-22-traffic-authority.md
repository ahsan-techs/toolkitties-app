# Traffic & Authority Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move toolkitties.com's highest-impression pages from Google position 50-90 toward the top 20 and grow real organic clicks, without adding tools.

**Architecture:** Fix the heaviest technical drag (tool-page JS weight), then strengthen the top-impression pages using the real GSC queries that reach them, then point legitimate off-site effort at those pages, and measure monthly against the 2026-11-20 baseline.

**Tech Stack:** Next.js 14 app router, TypeScript, content in `lib/blog/*.ts`, `lib/tool-seo.ts`, `lib/tool-variants.ts`; Supermetrics (GSC `GW`, property `sc-domain:toolkitties.com`), Vercel, Firecrawl/web search.

**Spec:** `docs/superpowers/specs/2026-11-22-traffic-authority-design.md`

## Global Constraints

- No new tools. No paid ads. No monetization work.
- No fake reviews, fake stats, bought/PBN backlinks, spammy directory blasts, or fake freshness dates.
- Every figure written into content or reports comes from a real source pulled in-session.
- Before every push: `npm run build` passes; after every push: Vercel deployment `READY` (project `toolkitities`).
- Baseline to beat: tool-page first-load JS 359 kB (`/[slug]`); site 28-day clicks ~46 (GSC 2026-11-20).

## Review Focus

- A lazy-loaded processor makes the first click on a tool slow or silently fail → show the existing loader and verify one tool end to end (Task 2).
- Retitled pages collide with each other (blog post vs tool vs variant for the same query) → one primary page per query cluster (Task 3).
- Titles over ~60 characters or duplicated across pages (Task 3, Task 4).
- `updated` date changed on a post with no real content change (Task 3).
- Locale routes (`/de/[slug]`, `/es/[slug]`, …) break or lose metadata after changes to `[slug]` (Task 2, Task 4).
- An off-site draft makes a claim not backed by a source (Task 5).

---

### Task 1: Baseline snapshot

**Files:**
- Create: `docs/seo-baseline-2026-11-22.md`

**Interfaces:**
- Produces: a table of the top ~10 pages with impressions, clicks, position and their top 5 queries each. Tasks 3, 4, 6 read it.

- [ ] **Step 1:** Pull GSC via Supermetrics (`ds_id` GW, `report_type` STANDARD, last 28 days) for `page` and for `query`+`page`.
- [ ] **Step 2:** Write the table to `docs/seo-baseline-2026-11-22.md` with the pull date and the exact query used.
- [ ] **Step 3:** Verify every row in the file matches the pull. Commit: `docs: add GSC baseline`.

### Task 2: Cut tool-page JavaScript weight

**Files:**
- Modify: `components/ToolWorkspace.tsx:8-17` (static imports of `text`, `image`, `pdf`, `dev` processors and `makeZip`)

**Interfaces:**
- Consumes: modules `@/lib/tool-processors/{text-tools,image-tools,pdf-tools,dev-tools,zip}` (unchanged).
- Produces: same tool behavior; each processor module loads via `await import(...)` only when a tool runs.

- [ ] **Step 1:** Record the current `/[slug]` first-load JS (359 kB) and `/de/[slug]` (311 kB) from `npm run build`.
- [ ] **Step 2:** Replace each static `import * as x` with a dynamic `import()` at the call site that runs the tool; keep the existing `WaveLoader` visible while the module loads.
- [ ] **Step 3:** Run `npm run build`. Expected: build passes; `/[slug]` first-load JS lower than 359 kB (record the new number).
- [ ] **Step 4:** Run `npm start`, open one text tool, one image tool, one PDF tool; each completes a run and downloads output. Open `/de/word-counter`; it renders.
- [ ] **Step 5:** Commit and push; confirm Vercel `READY`.

### Task 3: Strengthen the top blog posts

**Files:**
- Modify: the posts in `lib/blog/posts-*.ts` with slugs `how-to-merge-pdf-files`, `how-to-reduce-pdf-file-size`, `how-to-write-an-invoice`, `how-to-compress-pdf-for-email-and-applications`

**Interfaces:**
- Consumes: the Task 1 query lists per page.
- Produces: per post, a title/description/first paragraph that uses the real query wording, added sections that answer the listed queries, and links to the matching tool and variant pages (e.g. `/merge-pdf`, `/combine-pdf-files-online-free`).

- [ ] **Step 1:** For each post, list its top queries from Task 1 and the questions they imply that the post does not yet answer.
- [ ] **Step 2:** Rewrite `title`, `seoTitle` (≤ 60 chars), `description`, and the opening of each post to match; add one section per unanswered question with real content; set `updated` only on posts that gained content.
- [ ] **Step 3:** Add links from each post to its tool and variant pages; confirm no two pages target the same primary query (the blog post answers "how to…", the tool/variant answers "…online free").
- [ ] **Step 4:** `npm run build`; check each edited slug renders. Commit and push; confirm Vercel `READY`.

### Task 4: Strengthen the top tool pages and link guides to tools

**Files:**
- Modify: `lib/tool-seo.ts` (entries for `word-counter`, `split-pdf`, `vat-calculator`), `lib/tool-variants.ts` (entries `compare-two-text-files`, `url-decode-online`, `resize-image-for-passport-photo`)
- Create: `lib/tool-guides.ts` exporting `toolGuides: Record<string, string[]>` (tool slug → blog slugs)
- Modify: `app/(main)/[slug]/page.tsx` to render a "Related guides" list from `toolGuides`

**Interfaces:**
- Consumes: Task 1 queries for these pages.
- Produces: `toolGuides[toolSlug]` returns blog slugs that exist in `allPosts`.

- [ ] **Step 1:** Write `lib/tool-guides.ts` with entries only for slugs that exist in `lib/blog` and `lib/tools-data.ts`.
- [ ] **Step 2:** Render the list on the tool page under the FAQ using existing link styles; render nothing when the tool has no entry.
- [ ] **Step 3:** Update titles/descriptions/`also` phrases for the six pages to use the real query wording (titles ≤ 60 chars, unique).
- [ ] **Step 4:** `npm run build`; confirm `/word-counter`, `/split-pdf`, `/de/word-counter` render and the guide links resolve. Commit and push; confirm Vercel `READY`.

### Task 5: Off-site authority kit

**Files:**
- Create: `docs/off-site/targets.md`, `docs/off-site/drafts.md`

**Interfaces:**
- Produces: `targets.md` rows of `name | URL | what it accepts | free? | submission rules | page we point to`; `drafts.md` ready-to-paste text per target.

- [ ] **Step 1:** Research with Firecrawl/web search: legitimate free tool directories, alternative-to sites, relevant communities, and resource pages; open each URL and record its real rules.
- [ ] **Step 2:** Keep only targets that are free, currently live, and accept this kind of site; each points at one strengthened page from Tasks 3-4.
- [ ] **Step 3:** Write drafts using only facts true of the site (browser-based processing, no signup, no watermark, free). No superlatives or numbers without a source.
- [ ] **Step 4:** Verify each draft claim against the site. Commit; hand `drafts.md` to the owner to submit from his own accounts.

### Task 6: Monthly measurement

**Files:**
- Create: `docs/seo-measurement.md`

**Interfaces:**
- Consumes: the Task 1 baseline.
- Produces: the exact Supermetrics call and a results table to append to each month.

- [ ] **Step 1:** Document the call (`ds_id` GW, `sc-domain:toolkitties.com`, fields `page,clicks,impressions,ctr,position`, `report_type` STANDARD, last 28 days) and the table layout.
- [ ] **Step 2:** Add the baseline row set and the next check date (2026-12-20). Commit.

---

## Self-review

- Spec coverage: workstreams 1→Tasks 3-4, 2→Task 2, 3→Task 5, 4→Task 6; baseline Task 1 feeds them.
- Names consistent: `toolGuides` and `lib/tool-guides.ts` used the same way in Task 4.
- Proportion: one page per workstream; no code bodies beyond signatures.
