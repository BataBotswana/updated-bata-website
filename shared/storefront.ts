export type StorefrontContentType = "copy" | "image";

export type StorefrontContentDefinition = {
  contentKey: string;
  label: string;
  value: string;
  type?: StorefrontContentType;
  description?: string;
};

export const DEFAULT_STOREFRONT_CONTENT: StorefrontContentDefinition[] = [
  { contentKey: "announcement", label: "Announcement bar", value: "Free delivery on orders over P 800", description: "Top-of-site delivery message." },
  { contentKey: "hero_title", label: "Home hero title", value: "Move at your pace.", description: "Use a short headline. A line break is applied after the first two words." },
  { contentKey: "hero_copy", label: "Home hero copy", value: "Fresh silhouettes, dependable comfort, and the kind of shoes that take everyday further.", description: "Supporting copy below the hero headline." },
  { contentKey: "hero_image", label: "Home hero image URL", value: "/manus-storage/bata-bw-hero_639a16de.jpg", type: "image", description: "Use a wide, high-quality Bata campaign image." },
  { contentKey: "collections_heading", label: "Collections heading", value: "The collection\nstarts here.", description: "Collection section heading. Use a newline for a deliberate line break." },
  { contentKey: "collections_copy", label: "Collections introduction", value: "Every step tells a different story. Find an easy favourite for yours." },
  { contentKey: "women_caption", label: "Women collection caption", value: "Built for every plan." },
  { contentKey: "men_caption", label: "Men collection caption", value: "Go further in comfort." },
  { contentKey: "kids_caption", label: "Kids collection caption", value: "Play starts here." },
  { contentKey: "women_image", label: "Women collection image URL", value: "/manus-storage/bata-bw-women_7aaea889.jpg", type: "image" },
  { contentKey: "men_image", label: "Men collection image URL", value: "/manus-storage/bata-bw-men_e3418b13.jpg", type: "image" },
  { contentKey: "kids_image", label: "Kids collection image URL", value: "/manus-storage/bata-bw-kids_a64a30be.jpg", type: "image" },
  { contentKey: "arrivals_heading", label: "New arrivals heading", value: "Ready for\nright now." },
  { contentKey: "sale_heading", label: "Sale heading", value: "Small price.\nBig day." },
  { contentKey: "sale_offer", label: "Sale offer", value: "Up to 40% off" },
  { contentKey: "campaign_kicker", label: "Bata campaign kicker", value: "Made for Botswana" },
  { contentKey: "campaign_heading", label: "Bata campaign heading", value: "Comfort that\nkeeps moving." },
  { contentKey: "campaign_copy", label: "Bata campaign copy", value: "Reliable everyday footwear, designed for school days, work days, and all the miles in between." },
  { contentKey: "campaign_image", label: "Bata campaign image URL", value: "/manus-storage/bata-bw-men_e3418b13.jpg", type: "image" },
  { contentKey: "brands_heading", label: "Brands heading", value: "Made for\nyour world." },
  { contentKey: "brands_copy", label: "Brands introduction", value: "From work sites to school runs and weekend trails, discover the brands that move Botswana." },
  { contentKey: "newsletter_heading", label: "Newsletter heading", value: "The pair you want,\nbefore it goes." },
  { contentKey: "newsletter_offer", label: "Newsletter offer", value: "Take 10% off your next step." },
  { contentKey: "footer_tagline", label: "Footer tagline", value: "Comfort, quality and every reason to keep moving." },
];

export const storefrontDefaults = Object.fromEntries(
  DEFAULT_STOREFRONT_CONTENT.map(({ contentKey, value }) => [contentKey, value]),
) as Record<string, string>;
