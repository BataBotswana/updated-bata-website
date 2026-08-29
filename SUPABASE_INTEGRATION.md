# Bata Botswana Supabase integration

The public storefront reads its catalog and front-end imagery from Supabase project `iygrjsxueejfucnyozvx` instead of the legacy local/Drizzle catalog path.

## Data and asset source

The catalog is generated from numeric SKU filenames in the private `Ladies Heels Shoes` and `Mens Shoes` buckets. The current bucket inventory produces 39 live styles: 17 women’s styles and 22 men’s styles. Gallery images remain grouped by SKU and sorted by angle number.

The `Frontend Material` bucket supplies the Bata logo, hero imagery, Women/Men/Kids collection imagery, campaign imagery, newsletter imagery, and Safari/North Star/Power brand imagery. The `Shoes` bucket supplies the Winter Sale image. The public storefront never requests private Storage objects directly.

No Toughees object was present in the requested Supabase buckets. The redesigned site therefore uses the copied actual Toughees shoe and logo assets in `client/public/brand-assets/` for the Toughees homepage tile and collection hero.

## Secure delivery path

The deployed Supabase Edge Function is:

`https://iygrjsxueejfucnyozvx.supabase.co/functions/v1/bata-storefront`

The function lists private buckets with Supabase-managed server credentials, creates signed HMAC asset URLs, and proxies only allowlisted bucket names and object paths. The service-role key is not included in client code or browser requests. Catalog requests are cache-busted in the client to avoid stale unsigned URLs after a function deployment.

## Environment

The local `.env` contains the supplied project URL, the client-safe anon key from the project, `ENABLE_SUPABASE_DB=true`, and the requested WhatsApp catalog URL. `SUPABASE_SERVICE_ROLE_KEY` is intentionally blank in the storefront project because the Edge Function uses Supabase-managed runtime secrets. The `.env.example` file is safe to distribute and leaves client/server secrets blank.

## Redesign

The homepage now uses a viewport-sized hero slideshow with concise animated slide copy: `Explore heels`, `Explore beach`, and `Sale 50%`. The Collections section is image-led and links to full landing pages for Women, Men, and Kids. New arrivals contains only the heading and live product cards. The old oversized `bata-campaign__overlay` treatment has been removed.

The shoe campaign section is a full-screen image-based animation that cycles Power, Toughees, and Bata visuals using the available bucket imagery. It is capped with `min(100svh, 760px)` on larger screens and sized for the viewport on mobile, so the visual cannot grow beyond the device. An MP4 could not be generated on the current plan, so the site uses the agreed image-animation fallback.

The brand section is image-led with dedicated routes for Safari, North Star, Power, and Toughees. Category and brand landing routes are available at:

- `/collections/women`
- `/collections/men`
- `/collections/kids`
- `/collections/safari`
- `/collections/north-star`
- `/collections/power`
- `/collections/toughees`

The shared `CartProvider` persists items in local storage. `CartDrawer` is available from the homepage, catalog, product detail, collection landing pages, and checkout. It supports quantity changes, removal, subtotal display, and checkout handoff. The newsletter offer is a compact bottom-aligned modal with a bounded height and mobile layout so it does not block the full screen.

## Validation

`pnpm check`, `pnpm test`, and `pnpm build` all pass. Browser validation confirmed the full-screen hero, animated controls, concise sections, live product imagery, Power landing route, actual Toughees assets, the shared bag control, tokenized HTTPS asset URLs, and the WhatsApp catalog link.
