# Salo Thank You Pages

Post-project thank you pages for Salo clients, built with [Astro](https://astro.build) and deployed as a static site to GitHub Pages.

**Live URLs**

- GitHub Pages: [https://salocreative.github.io/thank-you](https://salocreative.github.io/thank-you)
- Custom domain (optional): [https://thanks.salo.uk](https://thanks.salo.uk)

## Project structure

```
src/
├── components/
│   ├── ActionCards.astro      # Testimonial, review, and referral CTAs
│   ├── Footer.astro
│   ├── ReferralNote.astro
│   ├── SiteHeader.astro
│   ├── TeamVideo.astro        # Carl & Toby message (Vimeo or placeholder)
│   ├── TestimonialVideo.astro # Client testimonials reel
│   └── UpsellBlock.astro      # Flexi-Design upsell
├── data/
│   ├── clients.ts             # Client schema and page content
│   └── site.ts                # Shared links and defaults
├── layouts/
│   └── Base.astro             # HTML shell, fonts, global styles
├── pages/
│   ├── index.astro            # Generic thank you page
│   └── [client].astro         # Personalised pages, e.g. /provenant
└── styles/
    └── global.css             # All page styles (preserved from original HTML)
```

## Development

Requires Node.js 22.12+.

```bash
npm install
npm run dev
```

Open [http://localhost:4321/thank-you](http://localhost:4321/thank-you) — the `/thank-you` base path matches production.

## Building

```bash
npm run build
npm run preview
```

Output is written to `dist/`.

## Deployment (GitHub Pages)

1. Push this repo to `salocreative/thank-you` on GitHub.
2. In repo **Settings → Pages**, set source to **GitHub Actions**.
3. Push to `main` — the workflow in `.github/workflows/deploy.yml` builds and deploys automatically.

The site is configured with `base: '/thank-you'` in `astro.config.mjs` for project-page hosting at `salocreative.github.io/thank-you`.

### Custom subdomain (`thanks.salo.uk`)

1. Add a `CNAME` record pointing `thanks.salo.uk` to `salocreative.github.io`.
2. In GitHub repo **Settings → Pages → Custom domain**, enter `thanks.salo.uk`.
3. Update `astro.config.mjs` for root hosting:

   ```js
   export default defineConfig({
     site: 'https://thanks.salo.uk',
     base: '/',
     output: 'static',
     integrations: [sitemap()],
   });
   ```

4. Rebuild and redeploy.

## Adding a personalised client page

Pages are managed in the **admin portal** (Supabase `thank_you_clients` table). The site is static — each page is generated at **build time**, not on every visit.

### Workflow

1. Create the page in the admin portal and set **Published** to on.
2. Trigger a rebuild (push to `main`, or run **Actions → Deploy to GitHub Pages → Run workflow**).
3. The page goes live at `/thank-you/{slug}` (e.g. `/thank-you/src`).

If a page 404s, it usually means one of:

- **Not published** — only rows with `published = true` are built.
- **Site not rebuilt** — creating a row in Supabase does not update GitHub Pages until the next deploy.
- **Supabase not wired in CI** — GitHub Actions needs `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` secrets (see below).

### Test locally

1. Copy `.env.example` to `.env` and add your Supabase credentials.
2. Build and preview:

   ```bash
   npm run build
   npm run preview
   ```

3. Open [http://localhost:4321/thank-you/src](http://localhost:4321/thank-you/src) (replace `src` with your slug).

During `npm run dev`, Astro still pre-renders static paths at startup — restart the dev server after adding a new client.

### Team video (optional)

The team message block is **hidden** unless `team_video_presenters` or `team_video_url` is set in Supabase.

| Field | Purpose |
|-------|---------|
| `team_video_presenters` | Names in the section label and placeholder, e.g. `Carl & Toby` |
| `team_video_url` | Vimeo video ID — shows the player when set |
| `team_video_placeholder_text` | Subtext when video is not ready (defaults to "Message coming shortly") |

**Examples**

- Presenters set, no URL → placeholder with names (Provenant)
- Presenters + URL → embedded Vimeo player
- Both null → section omitted entirely

Run [`supabase/migrations/20260521_add_team_video_presenters.sql`](supabase/migrations/20260521_add_team_video_presenters.sql) on existing databases.

## Shared links

Update placeholder URLs in `src/data/site.ts`:

- `RIVERSIDE_LINK` — Riverside testimonial recording link
- `GOOGLE_REVIEW_LINK` — Google review URL

## Supabase (admin portal)

SQL to create the `thank_you_clients` table is in [`supabase/thank_you_clients.sql`](supabase/thank_you_clients.sql).

At build time, [`src/lib/getClients.ts`](src/lib/getClients.ts) fetches all **published** rows from Supabase and generates static HTML for each slug.

### GitHub Actions secrets

In the repo **Settings → Secrets and variables → Actions**, add:

| Secret | Value |
|--------|--------|
| `SUPABASE_URL` | Project URL from Supabase dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (Settings → API) |

The service role key is only used during the build step in CI — it never ships to the browser.

If you prefer the anon key instead, run [`supabase/policies.sql`](supabase/policies.sql) and use `SUPABASE_ANON_KEY` in place of the service role key.

### Fallback data

`src/data/clients.ts` is used when Supabase env vars are missing (e.g. offline dev). In production CI, Supabase is the source of truth.

## Sitemap

`@astrojs/sitemap` is enabled. After deploy, the sitemap is available at `/thank-you/sitemap-index.xml` (or `/sitemap-index.xml` on a custom domain).

## Original HTML

The source designs are kept for reference:

- `salo-thank-you.html` — generic template
- `salo-thank-you-personalised.html` — Provenant personalised version
