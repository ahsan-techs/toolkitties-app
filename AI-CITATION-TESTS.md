# AI Citation Test Log

Purpose: periodically check whether AI answer engines (ChatGPT, Perplexity, Google AI Overviews)
are citing or recommending Toolkitties for the comparison/long-tail content we've built. This is
the self-check from the Phase 4 GEO roadmap — run it every few weeks, log the real result below
(no rounding up), and only act on what it actually shows.

## How to run it

1. Ask each of the "Test queries" below to ChatGPT (web-browsing/search mode), Perplexity, and a
   Google search (checking for an AI Overview), one at a time, in a fresh/incognito session.
2. For each engine, note: Cited? (yes/no) — Position (first mentioned / one of several / not
   mentioned) — Exact wording used, if any.
3. Also run a plain web search for `site:toolkitties.com` and for the exact long-tail phrase
   (e.g. `"camscanner alternative free no watermark"`) to check basic indexing — citation can't
   happen before indexing does.
4. Add a dated entry below. Don't edit old entries — append a new one so the trend is visible.

## Test queries (tied to real pages on the site)

- "free CamScanner alternative with no watermark"
- "free DocHub alternative with no monthly signature limit"
- "PDF24 vs Toolkitties"
- "iLovePDF alternative with no daily limit"
- "Smallpdf alternative free"
- "merge PDF online free no signup"

## Log

### 2026-11-18 — baseline, via web search (no direct ChatGPT/Perplexity access in this session)
- `site:toolkitties.com` and `"toolkitties.com"` searches did not surface the site at all — it's
  being outranked by a very large number of near-identical "free browser PDF tools" sites
  (lovable.app, pages.dev, vercel.app clones, plus established players like PDF24, i2PDF,
  ToolPDFs). This is an indexing/authority problem, not a content problem — the site is ~4 weeks
  old, so this is expected at this stage, not a regression.
- None of the new comparison articles (CamScanner, DocHub, PDF24) are old enough yet to have been
  crawled and ranked — too early to expect citation. This entry is the starting point to compare
  future runs against.
- Action for next run: re-check in 3–4 weeks once Google Search Console is connected (Phase 5) so
  we can see real indexing status instead of inferring it from search result absence.
