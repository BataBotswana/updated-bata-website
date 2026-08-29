/**
 * Botswana in Motion data model: clear retail information with localized pula pricing.
 * Seeded product photographs use Bata-managed storage assets; admin products can supply any ordered gallery.
 */
export type ProductCategory = "Women" | "Men" | "Kids" | "Industrial";

export type CatalogProduct = {
  id: number;
  name: string;
  category: ProductCategory;
  brand: string;
  price: number;
  image: string;
  gallery: string[];
  galleryLabels?: string[];
  colors: { name: string; hex: string }[];
  sizes: number[];
  tag?: string;
  description: string;
  details: string[];
};

const lunaGallery = [
  "/manus-storage/luna-loafer-side_45b1e9b1.jpg",
  "/manus-storage/luna-loafer-top_c0dd1b01.jpg",
  "/manus-storage/luna-loafer-sole_52aee588.jpg",
];

const catalogSeed: CatalogProduct[] = [
  { id: 1, name: "Luna Soft Loafer", category: "Women", brand: "Bata Comfort", price: 699, image: lunaGallery[0], gallery: lunaGallery, colors: [{ name: "Oxblood", hex: "#54201f" }, { name: "Black", hex: "#161514" }], sizes: [3, 4, 5, 6, 7, 8], tag: "New In", description: "A refined penny loafer with a softly structured upper and a flexible sole for polished, everyday movement.", details: ["Soft leather-look upper", "Cushioned insole", "Flexible traction sole"] },
  { id: 2, name: "Cleo Slingback", category: "Women", brand: "Bata Red Label", price: 829, image: "/manus-storage/bata-bw-mark_5314fdf6.png", gallery: ["/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png"], colors: [{ name: "Black", hex: "#171717" }, { name: "Cream", hex: "#E7DED0" }], sizes: [3, 4, 5, 6, 7], description: "A clean pointed slingback that gives weekday and occasion outfits an easy finish.", details: ["Adjustable heel strap", "Sleek pointed toe", "Lightly cushioned footbed"] },
  { id: 3, name: "Mila Day Sneaker", category: "Women", brand: "North Star", price: 759, image: "/manus-storage/bata-bw-mark_5314fdf6.png", gallery: ["/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png"], colors: [{ name: "Sand", hex: "#D8C7AD" }, { name: "White", hex: "#F4F3ED" }], sizes: [3, 4, 5, 6, 7, 8], tag: "Bestseller", description: "A low-profile everyday sneaker that pairs a soft feel with a fresh, practical silhouette.", details: ["Breathable textile upper", "Padded collar", "Lightweight rubber outsole"] },
  { id: 4, name: "Asha Woven Sandal", category: "Women", brand: "Bata Comfort", price: 539, image: "/manus-storage/bata-bw-mark_5314fdf6.png", gallery: ["/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png"], colors: [{ name: "Tan", hex: "#A86D44" }, { name: "Black", hex: "#171717" }], sizes: [3, 4, 5, 6, 7], description: "Easy woven straps and soft support make a versatile warm-weather sandal.", details: ["Woven upper", "Soft support footbed", "Adjustable buckle"] },
  { id: 5, name: "Ridge Court Sneaker", category: "Men", brand: "Power", price: 799, image: "/manus-storage/bata-bw-mark_5314fdf6.png", gallery: ["/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png"], colors: [{ name: "White", hex: "#F4F3ED" }, { name: "Navy", hex: "#203249" }], sizes: [6, 7, 8, 9, 10, 11], tag: "New In", description: "A bright, easy court sneaker designed for days that start early and finish late.", details: ["Durable synthetic upper", "Foam comfort footbed", "Non-marking rubber sole"] },
  { id: 6, name: "Kalahari Leather Derby", category: "Men", brand: "Bata", price: 999, image: "/manus-storage/bata-bw-mark_5314fdf6.png", gallery: ["/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png"], colors: [{ name: "Brown", hex: "#643E28" }, { name: "Black", hex: "#171717" }], sizes: [6, 7, 8, 9, 10, 11], description: "A dependable lace-up with a classic profile, made for sharp working days and formal plans.", details: ["Polished leather-look finish", "Lace-up closure", "Cushioned formal insole"] },
  { id: 7, name: "Rally Active Trainer", category: "Men", brand: "Power", price: 879, image: "/manus-storage/bata-bw-mark_5314fdf6.png", gallery: ["/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png"], colors: [{ name: "Red", hex: "#D9222C" }, { name: "Charcoal", hex: "#313238" }], sizes: [6, 7, 8, 9, 10, 11], tag: "Bestseller", description: "A responsive trainer with ventilated structure and a supportive feel for an active routine.", details: ["Breathable mesh upper", "Responsive foam midsole", "Grippy rubber outsole"] },
  { id: 8, name: "Coast Easy Sandal", category: "Men", brand: "Bata Comfort", price: 499, image: "/manus-storage/bata-bw-mark_5314fdf6.png", gallery: ["/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png"], colors: [{ name: "Black", hex: "#171717" }, { name: "Brown", hex: "#643E28" }], sizes: [6, 7, 8, 9, 10, 11], description: "A no-fuss sandal with adjustable comfort for relaxed days in the sun.", details: ["Adjustable straps", "Cushioned footbed", "Textured grip sole"] },
  { id: 9, name: "Sparkle Play Sneaker", category: "Kids", brand: "Bubblegummers", price: 459, image: "/manus-storage/bata-bw-mark_5314fdf6.png", gallery: ["/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png"], colors: [{ name: "Pink", hex: "#F2A6B2" }, { name: "White", hex: "#F4F3ED" }], sizes: [10, 11, 12, 13, 1, 2], tag: "New In", description: "A bright, lightweight sneaker for playground plans, school runs and all-out fun.", details: ["Easy hook-and-loop closure", "Cushioned lining", "Flexible sole"] },
  { id: 10, name: "Junior School Derby", category: "Kids", brand: "Bata School", price: 529, image: "/manus-storage/bata-bw-mark_5314fdf6.png", gallery: ["/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png"], colors: [{ name: "Black", hex: "#171717" }], sizes: [10, 11, 12, 13, 1, 2, 3], description: "A hardworking uniform shoe made to stay comfortable through a full school day.", details: ["Easy-care upper", "Secure laces", "Durable outsole"] },
  { id: 11, name: "Everyday Dash Sandal", category: "Kids", brand: "Bubblegummers", price: 369, image: "/manus-storage/bata-bw-mark_5314fdf6.png", gallery: ["/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png"], colors: [{ name: "Blue", hex: "#285CA9" }, { name: "Yellow", hex: "#F3BC26" }], sizes: [10, 11, 12, 13, 1, 2], tag: "Bestseller", description: "A secure adjustable sandal that is ready to keep up with every off-duty adventure.", details: ["Soft adjustable straps", "Cushioned footbed", "Lightweight construction"] },
  { id: 12, name: "Stride Light Trainer", category: "Kids", brand: "Power Kids", price: 489, image: "/manus-storage/bata-bw-mark_5314fdf6.png", gallery: ["/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png", "/manus-storage/bata-bw-mark_5314fdf6.png"], colors: [{ name: "Blue", hex: "#285CA9" }, { name: "Grey", hex: "#9A9A9A" }], sizes: [10, 11, 12, 13, 1, 2], description: "A light, colourful trainer designed for speedy steps and comfortable everyday play.", details: ["Lightweight textile upper", "Padded footbed", "Flexible grip sole"] },
];

const premiumProductImages: Record<number, string> = {
  1: lunaGallery[0],
  2: "/manus-storage/bata-cleo-slingback_ed70d98d.jpg",
  3: "/manus-storage/bata-mila-sneaker_863ccf4b.jpg",
  4: "/manus-storage/bata-asha-sandal_d6b39976.jpg",
  5: "/manus-storage/bata-ridge-sneaker_b51b8636.jpg",
  6: "/manus-storage/bata-kalahari-derby_59de5739.jpg",
  7: "/manus-storage/bata-rally-trainer_286fd103.jpg",
  8: "/manus-storage/bata-coast-sandal_89464a03.jpg",
  9: "/manus-storage/bata-sparkle-kids_9b864223.jpg",
  10: "/manus-storage/bata-junior-school_7e561926.jpg",
  11: "/manus-storage/bata-dash-kids-sandal_c1a3d2c1.jpg",
  12: "/manus-storage/bata-stride-kids-trainer_9c8695e3.jpg",
};

export const catalog: CatalogProduct[] = catalogSeed.map((product) => ({
  ...product,
  image: premiumProductImages[product.id],
  gallery: product.id === 1 ? lunaGallery : [premiumProductImages[product.id]],
}));

export const stores = [
  { id: "gamecity", name: "Bata Game City", city: "Gaborone", address: "Shop No. 23, Game City Mall, Kgale", phone: "+267 392 4575", hours: "Mon–Sat 09:00–18:00 · Sun 10:00–15:00", position: { lat: -24.6697, lng: 25.8972 } },
  { id: "riverwalk", name: "Bata Riverwalk", city: "Gaborone", address: "Riverwalk Shopping Complex, Village", phone: "+267 392 4575", hours: "Mon–Sat 09:00–18:00 · Sun 10:00–15:00", position: { lat: -24.6423, lng: 25.9155 } },
  { id: "airport", name: "Bata Airport Junction", city: "Gaborone", address: "Shop No. 57, Airport Junction Shopping Centre", phone: "+267 392 4575", hours: "Mon–Sat 09:00–18:00 · Sun 10:00–15:00", position: { lat: -24.6175, lng: 25.9379 } },
  { id: "railpark", name: "Bata Railpark", city: "Gaborone", address: "Shop No. 11, Railway Park Mall", phone: "+267 392 4575", hours: "Mon–Sat 09:00–18:00 · Sun 10:00–15:00", position: { lat: -24.6541, lng: 25.9087 } },
  { id: "francistown", name: "Bata Francistown", city: "Francistown", address: "Shop 1/2, Plot 20586, J. Haskins Street", phone: "+267 241 0000", hours: "Mon–Sat 08:30–17:30 · Sun 10:00–13:00", position: { lat: -21.1695, lng: 27.5062 } },
  { id: "maun", name: "Bata Maun", city: "Maun", address: "Unit 3, Plot 2576, Block 4, The Mall", phone: "+267 686 0000", hours: "Mon–Sat 08:30–17:30 · Sun 10:00–13:00", position: { lat: -19.9833, lng: 23.4181 } },
  { id: "lobatse", name: "Bata Lobatse", city: "Lobatse", address: "Unit 3A, Lobatse Mall", phone: "+267 533 0000", hours: "Mon–Sat 08:30–17:30", position: { lat: -25.2244, lng: 25.6801 } },
  { id: "selibe-phikwe", name: "Bata Selibe Phikwe", city: "Selibe Phikwe", address: "Shop 5/6, Galo Centre", phone: "+267 261 0000", hours: "Mon–Sat 08:30–17:30", position: { lat: -21.9768, lng: 27.8426 } },
];

export const productById = (id: number) => catalog.find((product) => product.id === id);

/** Converts published admin content into the storefront's established catalogue shape. */
export type ManagedStorefrontProduct = {
  id: number;
  title: string;
  category: ProductCategory;
  brand: string;
  price: number;
  tag: string | null;
  description: string | null;
  sizesJson: string;
  colorsJson: string;
  images: { id: number; url: string; alt: string | null; position: number }[];
};

export function managedProductToCatalog(product: ManagedStorefrontProduct): CatalogProduct {
  const sizes = (() => { try { return (JSON.parse(product.sizesJson) as string[]).map(Number).filter(Number.isFinite); } catch { return []; } })();
  const colors = (() => { try { return JSON.parse(product.colorsJson) as { name: string; hex: string }[]; } catch { return []; } })();
  const gallery = product.images.map((image) => image.url);
  const primary = gallery[0] ?? "/manus-storage/bata-bw-mark_5314fdf6.png";
  const galleryLabels = product.images.map((image, index) => {
    const raw = image.alt?.split("·").pop()?.trim();
    return raw && raw.toLowerCase() !== `${product.title.toLowerCase()} product angle` ? raw : index === 0 ? "Primary" : `View ${index + 1}`;
  });
  return { id: product.id, name: product.title, category: product.category, brand: product.brand, price: product.price, image: primary, gallery: gallery.length ? gallery : [primary], galleryLabels: galleryLabels.length ? galleryLabels : ["Primary"], colors: colors.length ? colors : [{ name: "Black", hex: "#171717" }], sizes: sizes.length ? sizes : [3, 4, 5, 6, 7], tag: product.tag ?? undefined, description: product.description ?? "A thoughtfully made Bata shoe, managed from the Botswana catalogue.", details: ["Managed product details", "Select a size for availability", "Additional information available from Bata Botswana"] };
}
