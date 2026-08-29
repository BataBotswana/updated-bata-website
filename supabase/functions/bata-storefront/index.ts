import "jsr:@supabase/functions-js/edge-runtime.d.ts";

type StorageObject = {
  name: string;
  metadata?: { mimetype?: string } | null;
};

type CatalogProduct = {
  id: number;
  name: string;
  category: "Women" | "Men";
  brand: string;
  price: number;
  image: string;
  gallery: string[];
  galleryLabels: string[];
  colors: { name: string; hex: string }[];
  sizes: number[];
  tag?: string;
  description: string;
  details: string[];
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const PRODUCT_BUCKETS = [
  { bucket: "Ladies Heels Shoes", category: "Women" as const, brand: "Bata Ladies" },
  { bucket: "Mens Shoes", category: "Men" as const, brand: "Bata Men" },
];
const FRONTEND_BUCKET = "Frontend Material";
const ALLOWED_BUCKETS = new Set(["Mens Shoes", "Ladies Heels Shoes", "Frontend Material", "Shoes"]);

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

let signingKeyPromise: Promise<CryptoKey> | null = null;

function json(data: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...headers, "Content-Type": "application/json; charset=utf-8", ...extraHeaders },
  });
}

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function getSigningKey() {
  if (!signingKeyPromise) {
    signingKeyPromise = crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SERVICE_ROLE_KEY),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
  }
  return signingKeyPromise;
}

async function signAsset(bucket: string, name: string) {
  const key = await getSigningKey();
  const value = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${bucket}:${name}`));
  return base64Url(new Uint8Array(value));
}

function safeEquals(left: string, right: string) {
  if (!left || left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return difference === 0;
}

function storagePath(bucket: string, name: string) {
  return `${SUPABASE_URL}/storage/v1/object/${encodeURIComponent(bucket)}/${name.split("/").map(encodeURIComponent).join("/")}`;
}

async function storefrontAssetUrl(request: Request, bucket: string, name: string) {
  const url = new URL("/functions/v1/bata-storefront", request.url);
  url.protocol = "https:";
  url.searchParams.set("action", "asset");
  url.searchParams.set("bucket", bucket);
  url.searchParams.set("path", name);
  url.searchParams.set("token", await signAsset(bucket, name));
  return url.toString();
}

async function listBucket(bucket: string): Promise<StorageObject[]> {
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${encodeURIComponent(bucket)}`, {
    method: "POST",
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prefix: "", limit: 1000, offset: 0, sortBy: { column: "name", order: "asc" } }),
  });
  if (!response.ok) throw new Error(`Unable to list ${bucket}`);
  const objects = await response.json();
  return Array.isArray(objects) ? objects.filter((object) => typeof object?.name === "string") : [];
}

function skuFor(name: string) {
  const match = name.match(/^([0-9]+)/);
  return match?.[1] ?? null;
}

function angleFor(name: string, sku: string) {
  const match = name.match(new RegExp(`^${sku}(?:-|_)(\\d+)`));
  return match ? Number(match[1]) : 99;
}

function productName(sku: string, category: "Women" | "Men") {
  return `${category === "Women" ? "Bata ladies" : "Bata men's"} style ${sku}`;
}

async function productFromFiles(
  request: Request,
  bucket: string,
  category: "Women" | "Men",
  brand: string,
  files: StorageObject[],
): Promise<CatalogProduct> {
  const sku = skuFor(files[0].name) ?? files[0].name.replace(/\.[^.]+$/, "");
  const ordered = [...files].sort((a, b) => angleFor(a.name, sku) - angleFor(b.name, sku) || a.name.localeCompare(b.name));
  const gallery = await Promise.all(ordered.map((file) => storefrontAssetUrl(request, bucket, file.name)));
  const sizes = category === "Women" ? [3, 4, 5, 6, 7, 8, 9] : [6, 7, 8, 9, 10, 11, 12];
  return {
    id: Number(sku),
    name: productName(sku, category),
    category,
    brand,
    price: category === "Women" ? 699 : 799,
    image: gallery[0],
    gallery,
    galleryLabels: gallery.map((_, index) => index === 0 ? "Primary" : `View ${index + 1}`),
    colors: [{ name: "Signature", hex: "#171717" }],
    sizes,
    description: category === "Women"
      ? "A Bata ladies style selected from the live Botswana footwear collection."
      : "A Bata men's style selected from the live Botswana footwear collection.",
    details: ["Live image from the Bata Botswana Storage catalogue", "Select a size for availability", "Product information is managed in Supabase"],
  };
}

async function catalogResponse(request: Request) {
  const bucketResults = await Promise.all(PRODUCT_BUCKETS.map(async (source) => ({
    ...source,
    files: await listBucket(source.bucket),
  })));
  const products = (await Promise.all(bucketResults.map(async (source) => {
    const groups = new Map<string, StorageObject[]>();
    for (const file of source.files) {
      const sku = skuFor(file.name);
      if (!sku) continue;
      const group = groups.get(sku) ?? [];
      group.push(file);
      groups.set(sku, group);
    }
    return Promise.all([...groups.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, files]) => productFromFiles(request, source.bucket, source.category, source.brand, files)));
  }))).flat();

  const [frontendFiles, shoesFiles] = await Promise.all([listBucket(FRONTEND_BUCKET), listBucket("Shoes")]);
  const [frontendEntries, shoesEntries] = await Promise.all([
    Promise.all(frontendFiles.map(async (file) => [file.name, await storefrontAssetUrl(request, FRONTEND_BUCKET, file.name)] as const)),
    Promise.all(shoesFiles.map(async (file) => [file.name, await storefrontAssetUrl(request, "Shoes", file.name)] as const)),
  ]);
  const frontend = new Map(frontendEntries);
  const shoes = new Map(shoesEntries);
  const asset = (name: string) => frontend.get(name) ?? "";
  const content = {
    logo_url: asset("toppng.com-bata-logo-vector-free-download-400x400.png"),
    hero_image: asset("slider womens shoes.webp") || asset("slider power shoes.webp"),
    women_image: asset("ladies casual.webp"),
    men_image: asset("mens category.webp") || asset("mens category.jpg"),
    kids_image: asset("bubblegummers.webp"),
    campaign_image: asset("mens formal.webp") || asset("mens category.webp"),
    newsletter_image: asset("ladies heels.webp"),
    sale_image: shoes.get("WINTER SALE .jpg") ?? "",
    safari_logo: asset("Safari_Logo.webp"),
    safari_image: asset("safari shoe.jpg"),
    north_star_logo: asset("north star img.png") || asset("north star img.jpg"),
    north_star_image: asset("north star.jpg"),
    power_logo: asset("power logo.webp"),
    power_image: asset("power.jpg"),
    toughees_image: asset("bubblegummers.webp") || asset("mens formal.webp"),
    industrials_logo: asset("bata-industrials logo.webp"),
    industrials_image: asset("bata-industrials.webp"),
  };
  return json({ products, content, source: { buckets: ["Mens Shoes", "Ladies Heels Shoes", "Frontend Material", "Shoes"] } }, 200, { "Cache-Control": "public, max-age=300" });
}

async function assetResponse(request: Request) {
  const url = new URL(request.url);
  const bucket = url.searchParams.get("bucket") ?? "";
  const name = url.searchParams.get("path") ?? "";
  const token = url.searchParams.get("token") ?? "";
  if (!ALLOWED_BUCKETS.has(bucket) || !name || name.includes("..") || !safeEquals(token, await signAsset(bucket, name))) return json({ error: "Asset not found" }, 404);
  const response = await fetch(storagePath(bucket, name), {
    headers: { apikey: SERVICE_ROLE_KEY, Authorization: `Bearer ${SERVICE_ROLE_KEY}` },
  });
  if (!response.ok || !response.body) return json({ error: "Asset not found" }, 404);
  const contentType = response.headers.get("content-type") ?? "application/octet-stream";
  return new Response(response.body, {
    status: 200,
    headers: { ...headers, "Content-Type": contentType, "Cache-Control": "public, max-age=3600, immutable" },
  });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers });
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return json({ error: "Supabase function configuration is incomplete" }, 500);
  try {
    const action = new URL(request.url).searchParams.get("action") ?? "catalog";
    if (action === "asset") return await assetResponse(request);
    if (action === "catalog") return await catalogResponse(request);
    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    console.error("bata-storefront error", error);
    return json({ error: "Unable to load the Bata storefront" }, 500);
  }
});
