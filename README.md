# Toolkitties

A Smallpdf-style micro-SaaS utility website — 44 everyday tools (PDF, image, text, and calculators) that run **entirely in the visitor's browser**. No signup, no login, no backend file uploads.

Built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS**, ready to deploy on **Vercel**, monetized via **Lemon Squeezy**.

## What's included

- Sticky navbar with the "⚡ No Signup. No Login. Start Instantly." badge and mega-menu dropdowns
- Hero with instant, type-ahead tool search
- 4 tool groups (Document & PDF, Image & Media, Text & Data, Developer & Calculators) with "View all tools →" expand
- 37 fully functional client-side tools + 7 tools flagged "coming soon" (ready to wire up later)
- Alternating scroll feature rows, a scale/trust tracker, and a 3-tier pricing section
- Per-tool page at `/tools/[slug]` with its own metadata, JSON-LD `SoftwareApplication` schema, and a working input → process → download workspace
- `sitemap.xml` and `robots.txt` generated automatically from the tool list

## Run it locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Go to **vercel.com → Add New → Project** and import the repo.
3. Framework preset: Vercel auto-detects **Next.js** — leave build command as `next build`.
4. Click **Deploy**. That's it — no environment variables are required for the site to work.
5. Once live, point your domain (e.g. `toolkitties.com`) to the Vercel project under **Settings → Domains**.

## Connect Lemon Squeezy payments

The two paid pricing cards (`components/PricingSection.tsx`) currently link to placeholder checkout URLs:

```
https://toolkitties.lemonsqueezy.com/checkout?plan=pro
https://toolkitties.lemonsqueezy.com/checkout?plan=business
```

To go live:
1. Create your store and two products (Ultimate Pro Bundle, Business Matrix) at `app.lemonsqueezy.com`.
2. Copy each product's real **Checkout URL** from Lemon Squeezy.
3. Paste those URLs into the `href` fields in `components/PricingSection.tsx`.
4. (Optional) Add a Lemon Squeezy webhook later if you want to gate the "Pro" tool limits server-side — the current build treats all tools as open/unlimited since there's no backend yet.

## Adding more tools

Every tool is one entry in `lib/tools-data.ts`:

```ts
{ slug: "my-tool", name: "My Tool", description: "…", icon: "🛠️", functional: true }
```

Set `functional: true` once you've added its logic to the right file in `lib/tool-processors/` and wired a case for its `slug` inside `components/ToolWorkspace.tsx`. Until then, leaving it `false` shows a "coming soon" state automatically — nothing else to configure.

## Project structure

```
app/
  page.tsx              → homepage (assembles all sections)
  tools/[slug]/page.tsx  → per-tool page, metadata + JSON-LD
  sitemap.ts, robots.ts
components/
  Navbar, HeroSearch, ToolGroupSection, ToolCard, ScrollFeatureRows,
  ScaleTracker, PricingSection, Footer, ToolWorkspace, WaveLoader
  workspace/Dropzone.tsx, workspace/OutputPanel.tsx
lib/
  tools-data.ts               → the master list of every tool
  tool-processors/            → the actual PDF / image / text / dev logic
```
