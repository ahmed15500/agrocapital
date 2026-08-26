# AgroCapital Corporate Website

Bilingual corporate and product-catalogue website for AgroCapital for International Trade. The application supports English and Arabic RTL layouts, separate page URLs, product detail pages, a multi-product quotation workflow, news content, and a JSON-backed administration area.

## Main Features

- English and Arabic with complete RTL support
- Responsive layouts for mobile, tablet, and desktop
- Product catalogue with individual product URLs
- Persistent multi-product quote list with quantities
- Consolidated quotation request form
- Editable products, posts, and site content through `/admin`
- SEO metadata, sitemap, robots.txt, and social sharing metadata

## Local Setup

Requirements: Node.js 20 or newer.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000/en` or `http://localhost:3000/ar`.

## Environment Variables

Configure these values in `.env.local` for local development and in the hosting provider's environment settings for production:

```env
SITE_URL=https://agrocapital-eg.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=replace-with-a-long-unique-password
GA_MEASUREMENT_ID=
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=
```

There are no default administrator credentials. Set `ADMIN_USERNAME` and a long, unique `ADMIN_PASSWORD`, restart the application, then sign in at `/admin`.

## Content Management

Site content is stored in `content/site.json`, products in `content/products.json`, and posts in `content/posts.json`. The administration API updates these files, so production hosting must provide persistent writable storage if edits are expected to survive deployments.

Contact and quote submissions are stored in `content/submissions.json`. This file is intentionally excluded from Git.

## Production

```powershell
npm run build
npm start
```
