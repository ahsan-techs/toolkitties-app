# Traffic & Authority Upgrade — Design

Status: awaiting approval (nothing built yet)

## Intent and why
toolkitties.com has solid content (69 tools, 100+ landing pages, blog, pillar guides) but almost no
organic traffic: ~46 clicks in 28 days, with 117 pages indexed and most sitting at Google position
50-90 (source: SEO-PERFORMANCE-REPORT.md, GSC 2026-11-20). The owner wants more real visitors. The
bottleneck is ranking strength, not missing features.

## Goals
- Move the highest-impression pages from position 50-90 toward the top 20, and grow real clicks.
- Make the site faster on its heaviest pages (tool pages ship ~359 kB first-load JS).
- Build real off-site authority: legitimate listings, mentions and backlinks.
- Measure monthly against the 2026-11-20 baseline using real GSC data.

## Non-goals
- No new tools. No paid ads. No monetization work yet (too little traffic to monetize).

## Anti-goals (a failure even if it "works")
- Fake reviews, fake stats, bought/PBN backlinks, spammy directory blasts, fake freshness dates.

## Approaches considered
1. On-site only (deepen top pages, speed): safe and fully in my control, but authority stays flat.
2. Off-site only (listings, outreach): needed for authority, but weak pages waste the new links.
3. Combined: strengthen the top pages first, then point off-site effort at them. **Chosen (my call).**

## Workstreams
1. Top-page strengthening: the ~10 pages with the most impressions (/blog/how-to-merge-pdf-files,
   /blog/how-to-reduce-pdf-file-size, /word-counter, /split-pdf, /compare-two-text-files,
   /url-decode-online, passport-photo resize, /vat-calculator, invoice post). Align title, H1 and
   intro to the real GSC queries, add real depth (no padding), and add internal links from related
   posts and variants.
2. Speed: cut first-load JS on /[slug] by lazy-loading heavy libraries; verify with a build.
3. Off-site authority kit: research legitimate targets (tool directories, alternative-to sites,
   communities, resource pages), then draft honest listings and posts. The owner submits them, since
   accounts and posting need the owner's logins.
4. Measurement: monthly GSC pull via Supermetrics, compared to the baseline.

## Tools I will use (my call)
Supermetrics (GSC data), Vercel (deploys, runtime and analytics checks), Firecrawl and web search
(link-target and competitor research), the seo-audit, competitive-brief and draft-content skills.
Third-party SEO connectors (Ryze, ChatSEO) only if the owner opts in.

## Needs from the owner
Posting/submitting the off-site listings from his own accounts. Nothing else.

## Left to the builder
Exact title/intro wording per page, which libraries to lazy-load, and the link-target shortlist.
