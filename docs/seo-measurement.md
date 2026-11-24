# Monthly SEO measurement

Run once a month (next: 2026-12-20). Compare against `docs/seo-baseline-2026-11-22.md` and
`SEO-PERFORMANCE-REPORT.md` (2026-11-20 snapshot).

## The pull (Supermetrics, Google Search Console)
- `ds_id`: GW
- `ds_accounts`: `["sc-domain:toolkitties.com"]`
- `fields`: `page, clicks, impressions, ctr, position`
- `settings`: `{"report_type": "STANDARD"}`
- `date_range_type`: `last_28_days`
- Second pull with `page, query, impressions, position` for query-level changes. The `filters`
  parameter is `filters` (not `filter`); without it the pull is capped by `max_rows`.

## What to record each month
| Month | Pages with impressions | Total clicks | Position: /blog/how-to-merge-pdf-files | /blog/how-to-reduce-pdf-file-size | /word-counter | /split-pdf |
|---|---|---|---|---|---|---|
| 2026-11 (baseline) | 117 | ~46 | 73.7 | 61.1 | 68.5 | 53.7 |

Position: lower is better. A move from 60 to 30 over a month counts as progress even with few clicks.

## Changes shipped in this plan (for attribution)
- 2026-11-22: tool-page JavaScript lazy-loading; the four blog posts rewritten around real queries;
  related-guides links on tool pages; word-counter, VAT, URL-decode wording; invoice page claim fixed.
- Off-site drafts are in `docs/off-site/`; record the date each one is actually submitted here.
