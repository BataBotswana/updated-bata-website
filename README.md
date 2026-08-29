# Bata Botswana Store

A Bata Botswana storefront with a Shopify-style shopping experience and a protected admin workspace for catalogue and storefront-content management.

## What is included

The public storefront remains the primary experience at `/`. It includes the campaign homepage, catalogue filters, product detail pages with multi-angle galleries, store finder, cart interactions, and checkout flow. The admin workspace is available at `/admin` for compatibility and can also run as a separate host at `admin.dev` or `admin.example.com`.

The admin can create and edit products, set prices and compare-at prices, choose categories and visibility, manage sizes and colour swatches, upload product images, add image URLs, delete images, and reorder the gallery. The first gallery image is the primary image shown in catalogue cards. Storefront content editing includes campaign copy, announcement text, collection captions, homepage imagery, campaign imagery, promotional messaging, newsletter copy, and footer copy.

## Local VS Code setup

Use Node.js 22 or newer and pnpm 10. From the project root:

```bash
pnpm install
cp .env.example .env
# Fill in the environment values described below.
pnpm dev
```

The public store opens at `http://localhost:3000`. For the split-domain workflow, add these entries to your local hosts file:

```text
127.0.0.1 storefront.dev
127.0.0.1 admin.dev
```

Then use `http://storefront.dev:3000` for the public store and `http://admin.dev:3000` for the admin workspace. The admin host opens the dashboard at `/`, `/products`, and `/content`; the storefront host keeps public routes and legacy `/admin` routes.

The production-style local preview is:

```bash
pnpm preview
```

Useful checks are:

```bash
pnpm check
pnpm test
pnpm build
```

## Environment variables

The backend needs Manus OAuth, a MySQL/TiDB database, and managed storage credentials. Copy `.env.example` and provide values for `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL`, `OAUTH_SERVER_URL`, `JWT_SECRET`, `OWNER_OPEN_ID`, `DATABASE_URL`, `BUILT_IN_FORGE_API_URL`, and `BUILT_IN_FORGE_API_KEY`. Do not commit `.env` files.

The first owner account is promoted by the existing user upsert logic. For another administrator, update the persisted user role after that account has signed in:

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

## Database

The schema contains `users`, `products`, `product_images`, and `storefront_content`. Generate and apply migrations through the existing Drizzle workflow after configuring `DATABASE_URL`:

```bash
pnpm db:push
```

Product prices are stored as whole Botswana pula values. Product image bytes are kept in managed storage; the database stores the image URL, alt text, and display position.

## Cloudflare Pages deployment

The frontend and edge proxy are configured for Cloudflare Pages through `wrangler.toml`, `functions/api/[[path]].ts`, and `functions/manus-storage/[[path]].ts`. The Pages project serves the Vite output from `dist/public`, preserves SPA deep links, and proxies `/api/*` and `/manus-storage/*` to the configured API origin.

Because this project uses the existing Express/tRPC server, MySQL/TiDB, Manus OAuth, and managed storage APIs, the safe production topology is:

```text
storefront.example.com  ─┐
                          ├─ Cloudflare Pages + Pages Functions ── API_ORIGIN ── Bata API origin
admin.example.com       ─┘                                                   ├─ MySQL/TiDB
                                                                                └─ managed storage/auth
```

Deploy the Pages frontend with:

```bash
pnpm cloudflare:deploy
```

In Cloudflare Pages project settings, configure `API_ORIGIN` for both Preview and Production, for example `https://api.example.com`. Add `storefront.example.com` and `admin.example.com` as custom domains. Keep the two domains on the same parent domain when possible so the operational setup and cookie policy remain easy to manage.

For a local Pages Functions preview, create `.dev.vars` from `.dev.vars.example`, set `API_ORIGIN`, then run:

```bash
pnpm cloudflare:dev
```

This repository intentionally does not pretend that an Express server using MySQL/TiDB and Manus storage is a native Cloudflare Worker. The Pages edge layer is production-ready now; migrating the API data/storage layer to Workers + D1/R2 would be a separate platform migration.

## Design and performance notes

The visual system uses Inter for shopping utility text, Barlow Condensed for Bata's campaign display voice, and the supplied Bata wordmark. The storefront uses warm neutrals, restrained Bata red, compact catalogue metadata, strong product-first cards, and a persistent utility header. Remote placeholder image URLs were removed from the active seeded catalogue; managed storage paths and admin-provided galleries are used instead.

Route pages are lazy-loaded so the initial client bundle is smaller. Images use `loading`, `decoding`, and high-priority hints where appropriate. Cloudflare static assets are marked immutable and managed-storage responses are cached with stale-while-revalidate.

## Project commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Local full-stack development server with Vite and Express |
| `pnpm preview` | Build and run the production-style local Express server |
| `pnpm cloudflare:dev` | Preview Cloudflare Pages output and Pages Functions |
| `pnpm cloudflare:deploy` | Build and deploy `dist/public` to Cloudflare Pages |
| `pnpm check` | TypeScript validation |
| `pnpm test` | Vitest suite |
| `pnpm build` | Production client and server build |
| `pnpm db:push` | Generate and apply Drizzle migrations |
