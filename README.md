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

1. Add an entry to `src/data/clients.ts`:

   ```ts
   acme: {
     slug: 'acme',
     clientName: 'Acme Ltd',
     recipientNames: 'Jane',
     projectDescription: 'Brand refresh',
     personalMessage: ['Paragraph one.', 'Paragraph two.'],
     teamVideoUrl: null,       // Vimeo ID when ready, e.g. '123456789'
     showUpsell: true,
   },
   ```

2. The page is generated at `/thank-you/acme` (or `/acme` on a custom domain).

Optional fields for personalised copy: `referralActionDescription`, `upsellHeading`, `upsellDescription`, `upsellButtonText`.

## Shared links

Update placeholder URLs in `src/data/site.ts`:

- `RIVERSIDE_LINK` — Riverside testimonial recording link
- `GOOGLE_REVIEW_LINK` — Google review URL

## Supabase (admin portal)

SQL to create the `thank_you_clients` table is in [`supabase/thank_you_clients.sql`](supabase/thank_you_clients.sql).

The table mirrors the TypeScript client schema and includes optional override columns for personalised upsell and referral copy. Wire your admin portal to CRUD this table; at build time you can export rows into `clients.ts` or fetch via a build script.

## Sitemap

`@astrojs/sitemap` is enabled. After deploy, the sitemap is available at `/thank-you/sitemap-index.xml` (or `/sitemap-index.xml` on a custom domain).

## Original HTML

The source designs are kept for reference:

- `salo-thank-you.html` — generic template
- `salo-thank-you-personalised.html` — Provenant personalised version
